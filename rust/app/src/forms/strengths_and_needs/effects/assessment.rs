//! Loading the assessment, saving answers (queued, then committed as
//! one batch), collections, drug categories and the OASys data mapping hook.

use std::sync::Arc;

use forge_core::value::Map;
use forge_core::{EffectContext, ForgeResult, FunctionEntry, Value};
use serde_json::{Value as Json, json};

use super::answer_delta::{build_answer_delta, build_changed_answer_codes, restore_suppressed_answers, unique};
use super::{StrengthsAndNeedsEffectsDeps, queue_command, san_session, send_audit_event, update_san_session, user_json};
use crate::data::{unwrap_all, wrap_all};
use crate::forms::dsl::arg;
use crate::forms::dsl::http_error::{bad_request, internal, not_found};
use crate::forms::strengths_and_needs::audit_events::san_audit_event;
use crate::forms::strengths_and_needs::constants::LATEST_VERSION;
use crate::forms::strengths_and_needs::constants::collection::{Collection, store_collection_uuid};
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_config::v1_form_config;
use crate::forms::strengths_and_needs::v1::constants::form_version::FORM_VERSION;
use crate::forms::strengths_and_needs::v1::constants::section::{THINKING_BEHAVIOURS_AND_ATTITUDES, section_complete};
use crate::forms::strengths_and_needs::v1::constants::user_submitted::{is_user_submitted, is_user_submitted_code};
use crate::forms::strengths_and_needs::v1::journeys::accommodation::constants::question as accommodation_question;
use crate::forms::strengths_and_needs::v1::journeys::drug_use::constants::{option as drug_option, question as drug_question};
use crate::forms::strengths_and_needs::v1::journeys::drug_use::drugs::{DRUGS_LIST, drug_by_value, field_code_string};
use crate::forms::strengths_and_needs::v1::journeys::offence_analysis::constants::{option as offence_option, question as offence_question};
use crate::forms::strengths_and_needs::v1::journeys::thinking_behaviours_and_attitudes::constants::question as tba_question;
use crate::register_effect;

/// `loadAssessmentQuery`: `None` when the API has no such assessment.
pub async fn load_assessment_query(deps: &StrengthsAndNeedsEffectsDeps, query: Json) -> ForgeResult<Option<Json>> {
    match deps.api.execute_query(query).await {
        Ok(result) => Ok(Some(result)),
        Err(e) if e.is_missing_assessment() => Ok(None),
        Err(e) => Err(e.into()),
    }
}

/// `UpdateOasysDataMappingHook`: re-runs the OASys data mapping with the form's field config.
fn oasys_data_mapping_hook(assessment: &Value) -> ForgeResult<Json> {
    let version = match assessment.get("formVersion") {
        v if v.truthy() => v.to_js_string(),
        _ => LATEST_VERSION.to_string(),
    };
    if version != FORM_VERSION {
        return Err(internal(format!("No formConfig defined for version {version}")));
    }
    Ok(json!({ "type": "UpdateOasysDataMapping", "formConfig": v1_form_config().to_json() }))
}

fn collection_arg(args: &[Value], i: usize) -> (String, Vec<String>) {
    Collection::from_value(&arg(args, i))
}

/// `assessment.collections.find(c => c.name === name)`.
fn find_collection(ctx: &EffectContext, name: &str) -> Value {
    ctx.get_data("assessment")
        .get("collections")
        .as_array()
        .and_then(|a| a.iter().find(|c| c.get("name").as_str() == Some(name)).cloned())
        .unwrap_or(Value::Undefined)
}

/// `array.at(index)`.
fn at(items: &Value, index: f64) -> Value {
    let Some(a) = items.as_array() else { return Value::Undefined };
    if !index.is_finite() {
        return if a.is_empty() { Value::Undefined } else { a[0].clone() };
    }
    let i = index.trunc() as i64;
    let i = if i < 0 { a.len() as i64 + i } else { i };
    if i < 0 { Value::Undefined } else { a.get(i as usize).cloned().unwrap_or(Value::Undefined) }
}

fn collection_answers(ctx: &EffectContext, fields: &[String]) -> Map {
    let mut items = Map::new();
    for code in fields {
        let value = ctx.get_answer(code);
        if !value.is_undefined() {
            items.insert(code.as_str().into(), value);
        }
    }
    items
}

