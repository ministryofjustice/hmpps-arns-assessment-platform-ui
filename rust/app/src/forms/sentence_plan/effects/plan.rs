//! Loading the plan, its timeline, versions and historic versions, plan
//! agreements, plan history and "last updated" details.

use std::collections::{HashMap, HashSet};
use std::sync::Arc;

use forge_core::{EffectContext, ForgeError, FunctionEntry, Value, obj};
use serde_json::{Value as Json, json};

use super::dates::{millis, newest_first, now_iso, to_iso};
use super::goals::{derive_goals_with_steps, sanitize_date_value};
use super::{SentencePlanEffectsDeps, api_error, data_list, practitioner_name, required_context, track_business_event};
use crate::data::{AapError, unwrap_all, wrap_all};
use crate::forms::dsl::http_error::{internal, not_found};
use crate::forms::dsl::nullish_or;
use crate::forms::sentence_plan::guards::POST_AGREEMENT_PROCESS_STATUSES;
use crate::register_effect;

const TIMELINE_CUSTOM_TYPES: [&str; 6] = ["GOAL_CREATED", "GOAL_ACHIEVED", "GOAL_REMOVED", "GOAL_READDED", "GOAL_UPDATED", "GOAL_DELETED"];

fn collection(assessment: &Value, name: &str) -> Option<Value> {
    assessment.get("collections").as_array()?.iter().find(|c| c.get("name").as_str() == Some(name)).cloned()
}

/// `derivePlanAgreementsData`: the plan's agreements (newest first) and the latest status.
pub fn derive_plan_agreements_data(assessment: &Value) -> (Vec<Value>, Value, Value, Value) {
    let draft = (vec![], Value::Undefined, Value::from("DRAFT"), Value::Undefined);
    let Some(agreements_collection) = collection(assessment, "PLAN_AGREEMENTS") else { return draft };
    let mut agreements: Vec<Value> = agreements_collection
        .get("items")
        .as_array()
        .map(|items| {
            items
                .iter()
                .map(|item| {
                    let answers = unwrap_all(&item.get("answers"));
                    let properties = unwrap_all(&item.get("properties"));
                    let a = |k: &str| answers.get(k).cloned().unwrap_or_default();
                    let p = |k: &str| properties.get(k).cloned().unwrap_or_default();
                    obj! {
                        "uuid": item.get("uuid"),
                        "status": p("status"),
                        "statusDate": p("status_date"),
                        "agreementQuestion": a("agreement_question"),
                        "detailsNo": a("details_no"),
                        "detailsCouldNotAnswer": a("details_could_not_answer"),
                        "notes": a("notes"),
                        "createdBy": a("created_by"),
                    }
                })
                .collect()
        })
        .unwrap_or_default();
    agreements.sort_by(|a, b| newest_first(&a.get("statusDate").to_js_string(), &b.get("statusDate").to_js_string()));
    let latest_status = agreements.first().map_or(Value::from("DRAFT"), |a| nullish_or(a.get("status"), || Value::from("DRAFT")));
    let latest_date = agreements.first().map_or(Value::Undefined, |a| a.get("statusDate"));
    (agreements, agreements_collection.get("uuid"), latest_status, latest_date)
}

