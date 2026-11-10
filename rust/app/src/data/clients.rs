//! The API clients and Redis-backed stores.

use std::sync::Arc;

use forge_core::ForgeError;
use serde_json::{Value as Json, json};

use crate::config::Config;
use crate::data::redis_client::RedisClient;
use crate::data::rest_client::{ApiError, ApiResult, As, AuthenticationClient, RestClient};

// Assessment Platform API -------------------------------------------------------------------

/// A failure from the Assessment Platform API: the HTTP call itself, a command whose result
/// reports failure (`CommandError`) or a query with no result (`QueryError`).
#[derive(Debug, Clone)]
pub enum AapError {
    Api(ApiError),
    Command { command_type: String, message: String, index: usize },
    Query { query_type: String, index: usize },
}

impl std::fmt::Display for AapError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            AapError::Api(e) => e.fmt(f),
            AapError::Command { command_type, message, .. } => write!(f, "{command_type} failed: {message}"),
            AapError::Query { query_type, .. } => write!(f, "{query_type} failed: No result returned"),
        }
    }
}

impl From<ApiError> for AapError {
    fn from(e: ApiError) -> Self {
        AapError::Api(e)
    }
}

impl From<AapError> for ForgeError {
    fn from(e: AapError) -> Self {
        match e {
            AapError::Api(e) => e.into(),
            other => ForgeError::http(500, other.to_string()),
        }
    }
}

impl AapError {
    /// The API found nothing: an `AssessmentVersionQuery` without a result, or a 404.
    pub fn is_missing_assessment(&self) -> bool {
        match self {
            AapError::Query { query_type, .. } => query_type == "AssessmentVersionQuery",
            AapError::Api(e) => e.status == Some(404),
            AapError::Command { .. } => false,
        }
    }
}

pub type AapResult<T> = Result<T, AapError>;

/// `AssessmentCacheStore`: the latest version of an assessment, cached in Redis by the API.
pub struct AssessmentCacheStore {
    redis: Option<Arc<RedisClient>>,
}

impl AssessmentCacheStore {
    pub fn new(redis: Option<Arc<RedisClient>>) -> Self {
        Self { redis }
    }

    pub async fn get(&self, assessment_uuid: &str) -> Option<Json> {
        let redis = self.redis.as_ref()?;
        match redis.get(&format!("assessment:{assessment_uuid}:latest")).await {
            Ok(Some(data)) => serde_json::from_str(&data).ok(),
            Ok(None) => None,
            Err(e) => {
                crate::error!({ "err": e.to_string(), "assessmentUuid": assessment_uuid }, "Failed to get cached assessment");
                None
            }
        }
    }
}

/// `AssessmentPlatformApiClient`: the CQRS command and query endpoints.
pub struct AssessmentPlatformApiClient {
    rest: RestClient,
    cache: AssessmentCacheStore,
}

impl AssessmentPlatformApiClient {
    pub fn new(config: &Config, auth: Arc<AuthenticationClient>, cache: AssessmentCacheStore) -> Self {
        Self { rest: RestClient::new("Assessment Platform API", &config.aap_api, Some(auth)), cache }
    }

    /// The client against another environment's API, without the assessment cache
    /// (`new AssessmentPlatformApiClient(authClient, null, { url })`).
    pub fn for_environment(config: &Config, auth: Arc<AuthenticationClient>, url: &str) -> Self {
        let api = crate::config::ApiConfig { url: url.to_string(), ..config.aap_api.clone() };
        Self { rest: RestClient::new("Assessment Platform API", &api, Some(auth)), cache: AssessmentCacheStore::new(None) }
    }

    /// `getDataDeletionData`: an assessment's events and timeline, as stored.
    pub async fn get_data_deletion_data(&self, assessment_uuid: &str) -> ApiResult<Json> {
        self.rest.get(&format!("/data-deletion/{assessment_uuid}"), As::System).await
    }

    /// `postDataDeletionRequest`: applies (or, with `dryRun`, validates) event and timeline changes.
    pub async fn post_data_deletion_request(&self, assessment_uuid: &str, request: &Json) -> ApiResult<Json> {
        self.rest.post(&format!("/data-deletion/{assessment_uuid}"), request, As::System).await
    }

