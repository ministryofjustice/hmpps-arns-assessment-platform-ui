//! The sign-in routes (OAuth2 authorisation code flows with HMPPS Auth and the ARNS handover
//! service), sign-out and account details.

use forge_core::Value;
use serde_json::Value as Json;
use topcoat::router::StatusCode;
use topcoat::router::response::Response;

use super::pipeline::{App, Req, jwt_claims, redirect, respond};
use super::session::new_session_id;
use crate::data::rest_client::basic_auth;
use crate::utils::encode_uri_component;

/// The auth routes, matched before authentication gating.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum AuthRoute {
    SignIn,
    HmppsAuth,
    HmppsAuthCallback,
    Handover,
    HandoverCallback,
    SignOut,
    AccountDetails,
    AuthError,
}

impl AuthRoute {
    pub const ALL: [(AuthRoute, &'static str); 8] = [
        (AuthRoute::SignIn, "/sign-in"),
        (AuthRoute::HmppsAuth, "/sign-in/hmpps-auth"),
        (AuthRoute::HmppsAuthCallback, "/sign-in/hmpps-auth/callback"),
        (AuthRoute::Handover, "/sign-in/handover"),
        (AuthRoute::HandoverCallback, "/sign-in/handover/callback"),
        (AuthRoute::SignOut, "/sign-out"),
        (AuthRoute::AccountDetails, "/account-details"),
        (AuthRoute::AuthError, "/autherror"),
    ];
}

#[derive(Clone, Copy, PartialEq, Eq)]
enum Strategy {
    HmppsAuth,
    Handover,
}

struct StrategyConfig {
    authorize_url: String,
    token_url: String,
    client_id: String,
    client_secret: String,
    callback_url: String,
    scope: Option<&'static str>,
    state_key: &'static str,
}

/// Mapping of service names to their access form entry paths after handover auth.
fn target_service_path(service: &str) -> Option<&'static str> {
    match service {
        "sentence-plan" => Some("/access/sentence-plan/oasys"),
        "strengths-and-needs" => Some("/access/strengths-and-needs/oasys"),
        _ => None,
    }
}

impl App {
    fn strategy(&self, strategy: Strategy) -> StrategyConfig {
        let c = self.config;
        match strategy {
            Strategy::HmppsAuth => StrategyConfig {
                authorize_url: format!("{}/oauth/authorize", c.hmpps_auth.external_url),
                token_url: format!("{}/oauth/token", c.hmpps_auth.api.url),
                client_id: c.hmpps_auth.auth_client_id.clone(),
                client_secret: c.hmpps_auth.auth_client_secret.clone(),
                callback_url: format!("{}/sign-in/hmpps-auth/callback", c.ingress_url),
                scope: None,
                state_key: "oauth2:hmpps-auth",
            },
            Strategy::Handover => StrategyConfig {
                authorize_url: format!("{}/oauth2/authorize", c.arns_handover.external_url),
                token_url: format!("{}/oauth2/token", c.arns_handover.api.url),
                client_id: c.arns_handover.client_id.clone(),
                client_secret: c.arns_handover.client_secret.clone(),
                callback_url: format!("{}/sign-in/handover/callback", c.ingress_url),
                scope: Some("profile"),
                state_key: "oauth2:handover",
            },
        }
    }

    /// The start of the flow: off to the authorisation server, with
    /// the state kept in the session.
    fn authorize(&self, req: &mut Req, strategy: Strategy) -> Response {
        let s = self.strategy(strategy);
        let state = new_session_id()[..24].to_string();
        req.session.set(s.state_key, Value::from_pairs([("state", Value::from(state.as_str()))]));
        let mut url = format!(
            "{}?response_type=code&redirect_uri={}",
            s.authorize_url,
            encode_uri_component(&s.callback_url)
        );
        if let Some(scope) = s.scope {
            url += &format!("&scope={scope}");
        }
        url += &format!("&state={state}&client_id={}", encode_uri_component(&s.client_id));
        redirect(&url)
    }