/// `derivePlanLastUpdatedData`: whether a goal event came after the latest agreement, and when
/// and by whom (only events up to `before` count, for historic versions).
pub fn derive_plan_last_updated(timeline: &[Value], agreement_date: &Value, agreement_status: &Value, before: Option<i64>) -> (bool, Value, Value) {
    let none = (false, Value::Undefined, Value::Undefined);
    if !agreement_date.truthy() || agreement_status.as_str() == Some("DRAFT") || timeline.is_empty() {
        return none;
    }
    let mut events: Vec<&Value> = timeline
        .iter()
        .filter(|e| before.is_none_or(|b| millis(&e.get("timestamp").to_js_string()).is_some_and(|t| t <= b)))
        .collect();
    if events.is_empty() {
        return none;
    }
    events.sort_by(|a, b| newest_first(&a.get("timestamp").to_js_string(), &b.get("timestamp").to_js_string()));
    let latest = events[0];
    let Some(event_time) = millis(&latest.get("timestamp").to_js_string()) else { return none };
    match millis(&agreement_date.to_js_string()) {
        Some(agreed) if event_time > agreed => {}
        _ => return none,
    }
    let custom = latest.get("customData");
    let by = ["updatedBy", "createdBy", "achievedBy", "removedBy", "readdedBy"]
        .iter()
        .map(|k| custom.get(k))
        .find(|v| !v.is_nullish())
        .unwrap_or_else(|| nullish_or(latest.get("user").get("name"), || Value::from("Unknown")));
    let date = chrono::DateTime::from_timestamp_millis(event_time).map_or(Value::Undefined, |d| Value::from(to_iso(d)));
    (true, date, by)
}

fn resolve_area_label(slug: &Value, areas: &[Value]) -> Value {
    if !slug.truthy() {
        return Value::Undefined;
    }
    areas.iter().find(|a| a.get("slug").strict_eq(slug)).map_or_else(|| slug.clone(), |a| a.get("text"))
}

fn resolve_actor_label(actor: &Value, labels: &Value, person: &str) -> Value {
    if !actor.truthy() {
        return Value::from("");
    }
    if actor.as_str() == Some("person_on_probation") {
        return Value::from(person);
    }
    nullish_or(labels.get(&actor.to_js_string()), || actor.clone())
}

fn timeline_goal_uuid(item: &Value) -> Option<String> {
    let uuid = nullish_or(item.get("customData").get("goalUuid"), || item.get("data").get("goalUuid"));
    uuid.as_str().filter(|s| !s.is_empty()).map(str::to_string)
}

/// `buildGoalContext`: the goal as at the event (from its snapshot), or as now for legacy events.
fn goal_context(snapshot: &Value, current: Option<&Value>, areas: &[Value], labels: &Value, person: &str) -> Vec<(&'static str, Value)> {
    if snapshot.truthy() {
        let related: Vec<Value> = snapshot
            .get("relatedAreasOfNeed")
            .as_array()
            .map(|a| a.iter().map(|s| resolve_area_label(s, areas)).filter(Value::truthy).collect())
            .unwrap_or_default();
        let steps: Vec<Value> = snapshot
            .get("steps")
            .as_array()
            .map(|a| {
                a.iter()
                    .map(|s| obj! { "actor": resolve_actor_label(&s.get("actor"), labels, person), "description": s.get("description"), "status": s.get("status") })
                    .collect()
            })
            .unwrap_or_default();
        return vec![
            ("goalStatus", snapshot.get("status")),
            ("targetDate", sanitize_date_value(&snapshot.get("targetDate"))),
            ("statusDate", snapshot.get("statusDate")),
            ("areaOfNeedLabel", resolve_area_label(&snapshot.get("areaOfNeed"), areas)),
            ("relatedAreasOfNeedLabels", Value::array(related)),
            ("steps", Value::array(steps)),
        ];
    }
    let Some(goal) = current else { return vec![] };
    let steps: Vec<Value> = goal
        .get("steps")
        .as_array()
        .map(|a| a.iter().map(|s| obj! { "actor": s.get("actorLabel"), "description": s.get("description"), "status": s.get("status") }).collect())
        .unwrap_or_default();
    vec![
        ("goalStatus", goal.get("status")),
        ("targetDate", sanitize_date_value(&goal.get("targetDate"))),
        ("statusDate", goal.get("statusDate")),
        ("areaOfNeedLabel", goal.get("areaOfNeedLabel")),
        ("relatedAreasOfNeedLabels", goal.get("relatedAreasOfNeedLabels")),
        ("steps", Value::array(steps)),
    ]
}

