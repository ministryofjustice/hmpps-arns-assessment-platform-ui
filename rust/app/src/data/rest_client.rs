//! `RestClient` (`@ministryofjustice/hmpps-rest-client`) and `AuthenticationClient`
//! (`@ministryofjustice/hmpps-auth-clients`): JSON over HTTP, as the system (a cached client
//! credentials token) or as the signed-in user.

use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use base64::Engine;
use forge_core::ForgeError;
use serde_json::Value as Json;

use crate::config::ApiConfig;
use crate::data::redis_client::RedisClient;

/// A failed API call (`SanitisedError`): the upstream status, when there was a response.
#[derive(Debug, Clone)]
pub struct ApiError {
    pub api: &'static str,
    pub status: Option<u16>,
    pub message: String,
    pub body: Option<Json>,
}

impl std::fmt::Display for ApiError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self.status {
            Some(status) => write!(f, "{} responded {status}: {}", self.api, self.message),
            None => write!(f, "{} request failed: {}", self.api, self.message),
        }
    }
}

impl std::error::Error for ApiError {}

/// The error page responds with the upstream status (or 500).
impl From<ApiError> for ForgeError {
    fn from(e: ApiError) -> Self {
        ForgeError::http(e.status.unwrap_or(500), e.to_string())
    }
}

pub type ApiResult<T> = Result<T, ApiError>;

/// Who a request is made as (`asSystem()` / `asUser(token)`).
#[derive(Clone, Debug)]
pub enum As {
    System,
    User(String),
    /// No `Authorization` header (the Wiremock admin API).
    Anonymous,
}

/// `generateOauthClientToken`: HTTP Basic credentials for an OAuth client.
pub fn basic_auth(client_id: &str, client_secret: &str) -> String {
    format!("Basic {}", base64::engine::general_purpose::STANDARD.encode(format!("{client_id}:{client_secret}")))
}

/// Where system tokens are cached (`InMemoryTokenStore` / `RedisTokenStore`).
enum TokenStore {
    Memory(Mutex<Option<(String, Instant)>>),
    Redis(Arc<RedisClient>, &'static str),
}

/// `AuthenticationClient`: client credentials tokens from HMPPS Auth, cached until shortly
/// before they expire.
pub struct AuthenticationClient {
    http: reqwest::Client,
    url: String,
    client_id: String,
    client_secret: String,
    store: TokenStore,
}

impl AuthenticationClient {
    pub fn new(config: &crate::config::HmppsAuthConfig, redis: Option<Arc<RedisClient>>) -> Self {
        Self {
            http: reqwest::Client::builder()
                .timeout(Duration::from_millis(config.api.timeout_ms))
                .build()
                .expect("HTTP client"),
            url: config.api.url.clone(),
            client_id: config.system_client_id.clone(),
            client_secret: config.system_client_secret.clone(),
            store: match redis {
                Some(r) => TokenStore::Redis(r, "aap-ui-system-token"),
                None => TokenStore::Memory(Mutex::new(None)),
            },
        }
    }

    /// A client for other credentials against another HMPPS Auth, caching its token in memory
    /// (`new AuthenticationClient({ ...config, url, systemClientId, systemClientSecret }, logger,
    /// new InMemoryTokenStore())`).
    pub fn with_credentials(url: &str, client_id: &str, client_secret: &str, timeout_ms: u64) -> Self {
        Self {
            http: reqwest::Client::builder().timeout(Duration::from_millis(timeout_ms)).build().expect("HTTP client"),
            url: url.trim_end_matches('/').to_string(),
            client_id: client_id.to_string(),
            client_secret: client_secret.to_string(),
            store: TokenStore::Memory(Mutex::new(None)),
        }
    }

    async fn cached(&self) -> Option<String> {
        match &self.store {
            TokenStore::Memory(m) => {
                m.lock().unwrap().as_ref().filter(|(_, expires)| Instant::now() < *expires).map(|(t, _)| t.clone())
            }
            TokenStore::Redis(r, key) => r.get(key).await.ok().flatten(),
        }
    }

    async fn cache(&self, token: &str, expires_in: u64) {
        // Refresh a minute early so a token never expires mid-request.
        let ttl = expires_in.saturating_sub(60).max(1);
        match &self.store {
            TokenStore::Memory(m) => *m.lock().unwrap() = Some((token.to_string(), Instant::now() + Duration::from_secs(ttl))),
            TokenStore::Redis(r, key) => {
                if let Err(e) = r.set_ex(key, token, ttl).await {
                    crate::error!({ "err": e.to_string() }, "Failed to cache system token");
                }
            }
        }
    }

