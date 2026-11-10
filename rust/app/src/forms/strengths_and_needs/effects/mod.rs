//! SAN's effects. Session changes go through `update_session`; API payloads are built as JSON.

pub mod answer_delta;
pub mod assessment;
pub mod session;
pub mod versions;

use std::sync::Arc;

use forge_core::{EffectContext, ForgeResult, FunctionEntry, Value};
use serde_json::{Value as Json, json};

use crate::data::{AssessmentPlatformApiClient, CoordinatorApiClient};
use crate::forms::shared::audit::send_form_audit_event;
use crate::services::AuditService;

use super::audit_events::SAN_AUDIT_FORM;

/// `StrengthsAndNeedsEffectsDeps`.
pub struct StrengthsAndNeedsEffectsDeps {
    pub api: Arc<AssessmentPlatformApiClient>,
    pub audit_service: Arc<AuditService>,
    pub coordinator_api: Arc<CoordinatorApiClient>,
}

/// SAN's own session state (`session.san`), as currently stored.
pub fn san_session(ctx: &EffectContext) -> Value {
    match ctx.get_session().get("san") {
        v @ Value::Object(_) => v,
        _ => Value::empty_object(),
    }
}

/// Updates `session.san`, creating it on first use.
pub fn update_san_session(ctx: &EffectContext, f: impl FnOnce(&mut Value)) {
    ctx.update_session(|s| {
        let mut san = match s.get("san") {
            v @ Value::Object(_) => v,
            _ => Value::empty_object(),
        };
        f(&mut san);
        s.set("san", san);
    });
}

/// The user, as API commands and queries carry it (`context.getState('user')`).
pub fn user_json(ctx: &EffectContext) -> Json {
    ctx.get_state("user").to_json()
}

/// `queueCommand`: holds a command until `commitPendingCommands`, so a submission makes one
/// API round trip.
pub fn queue_command(ctx: &EffectContext, command: Json, map_to_oasys: bool, audit: Option<(String, Json)>) -> ForgeResult<()> {
    let mut pending = ctx.get_data("pendingCommands").as_array().map(|a| a.to_vec()).unwrap_or_default();
    let mut entry = json!({ "command": command, "mapToOasys": map_to_oasys });
    if let Some((action, details)) = audit {
        entry["audit"] = json!({ "action": action, "details": details });
    }
    pending.push(Value::from_json(&entry));
    ctx.set_data("pendingCommands", Value::array(pending))
}

/// `sendAuditEvent` for SAN.
pub async fn send_audit_event(deps: &StrengthsAndNeedsEffectsDeps, ctx: &EffectContext, action: &str, details: Option<Json>) {
    send_form_audit_event(&deps.audit_service, ctx, SAN_AUDIT_FORM, action, details).await;
}

pub fn entries(deps: &Arc<StrengthsAndNeedsEffectsDeps>) -> Vec<FunctionEntry> {
    let mut entries = session::entries(deps);
    entries.extend(assessment::entries(deps));
    entries.extend(versions::entries(deps));
    entries
}