/// `derivePlanHistoryEntries`: goal events from the timeline and the plan agreements, newest
/// first. A goal created with steps shows as one entry, and deleted goals don't show.
pub fn derive_plan_history_entries(ctx: &EffectContext) -> Vec<Value> {
    let timeline = data_list(ctx, "planTimeline");
    let agreements = data_list(ctx, "planAgreements");
    let goals = data_list(ctx, "goals");
    let areas = data_list(ctx, "areasOfNeed");
    let labels = ctx.get_data("actorLabels");
    let person = ctx.get_data("caseData").get("name").get("forename").as_str().unwrap_or("Person on probation").to_string();
    let custom_type = |item: &Value| item.get("customType").to_js_string();
    let is_initial_step_add = |item: &Value| custom_type(item) == "GOAL_UPDATED" && item.get("customData").get("isInitialStepAdd").truthy();

    let mut initial_steps: HashMap<String, Value> = HashMap::new();
    for item in &timeline {
        let data = item.get("customData");
        if is_initial_step_add(item) && data.get("goalUuid").truthy() && data.get("goalSnapshot").truthy() {
            initial_steps.insert(data.get("goalUuid").to_js_string(), data.get("goalSnapshot").get("steps"));
        }
    }
    let deleted: HashSet<String> = timeline.iter().filter(|i| custom_type(i) == "GOAL_DELETED").filter_map(timeline_goal_uuid).collect();

    let mut entries = vec![];
    for item in &timeline {
        let kind = custom_type(item);
        let goal_uuid = timeline_goal_uuid(item);
        let is_deleted_goal = goal_uuid.as_ref().is_some_and(|u| deleted.contains(u));
        if is_initial_step_add(item) || kind == "GOAL_DELETED" || ((kind == "GOAL_CREATED" || kind == "GOAL_UPDATED") && is_deleted_goal) {
            continue;
        }
        let data = item.get("customData");
        let current = goal_uuid.as_ref().and_then(|u| goals.iter().find(|g| g.get("uuid").as_str() == Some(u.as_str())));
        let mut snapshot = data.get("goalSnapshot");
        if kind == "GOAL_CREATED"
            && snapshot.truthy()
            && let Some(steps) = initial_steps.get(&data.get("goalUuid").to_js_string())
        {
            snapshot.set("steps", steps.clone());
        }
        let mut context = goal_context(&snapshot, current, &areas, &labels, &person);
        context.push(("currentGoalStatus", current.map_or(Value::Undefined, |g| g.get("status"))));
        let timestamp = item.get("timestamp");
        let goal_key = data.get("goalUuid").to_js_string();
        let (entry_type, uuid, specific): (&str, String, Vec<(&str, Value)>) = match kind.as_str() {
            "GOAL_CREATED" => (
                "goal_created",
                format!("created-{}-{}", item.get("uuid").to_js_string(), timestamp.to_js_string()),
                vec![("createdBy", data.get("createdBy"))],
            ),
            "GOAL_ACHIEVED" => (
                "goal_achieved",
                format!("achieved-{goal_key}-{}", timestamp.to_js_string()),
                vec![("achievedBy", data.get("achievedBy")), ("notes", data.get("notes"))],
            ),
            "GOAL_REMOVED" => {
                let active = current.is_some_and(|g| matches!(g.get("status").as_str(), Some("ACTIVE" | "FUTURE")));
                (
                    "goal_removed",
                    format!("removed-{goal_key}-{}", timestamp.to_js_string()),
                    vec![("removedBy", data.get("removedBy")), ("reason", data.get("reason")), ("isCurrentlyActive", Value::Bool(active))],
                )
            }
            "GOAL_READDED" => (
                "goal_readded",
                format!("readded-{goal_key}-{}", timestamp.to_js_string()),
                vec![("readdedBy", data.get("readdedBy")), ("reason", data.get("reason"))],
            ),
            "GOAL_UPDATED" => (
                "goal_updated",
                format!("updated-{goal_key}-{}", timestamp.to_js_string()),
                vec![("updatedBy", data.get("updatedBy")), ("notes", data.get("notes"))],
            ),
            _ => continue,
        };
        let mut entry = obj! {
            "type": entry_type,
            "uuid": uuid,
            "date": timestamp,
            "goalUuid": data.get("goalUuid"),
            "goalTitle": data.get("goalTitle"),
        };
        for (k, v) in specific.into_iter().chain(context) {
            entry.set(k, v);
        }
        entries.push(entry);
    }
    for agreement in agreements {
        entries.push(obj! {
            "type": "agreement",
            "uuid": agreement.get("uuid"),
            "date": agreement.get("statusDate"),
            "status": agreement.get("status"),
            "createdBy": agreement.get("createdBy"),
            "detailsNo": agreement.get("detailsNo"),
            "detailsCouldNotAnswer": agreement.get("detailsCouldNotAnswer"),
            "notes": agreement.get("notes"),
        });
    }
    entries.sort_by(|a, b| newest_first(&a.get("date").to_js_string(), &b.get("date").to_js_string()));
    entries
}