    /// A single command's result. Fails if the command fails.
    pub async fn execute_command(&self, command: Json) -> AapResult<Json> {
        Ok(self.execute_commands(vec![command]).await?.into_iter().next().unwrap_or(Json::Null))
    }

    /// A transactional batch: every command succeeds or the batch fails.
    pub async fn execute_commands(&self, commands: Vec<Json>) -> AapResult<Vec<Json>> {
        let types: Vec<String> =
            commands.iter().map(|c| c.get("type").and_then(Json::as_str).unwrap_or_default().to_string()).collect();
        let response = self.rest.post("/command", &json!({ "commands": commands }), As::System).await?;
        let results: Vec<Json> =
            response.get("commands").and_then(Json::as_array).cloned().unwrap_or_default();
        let mut out = Vec::with_capacity(results.len());
        for (index, entry) in results.into_iter().enumerate() {
            let result = entry.get("result").cloned().unwrap_or(Json::Null);
            if result.get("success").and_then(Json::as_bool) != Some(true) {
                return Err(AapError::Command {
                    command_type: types.get(index).cloned().unwrap_or_default(),
                    message: result.get("message").and_then(Json::as_str).unwrap_or("Unknown error").to_string(),
                    index,
                });
            }
            out.push(result);
        }
        Ok(out)
    }

    /// A single query's result. The latest version of an assessment by UUID comes from the
    /// Redis cache when it holds it.
    pub async fn execute_query(&self, query: Json) -> AapResult<Json> {
        let identifier = query.get("assessmentIdentifier");
        if query.get("type").and_then(Json::as_str) == Some("AssessmentVersionQuery")
            && identifier.and_then(|i| i.get("type")).and_then(Json::as_str) == Some("UUID")
            && query.get("timestamp").is_none_or(Json::is_null)
            && let Some(uuid) = identifier.and_then(|i| i.get("uuid")).and_then(Json::as_str)
            && let Some(cached) = self.cache.get(uuid).await
        {
            crate::debug!({ "assessmentUuid": uuid }, "Assessment cache hit");
            return Ok(cached);
        }
        Ok(self.execute_queries(vec![query]).await?.into_iter().next().unwrap_or(Json::Null))
    }

    pub async fn execute_queries(&self, queries: Vec<Json>) -> AapResult<Vec<Json>> {
        let types: Vec<String> =
            queries.iter().map(|q| q.get("type").and_then(Json::as_str).unwrap_or_default().to_string()).collect();
        let response = self.rest.post("/query", &json!({ "queries": queries }), As::System).await?;
        let results: Vec<Json> = response.get("queries").and_then(Json::as_array).cloned().unwrap_or_default();
        let mut out = Vec::with_capacity(results.len());
        for (index, entry) in results.into_iter().enumerate() {
            match entry.get("result") {
                Some(result) if !result.is_null() => out.push(result.clone()),
                _ => return Err(AapError::Query { query_type: types.get(index).cloned().unwrap_or_default(), index }),
            }
        }
        Ok(out)
    }

    pub fn rest(&self) -> &RestClient {
        &self.rest
    }
}

/// `wrapAll`: plain values into the API's `Single` / `Multi` values (`undefined` omitted).
pub fn wrap_all(answers: &forge_core::value::Map) -> Json {
    let mut out = serde_json::Map::new();
    for (key, value) in answers.iter() {
        if value.is_undefined() {
            continue;
        }
        let wrapped = match value {
            forge_core::Value::Array(_) => json!({ "type": "Multi", "values": value.to_json() }),
            _ => json!({ "type": "Single", "value": value.to_json() }),
        };
        out.insert(key.to_string(), wrapped);
    }
    Json::Object(out)
}

/// `unwrapAll`: the API's `Single` / `Multi` values back to plain values.
pub fn unwrap_all(wrapped: &forge_core::Value) -> forge_core::value::Map {
    let mut out = forge_core::value::Map::new();
    if let Some(o) = wrapped.as_object() {
        for (key, value) in o.iter() {
            let plain = if value.get("type").as_str() == Some("Multi") { value.get("values") } else { value.get("value") };
            out.insert(key.clone(), plain);
        }
    }
    out
}

