//! The data deletion tool's effects (`effects/`): the tool's state lives in the session
//! (`answers`, `currentData`, `deletionRequest`, `deletionResponse`), and the AAP API is called
//! with credentials entered on the configuration step, against the chosen environment.

use std::sync::Arc;

use forge_core::{EffectContext, ForgeError, FunctionEntry};
use serde_json::Value as Json;

use crate::config::{DATA_DELETION_ENVIRONMENTS, config};
use crate::data::{AssessmentPlatformApiClient, AuthenticationClient};
use crate::forms::dsl::http_error::{internal, not_found};
use crate::forms::dsl::*;
use crate::register_effect;

/// `DataDeletionToolEffectsDeps`. The tool builds its own API clients per request (the
/// environment and credentials come from the form), so it needs nothing from the app.
pub struct DataDeletionToolEffectsDeps;

/// `createApiClient`: an AAP API client for the environment and credentials in the session.
fn create_api_client(ctx: &EffectContext) -> Result<AssessmentPlatformApiClient, ForgeError> {
    let answers = ctx.get_session().get("answers");
    let environment = answers.get("environment").to_js_string();
    let Some((_, env)) = DATA_DELETION_ENVIRONMENTS.iter().find(|(key, _)| !environment.is_empty() && *key == environment) else {
        return Err(internal("A valid environment is required"));
    };
    let c = config();
    let auth = AuthenticationClient::with_credentials(
        env.auth_url,
        &answers.get("clientId").to_js_string(),
        &answers.get("clientSecret").to_js_string(),
        c.hmpps_auth.api.timeout_ms,
    );
    Ok(AssessmentPlatformApiClient::for_environment(c, Arc::new(auth), env.api_url))
}

fn assessment_uuid(ctx: &EffectContext) -> Result<String, ForgeError> {
    match ctx.get_session().get("answers").get("assessmentUuid") {
        v if v.truthy() => Ok(v.to_js_string()),
        _ => Err(internal("Assessment identifier is required")),
    }
}

fn set_session(ctx: &EffectContext, key: &str, value: Value) {
    ctx.update_session(|s| s.set(key, value));
}

/// `JSON.parse` of an answer, as the effect reads it (a parse failure fails the request).
fn parse_json(v: &Value) -> Result<Value, ForgeError> {
    serde_json::from_str::<Json>(&v.to_js_string())
        .map(|j| Value::from_json(&j))
        .map_err(|e| ForgeError::http(500, format!("Unexpected JSON: {e}")))
}

/// The selected operation (`value[0]`), when the item's checkbox answer has one.
fn selected_operation(value: &Value) -> Option<String> {
    let first = value.as_array().filter(|a| !a.is_empty()).map(|a| a[0].clone())?;
    Some(first.to_js_string())
}

fn find_by_uuid(list: &Value, uuid: &str) -> Value {
    list.as_array().and_then(|a| a.iter().find(|it| it.get("uuid").as_str() == Some(uuid)).cloned()).unwrap_or(Value::Undefined)
}

/// `createDeletionRequest`: the deletion request from the event and timeline actions answered.
fn create_deletion_request(ctx: &EffectContext) -> Result<(), ForgeError> {
    let answers = ctx.get_all_answers();
    let current = ctx.get_session().get("currentData");
    let mut events = vec![];
    let mut timeline = vec![];
    for (key, value) in answers.iter() {
        let Some(operation) = selected_operation(value) else { continue };
        if let Some(uuid) = key.strip_prefix("event-action-") {
            let event = if operation == "UPDATE" {
                parse_json(&answers.get(format!("event-data-{uuid}").as_str()).cloned().unwrap_or_default())?
            } else {
                find_by_uuid(&current.get("events"), uuid).get("data")
            };
            events.push(obj! { "uuid": uuid, "operation": operation.as_str(), "event": event });
        } else if let Some(uuid) = key.strip_prefix("timeline-action-") {
            let item = find_by_uuid(&current.get("timeline"), uuid);
            let answer = |name: &str| answers.get(format!("timeline-{name}-{uuid}").as_str()).cloned().unwrap_or_default();
            let update = operation == "UPDATE";
            let event = if update { nullish_or(answer("event"), || item.get("event")) } else { item.get("event") };
            let data = if update && answer("data").truthy() { parse_json(&answer("data"))? } else { item.get("data") };
            let custom_type =
                if update { nullish_or(answer("custom-type"), || item.get("customType")) } else { item.get("customType") };
            let custom_data =
                if update && answer("custom-data").truthy() { parse_json(&answer("custom-data"))? } else { item.get("customData") };
            timeline.push(obj! {
                "uuid": uuid,
                "operation": operation.as_str(),
                "timeline": obj! {
                    "uuid": uuid,
                    "assessment": item.get("assessment"),
                    "position": item.get("position"),
                    "event": event,
                    "timestamp": item.get("timestamp"),
                    "data": data,
                    "customType": custom_type,
                    "customData": custom_data,
                    "user": item.get("user"),
                },
            });
        }
    }
    set_session(ctx, "deletionRequest", obj! { "dryRun": true, "events": events, "timeline": timeline });
    Ok(())
}

