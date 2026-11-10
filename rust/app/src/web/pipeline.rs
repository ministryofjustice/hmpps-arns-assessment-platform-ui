//! The request pipeline, in order: request id and security headers,
//! the session, the preferences cookie, authentication and authorisation, CSRF, the current
//! user, feature flags and previous page tracking, then the route; errors go to the error page
//! (authentication errors sign the user out).

use std::collections::HashMap;
use std::sync::Arc;

use base64::Engine;
use forge_core::framework::{HttpMethod, OutcomeKind, RecordingResponse, RequestSnapshot};
use forge_core::engine::concerns::render::Renderer;
use forge_core::engine::mount::ForgeRoute;
use forge_core::engine::runtime::context::RequestLocation;
use forge_core::route_path::resolve_path_params;
use forge_core::value::Map;
use forge_core::{Forge, Value};
use forge_runjucks::RunjucksEngine;
use serde_json::{Value as Json, json};
use topcoat::context::Cx;
use topcoat::router::response::Response;
use topcoat::router::{Body, Method, StatusCode, request, to_bytes};

use super::session::{SESSION_COOKIE_NAME, SessionStore, new_session_id};
use crate::config::Config;
use crate::services::Services;
use crate::services::feature_flags::BOOLEAN_FEATURE_FLAGS;
use crate::utils::convert_to_title_case;

const PREFERENCES_COOKIE: &str = "hmpps-arns-assessment-platform-preferences";
const ONE_YEAR_SECONDS: u64 = 365 * 24 * 60 * 60;
const MAX_PAGE_HISTORY: usize = 10;

/// Paths that don't require signing in.
const AUTH_BYPASS_PATHS: [&str; 4] =
    ["/training-session-launcher", "/data-deletion-tool", "/platform", "/sentence-plan/unsaved-information-deleted"];

/// Paths previous page tracking ignores.
const UNTRACKED_PATH_PREFIXES: [&str; 9] =
    ["/assets", "/health", "/info", "/ping", "/sign-in", "/sign-out", "/autherror", "/account-details", "/session"];

/// Everything requests share.
pub struct App {
    pub config: &'static Config,
    pub services: Arc<Services>,
    pub forge: Arc<Forge>,
    pub renderer: Arc<dyn Renderer>,
    pub engine: Arc<RunjucksEngine>,
    pub sessions: SessionStore,
    pub locals: Value,
    pub http: reqwest::Client,
    pub paths: super::views::AppPaths,
    pub started: std::time::Instant,
}

/// One request as it moves through the pipeline.
pub struct Req {
    pub method: Method,
    pub uri: http::Uri,
    pub path: String,
    pub headers: http::HeaderMap,
    pub cookies: HashMap<String, String>,
    pub body: Value,
    pub session_id: String,
    pub session: Value,
    /// The request state: what Forge effects and templates see.
    pub state: Value,
    pub nonce: String,
    pub request_id: String,
    set_cookies: Vec<String>,
    /// Signed-in sessions are reissued under a new id (login), or removed (logout).
    session_destroyed: bool,
}

impl Req {
    pub fn user(&self) -> Value {
        self.session.get("passport").get("user")
    }

    pub fn is_authenticated(&self) -> bool {
        self.user().truthy()
    }

    pub fn auth_source(&self) -> String {
        self.user().get("authSource").to_js_string()
    }

    /// Signs out: the session is removed.
    pub async fn destroy_session(&mut self, app: &App) {
        app.sessions.destroy(&self.session_id).await;
        self.session = Value::empty_object();
        self.session_destroyed = true;
    }

    /// Signs in: a new session id with the user, keeping only the given values.
    pub async fn log_in(&mut self, app: &App, user: Value, keep: &[&str]) {
        let mut fresh = Value::empty_object();
        for key in keep {
            let v = self.session.get(key);
            if !v.is_undefined() {
                fresh.set(*key, v);
            }
        }
        fresh.set("passport", Value::from_pairs([("user", user)]));
        app.sessions.destroy(&self.session_id).await;
        self.session_id = new_session_id();
        self.session = fresh;
    }

    pub fn query(&self) -> Value {
        self.uri.query().map_or_else(Value::empty_object, forge_topcoat::parse_qs)
    }

    pub fn original_url(&self) -> String {
        self.uri.path_and_query().map_or_else(|| self.path.clone(), |p| p.as_str().to_string())
    }
}

