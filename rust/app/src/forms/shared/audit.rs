//! Audit events raised from forms.

use forge_core::EffectContext;
use serde_json::{Value as Json, json};

use crate::services::{AuditMessage, AuditService};

/// Audit events raised by more than one assessment type.
pub mod common_audit_event {
    pub const CONFIRM_PRIVACY_SCREEN: &str = "CONFIRM_PRIVACY_SCREEN";
}

/// `sendFormAuditEvent`: who (the user), which case (the CRN), the request id as the
/// correlation id, and the form, assessment and form version in the details.
pub async fn send_form_audit_event(audit: &AuditService, ctx: &EffectContext, form: &str, action: &str, details: Option<Json>) {
    let user_id = ctx.get_state("user").get("id");
    let request_id = ctx.get_state("requestId");
    let crn = ctx.get_session().get("caseDetails").get("crn");
    let crn = crn.as_str().map(str::to_string);
    let mut all_details = json!({
        "form": form,
        "assessmentUuid": ctx.get_data("assessmentUuid").to_json(),
        "formVersion": ctx.get_data("formVersion").to_json(),
    });
    // `undefined` values are dropped by JSON.stringify
    if let Some(o) = all_details.as_object_mut() {
        o.retain(|_, v| !v.is_null());
        if let Some(Json::Object(extra)) = details {
            for (k, v) in extra {
                o.insert(k, v);
            }
        }
    }
    audit
        .send(AuditMessage {
            action: action.to_string(),
            who: user_id.as_str().map_or_else(|| "unknown".to_string(), str::to_string),
            subject_type: crn.as_ref().map(|_| "CRN".to_string()),
            subject_id: crn,
            correlation_id: Some(request_id.as_str().map_or_else(|| "unknown".to_string(), str::to_string)),
            details: Some(all_details),
        })
        .await;
}