/// Appends the item to the collection's answer and clears its fields.
fn stage_collection_item(ctx: &EffectContext, name: &str, fields: &[String], items: &Map) -> ForgeResult<()> {
    let mut answer = ctx.get_answer(name).as_array().map(|a| a.to_vec()).unwrap_or_default();
    answer.push(Value::object(items.clone()));
    ctx.set_answer(name, Value::array(answer))?;
    for code in fields {
        ctx.set_answer(code, Value::Undefined)?;
    }
    Ok(())
}

/// `saveCurrentStepAnswers` / `saveCurrentAccommodationStepAnswers`: queues the answer changes.
/// Answers only leave the record on a real, successful save; a failed save and an autosave keep
/// what is stored and put back anything Forge emptied, so the page still shows it.
fn save_step_answers(ctx: &EffectContext, args: &[Value], accommodation: bool) -> ForgeResult<()> {
    let clear_fields = !matches!(arg(args, 0), Value::Bool(false));
    let is_autosaved = matches!(arg(args, 1), Value::Bool(true));
    let user = ctx.get_state("user");
    let assessment_uuid = ctx.get_data("assessmentUuid");
    let clear_removals = clear_fields && !is_autosaved;

    if accommodation && clear_removals {
        for code in [
            accommodation_question::approved_premises_end_date,
            accommodation_question::short_term_accommodation_end_date,
            accommodation_question::cas2_end_date,
            accommodation_question::cas3_end_date,
            accommodation_question::immigration_accommodation_end_date,
        ] {
            let raw = ctx.get_answer(code);
            // An absent date has nothing to sanitise.
            if !raw.is_nullish() {
                ctx.set_answer(code, sanitize_date_value(&raw))?;
            }
        }
    }
    if !user.truthy() {
        return Err(internal("User is required to save strengths and needs answers"));
    }
    if !assessment_uuid.truthy() {
        return Err(internal("Assessment UUID is required to save strengths and needs answers"));
    }
    let fields_to_clear: Vec<String> = if accommodation { vec![] } else { ctx.get_fields_to_clear().iter().map(|f| f.to_string()).collect() };
    if !accommodation && clear_removals {
        for field in &fields_to_clear {
            ctx.clear_answer(field);
        }
    }
    let histories = ctx.get_all_answer_histories();
    let delta = build_answer_delta(&histories);
    if delta.added.is_empty() && delta.removed.is_empty() {
        return Ok(());
    }
    let removed = unique(delta.removed.iter().cloned().chain(fields_to_clear.iter().cloned()));
    let mut command = json!({
        "type": "UpdateAssessmentAnswersCommand",
        "assessmentUuid": assessment_uuid.to_json(),
        "user": user.to_json(),
        "added": wrap_all(&delta.added),
        "removed": if clear_removals { json!(removed) } else { json!([]) },
        "autosaved": is_autosaved,
    });
    if !clear_removals {
        restore_suppressed_answers(ctx, &histories, &removed)?;
    }
    let fields_to_change = unique(build_changed_answer_codes(&histories).into_iter().chain(fields_to_clear.iter().cloned()));
    let changed_fields: Vec<String> = if accommodation {
        if !clear_fields && is_autosaved { fields_to_change.into_iter().filter(|f| !removed.contains(f)).collect() } else { fields_to_change }
    } else if clear_removals {
        fields_to_change
    } else {
        fields_to_change.into_iter().filter(|f| !removed.contains(f)).collect()
    };
    // Field codes only: answers do not belong in the audit log.
    let audit = (!changed_fields.is_empty())
        .then(|| (san_audit_event::EDIT_ANSWERS.to_string(), json!({ "changedFields": changed_fields })));
    if command["removed"].is_null() {
        command["removed"] = json!([]);
    }
    queue_command(ctx, command, true, audit)
}

/// `sanitizeDateValue`: `undefined` for anything that isn't a real date (including the strings
/// "null" and "undefined").
pub fn sanitize_date_value(value: &Value) -> Value {
    let s = value.to_js_string();
    if !value.truthy() || s == "null" || s == "undefined" {
        return Value::Undefined;
    }
    if !forge_core::jsdate::JsDate::parse(&s).is_valid() {
        return Value::Undefined;
    }
    value.clone()
}

