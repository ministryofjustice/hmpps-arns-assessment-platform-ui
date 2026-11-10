//! Session set-up, notifications, audit, feature flags,
//! telemetry and navigation tracking.

use std::sync::Arc;

use forge_core::{FunctionEntry, Value, obj};
use serde_json::json;

use super::{SentencePlanEffectsDeps, track_business_event, user_context};
use crate::forms::dsl::http_error::internal;
use crate::forms::dsl::{arg, nullish_or};
use crate::forms::shared::audit::send_form_audit_event;
use crate::forms::shared::navigation::{NavigationConfig, insert_navigation_referrer, track_navigation};
use crate::register_effect;
use crate::services::feature_flags::BOOLEAN_FEATURE_FLAGS;

const NAVIGATION: NavigationConfig =
    NavigationConfig { stack_key: "sentence-plan", clear_key: Some(super::super::navigation::PLAN_OVERVIEW), referrer_key: "navigationReferrer" };

pub fn entries(deps: &Arc<SentencePlanEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // Turns the access form's session data into the plan's session details, choosing how the
        // plan is identified: by UUID from an OASys handover, otherwise by CRN.
        register_effect!("initializeSessionFromAccess", |ctx, args| {
            let session = ctx.get_session();
            let access = session.get("accessDetails");
            if !access.truthy() {
                return Err(internal("Access details not found - ensure access ran first"));
            }
            let case = session.get("caseDetails");
            if !case.truthy() {
                return Err(internal("Case details not found - ensure access ran first"));
            }
            let sp_context = session.get("handoverContext").get("sentencePlanContext");
            let plan_id = sp_context.get("planId");
            let identifier = if access.get("accessType").as_str() == Some("OASYS") && plan_id.truthy() {
                obj! { "type": "UUID", "uuid": plan_id }
            } else if case.get("crn").truthy() {
                obj! { "type": "EXTERNAL", "identifier": case.get("crn"), "identifierType": "CRN", "assessmentType": "SENTENCE_PLAN" }
            } else {
                return Err(internal("Cannot determine plan identifier - no planId or CRN available"));
            };
            let details = obj! {
                "accessType": access.get("accessType"),
                "planAccessMode": access.get("planAccessMode"),
                "oasysRedirectUrl": access.get("oasysRedirectUrl"),
                "planIdentifier": identifier,
                "planVersion": sp_context.get("planVersion"),
            };
            ctx.update_session(|s| s.set("sessionDetails", details.clone()));
            ctx.set_data("sessionDetails", details)?;
            if session.get("principal").get("identifier").truthy() {
                track_business_event(&ctx, "SENTENCE_PLAN_ACCESSED", json!({}));
            }
            Ok(())
        }),
        register_effect!("loadSessionData", |ctx, args| {
            let session = ctx.get_session();
            ctx.set_data("privacyAccepted", nullish_or(session.get("privacyAccepted"), || Value::Bool(false)))?;
            for (key, data_key) in [("caseDetails", "caseData"), ("sessionDetails", "sessionDetails"), ("accessDetails", "accessDetails")] {
                let v = session.get(key);
                if v.truthy() {
                    ctx.set_data(data_key, v)?;
                }
            }
            let pk = session.get("handoverContext").get("sentencePlanContext").get("oasysAssessmentPk");
            if pk.truthy() {
                ctx.set_data("oasysAssessmentPk", pk)?;
            }
            Ok(())
        }),
        // The sentences for the About page, from Delius unless the CRN access route loaded them.
        register_effect!("loadSentenceInformation", deps, |ctx, args| {
            let case = ctx.get_session().get("caseDetails");
            let assessment_uuid = ctx.get_data("assessmentUuid").to_json();
            let crn = case.get("crn");
            if !crn.truthy() {
                crate::error!({ "assessmentUuid": assessment_uuid }, "Cannot load sentence information: missing CRN in session");
                return Ok(());
            }
            let crn = crn.to_js_string();
            if case.get("sentences").as_array().is_some_and(|a| !a.is_empty()) {
                crate::debug!({ "assessmentUuid": assessment_uuid, "crn": crn }, "Sentence information already loaded, skipping Delius API call");
                return Ok(());
            }
            match deps.delius_api.get_case_details(&crn).await {
                Ok(details) => {
                    let mut case = case;
                    case.set("sentences", Value::from_json(details.get("sentences").unwrap_or(&serde_json::Value::Null)));
                    ctx.update_session(|s| s.set("caseDetails", case.clone()));
                    ctx.set_data("caseData", case)?;
                }
                Err(e) => crate::error!(
                    { "err": e.to_string(), "assessmentUuid": assessment_uuid, "crn": crn },
                    "Failed to load sentence information from Delius"
                ),
            }
            Ok(())
        }),
        register_effect!("setPrivacyAccepted", |ctx, args| {
            ctx.update_session(|s| s.set("privacyAccepted", Value::Bool(true)));
            Ok(())
        }),
        // Queues a flash notification for a page; without a title, the message is the title.
        register_effect!("addNotification", |ctx, args| {
            let notification = arg(&args, 0);
            if notification.get("onlyWhen").strict_eq(&Value::Bool(false)) {
                return Ok(());
            }
            let normalised = if notification.get("title").truthy() {
                notification
            } else {
                let mut n = notification.clone();
                n.set("title", notification.get("message"));
                n.set("message", Value::Undefined);
                n
            };
            ctx.update_session(|s| {
                let mut list = if normalised.get("clearOtherNotifications").truthy() {
                    vec![]
                } else {
                    s.get("notifications").as_array().map(|a| a.to_vec()).unwrap_or_default()
                };
                list.push(normalised.clone());
                s.set("notifications", Value::array(list));
            });
            Ok(())
        }),
        // Takes the notifications for `target` out of the session, for this page to show.
        register_effect!("loadNotifications", |ctx, args| {
            let target = arg(&args, 0);
            let all = ctx.get_session().get("notifications").as_array().map(|a| a.to_vec()).unwrap_or_default();
            let (matching, rest): (Vec<Value>, Vec<Value>) = all.into_iter().partition(|n| n.get("target").strict_eq(&target));
            ctx.update_session(|s| s.set("notifications", Value::array(rest)));
            ctx.set_data("notifications", Value::array(matching))
        }),
        register_effect!("trackNavigation", |ctx, args| { track_navigation(&ctx, &arg(&args, 0), &NAVIGATION) }),
        register_effect!("insertNavigationReferrer", |ctx, args| {
            insert_navigation_referrer(&ctx, &arg(&args, 0).to_js_string(), &NAVIGATION);
            Ok(())
        }),
        register_effect!("sendAuditEvent", deps, |ctx, args| {
            let mut details = serde_json::Map::new();
            let goal = ctx.get_data("activeGoalUuid");
            if goal.truthy() {
                details.insert("goalUuid".into(), goal.to_json());
            }
            if let serde_json::Value::Object(extra) = arg(&args, 1).to_json() {
                details.extend(extra);
            }
            let action = arg(&args, 0).to_js_string();
            send_form_audit_event(&deps.audit_service, &ctx, "sentence-plan", &action, Some(serde_json::Value::Object(details))).await;
            Ok(())
        }),
        register_effect!("sendTelemetryEvent", |ctx, args| {
            crate::info!(
                {
                    "event": arg(&args, 0).to_json(),
                    "assessmentUuid": ctx.get_data("assessmentUuid").to_json(),
                    "requestId": ctx.get_state("requestId").to_json(),
                    "authSource": ctx.get_state("user").get("authSource").to_json(),
                    "userContext": user_context(&ctx),
                },
                "Telemetry event"
            );
            Ok(())
        }),
        register_effect!("loadFeatureFlags", deps, |ctx, args| {
            let user_id = ctx.get_state("user").get("id");
            let flags = deps.feature_flag_service.evaluate_boolean_flags(BOOLEAN_FEATURE_FLAGS, user_id.as_str()).await;
            ctx.set_data("featureFlags", Value::from_json(&flags))
        }),
    ]
}