fn parse_cookies(headers: &http::HeaderMap) -> HashMap<String, String> {
    let mut out = HashMap::new();
    for header in headers.get_all(http::header::COOKIE) {
        for part in header.to_str().unwrap_or_default().split(';') {
            if let Some((k, v)) = part.trim().split_once('=') {
                out.insert(k.trim().to_string(), percent_decode(v.trim()));
            }
        }
    }
    out
}

pub fn percent_decode(s: &str) -> String {
    let bytes = s.as_bytes();
    let mut out = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%'
            && i + 2 < bytes.len()
            && let Ok(b) = u8::from_str_radix(std::str::from_utf8(&bytes[i + 1..i + 3]).unwrap_or("zz"), 16)
        {
            out.push(b);
            i += 3;
            continue;
        }
        out.push(bytes[i]);
        i += 1;
    }
    String::from_utf8_lossy(&out).into_owned()
}

/// `jwtDecode`: the token's claims, unverified (HMPPS Auth and the handover service issued it).
pub fn jwt_claims(token: &str) -> Json {
    token
        .split('.')
        .nth(1)
        .and_then(|p| base64::engine::general_purpose::URL_SAFE_NO_PAD.decode(p.trim_end_matches('=')).ok())
        .and_then(|b| serde_json::from_slice(&b).ok())
        .unwrap_or(Json::Null)
}

pub fn respond(status: StatusCode, content_type: &str, body: impl Into<Body>) -> Response {
    let mut r = Response::new(body.into());
    *r.status_mut() = status;
    if let Ok(v) = http::HeaderValue::from_str(content_type) {
        r.headers_mut().insert(http::header::CONTENT_TYPE, v);
    }
    r
}

pub fn redirect(location: &str) -> Response {
    let mut r = respond(StatusCode::FOUND, "text/plain; charset=utf-8", format!("Found. Redirecting to {location}"));
    if let Ok(v) = http::HeaderValue::from_str(location) {
        r.headers_mut().insert(http::header::LOCATION, v);
    }
    r
}

fn is_under(path: &str, prefix: &str) -> bool {
    let prefix = prefix.trim_end_matches('/');
    let prefix = if prefix.is_empty() { "/" } else { prefix };
    path == prefix || path.starts_with(&format!("{prefix}/"))
}

/// What the request runs, once the pipeline lets it through.
pub enum Handler<'a> {
    Forge(&'a ForgeRoute),
    Auth(super::auth::AuthRoute),
    Index,
    SessionExtend,
    PrintPreviewPdf,
    NotFound,
}

/// An error leaving a handler: its status and message.
pub struct HttpError {
    pub status: u16,
    pub message: String,
}

impl App {
    fn cookie(&self, name: &str, value: &str, max_age_seconds: u64) -> String {
        let secure = if self.config.https { "; Secure" } else { "" };
        format!("{name}={value}; Path=/; Max-Age={max_age_seconds}; HttpOnly; SameSite=Lax{secure}")
    }