// Delius, Handover, Coordinator, ARNS --------------------------------------------------------

/// `DeliusApiClient`.
pub struct DeliusApiClient {
    rest: RestClient,
}

impl DeliusApiClient {
    pub fn new(config: &Config, auth: Arc<AuthenticationClient>) -> Self {
        Self { rest: RestClient::new("Delius API", &config.delius_api, Some(auth)) }
    }

    pub async fn get_case_details(&self, crn: &str) -> ApiResult<Json> {
        self.rest.get(&format!("/case-details/{crn}"), As::System).await
    }

    /// Whether a user can access a CRN (the authorisation middleware).
    pub async fn get_user_access(&self, username: &str, crn: &str) -> ApiResult<Json> {
        self.rest.get(&format!("/users/{username}/access/{crn}"), As::System).await
    }

    pub fn rest(&self) -> &RestClient {
        &self.rest
    }
}

/// `HandoverApiClient`.
pub struct HandoverApiClient {
    rest: RestClient,
}

impl HandoverApiClient {
    pub fn new(config: &Config, auth: Arc<AuthenticationClient>) -> Self {
        Self { rest: RestClient::new("Handover API", &config.arns_handover.api, Some(auth)) }
    }

    pub async fn get_context(&self, handover_session_id: &str) -> ApiResult<Json> {
        self.rest.get(&format!("/context/{handover_session_id}"), As::System).await
    }

    /// The handover context of the signed-in user's active session.
    pub async fn get_current_context(&self, token: &str) -> ApiResult<Json> {
        self.rest.get("/context", As::User(token.to_string())).await
    }

    pub async fn create_handover_link(&self, request: &Json) -> ApiResult<Json> {
        self.rest.post("/handover", request, As::System).await
    }

    pub async fn update_context(&self, handover_session_id: &str, request: &Json) -> ApiResult<Json> {
        self.rest.post(&format!("/context/{handover_session_id}"), request, As::System).await
    }

    pub fn rest(&self) -> &RestClient {
        &self.rest
    }
}

/// `CoordinatorApiClient`.
pub struct CoordinatorApiClient {
    rest: RestClient,
}

impl CoordinatorApiClient {
    pub fn new(config: &Config, auth: Arc<AuthenticationClient>) -> Self {
        Self { rest: RestClient::new("Coordinator API", &config.coordinator_api, Some(auth)) }
    }

    pub async fn create_oasys_association(&self, request: &Json) -> ApiResult<Json> {
        self.rest.post("/oasys/create", request, As::System).await
    }

    pub async fn merge_oasys_association(&self, request: &Json) -> ApiResult<Json> {
        self.rest.post("/oasys/merge", request, As::System).await
    }

    pub async fn get_entity_assessment(&self, entity_uuid: &str) -> ApiResult<Json> {
        self.rest.get(&format!("/entity/{entity_uuid}/ASSESSMENT"), As::System).await
    }

    pub async fn get_versions_by_entity_id(&self, entity_uuid: &str) -> ApiResult<Json> {
        self.rest.get(&format!("/entity/versions/{entity_uuid}"), As::System).await
    }

    pub fn rest(&self) -> &RestClient {
        &self.rest
    }
}

/// `ArnsApiClient`.
pub struct ArnsApiClient {
    rest: RestClient,
}

impl ArnsApiClient {
    pub fn new(config: &Config, auth: Arc<AuthenticationClient>) -> Self {
        Self { rest: RestClient::new("ARNS API", &config.arns_api, Some(auth)) }
    }

    pub async fn get_criminogenic_needs(&self, crn: &str, token: &str) -> ApiResult<Json> {
        let query = [("excludeIncomplete", "false".to_string())];
        self.rest.get_with_query(&format!("/needs/crn/{crn}"), &query, As::User(token.to_string())).await
    }

    pub async fn get_criminogenic_needs_details(&self, crn: &str) -> ApiResult<Json> {
        let query = [("excludeIncomplete", "false".to_string())];
        self.rest.get_with_query(&format!("/needs/{crn}"), &query, As::System).await
    }

    pub fn rest(&self) -> &RestClient {
        &self.rest
    }
}

// Wiremock admin ---------------------------------------------------------------------------