fn request_with_dry_run(ctx: &EffectContext, dry_run: bool) -> Json {
    let mut request = ctx.get_session().get("deletionRequest");
    request.set("dryRun", Value::Bool(dry_run));
    set_session(ctx, "deletionRequest", request.clone());
    request.to_json()
}

pub fn entries(deps: &Arc<DataDeletionToolEffectsDeps>) -> Vec<FunctionEntry> {
    let _ = deps;
    vec![
        // Keeps the configuration answers; drops the loaded data, request and response.
        register_effect!("clearSession", |ctx, args| {
            ctx.update_session(|s| {
                let answers = s.get("answers");
                s.set(
                    "answers",
                    obj! {
                        "environment": answers.get("environment"),
                        "clientId": answers.get("clientId"),
                        "clientSecret": answers.get("clientSecret"),
                        "assessmentUuid": answers.get("assessmentUuid"),
                    },
                );
                for key in ["currentData", "deletionRequest", "deletionResponse"] {
                    s.set(key, Value::Null);
                }
            });
            Ok(())
        }),
        register_effect!("loadAnswers", |ctx, args| {
            if let Some(answers) = ctx.get_session().get("answers").as_object() {
                for (key, value) in answers.iter() {
                    ctx.set_answer(key, value.clone())?;
                }
            }
            Ok(())
        }),
        register_effect!("saveAnswers", |ctx, args| {
            let saved = ctx.get_session().get("answers");
            let mut merged = spread([saved, Value::object(ctx.get_all_answers())]);
            if merged.as_object().is_none() {
                merged = Value::empty_object();
            }
            set_session(&ctx, "answers", merged);
            Ok(())
        }),
        register_effect!("createDeletionRequest", |ctx, args| { create_deletion_request(&ctx) }),
        register_effect!("clearDeletionResponse", |ctx, args| {
            set_session(&ctx, "deletionResponse", Value::Null);
            Ok(())
        }),
        register_effect!("loadAssessmentData", |ctx, args| {
            let uuid = assessment_uuid(&ctx)?;
            let api = create_api_client(&ctx)?;
            let data = api.get_data_deletion_data(&uuid).await.map_err(ForgeError::from)?;
            if data.is_null() {
                return Err(not_found("Data deletion data not found"));
            }
            set_session(&ctx, "currentData", Value::from_json(&data));
            Ok(())
        }),
        // A failed dry run is recorded as the response, so the page can show the cause.
        register_effect!("deletionDryRun", |ctx, args| {
            let uuid = assessment_uuid(&ctx)?;
            let api = create_api_client(&ctx)?;
            let request = request_with_dry_run(&ctx, true);
            let response = match api.post_data_deletion_request(&uuid, &request).await {
                Ok(r) => Value::from_json(&r),
                Err(e) => obj! {
                    "success": false,
                    "dryRun": true,
                    "rebuiltState": Value::Null,
                    "exception": obj! {
                        "eventUuid": Value::Null,
                        "eventName": Value::Null,
                        "handlerName": Value::Null,
                        "cause": e.body.as_ref().map_or(Value::Undefined, Value::from_json),
                    },
                },
            };
            set_session(&ctx, "deletionResponse", response);
            Ok(())
        }),
        register_effect!("deletionPersist", |ctx, args| {
            let uuid = assessment_uuid(&ctx)?;
            let api = create_api_client(&ctx)?;
            let request = request_with_dry_run(&ctx, false);
            let response = api.post_data_deletion_request(&uuid, &request).await.map_err(ForgeError::from)?;
            set_session(&ctx, "deletionResponse", Value::from_json(&response));
            Ok(())
        }),
    ]
}