pub fn entries(deps: &Arc<StrengthsAndNeedsEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // Loads the assessment for the access (or, with `historicVersion`, the version at its
        // timestamp), creating it when it doesn't exist yet; then its answers and properties.
        register_effect!("loadAssessment", deps, |ctx, args| {
            let user = ctx.get_state("user");
            let session = ctx.get_session();
            let details = san_session(&ctx).get("sessionDetails");
            if !user.truthy() {
                return Err(internal("User is required to load a strengths and needs assessment"));
            }
            if !details.get("assessmentIdentifier").truthy() {
                return Err(internal("Assessment identifier is required in session details"));
            }
            let mut query = json!({
                "type": "AssessmentVersionQuery",
                "user": user.to_json(),
                "assessmentIdentifier": details.get("assessmentIdentifier").to_json(),
            });
            let historic = ctx.get_data("historicVersion");
            if historic.truthy() {
                query["timestamp"] = historic.get("updatedAt").to_json();
            }
            let has_timestamp = query.get("timestamp").is_some_and(|t| !t.is_null());
            let mut assessment = load_assessment_query(&deps, query).await?;
            if assessment.is_none() && has_timestamp {
                return Err(not_found("No assessment found at version timestamp"));
            }
            if assessment.is_none() {
                if !session.get("caseDetails").get("crn").truthy() {
                    return Err(internal("CRN is required to create a strengths and needs assessment"));
                }
                let created = deps
                    .api
                    .execute_query(json!({
                        "type": "AssessmentVersionQuery",
                        "user": user.to_json(),
                        "assessmentIdentifier": details.get("assessmentIdentifier").to_json(),
                    }))
                    .await
                    .map_err(forge_core::ForgeError::from)?;
                if session.get("handoverContext").truthy() {
                    let uuid = Value::from_json(&created["assessmentUuid"]);
                    ctx.update_session(|s| {
                        let mut handover = s.get("handoverContext");
                        let mut context = match handover.get("assessmentContext") {
                            v @ Value::Object(_) => v,
                            _ => Value::empty_object(),
                        };
                        context.set("assessmentId", uuid);
                        crate::forms::dsl::remove_key(&mut context, "assessmentVersion");
                        handover.set("assessmentContext", context);
                        s.set("handoverContext", handover);
                    });
                }
                assessment = Some(created);
            }
            let assessment = assessment.unwrap_or(Json::Null);
            // The fetched assessment must be the one the handover named.
            let handover_id = ctx.get_session().get("handoverContext").get("assessmentContext").get("assessmentId");
            if handover_id.truthy() && handover_id.to_json() != assessment["assessmentUuid"] {
                return Err(bad_request(format!(
                    "Assessment ID mismatch: expected {}, but fetched {}",
                    handover_id.to_js_string(),
                    assessment["assessmentUuid"].as_str().unwrap_or("undefined")
                )));
            }
            let assessment_value = Value::from_json(&assessment);
            let uuid = assessment_value.get("assessmentUuid");
            ctx.set_data("assessment", assessment_value.clone())?;
            ctx.set_data("assessmentUuid", uuid.clone())?;
            ctx.set_data("sessionDetails", details)?;
            update_san_session(&ctx, |san| san.set("assessmentUuid", uuid));
            for (code, value) in unwrap_all(&assessment_value.get("answers")) {
                ctx.set_answer(&code, value)?;
            }
            for (code, value) in unwrap_all(&assessment_value.get("properties")) {
                ctx.set_data(&code, value)?;
            }
            Ok(())
        }),
        register_effect!("saveCurrentStepAnswers", |ctx, args| { save_step_answers(&ctx, &args, false) }),
        // TODO: replace with saveCurrentStepAnswers.
        register_effect!("saveCurrentAccommodationStepAnswers", |ctx, args| { save_step_answers(&ctx, &args, true) }),
        // Sends every queued command as one transactional batch, the OASys mapping hook on the
        // last one, then the audit events in queue order.
        register_effect!("commitPendingCommands", deps, |ctx, args| {
            let pending = ctx.get_data("pendingCommands").as_array().map(|a| a.to_vec()).unwrap_or_default();
            if pending.is_empty() {
                return Ok(());
            }
            ctx.set_data("pendingCommands", Value::array(vec![]))?;
            let mut commands: Vec<Json> = pending.iter().map(|p| p.get("command").to_json()).collect();
            if pending.iter().any(|p| p.get("mapToOasys").truthy())
                && let Some(last) = commands.last_mut()
            {
                last["hooks"] = json!([oasys_data_mapping_hook(&ctx.get_data("assessment"))?]);
            }
            deps.api.execute_commands(commands).await?;
            for p in &pending {
                let audit = p.get("audit");
                if audit.truthy() {
                    send_audit_event(&deps, &ctx, &audit.get("action").to_js_string(), Some(audit.get("details").to_json())).await;
                }
            }
            Ok(())
        }),
        register_effect!("setSectionProgress", |ctx, args| {
            let status_key = arg(&args, 0).get("statusKey").to_js_string();
            let status = arg(&args, 1);
            ctx.set_data(&status_key, status.clone())?;
            let mut added = Map::new();
            added.insert(status_key.as_str().into(), status);
            let command = json!({
                "type": "UpdateAssessmentPropertiesCommand",
                "assessmentUuid": ctx.get_data("assessmentUuid").to_json(),
                "user": user_json(&ctx),
                "added": wrap_all(&added),
                "removed": [],
            });
            queue_command(&ctx, command, true, None)
        }),
        register_effect!("setUserSubmitted", |ctx, args| {
            let code = is_user_submitted_code(&arg(&args, 0).to_js_string());
            let value = match arg(&args, 1) {
                Value::Undefined => Value::from(is_user_submitted::TRUE),
                v => v,
            };
            ctx.set_data(&code, value.clone())?;
            let mut added = Map::new();
            added.insert(code.as_str().into(), value);
            let command = json!({
                "type": "UpdateAssessmentPropertiesCommand",
                "assessmentUuid": ctx.get_data("assessmentUuid").to_json(),
                "user": user_json(&ctx),
                "added": wrap_all(&added),
                "removed": [],
            });
            queue_command(&ctx, command, true, None)
        }),
        // A "yes" in OASys for sexually motivated offence history is carried into SAN.
        register_effect!("setRiskOfSexualHarm", deps, |ctx, args| {
            let oasys_answer = ctx.get_session().get("caseDetails").get("sexuallyMotivatedOffenceHistory");
            let code = tba_question::thinking_behaviours_attitudes_risk_sexual_harm;
            let san_answer = ctx.get_answer(code);
            if oasys_answer.as_str() != Some(common_option::yes) || oasys_answer.strict_eq(&san_answer) {
                return Ok(());
            }
            let mut answers = Map::new();
            answers.insert(code.into(), Value::from(common_option::yes));
            let mut properties = Map::new();
            properties.insert(THINKING_BEHAVIOURS_AND_ATTITUDES.status_key.into(), Value::from(section_complete::NO));
            let (added_answers, added_properties) = (wrap_all(&answers), wrap_all(&properties));
            let uuid = ctx.get_data("assessmentUuid").to_json();
            let user = user_json(&ctx);
            deps.api
                .execute_commands(vec![
                    json!({ "type": "UpdateAssessmentAnswersCommand", "assessmentUuid": uuid, "user": user, "added": added_answers, "removed": [] }),
                    json!({ "type": "UpdateAssessmentPropertiesCommand", "assessmentUuid": uuid, "user": user, "added": added_properties, "removed": [] }),
                ])
                .await?;
            let assessment = ctx.get_data("assessment");
            let mut updated = Value::empty_object();
            if let Some(o) = assessment.as_object() {
                for (k, v) in o.iter() {
                    if k.as_ref() != "answers" && k.as_ref() != "properties" {
                        updated.set(k.clone(), v.clone());
                    }
                }
            }
            let merge = |base: Value, extra: &Json| {
                let mut merged = match base {
                    v @ Value::Object(_) => v,
                    _ => Value::empty_object(),
                };
                if let Some(o) = extra.as_object() {
                    for (k, v) in o {
                        merged.set(k.as_str(), Value::from_json(v));
                    }
                }
                merged
            };
            updated.set("answers", merge(assessment.get("answers"), &added_answers));
            updated.set("properties", merge(assessment.get("properties"), &added_properties));
            ctx.set_data("assessment", updated)?;
            ctx.set_answer(code, Value::from(common_option::yes))?;
            ctx.set_data(THINKING_BEHAVIOURS_AND_ATTITUDES.status_key, Value::from(section_complete::NO))
        }),
        // Which selected drugs were used in the last 6 months, more than 6 months ago, and
        // which are injectable.
        register_effect!("deriveDrugCategories", |ctx, args| {
            let selected: Vec<String> = ctx
                .get_answer(drug_question::select_misused_drugs)
                .as_array()
                .map(|a| a.iter().map(Value::to_js_string).collect())
                .unwrap_or_default();
            let (mut last_six, mut more_than_six, mut injectable) = (vec![], vec![], vec![]);
            for value in &selected {
                let Some(drug) = drug_by_value(value) else { continue };
                let last_used = ctx.get_answer(&field_code_string(drug_question::drug_last_used, value));
                match last_used.as_str() {
                    Some(drug_option::last_six) => last_six.push(drug.to_value()),
                    Some(drug_option::more_than_six) => more_than_six.push(drug.to_value()),
                    _ => {}
                }
                if drug.injectable {
                    injectable.push(drug.to_value());
                }
            }
            ctx.set_data("drugsUsedInLastSix", Value::array(last_six))?;
            ctx.set_data("drugsUsedMoreThanSix", Value::array(more_than_six))?;
            ctx.set_data("injectableSelectedDrugs", Value::array(injectable))
        }),
        // Forge only clears answers on the page being saved; the per-drug answers of drugs no
        // longer selected are on later pages, so they are removed here.
        register_effect!("clearUnselectedDrugAnswers", |ctx, args| {
            let per_drug = [
                drug_question::drug_last_used_value,
                drug_question::how_often_used_value,
                drug_question::how_often_used_details,
                drug_question::drugs_injected_value,
            ];
            let selected: Vec<String> = ctx
                .get_answer(drug_question::select_misused_drugs)
                .as_array()
                .map(|a| a.iter().map(Value::to_js_string).collect())
                .unwrap_or_default();
            let mut removed: Vec<String> = DRUGS_LIST
                .iter()
                .filter(|d| !selected.iter().any(|s| s == d.value))
                .flat_map(|d| per_drug.iter().map(move |code| code.replacen("%1", &d.value.to_lowercase(), 1)))
                .filter(|code| !ctx.get_answer(code).is_undefined())
                .collect();
            let mut added = Map::new();
            let injected = ctx.get_answer(drug_question::drugs_injected);
            if let Some(injected) = injected.as_array() {
                // Answers that aren't drugs, such as "None", stay.
                let still: Vec<Value> = injected
                    .iter()
                    .filter(|v| {
                        let v = v.to_js_string();
                        drug_by_value(&v).is_none() || selected.contains(&v)
                    })
                    .cloned()
                    .collect();
                if still.len() != injected.len() {
                    if still.is_empty() {
                        removed.push(drug_question::drugs_injected.to_string());
                    } else {
                        added.insert(drug_question::drugs_injected.into(), Value::array(still));
                    }
                }
            }
            if removed.is_empty() && added.is_empty() {
                return Ok(());
            }
            for code in &removed {
                ctx.clear_answer(code);
            }
            let mut changed = removed.clone();
            changed.extend(added.keys().map(|k| k.to_string()));
            let command = json!({
                "type": "UpdateAssessmentAnswersCommand",
                "assessmentUuid": ctx.get_data("assessmentUuid").to_json(),
                "user": user_json(&ctx),
                "added": wrap_all(&added),
                "removed": removed,
            });
            queue_command(&ctx, command, true, Some((san_audit_event::EDIT_ANSWERS.into(), json!({ "changedFields": changed }))))
        }),
        register_effect!("addItemToCollection", deps, |ctx, args| {
            let (name, fields) = collection_arg(&args, 0);
            let user = user_json(&ctx);
            let assessment_uuid = ctx.get_data("assessmentUuid").to_json();
            let mut collection_uuid = ctx.get_data("collectionUuids").get(&name);
            if !collection_uuid.truthy() {
                let result = deps
                    .api
                    .execute_command(json!({ "type": "CreateCollectionCommand", "name": name, "assessmentUuid": assessment_uuid, "user": user }))
                    .await?;
                collection_uuid = Value::from_json(&result["collectionUuid"]);
                store_collection_uuid(&ctx, &name, collection_uuid.clone())?;
            }
            let items = collection_answers(&ctx, &fields);
            stage_collection_item(&ctx, &name, &fields, &items)?;
            deps.api
                .execute_command(json!({
                    "type": "AddCollectionItemCommand",
                    "collectionUuid": collection_uuid.to_json(),
                    "properties": {},
                    "answers": wrap_all(&items),
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }))
                .await?;
            Ok(())
        }),
        register_effect!("updateItemFromCollection", deps, |ctx, args| {
            let (name, fields) = collection_arg(&args, 0);
            let is_autosaved = matches!(arg(&args, 2), Value::Bool(true));
            let item = at(&find_collection(&ctx, &name).get("items"), arg(&args, 1).to_js_number());
            let items = collection_answers(&ctx, &fields);
            stage_collection_item(&ctx, &name, &fields, &items)?;
            deps.api
                .execute_command(json!({
                    "type": "UpdateCollectionItemAnswersCommand",
                    "collectionItemUuid": item.get("uuid").to_json(),
                    "added": wrap_all(&items),
                    "removed": [],
                    "assessmentUuid": ctx.get_data("assessmentUuid").to_json(),
                    "user": user_json(&ctx),
                    "autosaved": is_autosaved,
                }))
                .await?;
            Ok(())
        }),
        register_effect!("removeItemFromCollection", deps, |ctx, args| {
            let (name, _) = collection_arg(&args, 0);
            // The posted item number is 1-based.
            let item = at(&find_collection(&ctx, &name).get("items"), arg(&args, 1).to_js_number() - 1.0);
            if item.truthy() {
                deps.api
                    .execute_command(json!({
                        "type": "RemoveCollectionItemCommand",
                        "collectionItemUuid": item.get("uuid").to_json(),
                        "assessmentUuid": ctx.get_data("assessmentUuid").to_json(),
                        "user": user_json(&ctx),
                    }))
                    .await?;
            }
            Ok(())
        }),
        // Removes every victim once the offence no longer has people as victims.
        register_effect!("emptyCollection", deps, |ctx, args| {
            let (name, _) = collection_arg(&args, 0);
            let found = find_collection(&ctx, &name);
            let who = ctx.get_answer(offence_question::offence_analysis_who_was_the_victim);
            let who = if who.truthy() { who } else { Value::Undefined };
            let includes_people = who.as_array().is_some_and(|a| a.iter().any(|v| v.as_str() == Some(offence_option::one_or_more_person)));
            // Collections are created lazily, so an absent collection is already empty.
            if who.is_undefined() || includes_people || found.is_nullish() {
                return Ok(());
            }
            let uuid = ctx.get_data("assessmentUuid").to_json();
            let user = user_json(&ctx);
            let commands: Vec<Json> = found
                .get("items")
                .as_array()
                .map(|items| {
                    items
                        .iter()
                        .map(|item| {
                            json!({
                                "type": "RemoveCollectionItemCommand",
                                "collectionItemUuid": item.get("uuid").to_json(),
                                "assessmentUuid": uuid,
                                "user": user,
                            })
                        })
                        .collect()
                })
                .unwrap_or_default();
            deps.api.execute_commands(commands).await?;
            Ok(())
        }),
        register_effect!("loadItemFromCollection", |ctx, args| {
            let (name, fields) = collection_arg(&args, 0);
            let item = at(&find_collection(&ctx, &name).get("items"), arg(&args, 1).to_js_number());
            if item.is_undefined() {
                return Err(forge_core::ForgeError::type_error(format!("No item {} in collection {name}", arg(&args, 1).to_js_string())));
            }
            let answers = unwrap_all(&item.get("answers"));
            for code in &fields {
                ctx.set_answer(code, answers.get(code.as_str()).cloned().unwrap_or(Value::Undefined))?;
            }
            Ok(())
        }),
        register_effect!("loadAnswersFromCollection", |ctx, args| {
            let (name, _) = collection_arg(&args, 0);
            let collection = find_collection(&ctx, &name);
            let items = match collection.get("items") {
                Value::Undefined | Value::Null => Value::array(vec![]),
                items => items,
            };
            ctx.set_data(&name, items)?;
            store_collection_uuid(&ctx, &name, collection.get("uuid"))
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sanitizes_dates() {
        assert!(sanitize_date_value(&Value::from("null")).is_undefined());
        assert!(sanitize_date_value(&Value::from("not a date")).is_undefined());
        assert_eq!(sanitize_date_value(&Value::from("2027-01-15")).as_str(), Some("2027-01-15"));
    }

    #[test]
    fn array_at_supports_negative_indices() {
        let items = forge_core::val!([1, 2, 3]);
        assert_eq!(at(&items, 0.0).to_js_number(), 1.0);
        assert_eq!(at(&items, -1.0).to_js_number(), 3.0);
        assert!(at(&items, 5.0).is_undefined());
    }
}