/// `trimTodayVersions`: newest first, without today's entry.
fn trim_today_versions(versions: &Json) -> Json {
    let today = chrono::Utc::now().format("%Y-%m-%d").to_string();
    let mut entries: Vec<(&String, &Json)> = versions.as_object().map(|o| o.iter().collect()).unwrap_or_default();
    entries.sort_by(|a, b| b.0.cmp(a.0));
    if entries.first().is_some_and(|(k, _)| **k == today) {
        entries.remove(0);
    }
    Json::Object(entries.into_iter().map(|(k, v)| (k.clone(), v.clone())).collect())
}

fn plan_identifier(ctx: &EffectContext, message: &str) -> Result<Json, ForgeError> {
    let identifier = ctx.get_session().get("sessionDetails").get("planIdentifier");
    if identifier.truthy() { Ok(identifier.to_json()) } else { Err(internal(message)) }
}

fn require_user(ctx: &EffectContext, message: &str) -> Result<Json, ForgeError> {
    let user = ctx.get_state("user");
    if user.truthy() { Ok(user.to_json()) } else { Err(internal(message)) }
}

fn set_agreements(ctx: &EffectContext, assessment: &Value) -> forge_core::ForgeResult<()> {
    let (agreements, collection_uuid, status, date) = derive_plan_agreements_data(assessment);
    ctx.set_data("planAgreements", Value::array(agreements))?;
    ctx.set_data("planAgreementsCollectionUuid", collection_uuid)?;
    ctx.set_data("latestAgreementStatus", status)?;
    ctx.set_data("latestAgreementDate", date)
}

fn answer_str(ctx: &EffectContext, key: &str) -> Option<String> {
    let v = ctx.get_answer(key);
    v.truthy().then(|| v.to_js_string())
}

fn agreement_command(collection_uuid: &str, status: &str, answers: forge_core::value::Map, assessment_uuid: &str, user: &Json) -> Json {
    let mut properties = forge_core::value::Map::new();
    properties.insert("status".into(), Value::from(status));
    properties.insert("status_date".into(), Value::from(now_iso()));
    json!({
        "type": "AddCollectionItemCommand",
        "collectionUuid": collection_uuid,
        "properties": wrap_all(&properties),
        "answers": wrap_all(&answers),
        "timeline": { "type": "PLAN_AGREEMENT_STATUS_CHANGED", "data": { "status": status } },
        "assessmentUuid": assessment_uuid,
        "user": user,
    })
}