    /// `getToken()`: a system token.
    pub async fn get_token(&self) -> ApiResult<String> {
        if let Some(token) = self.cached().await {
            return Ok(token);
        }
        let error = |status: Option<u16>, message: String| ApiError { api: "HMPPS Auth", status, message, body: None };
        let response = self
            .http
            .post(format!("{}/oauth/token", self.url))
            .header(http::header::AUTHORIZATION, basic_auth(&self.client_id, &self.client_secret))
            .form(&[("grant_type", "client_credentials")])
            .send()
            .await
            .map_err(|e| error(None, e.to_string()))?;
        let status = response.status();
        if !status.is_success() {
            return Err(error(Some(status.as_u16()), response.text().await.unwrap_or_default()));
        }
        let body: Json = response.json().await.map_err(|e| error(None, e.to_string()))?;
        let token = body.get("access_token").and_then(Json::as_str).unwrap_or_default().to_string();
        self.cache(&token, body.get("expires_in").and_then(Json::as_u64).unwrap_or(300)).await;
        Ok(token)
    }
}

/// A JSON API: base URL, timeout and the token source.
pub struct RestClient {
    pub name: &'static str,
    base_url: String,
    http: reqwest::Client,
    auth: Option<Arc<AuthenticationClient>>,
}

impl RestClient {
    pub fn new(name: &'static str, config: &ApiConfig, auth: Option<Arc<AuthenticationClient>>) -> Self {
        Self {
            name,
            base_url: config.url.trim_end_matches('/').to_string(),
            http: reqwest::Client::builder()
                .timeout(Duration::from_millis(config.timeout_ms))
                .build()
                .expect("HTTP client"),
            auth,
        }
    }

    fn error(&self, status: Option<u16>, message: impl Into<String>, body: Option<Json>) -> ApiError {
        ApiError { api: self.name, status, message: message.into(), body }
    }

    async fn authorise(&self, request: reqwest::RequestBuilder, who: &As) -> ApiResult<reqwest::RequestBuilder> {
        Ok(match who {
            As::User(token) => request.bearer_auth(token),
            As::System => match &self.auth {
                Some(auth) => request.bearer_auth(auth.get_token().await?),
                None => request,
            },
            As::Anonymous => request,
        })
    }

    async fn send(&self, method: http::Method, path: &str, query: &[(&str, String)], body: Option<&Json>, who: &As) -> ApiResult<Json> {
        let url = format!("{}{path}", self.base_url);
        crate::debug!({ "api": self.name, "method": method.as_str(), "path": path }, "API request");
        let mut request = self.http.request(method, &url).header(http::header::ACCEPT, "application/json");
        if !query.is_empty() {
            request = request.query(query);
        }
        if let Some(body) = body {
            request = request.json(body);
        }
        let request = self.authorise(request, who).await?;
        let response = request.send().await.map_err(|e| self.error(None, e.to_string(), None))?;
        let status = response.status();
        let text = response.text().await.map_err(|e| self.error(Some(status.as_u16()), e.to_string(), None))?;
        let json = if text.trim().is_empty() { Json::Null } else { serde_json::from_str(&text).unwrap_or(Json::String(text)) };
        if !status.is_success() {
            crate::warn!({ "api": self.name, "path": path, "status": status.as_u16() }, "API request failed");
            let message = status.canonical_reason().unwrap_or("Error").to_string();
            return Err(self.error(Some(status.as_u16()), message, Some(json)));
        }
        Ok(json)
    }

    pub async fn get(&self, path: &str, who: As) -> ApiResult<Json> {
        self.send(http::Method::GET, path, &[], None, &who).await
    }

    pub async fn get_with_query(&self, path: &str, query: &[(&str, String)], who: As) -> ApiResult<Json> {
        self.send(http::Method::GET, path, query, None, &who).await
    }

    pub async fn post(&self, path: &str, body: &Json, who: As) -> ApiResult<Json> {
        self.send(http::Method::POST, path, &[], Some(body), &who).await
    }

    pub async fn delete(&self, path: &str, who: As) -> ApiResult<Json> {
        self.send(http::Method::DELETE, path, &[], None, &who).await
    }

    /// The health endpoint's status, for `/health`.
    pub async fn ping(&self, health_path: &str) -> Result<(), String> {
        let response = self.http.get(format!("{}{health_path}", self.base_url)).send().await.map_err(|e| e.to_string())?;
        if response.status().is_success() { Ok(()) } else { Err(format!("{}", response.status())) }
    }
}