    /// Request id, CSP nonce, session, preferences cookie and the app locals.
    pub async fn begin(&self, cx: &Cx, body: Body) -> Result<Req, Response> {
        let method = request::method(cx).clone();
        let uri = request::uri(cx).clone();
        let headers = request::headers(cx).clone();
        let cookies = parse_cookies(&headers);
        let body = if method == Method::POST {
            let content_type = headers.get(http::header::CONTENT_TYPE).and_then(|v| v.to_str().ok()).unwrap_or_default().to_string();
            // 100 KB, as for form posts
            let bytes = to_bytes(body, 100 * 1024).await.map_err(|_| respond(StatusCode::PAYLOAD_TOO_LARGE, "text/plain", "request entity too large"))?;
            let text = String::from_utf8_lossy(&bytes);
            if content_type.starts_with("application/x-www-form-urlencoded") {
                forge_topcoat::parse_qs(&text)
            } else if content_type.starts_with("application/json") {
                serde_json::from_str::<Json>(&text).map(|j| Value::from_json(&j)).unwrap_or_else(|_| Value::empty_object())
            } else {
                Value::empty_object()
            }
        } else {
            Value::empty_object()
        };
        let request_id =
            headers.get("x-request-id").and_then(|v| v.to_str().ok()).map(str::to_string).unwrap_or_else(|| uuid::Uuid::new_v4().to_string());
        let nonce = new_session_id()[..32].to_string();

        let existing = cookies.get(SESSION_COOKIE_NAME).cloned();
        let loaded = match &existing {
            Some(id) => self.sessions.load(id).await,
            None => None,
        };
        let (session_id, mut session) = match (existing, loaded) {
            (Some(id), Some(s)) => (id, s),
            _ => (new_session_id(), Value::empty_object()),
        };
        session.set("nowInMinutes", Value::Number((chrono::Utc::now().timestamp() / 60) as f64));
        // A telemetry id per session, so analytics can dedupe by login
        if !session.get("telemetryId").truthy() {
            session.set("telemetryId", Value::from(uuid::Uuid::new_v4().to_string()));
        }

        let mut state = self.locals.clone();
        state.set("requestId", Value::from(request_id.as_str()));
        state.set("telemetryId", session.get("telemetryId"));
        state.set("cspNonce", Value::from(nonce.as_str()));
        let mut set_cookies = vec![];
        let preferences_id = match cookies.get(PREFERENCES_COOKIE) {
            Some(id) if !id.is_empty() => id.clone(),
            _ => {
                let id = uuid::Uuid::new_v4().to_string();
                set_cookies.push(self.cookie(PREFERENCES_COOKIE, &id, ONE_YEAR_SECONDS));
                id
            }
        };
        state.set("preferencesId", Value::from(preferences_id));
        let path = uri.path().to_string();
        Ok(Req {
            method,
            uri,
            path,
            headers,
            cookies,
            body,
            session_id,
            session,
            state,
            nonce,
            request_id,
            set_cookies,
            session_destroyed: false,
        })
    }

    /// Authentication gating and CRN authorisation. `Ok(bypassed)`, or the
    /// response that stops the request.
    pub async fn authenticate(&self, req: &mut Req) -> Result<bool, Response> {
        // Switching between OASys and HMPPS Auth access starts a new session.
        let segments: Vec<&str> = req.path.split('/').collect();
        if segments.len() >= 4 && segments[1] == "access" && req.is_authenticated() {
            if segments[3] == "crn" && req.auth_source() == "OASYS" {
                let return_to = req.original_url();
                req.destroy_session(self).await;
                return Err(redirect(&return_to));
            }
            if segments[3] == "oasys" && req.auth_source() == "HMPPS_AUTH" {
                let service = segments[2].to_string();
                req.destroy_session(self).await;
                return Err(redirect(&format!("/sign-in/handover?service={service}")));
            }
        }
        let bypassed = AUTH_BYPASS_PATHS.iter().any(|p| is_under(&req.path, p));
        if !bypassed {
            let authenticated = req.is_authenticated()
                && (req.auth_source() == "OASYS" || self.verify_token(&req.user().get("token").to_js_string()).await);
            if !authenticated {
                req.session.set("returnTo", Value::from(req.original_url()));
                return Err(redirect("/sign-in"));
            }
        }
        if bypassed {
            return Ok(true);
        }
        // Fine-grained access: an HMPPS Auth user may only open the CRNs Delius allows them.
        let token = req.user().get("token").to_js_string();
        let claims = jwt_claims(&token);
        let crn = (segments.len() >= 5 && segments[1] == "access" && segments[3] == "crn").then(|| segments[4].to_string());
        if let (Some(crn), Some(username)) = (crn, claims.get("user_name").and_then(Json::as_str))
            && req.auth_source() == "HMPPS_AUTH"
        {
            match self.services.delius_api_client.get_user_access(username, &crn).await {
                Ok(access) if access.get("canAccess").and_then(Json::as_bool) == Some(true) => {}
                Ok(_) => {
                    crate::warn!({ "username": username, "crn": crn }, "User cannot access requested CRN");
                    return Err(redirect("/autherror"));
                }
                Err(e) => {
                    crate::error!({ "err": e.to_string(), "username": username, "crn": crn }, "Unable to verify fine-grained CRN access");
                    return Err(self.error_page(req, e.status.unwrap_or(500), &e.to_string()));
                }
            }
        }
        Ok(false)
    }

