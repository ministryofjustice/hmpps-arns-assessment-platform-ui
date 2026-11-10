//! Session set-up and audit effects.

use std::sync::{Arc, LazyLock};

use forge_core::{FunctionEntry, Value};
use regex::Regex;

use super::{StrengthsAndNeedsEffectsDeps, san_session, send_audit_event, update_san_session};
use crate::forms::dsl::arg;
use crate::forms::dsl::http_error::{bad_request, internal, not_found};
use crate::forms::strengths_and_needs::v1::constants::path::CURRENT_VERSION;
use crate::forms::strengths_and_needs::v1::constants::section::{ALL, section_complete};
use crate::register_effect;

const SAN_ASSESSMENT_TYPE: &str = "SAN_SP";

/// 8-4-4-4-12 hexadecimal digits.
static UUID_REGEX: LazyLock<Regex> =
    LazyLock::new(|| Regex::new(r"(?i)^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$").unwrap());

pub fn entries(deps: &Arc<StrengthsAndNeedsEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // The assessment identifier for this access (the handover's assessment, or the CRN),
        // section statuses defaulted, and SAN's session details. A version requested by the
        // handover is always shown read-only.
        register_effect!("initializeSessionFromAccess", |ctx, args| {
            let session = ctx.get_session();
            let access_details = session.get("accessDetails");
            if !access_details.truthy() {
                return Err(internal("Access details not found - ensure access ran first"));
            }
            let case_details = session.get("caseDetails");
            if !case_details.truthy() {
                return Err(internal("Case details not found - ensure access ran first"));
            }
            let handover = session.get("handoverContext");
            let assessment_id = handover.get("assessmentContext").get("assessmentId");
            let identifier = if access_details.get("accessType").as_str() == Some("OASYS") && assessment_id.truthy() {
                forge_core::obj! { "type": "UUID", "uuid": assessment_id }
            } else if case_details.get("crn").truthy() {
                forge_core::obj! {
                    "type": "EXTERNAL",
                    "identifier": case_details.get("crn"),
                    "identifierType": "CRN",
                    "assessmentType": SAN_ASSESSMENT_TYPE,
                }
            } else {
                return Err(internal("Cannot determine assessment identifier - no assessmentId or CRN available"));
            };
            for section in ALL {
                let status = match ctx.get_data(section.status_key) {
                    Value::Undefined | Value::Null => Value::from(section_complete::NO),
                    s => s,
                };
                if status.as_str() == Some(section_complete::NO) {
                    ctx.set_data(section.status_key, status)?;
                }
            }
            // The `createdAt` (UTC epoch millis) of the version OASys asked for.
            let assessment_version = handover.get("assessmentContext").get("assessmentVersion");
            let access_mode = if assessment_version.truthy() { Value::from("READ_ONLY") } else { access_details.get("accessMode") };
            if !access_mode.strict_eq(&access_details.get("accessMode")) {
                crate::warn!(
                    "Handover requested assessment version {} with {} access, using READ_ONLY",
                    assessment_version.to_js_string(),
                    access_details.get("accessMode").to_js_string()
                );
            }
            ctx.set_data("assessmentVersion", assessment_version.clone())?;
            let details = forge_core::obj! {
                "accessType": access_details.get("accessType"),
                "accessMode": access_mode,
                "planAccessMode": access_details.get("planAccessMode"),
                "oasysRedirectUrl": access_details.get("oasysRedirectUrl"),
                "assessmentIdentifier": identifier,
                "assessmentVersion": assessment_version,
            };
            update_san_session(&ctx, |san| san.set("sessionDetails", crate::forms::dsl::defined(details)));
            Ok(())
        }),
        // Exposes session values to `Data()` references.
        register_effect!("loadSessionData", |ctx, args| {
            let session = ctx.get_session();
            let privacy = match session.get("privacyAccepted") {
                Value::Undefined | Value::Null => Value::Bool(false),
                v => v,
            };
            ctx.set_data("privacyAccepted", privacy)?;
            if session.get("caseDetails").truthy() {
                ctx.set_data("caseData", session.get("caseDetails"))?;
            }
            let details = san_session(&ctx).get("sessionDetails");
            if details.truthy() {
                ctx.set_data("sessionDetails", details)?;
            }
            if session.get("accessDetails").truthy() {
                ctx.set_data("accessDetails", session.get("accessDetails"))?;
            }
            Ok(())
        }),
        register_effect!("setPrivacyAccepted", |ctx, args| {
            ctx.update_session(|s| s.set("privacyAccepted", Value::Bool(true)));
            Ok(())
        }),
        // The page the user came from when it is within the assessment, the fallback otherwise.
        register_effect!("setDynamicBacklink", |ctx, args| {
            let base_path = arg(&args, 0).to_js_string();
            let previous_page = ctx.get_state("previousPageUrl");
            let fallback = match ctx.get_data("dynamicBacklinkFallback") {
                v if v.truthy() => v.to_js_string(),
                _ => base_path.clone(),
            };
            let link = match previous_page.as_str() {
                Some(p) if p.starts_with(&base_path) => p.to_string(),
                _ => fallback,
            };
            ctx.set_data("dynamicBacklink", Value::from(link))
        }),
        // `/strengths-and-needs/v1.0/{mode}/{assessmentUuid}/{versionUuid}`: mode `edit`, `view`
        // or `view-historic`; a UUID; a UUID or `current`.
        register_effect!("validateModeAndVersionUuidFromUrl", |ctx, args| {
            let mode = ctx.get_request_param("mode");
            let Some(mode) = mode.as_str().filter(|m| !m.is_empty()).map(str::to_string) else { return Ok(()) };
            if !matches!(mode.as_str(), "edit" | "view" | "view-historic") {
                return Err(bad_request(format!("Invalid mode parameter: {mode}. Must be 'edit', 'view' or 'view-historic'")));
            }
            let assessment_uuid = ctx.get_request_param("assessmentUuid");
            if !UUID_REGEX.is_match(assessment_uuid.as_str().unwrap_or_default()) {
                return Err(not_found(format!("Invalid assessment UUID: {}", assessment_uuid.to_js_string())));
            }
            let version_uuid = ctx.get_request_param("versionUuid");
            let version = version_uuid.as_str().unwrap_or_default();
            if version != CURRENT_VERSION && !UUID_REGEX.is_match(version) {
                return Err(not_found(format!(
                    "Invalid version UUID: {}. Must be a UUID or '{CURRENT_VERSION}'",
                    version_uuid.to_js_string()
                )));
            }
            Ok(())
        }),
        register_effect!("sendAuditEvent", deps, |ctx, args| {
            let details = match arg(&args, 1) {
                Value::Undefined => None,
                d => Some(d.to_json()),
            };
            send_audit_event(&deps, &ctx, &arg(&args, 0).to_js_string(), details).await;
            Ok(())
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::UUID_REGEX;

    #[test]
    fn uuids() {
        assert!(UUID_REGEX.is_match("e8f1a0a4-0000-4000-8000-000000000001"));
        assert!(!UUID_REGEX.is_match("current"));
        assert!(!UUID_REGEX.is_match("accommodation"));
    }
}
