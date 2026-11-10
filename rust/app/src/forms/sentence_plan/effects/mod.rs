//! The sentence plan's effects (`effects/`): session set-up from the access form, loading and
//! deriving the plan, goals and steps (create, change, achieve, remove, re-add, reorder), plan
//! agreement, history and versions, assessment info, supervision package and domain events.

pub mod assessment;
pub mod dates;
pub mod goals;
pub mod plan;
pub mod session;
pub mod steps;
pub mod supervision;

use std::sync::Arc;

use forge_core::{EffectContext, ForgeError, FunctionEntry, Value};
use serde_json::{Value as Json, json};

use crate::data::{
    AapError, ArnsApiClient, AssessmentPlatformApiClient, CoordinatorApiClient, DeliusApiClient, MpopComponentsClient,
};
use crate::forms::dsl::http_error::internal;
use crate::services::{AuditService, DomainEventsService, FeatureFlagService};

/// `SentencePlanEffectsDeps`.
pub struct SentencePlanEffectsDeps {
    pub api: Arc<AssessmentPlatformApiClient>,
    pub coordinator_api: Arc<CoordinatorApiClient>,
    pub arns_api: Arc<ArnsApiClient>,
    pub delius_api: Arc<DeliusApiClient>,
    pub mpop_components: Arc<MpopComponentsClient>,
    pub audit_service: Arc<AuditService>,
    pub feature_flag_service: Arc<FeatureFlagService>,
    pub domain_events_service: Arc<DomainEventsService>,
}

/// `getRequiredEffectContext`: the user (as commands carry it) and the plan's assessment UUID.
pub fn required_context(ctx: &EffectContext, effect: &str) -> Result<(Json, String), ForgeError> {
    let user = ctx.get_state("user");
    if !user.truthy() {
        return Err(internal(format!("User is required for {effect}")));
    }
    let uuid = ctx.get_data("assessmentUuid");
    if !uuid.truthy() {
        return Err(internal(format!("Assessment UUID is required for {effect}")));
    }
    Ok((user.to_json(), uuid.to_js_string()))
}

/// `getPractitionerName`: the handover practitioner's name, or the signed-in user's.
pub fn practitioner_name(ctx: &EffectContext, user: &Json) -> String {
    let display = ctx.get_session().get("practitionerDetails").get("displayName");
    if display.truthy() {
        return display.to_js_string();
    }
    user.get("name").and_then(Json::as_str).unwrap_or_default().to_string()
}

/// `getUserContext`: the user's role (HMPPS Auth) or the handover location (OASys).
pub fn user_context(ctx: &EffectContext) -> String {
    let user = ctx.get_state("user");
    if user.get("authSource").as_str() == Some("HMPPS_AUTH") {
        return user.get("userRoles").get("0").as_str().unwrap_or("UNKNOWN").to_string();
    }
    ctx.get_session().get("handoverContext").get("subject").get("location").as_str().unwrap_or("UNKNOWN").to_string()
}

/// `trackBusinessEvent`: business events (for usage analytics) are written to the log.
pub fn track_business_event(ctx: &EffectContext, name: &str, properties: Json) {
    let mut event = serde_json::Map::new();
    let user_id = ctx.get_session().get("principal").get("identifier");
    if user_id.truthy() {
        event.insert("authenticatedUserId".into(), user_id.to_json());
    }
    let request_id = ctx.get_state("requestId");
    if request_id.truthy() {
        event.insert("requestId".into(), request_id.to_json());
    }
    event.insert("authSource".into(), ctx.get_state("user").get("authSource").to_json());
    event.insert("userContext".into(), json!(user_context(ctx)));
    if let Json::Object(extra) = properties {
        event.extend(extra);
    }
    crate::info!({ "event": name, "properties": Json::Object(event) }, "Business event");
}

/// API errors as request errors; a missing assessment (no query result or a 404) as
/// `not_found_message`.
pub fn api_error(not_found_message: &'static str) -> impl Fn(AapError) -> ForgeError {
    move |e| if e.is_missing_assessment() { ForgeError::http(404, not_found_message) } else { e.into() }
}

/// The session-scoped data `getData` returns, as a list.
pub fn data_list(ctx: &EffectContext, key: &str) -> Vec<Value> {
    ctx.get_data(key).as_array().map(|a| a.to_vec()).unwrap_or_default()
}

pub fn entries(deps: &Arc<SentencePlanEffectsDeps>) -> Vec<FunctionEntry> {
    let mut entries = session::entries(deps);
    entries.extend(plan::entries(deps));
    entries.extend(goals::entries(deps));
    entries.extend(steps::entries(deps));
    entries.extend(assessment::entries(deps));
    entries.extend(supervision::entries(deps));
    entries
}