    /// `VerificationClient.verifyToken`: the token is still active (when verification is on).
    async fn verify_token(&self, token: &str) -> bool {
        if !self.config.token_verification_enabled {
            return true;
        }
        let url = format!("{}/token/verify", self.config.token_verification.url);
        match self.http.post(url).bearer_auth(token).send().await {
            Ok(r) => r.json::<Json>().await.ok().and_then(|j| j.get("active").and_then(Json::as_bool)).unwrap_or(false),
            Err(e) => {
                crate::error!({ "err": e.to_string() }, "Token verification failed");
                false
            }
        }
    }

    /// CSRF: a synchroniser token per session, required as `_csrf` on POSTs.
    pub fn csrf(&self, req: &mut Req) -> Result<(), Response> {
        let token = match req.session.get("csrfToken") {
            Value::String(t) => t.to_string(),
            _ => {
                let t = new_session_id();
                req.session.set("csrfToken", Value::from(t.as_str()));
                t
            }
        };
        let test_mode = std::env::var("NODE_ENV").as_deref() == Ok("test");
        if !test_mode && req.method == Method::POST && req.body.get("_csrf").as_str() != Some(token.as_str()) {
            crate::warn!({ "path": req.path }, "Invalid CSRF token");
            // an invalid token is a 403, which signs the user out
            return Err(redirect("/sign-out"));
        }
        req.state.set("csrfToken", Value::from(token));
        Ok(())
    }

    /// The current user, feature flags, previous page tracking and the
    /// `targetService` local.
    pub async fn current_user(&self, req: &mut Req, bypassed: bool) {
        let user = req.user();
        if req.is_authenticated() && !(bypassed && !user.get("token").truthy()) {
            let token = user.get("token").to_js_string();
            let claims = jwt_claims(&token);
            let name = claims.get("name").and_then(Json::as_str).map(str::to_string);
            let user_id = claims.get("user_id").and_then(Json::as_str).map(str::to_string);
            let roles: Vec<String> = claims
                .get("authorities")
                .and_then(Json::as_array)
                .map(|a| a.iter().filter_map(Json::as_str).map(|r| r.split_once('_').map_or(r, |(_, rest)| rest).to_string()).collect())
                .unwrap_or_default();
            let username = user.get("username").to_js_string();
            let display_name = convert_to_title_case(name.as_deref().unwrap_or_default());
            let auth_source = user.get("authSource").to_js_string();
            let user_context = if auth_source == "HMPPS_AUTH" {
                roles.first().cloned().unwrap_or_else(|| "UNKNOWN".into())
            } else {
                req.session.get("handoverContext").get("subject").get("location").as_str().unwrap_or("UNKNOWN").to_string()
            };
            req.session.set(
                "principal",
                Value::from_json(&json!({
                    "identifier": user_id.clone().unwrap_or_else(|| username.clone()),
                    "username": username,
                    "displayName": display_name,
                })),
            );
            req.state.set("userContext", Value::from(user_context));
            req.state.set(
                "user",
                Value::from_json(&json!({
                    "id": username,
                    "name": name.clone().unwrap_or_else(|| username.clone()),
                    "displayName": display_name,
                    "authSource": auth_source,
                    "token": token,
                    "userRoles": roles,
                })),
            );
        }
        let user_id = jwt_claims(&user.get("token").to_js_string()).get("user_id").and_then(Json::as_str).map(str::to_string);
        let flags = self.services.feature_flag_service.evaluate_boolean_flags(BOOLEAN_FEATURE_FLAGS, user_id.as_deref()).await;
        req.state.set("featureFlags", Value::from_json(&flags));

        // Back-navigation: the entry before the revisited page; otherwise the top of the stack.
        let history = page_history(&req.session);
        let current = req.original_url();
        let previous = match history.iter().position(|u| *u == current) {
            Some(0) => None,
            Some(i) => history.get(i - 1).cloned(),
            None => history.last().cloned(),
        };
        req.state.set("previousPageUrl", previous.map_or(Value::Undefined, Value::from));
        req.state.set("targetService", req.session.get("targetService"));
    }