    /// The callback: checks the state, exchanges the code for a token and returns the user, or
    /// `None` when the authorisation server refused.
    async fn exchange(&self, req: &mut Req, strategy: Strategy) -> Result<Option<Value>, String> {
        let s = self.strategy(strategy);
        let query = req.query();
        if query.get("error").truthy() {
            return Ok(None);
        }
        let expected = req.session.get(s.state_key).get("state").to_js_string();
        crate::forms::dsl::remove_key(&mut req.session, s.state_key);
        let Some(code) = query.get("code").as_str().map(str::to_string) else {
            return Ok(None);
        };
        if query.get("state").to_js_string() != expected || expected.is_empty() {
            return Ok(None);
        }
        let form = [
            ("grant_type", "authorization_code"),
            ("redirect_uri", s.callback_url.as_str()),
            ("client_id", s.client_id.as_str()),
            ("client_secret", s.client_secret.as_str()),
            ("code", code.as_str()),
        ];
        let body = form.iter().map(|(k, v)| format!("{k}={}", encode_uri_component(v))).collect::<Vec<_>>().join("&");
        let response = self
            .http
            .post(&s.token_url)
            .header(http::header::AUTHORIZATION, basic_auth(&s.client_id, &s.client_secret))
            .header(http::header::CONTENT_TYPE, "application/x-www-form-urlencoded")
            .body(body)
            .send()
            .await
            .map_err(|e| format!("Failed to obtain access token: {e}"))?;
        let status = response.status();
        let params: Json = response.json().await.map_err(|e| format!("Failed to obtain access token: {e}"))?;
        if !status.is_success() {
            return Err(format!("Failed to obtain access token ({status}): {params}"));
        }
        let token = params.get("access_token").and_then(Json::as_str).unwrap_or_default().to_string();
        let (username, auth_source) = match strategy {
            Strategy::HmppsAuth => (params.get("user_name").cloned(), "HMPPS_AUTH"),
            Strategy::Handover => (jwt_claims(&token).get("user_name").cloned(), "OASYS"),
        };
        Ok(Some(Value::from_pairs([
            ("token", Value::from(token)),
            ("username", username.map_or(Value::Undefined, |u| Value::from_json(&u))),
            ("authSource", Value::from(auth_source)),
        ])))
    }

    fn auth_parameters(&self) -> String {
        format!("client_id={}&redirect_uri={}", self.config.hmpps_auth.auth_client_id, self.config.ingress_url)
    }

    pub async fn auth_route(&self, req: &mut Req, route: AuthRoute) -> Response {
        match route {
            AuthRoute::SignIn | AuthRoute::HmppsAuth => self.authorize(req, Strategy::HmppsAuth),
            AuthRoute::Handover => {
                if let Some(service) = req.query().get("service").as_str() {
                    req.session.set("targetService", Value::from(service));
                }
                self.authorize(req, Strategy::Handover)
            }
            AuthRoute::HmppsAuthCallback | AuthRoute::HandoverCallback => {
                let strategy = if route == AuthRoute::HandoverCallback { Strategy::Handover } else { Strategy::HmppsAuth };
                match self.exchange(req, strategy).await {
                    Err(e) => self.error_page(req, 500, &e),
                    Ok(None) => redirect("/autherror"),
                    Ok(Some(user)) => {
                        // signing in starts a new session; the CSRF token is kept, and the redirect
                        // target is read before the old session goes
                        let target = req.session.get("targetService").as_str().map(str::to_string);
                        let return_to = req.session.get("returnTo").as_str().map(str::to_string);
                        req.log_in(self, user, &["csrfToken"]).await;
                        let location = match strategy {
                            Strategy::Handover => target.as_deref().map_or(Some("/"), target_service_path).unwrap_or("/").to_string(),
                            Strategy::HmppsAuth => return_to.unwrap_or_else(|| "/".into()),
                        };
                        redirect(&location)
                    }
                }
            }
            AuthRoute::SignOut => {
                let url = format!("{}/sign-out?{}", self.config.hmpps_auth.external_url, self.auth_parameters());
                if req.is_authenticated() {
                    req.destroy_session(self).await;
                }
                redirect(&url)
            }
            AuthRoute::AccountDetails => {
                redirect(&format!("{}/account-details?{}", self.config.hmpps_auth.external_url, self.auth_parameters()))
            }
            AuthRoute::AuthError => match self.engine.render("autherror.njk", &req.state) {
                Ok(html) => respond(StatusCode::UNAUTHORIZED, "text/html; charset=utf-8", html),
                Err(e) => self.error_page(req, 500, &e.to_string()),
            },
        }
    }
}