/// `WiremockAdminClient`: registers per-session stubs for stubbed APIs (training sessions).
pub struct WiremockAdminClient {
    rest: RestClient,
    arns_api_url: String,
    can_stub_arns_api: bool,
    arns_api_stub_prefix: &'static str,
}

impl WiremockAdminClient {
    pub fn new(config: &Config) -> Self {
        Self {
            rest: RestClient::new("Wiremock admin", &config.wiremock_admin, None),
            arns_api_url: config.arns_api.url.clone(),
            can_stub_arns_api: config.can_stub_arns_api,
            arns_api_stub_prefix: config.arns_api_stub_prefix,
        }
    }

    /// `canStub('arnsApi')`: stubbing is enabled and the ARNS API URL points at Wiremock's prefix.
    pub fn can_stub_arns_api(&self) -> bool {
        if !self.can_stub_arns_api {
            return false;
        }
        let path = reqwest::Url::parse(&self.arns_api_url).map(|u| u.path().trim_end_matches('/').to_string()).unwrap_or_default();
        path == self.arns_api_stub_prefix
    }

    pub async fn remove_stubs(&self, ids: &[String]) {
        let mut failed = Vec::new();
        for id in ids {
            if let Err(e) = self.rest.delete(&format!("/mappings/{id}"), As::Anonymous).await
                && e.status != Some(404)
            {
                failed.push(id.clone());
            }
        }
        if !failed.is_empty() {
            crate::warn!({ "ids": failed }, "Failed to remove Wiremock stubs, they stay until Wiremock restarts");
        }
    }

    pub async fn import_stubs(&self, mappings: Vec<Json>) {
        let url_paths: Vec<Json> = mappings.iter().map(|m| m["request"]["urlPath"].clone()).collect();
        let body = json!({
            "mappings": mappings,
            "importOptions": { "duplicatePolicy": "OVERWRITE", "deleteAllNotInImport": false },
        });
        if let Err(e) = self.rest.post("/mappings/import", &body, As::Anonymous).await {
            crate::warn!(
                { "err": e.to_string(), "urlPaths": url_paths },
                "Failed to import Wiremock stubs, requests will fall through to the canned or real API response"
            );
        }
    }
}

// Preferences ------------------------------------------------------------------------------

const PREFERENCES_PREFIX: &str = "preferences:";
const PREFERENCES_TTL_SECONDS: u64 = 60 * 60 * 24 * 365;

/// `PreferencesStore`: per-browser preferences (training session launcher), in Redis.
pub struct PreferencesStore {
    redis: Option<Arc<RedisClient>>,
}

impl PreferencesStore {
    pub fn new(redis: Option<Arc<RedisClient>>) -> Self {
        Self { redis }
    }

    pub async fn get(&self, id: &str) -> Option<Json> {
        let Some(redis) = &self.redis else {
            crate::warn!("Redis not enabled, returning null for preferences");
            return None;
        };
        match redis.get(&format!("{PREFERENCES_PREFIX}{id}")).await {
            Ok(Some(data)) => serde_json::from_str(&data).ok(),
            Ok(None) => None,
            Err(e) => {
                crate::error!({ "err": e.to_string(), "preferencesId": id }, "Failed to get preferences data");
                None
            }
        }
    }

    pub async fn set(&self, id: &str, data: &Json) {
        let Some(redis) = &self.redis else {
            crate::warn!("Redis not enabled, preferences data not persisted");
            return;
        };
        if let Err(e) = redis.set_ex(&format!("{PREFERENCES_PREFIX}{id}"), &data.to_string(), PREFERENCES_TTL_SECONDS).await {
            crate::error!({ "err": e.to_string(), "preferencesId": id }, "Failed to set preferences data");
        }
    }

    pub async fn delete(&self, id: &str) {
        if let Some(redis) = &self.redis
            && let Err(e) = redis.del(&format!("{PREFERENCES_PREFIX}{id}")).await
        {
            crate::error!({ "err": e.to_string(), "preferencesId": id }, "Failed to delete preferences data");
        }
    }

    pub async fn update(&self, id: &str, updater: impl FnOnce(Option<Json>) -> Json) {
        let current = self.get(id).await;
        self.set(id, &updater(current)).await;
    }
}