pub fn entries(deps: &Arc<SentencePlanEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // The plan (latest version); a plan found by CRN must still have a live OASys
        // association, or it's treated as not found.
        register_effect!("loadPlan", deps, |ctx, args| {
            let user = require_user(&ctx, "User is required to load a sentence plan")?;
            let session = ctx.get_session();
            let details = session.get("sessionDetails");
            let identifier = plan_identifier(&ctx, "Plan identifier is required in session details")?;
            let assessment = deps
                .api
                .execute_query(json!({ "type": "AssessmentVersionQuery", "user": user, "assessmentIdentifier": identifier }))
                .await
                .map_err(api_error("Sentence plan not found"))?;
            if assessment.is_null() {
                return Err(not_found("Sentence plan not found"));
            }
            let uuid = assessment.get("assessmentUuid").and_then(Json::as_str).unwrap_or_default().to_string();
            if identifier.get("type").and_then(Json::as_str) == Some("EXTERNAL")
                && let Err(e) = deps.coordinator_api.get_versions_by_entity_id(&uuid).await
            {
                return Err(if e.status == Some(404) { not_found("Sentence plan not found") } else { e.into() });
            }
            ctx.set_data("assessment", Value::from_json(&assessment))?;
            ctx.set_data("assessmentUuid", Value::from(uuid))?;
            ctx.set_data("sessionDetails", details)?;
            let case = session.get("caseDetails");
            if case.truthy() {
                ctx.set_data("caseData", case)?;
            }
            Ok(())
        }),
        register_effect!("loadPlanTimeline", deps, |ctx, args| {
            let user = require_user(&ctx, "User is required to load plan timeline")?;
            let identifier = plan_identifier(&ctx, "Plan identifier is required to load plan timeline")?;
            let result = deps
                .api
                .execute_query(json!({
                    "type": "TimelineQuery",
                    "includeCustomTypes": TIMELINE_CUSTOM_TYPES,
                    "assessmentIdentifier": identifier,
                    "user": user,
                }))
                .await
                .map_err(ForgeError::from)?;
            let timeline = result.get("timeline").filter(|t| !t.is_null()).cloned().unwrap_or(json!([]));
            ctx.set_data("planTimeline", Value::from_json(&timeline))
        }),
        register_effect!("loadPreviousVersions", deps, |ctx, args| {
            let uuid = ctx.get_data("assessmentUuid");
            if !uuid.truthy() {
                return Err(internal("Assessment UUID is required to load previous versions"));
            }
            let private_beta_oasys = ctx.get_data("sessionDetails").get("accessType").as_str() == Some("OASYS")
                && ctx.get_data("assessment").get("flags").as_array().is_some_and(|f| f.iter().any(|v| v.as_str() == Some("SAN_BETA")));
            ctx.set_data("showAssessmentColumn", Value::Bool(private_beta_oasys))?;
            let mut versions = deps.coordinator_api.get_versions_by_entity_id(&uuid.to_js_string()).await.map_err(ForgeError::from)?;
            if versions.is_null() {
                return Err(not_found("Previous versions not found"));
            }
            for key in ["allVersions", "countersignedVersions"] {
                let trimmed = trim_today_versions(versions.get(key).unwrap_or(&Json::Null));
                versions[key] = trimmed;
            }
            ctx.set_data("previousVersions", Value::from_json(&versions))
        }),
        // The plan as it was at the `:timestamp` (milliseconds) point in time.
        register_effect!("loadHistoricPlan", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "loadHistoricPlan")?;
            let timestamp = ctx.get_request_param("timestamp").to_js_string();
            let point = timestamp.parse::<f64>().ok().filter(|t| t.is_finite()).and_then(|t| chrono::DateTime::from_timestamp_millis(t as i64));
            let Some(point) = point.filter(|_| !timestamp.is_empty()) else {
                return Err(not_found("Historic sentence plan not found"));
            };
            let assessment = deps
                .api
                .execute_query(json!({
                    "type": "AssessmentVersionQuery",
                    "user": user,
                    "assessmentIdentifier": { "type": "UUID", "uuid": assessment_uuid },
                    "timestamp": to_iso(point).replace('Z', "999Z"),
                }))
                .await
                .map_err(|e| match &e {
                    AapError::Api(api) if api.status == Some(400) => not_found("Historic sentence plan not found"),
                    _ if e.is_missing_assessment() => not_found("Historic sentence plan not found"),
                    _ => e.into(),
                })?;
            if assessment.is_null() {
                return Err(not_found("Historic sentence plan not found"));
            }
            let assessment = Value::from_json(&assessment);
            let (_, _, status, date) = derive_plan_agreements_data(&assessment);
            let (goals, _) = derive_goals_with_steps(&assessment, &ctx.get_data("caseData"), &ctx.get_data("actorLabels"), &data_list(&ctx, "areasOfNeed"));
            ctx.set_data(
                "historic",
                obj! {
                    "assessment": assessment,
                    "goals": goals,
                    "latestAgreementDate": date,
                    "latestAgreementStatus": status,
                },
            )
        }),
        register_effect!("derivePlanAgreementsFromAssessment", |ctx, args| { set_agreements(&ctx, &ctx.get_data("assessment")) }),
        register_effect!("derivePlanHistoryEntries", |ctx, args| {
            ctx.set_data("planHistoryEntries", Value::array(derive_plan_history_entries(&ctx)))
        }),
        register_effect!("derivePlanLastUpdated", |ctx, args| {
            let (updated, date, by) = derive_plan_last_updated(
                &data_list(&ctx, "planTimeline"),
                &ctx.get_data("latestAgreementDate"),
                &ctx.get_data("latestAgreementStatus"),
                None,
            );
            ctx.set_data("isUpdatedAfterAgreement", Value::Bool(updated))?;
            ctx.set_data("lastUpdatedDate", date)?;
            ctx.set_data("lastUpdatedByName", by)
        }),
        register_effect!("derivePlanLastUpdatedForHistoric", |ctx, args| {
            let mut historic = ctx.get_data("historic");
            if !historic.truthy() {
                return Ok(());
            }
            let timestamp = ctx.get_request_param("timestamp");
            let before = if timestamp.truthy() { timestamp.to_js_string().parse::<f64>().ok().map(|t| t as i64) } else { None };
            let (updated, date, by) = derive_plan_last_updated(
                &data_list(&ctx, "planTimeline"),
                &historic.get("latestAgreementDate"),
                &historic.get("latestAgreementStatus"),
                before,
            );
            historic.set("isUpdatedAfterAgreement", Value::Bool(updated));
            historic.set("lastUpdatedDate", date);
            historic.set("lastUpdatedByName", by);
            ctx.set_data("historic", historic)
        }),
        // Records the plan agreement answer (creating the PLAN_AGREEMENTS collection in the same
        // batch the first time; the API resolves "@0" to the first command's new UUID).
        register_effect!("updatePlanAgreementStatus", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "updatePlanAgreementStatus")?;
            let practitioner = practitioner_name(&ctx, &user);
            let Some(answer) = answer_str(&ctx, "plan_agreement_question") else {
                return Err(internal("Agreement answer is required to update plan agreement status"));
            };
            let status = match answer.as_str() {
                "yes" => "AGREED",
                "no" => "DO_NOT_AGREE",
                "could_not_answer" => "COULD_NOT_ANSWER",
                other => return Err(internal(format!("Invalid agreement answer: {other}"))),
            };
            let existing = ctx.get_data("planAgreementsCollectionUuid");
            let mut commands = vec![];
            if !existing.truthy() {
                commands.push(json!({ "type": "CreateCollectionCommand", "name": "PLAN_AGREEMENTS", "assessmentUuid": assessment_uuid, "user": user }));
            }
            let mut answers = forge_core::value::Map::new();
            answers.insert("agreement_question".into(), Value::from(answer.as_str()));
            for (field, key) in [
                ("plan_agreement_details_no", "details_no"),
                ("plan_agreement_details_could_not_answer", "details_could_not_answer"),
                ("plan_agreement_notes", "notes"),
            ] {
                if let Some(v) = answer_str(&ctx, field) {
                    answers.insert(key.into(), Value::from(v));
                }
            }
            if !practitioner.is_empty() {
                answers.insert("created_by".into(), Value::from(practitioner));
            }
            let collection_uuid = if existing.truthy() { existing.to_js_string() } else { "@0".into() };
            commands.push(agreement_command(&collection_uuid, status, answers, &assessment_uuid, &user));
            deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            track_business_event(&ctx, "AGREE_PLAN_PAGE_SUBMITTED", json!({ "assessmentUuid": assessment_uuid, "status": status }));
            Ok(())
        }),
        // Records the updated agreement after a "could not answer".
        register_effect!("updatePlanAgreement", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "updatePlanAgreement")?;
            let practitioner = practitioner_name(&ctx, &user);
            let Some(answer) = answer_str(&ctx, "update_plan_agreement_question") else {
                return Err(internal("Agreement answer is required to update plan agreement status"));
            };
            let status = match answer.as_str() {
                "yes" => "UPDATED_AGREED",
                "no" => "UPDATED_DO_NOT_AGREE",
                other => return Err(internal(format!("Invalid agreement answer: {other}"))),
            };
            let collection_uuid = ctx.get_data("planAgreementsCollectionUuid");
            if !collection_uuid.truthy() {
                return Err(internal("PLAN_AGREEMENTS collection not found"));
            }
            let mut answers = forge_core::value::Map::new();
            answers.insert("agreement_question".into(), Value::from(answer.as_str()));
            if answer == "no" {
                let Some(details) = answer_str(&ctx, "update_plan_agreement_details_no") else {
                    return Err(internal("Agreement details are required when the answer is \"no\""));
                };
                answers.insert("details_no".into(), Value::from(details));
            }
            answers.insert("created_by".into(), Value::from(practitioner));
            if let Some(notes) = answer_str(&ctx, "update_plan_agreement_notes") {
                answers.insert("notes".into(), Value::from(notes));
            }
            let command = agreement_command(&collection_uuid.to_js_string(), status, answers, &assessment_uuid, &user);
            deps.api.execute_command(command).await.map_err(ForgeError::from)?;
            track_business_event(&ctx, "UPDATE_PLAN_AGREEMENT_PAGE_SUBMITTED", json!({ "assessmentUuid": assessment_uuid, "status": status }));
            Ok(())
        }),
    ]
}

