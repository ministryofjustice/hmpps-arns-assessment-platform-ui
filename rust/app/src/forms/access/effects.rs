//! Access effects: they populate the session the target forms read
//! (`handoverContext`, `caseDetails`, `practitionerDetails`, `accessDetails`, `targetService`).

use std::sync::Arc;

use forge_core::{FunctionEntry, Value};

use crate::data::{DeliusApiClient, HandoverApiClient};
use crate::forms::dsl::http_error::{bad_request, internal};
use crate::forms::dsl::remove_key;
use crate::forms::shared::gender::gender_from_handover_code;
use crate::register_effect;

use super::registry::get_target_service;

/// `AccessEffectsDeps`.
pub struct AccessEffectsDeps {
    pub delius_api: Arc<DeliusApiClient>,
    pub handover_api: Arc<HandoverApiClient>,
}

fn handover_context_required() -> forge_core::ForgeError {
    internal("Handover context is required - ensure loadHandoverContext runs first")
}

pub fn access_effects(deps: &Arc<AccessEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // Clears all access-related session data, so switching between access routes (e.g.
        // OASys to HMPPS Auth) never carries stale data over. SAN's own session state is cleared
        // too, so every access starts SAN afresh.
        register_effect!("clearAccessSession", |ctx, args| {
            ctx.update_session(|s| {
                for key in ["handoverContext", "caseDetails", "practitionerDetails", "accessDetails", "san"] {
                    remove_key(s, key);
                }
            });
            Ok(())
        }),
        // Validates the `:service` route parameter against the registry, stores it in the
        // session and exposes the service's entry path as `redirectPath`.
        register_effect!("setTargetServiceAndRedirect", |ctx, args| {
            let service = ctx.get_request_param("service");
            let Some(service) = service.as_str().filter(|s| !s.is_empty()).map(str::to_string) else {
                return Err(bad_request("Service parameter is required"));
            };
            let Some(target) = get_target_service(&service) else {
                return Err(bad_request(format!("Unknown target service: {service}")));
            };
            ctx.update_session(|s| s.set("targetService", Value::from(service.as_str())));
            ctx.set_data("redirectPath", Value::from(target.entry_path))
        }),
        // CRN users (e.g. MPoP) always have READ_WRITE access and use HMPPS Auth.
        register_effect!("setAccessDetailsForCrn", |ctx, args| {
            ctx.update_session(|s| {
                s.set(
                    "accessDetails",
                    Value::from_pairs([
                        ("accessType", Value::from("HMPPS_AUTH")),
                        ("accessMode", Value::from("READ_WRITE")),
                        ("planAccessMode", Value::from("READ_WRITE")),
                    ]),
                )
            });
            Ok(())
        }),
        register_effect!("setCaseDetailsFromCrn", deps, |ctx, args| {
            let crn = ctx.get_request_param("crn");
            let Some(crn) = crn.as_str().filter(|s| !s.is_empty()).map(str::to_string) else {
                return Err(bad_request("CRN is required"));
            };
            let case_details = deps.delius_api.get_case_details(&crn).await?;
            ctx.update_session(|s| s.set("caseDetails", Value::from_json(&case_details)));
            Ok(())
        }),
        register_effect!("setPractitionerDetailsFromAuth", |ctx, args| {
            let user = ctx.get_state("user");
            if !user.truthy() {
                return Err(internal("User is required - ensure user is authenticated"));
            }
            ctx.update_session(|s| {
                s.set(
                    "practitionerDetails",
                    Value::from_pairs([
                        ("identifier", user.get("id")),
                        ("displayName", user.get("name")),
                        ("authSource", Value::from("HMPPS_AUTH")),
                    ]),
                )
            });
            Ok(())
        }),
        // Loads the handover context unless the session already holds it.
        register_effect!("loadHandoverContext", deps, |ctx, args| {
            if ctx.get_session().get("handoverContext").truthy() {
                return Ok(());
            }
            let token = ctx.get_state("user").get("token").to_js_string();
            let context = deps.handover_api.get_current_context(&token).await?;
            ctx.update_session(|s| s.set("handoverContext", Value::from_json(&context)));
            Ok(())
        }),
        register_effect!("setAccessDetailsFromHandoverContext", |ctx, args| {
            let handover = ctx.get_session().get("handoverContext");
            if !handover.truthy() {
                return Err(handover_context_required());
            }
            let principal = handover.get("principal");
            ctx.update_session(|s| {
                s.set(
                    "accessDetails",
                    Value::from_pairs([
                        ("accessType", Value::from("OASYS")),
                        ("accessMode", principal.get("accessMode")),
                        ("planAccessMode", principal.get("planAccessMode")),
                        ("oasysRedirectUrl", principal.get("returnUrl")),
                    ]),
                )
            });
            Ok(())
        }),
        register_effect!("setCaseDetailsFromHandoverContext", |ctx, args| {
            let handover = ctx.get_session().get("handoverContext");
            if !handover.truthy() {
                return Err(handover_context_required());
            }
            let subject = handover.get("subject");
            ctx.update_session(|s| {
                s.set(
                    "caseDetails",
                    Value::from_pairs([
                        (
                            "name",
                            Value::from_pairs([
                                ("forename", subject.get("givenName")),
                                ("middleName", Value::from("")),
                                ("surname", subject.get("familyName")),
                            ]),
                        ),
                        ("crn", subject.get("crn")),
                        ("pnc", subject.get("pnc")),
                        ("gender", Value::from(gender_from_handover_code(&subject.get("gender")))),
                        ("dateOfBirth", subject.get("dateOfBirth")),
                        ("nomisId", subject.get("nomisId")),
                        ("location", subject.get("location")),
                        ("sexuallyMotivatedOffenceHistory", subject.get("sexuallyMotivatedOffenceHistory")),
                        ("tier", Value::from("")),
                        ("region", Value::from("")),
                        ("sentences", Value::array(vec![])),
                    ]),
                )
            });
            Ok(())
        }),
        register_effect!("setPractitionerDetailsFromHandoverContext", |ctx, args| {
            let handover = ctx.get_session().get("handoverContext");
            if !handover.truthy() {
                return Err(handover_context_required());
            }
            let principal = handover.get("principal");
            ctx.update_session(|s| {
                s.set(
                    "practitionerDetails",
                    Value::from_pairs([
                        ("identifier", principal.get("identifier")),
                        ("displayName", principal.get("displayName")),
                        ("authSource", Value::from("OASYS")),
                    ]),
                )
            });
            Ok(())
        }),
    ]
}