    /// The error handler: authentication failures sign the user out; anything else is the error
    /// page (with the message outside production).
    pub fn error_page(&self, req: &Req, status: u16, message: &str) -> Response {
        crate::error!({ "originalUrl": req.original_url(), "status": status, "err": message }, "Error handling request");
        if status == 401 || status == 403 {
            crate::info!({ "statusCode": status }, "Logging user out after authentication error");
            return redirect("/sign-out");
        }
        let message =
            if self.config.production { "Something went wrong. The error has been logged. Please try again".to_string() } else { message.to_string() };
        let mut context = req.state.clone();
        context.set("message", Value::from(message.as_str()));
        context.set("status", Value::Number(status as f64));
        let html = self.engine.render("pages/error.njk", &context).unwrap_or_else(|e| {
            crate::error!({ "err": e.to_string() }, "Error page failed to render");
            format!("{status} {message}")
        });
        respond(StatusCode::from_u16(status).unwrap_or(StatusCode::INTERNAL_SERVER_ERROR), "text/html; charset=utf-8", html)
    }

    /// Runs the request through the pipeline and the handler, then finishes the response.
    pub async fn handle(&self, cx: &Cx, body: Body, handler: Handler<'_>) -> Response {
        let mut req = match self.begin(cx, body).await {
            Ok(r) => r,
            Err(response) => return response,
        };
        let response = match self.run(&mut req, handler).await {
            Ok(r) | Err(r) => r,
        };
        self.finish(req, response).await
    }