/// `POST_AGREEMENT_PROCESS_STATUSES.includes(status)`.
pub fn is_post_agreement(status: &Value) -> bool {
    status.as_str().is_some_and(|s| POST_AGREEMENT_PROCESS_STATUSES.contains(&s))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn last_updated_needs_an_event_after_agreement() {
        let timeline = vec![obj! { "timestamp": "2025-01-03T10:00:00.000Z", "customData": obj! { "updatedBy": "Sam" } }];
        let (updated, date, by) =
            derive_plan_last_updated(&timeline, &Value::from("2025-01-02T10:00:00.000Z"), &Value::from("AGREED"), None);
        assert!(updated);
        assert_eq!(date.to_js_string(), "2025-01-03T10:00:00.000Z");
        assert_eq!(by.to_js_string(), "Sam");
        let (updated, ..) = derive_plan_last_updated(&timeline, &Value::from("2025-01-04T10:00:00.000Z"), &Value::from("AGREED"), None);
        assert!(!updated);
    }

    #[test]
    fn agreements_are_newest_first() {
        let assessment = Value::from_json(&json!({
            "collections": [{
                "name": "PLAN_AGREEMENTS",
                "uuid": "c1",
                "items": [
                    { "uuid": "a", "answers": {}, "properties": { "status": { "type": "Single", "value": "COULD_NOT_ANSWER" }, "status_date": { "type": "Single", "value": "2025-01-01T00:00:00Z" } } },
                    { "uuid": "b", "answers": {}, "properties": { "status": { "type": "Single", "value": "UPDATED_AGREED" }, "status_date": { "type": "Single", "value": "2025-02-01T00:00:00Z" } } },
                ],
            }],
        }));
        let (agreements, uuid, status, _) = derive_plan_agreements_data(&assessment);
        assert_eq!(agreements.len(), 2);
        assert_eq!(uuid.to_js_string(), "c1");
        assert_eq!(status.to_js_string(), "UPDATED_AGREED");
    }
}