    async fn run(&self, req: &mut Req, handler: Handler<'_>) -> Result<Response, Response> {
        // The sign-in routes come before authentication gating
        if let Handler::Auth(route) = handler {
            return Ok(self.auth_route(req, route).await);
        }
        let bypassed = self.authenticate(req).await?;
        self.csrf(req)?;
        self.current_user(req, bypassed).await;
        Ok(match handler {
            Handler::Forge(route) => self.execute_forge(req, route).await,
            Handler::Index => {
                let mut context = req.state.clone();
                let now = forge_core::jsdate::JsDate::now();
                let date = forge_core::jsdate::intl_format_date(
                    &now,
                    &forge_core::jsdate::DateFormatOptions { locale: Some("en-GB".into()), date_style: Some("full".into()), ..Default::default() },
                )
                .unwrap_or_default();
                context.set("currentTime", Value::from(format!("{date} at {}", chrono::Local::now().format("%H:%M:%S %Z"))));
                match self.engine.render("pages/index.njk", &context) {
                    Ok(html) => respond(StatusCode::OK, "text/html; charset=utf-8", html),
                    Err(e) => self.error_page(req, 500, &e.to_string()),
                }
            }
            Handler::SessionExtend => {
                if !req.session.get("principal").truthy() {
                    respond(StatusCode::UNAUTHORIZED, "application/json", r#"{"error":"Not authenticated"}"#)
                } else {
                    respond(StatusCode::NO_CONTENT, "text/plain", "")
                }
            }
            Handler::PrintPreviewPdf => self.print_preview_pdf(req).await,
            Handler::Auth(_) => unreachable!(),
            Handler::NotFound => {
                crate::warn!({ "path": req.path }, "Page not found");
                self.error_page(req, 404, "Not found")
            }
        })
    }

    /// The plan's print preview as a PDF, rendered by Gotenberg loading the
    /// preview page with the user's session cookie.
    async fn print_preview_pdf(&self, req: &Req) -> Response {
        let Some(cookie) = req.cookies.get(SESSION_COOKIE_NAME) else {
            return self.error_page(req, 401, "A valid session is required to export a sentence plan");
        };
        if !req.state.get("featureFlags").get("printAndShareEnabled").truthy() {
            return self.error_page(req, 404, "PDF export is not available");
        }
        let session_cookie = format!("{SESSION_COOKIE_NAME}={cookie}");
        let path = crate::forms::sentence_plan::constants::SENTENCE_PLAN_PRINT_PREVIEW_PATH;
        match self.services.gotenberg_client.render_pdf_from_url(path, &session_cookie, Some(&req.request_id)).await {
            Ok(pdf) => {
                let mut r = respond(StatusCode::OK, "application/pdf", pdf);
                r.headers_mut().insert(
                    http::header::CONTENT_DISPOSITION,
                    http::HeaderValue::from_static("attachment; filename=\"sentence-plan.pdf\""),
                );
                r
            }
            Err(e) => self.error_page(req, e.status.unwrap_or(500), &e.to_string()),
        }
    }

    /// Runs a Forge node.
    async fn execute_forge(&self, req: &mut Req, route: &ForgeRoute) -> Response {
        if req.method == Method::POST {
            let content_type = req.headers.get(http::header::CONTENT_TYPE).and_then(|v| v.to_str().ok()).unwrap_or_default();
            if !content_type.starts_with("application/x-www-form-urlencoded") {
                return respond(StatusCode::UNSUPPORTED_MEDIA_TYPE, "text/plain", "Unsupported request body type");
            }
        }
        let mut params = Map::new();
        for (t, p) in route.template_path.split('/').zip(req.path.split('/')) {
            if let Some(name) = t.strip_prefix(':') {
                params.insert(name.into(), Value::from(percent_decode(p)));
            }
        }
        let params = Value::object(params);
        let mut header_map = Map::new();
        for (name, value) in req.headers.iter() {
            header_map.insert(name.as_str().into(), Value::from(value.to_str().unwrap_or_default()));
        }
        let mut cookie_map = Map::new();
        for (k, v) in &req.cookies {
            cookie_map.insert(k.as_str().into(), Value::from(v.as_str()));
        }
        let host = req.headers.get(http::header::HOST).and_then(|v| v.to_str().ok()).unwrap_or("localhost");
        let proto = req.headers.get("x-forwarded-proto").and_then(|v| v.to_str().ok()).unwrap_or("http");
        let origin = format!("{proto}://{host}");
        let mut session = req.session.clone();
        session.set("id", Value::from(req.session_id.as_str()));
        let snapshot = RequestSnapshot {
            node_id: route.node_id.as_str().into(),
            method: if req.method == Method::POST { HttpMethod::Post } else { HttpMethod::Get },
            location: RequestLocation {
                href: format!("{origin}{}", req.original_url()),
                pathname: req.path.clone(),
                base_path: resolve_path_params(&route.base_path, &params),
                origin,
            },
            params,
            query: req.query(),
            post: req.body.clone(),
            headers: Value::object(header_map),
            cookies: Value::object(cookie_map),
            state: req.state.clone(),
            session,
        };
        let recording = Arc::new(RecordingResponse::default());
        let result = self.forge.execute_with_renderer(&snapshot, recording.clone(), self.renderer.clone()).await;
        let mut response = match result {
            Err(e) => return self.error_page(req, e.status().unwrap_or(500), &e.to_string()),
            Ok(outcome) => {
                let mut session = outcome.session.clone();
                crate::forms::dsl::remove_key(&mut session, "id");
                req.session = session;
                match outcome.kind {
                    OutcomeKind::Navigate { url } => redirect(&url),
                    OutcomeKind::Error(e) => return self.error_page(req, e.status, &e.message),
                    OutcomeKind::Render { output: Some(html), .. } => respond(StatusCode::OK, "text/html; charset=utf-8", html.to_js_string()),
                    OutcomeKind::Render { output: None, .. } => {
                        return self.error_page(req, 500, "Render outcome produced no output - renderer not bound");
                    }
                }
            }
        };
        for (name, value) in recording.headers.lock().unwrap().iter() {
            if let (Ok(n), Ok(v)) = (http::HeaderName::try_from(name.as_str()), http::HeaderValue::from_str(value)) {
                response.headers_mut().insert(n, v);
            }
        }
        for (name, cookie) in recording.cookies.lock().unwrap().iter() {
            let max_age = cookie.options.as_ref().and_then(|o| o.max_age).map_or(0, |ms| (ms / 1000.0) as u64);
            req.set_cookies.push(self.cookie(name, &cookie.value, max_age));
        }
        response
    }

    /// Saves the session (rolling expiry), tracks the page, and adds cookies and headers.
    pub async fn finish(&self, mut req: Req, mut response: Response) -> Response {
        let status = response.status().as_u16();
        let is_html = response.headers().get(http::header::CONTENT_TYPE).and_then(|v| v.to_str().ok()).is_some_and(|c| c.contains("text/html"));
        let path = req.path.to_lowercase();
        if req.method == Method::GET
            && (200..300).contains(&status)
            && is_html
            && !UNTRACKED_PATH_PREFIXES.iter().any(|p| path == *p || path.starts_with(&format!("{p}/")))
        {
            let current = req.original_url();
            let mut history = page_history(&req.session);
            match history.iter().position(|u| *u == current) {
                Some(i) => history.truncate(i + 1),
                None if history.last() != Some(&current) => {
                    history.push(current);
                    let excess = history.len().saturating_sub(MAX_PAGE_HISTORY);
                    history.drain(..excess);
                }
                None => {}
            }
            req.session.set("pageHistory", Value::array(history.into_iter().map(Value::from).collect()));
        }
        if req.session_destroyed && !req.is_authenticated() && req.session.as_object().is_none_or(|o| o.is_empty()) {
            req.set_cookies.push(format!("{SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"));
        } else {
            self.sessions.save(&req.session_id, &req.session).await;
            req.set_cookies.push(self.cookie(SESSION_COOKIE_NAME, &req.session_id, self.sessions.max_age().as_secs()));
        }
        let headers = response.headers_mut();
        for cookie in &req.set_cookies {
            if let Ok(v) = http::HeaderValue::from_str(cookie) {
                headers.append(http::header::SET_COOKIE, v);
            }
        }
        for (name, value) in security_headers(self.config, &req.nonce) {
            if let Ok(v) = http::HeaderValue::from_str(&value) {
                headers.insert(http::HeaderName::from_static(name), v);
            }
        }
        if let Ok(v) = http::HeaderValue::from_str(&req.request_id) {
            headers.insert(http::HeaderName::from_static("x-request-id"), v);
        }
        response
    }
}

fn page_history(session: &Value) -> Vec<String> {
    session.get("pageHistory").as_array().map(|a| a.iter().map(Value::to_js_string).collect()).unwrap_or_default()
}

/// Security headers (with a CSP nonce per request) and no-cache headers for pages.
pub fn security_headers(config: &Config, nonce: &str) -> Vec<(&'static str, String)> {
    let mut csp = vec![
        "default-src 'self'".to_string(),
        format!("script-src 'self' 'nonce-{nonce}' https://embed.smartsurvey.io"),
        format!("style-src 'self' 'nonce-{nonce}'"),
        "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com".to_string(),
        "style-src-attr 'unsafe-inline'".to_string(),
        "font-src 'self' https://fonts.gstatic.com".to_string(),
        "connect-src 'self' https://www.smartsurvey.co.uk https://*.applicationinsights.azure.com".to_string(),
        "img-src 'self' https://embed.smartsurvey.io".to_string(),
        format!(
            "form-action 'self' https://*.hmpps.service.justice.gov.uk {} {} {}",
            config.hmpps_auth.external_url, config.arns_handover.external_url, config.san_legacy_url
        ),
        "base-uri 'self'".to_string(),
        "frame-ancestors 'self'".to_string(),
        "object-src 'none'".to_string(),
        "script-src-attr 'none'".to_string(),
    ];
    if config.https {
        csp.push("upgrade-insecure-requests".to_string());
    }
    vec![
        ("content-security-policy", csp.join(";")),
        ("permissions-policy", "geolocation=(), camera=(), microphone=(), payment=(), usb=(), fullscreen=(self)".into()),
        ("cross-origin-embedder-policy", "require-corp".into()),
        ("cross-origin-opener-policy", "same-origin".into()),
        ("cross-origin-resource-policy", "same-origin".into()),
        ("origin-agent-cluster", "?1".into()),
        ("referrer-policy", "no-referrer".into()),
        ("strict-transport-security", "max-age=31536000; includeSubDomains".into()),
        ("x-content-type-options", "nosniff".into()),
        ("x-dns-prefetch-control", "off".into()),
        ("x-download-options", "noopen".into()),
        ("x-frame-options", "SAMEORIGIN".into()),
        ("x-permitted-cross-domain-policies", "none".into()),
        ("cache-control", "no-store, no-cache, must-revalidate, proxy-revalidate".into()),
        ("pragma", "no-cache".into()),
        ("expires", "0".into()),
        ("surrogate-control", "no-store".into()),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn decodes_jwt_claims() {
        let payload = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode(r#"{"user_name":"AUSER","authorities":["ROLE_PROBATION"]}"#);
        let claims = jwt_claims(&format!("h.{payload}.s"));
        assert_eq!(claims["user_name"], "AUSER");
        assert!(jwt_claims("not-a-token").is_null());
    }

    #[test]
    fn bypass_prefixes_match_whole_segments() {
        assert!(is_under("/platform", "/platform"));
        assert!(is_under("/platform/accessibility", "/platform"));
        assert!(!is_under("/platformx", "/platform"));
    }
}
