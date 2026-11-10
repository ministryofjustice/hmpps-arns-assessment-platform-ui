//! Deriving goals from the plan, and creating, changing, achieving, removing,
//! re-adding, deleting and reordering them.

use std::sync::Arc;

use chrono::{DateTime, Local, Utc};
use forge_core::value::Map;
use forge_core::{EffectContext, ForgeError, ForgeResult, FunctionEntry, Value, obj};
use serde_json::{Value as Json, json};
use sha2::{Digest, Sha256};

use super::dates::{add_months_js, is_same_local_day, newest_first, now_iso, parse, to_iso};
use super::supervision::{publish_goals_added_event, publish_goals_completed_event};
use super::{SentencePlanEffectsDeps, data_list, practitioner_name, required_context, track_business_event};
use crate::data::{unwrap_all, wrap_all};
use crate::forms::dsl::http_error::{bad_request, internal};
use crate::forms::dsl::nullish_or;
use crate::forms::sentence_plan::constants::areas_of_need_list;
use crate::register_effect;

/// `sanitizeDateValue`: the value when it's a valid date, otherwise `undefined`.
pub fn sanitize_date_value(value: &Value) -> Value {
    let s = value.to_js_string();
    if !value.truthy() || s == "null" || s == "undefined" || parse(&s).is_none() { Value::Undefined } else { value.clone() }
}

const MONTHS_BY_OPTION: [(&str, i32); 3] = [("date_in_3_months", 3), ("date_in_6_months", 6), ("date_in_12_months", 12)];

fn months_for(option: &str) -> Option<i32> {
    MONTHS_BY_OPTION.iter().find(|(k, _)| *k == option).map(|(_, m)| *m)
}

/// `getMatchingTargetDateOption`: the "in N months" option the date falls on, if any.
fn matching_target_date_option(target: &str) -> Option<&'static str> {
    let target = parse(target)?;
    MONTHS_BY_OPTION
        .iter()
        .find(|(_, months)| is_same_local_day(target, add_months_js(Local::now(), *months).with_timezone(&Utc)))
        .map(|(k, _)| *k)
}

/// `calculateTargetDate`: from the "can start now" and target date answers.
pub fn calculate_target_date(can_start_now: &str, option: &str, custom: &str) -> Option<String> {
    if can_start_now != "yes" {
        return None;
    }
    if let Some(months) = months_for(option) {
        return Some(to_iso(add_months_js(Local::now(), months).with_timezone(&Utc)));
    }
    if option == "set_another_date" && !custom.is_empty() {
        return parse(custom).map(to_iso);
    }
    None
}

fn goal_status(can_start_now: &str) -> &'static str {
    if can_start_now == "yes" { "ACTIVE" } else { "FUTURE" }
}

fn map_of(pairs: Vec<(&str, Value)>) -> Map {
    pairs.into_iter().map(|(k, v)| (k.into(), v)).collect()
}

fn goal_answers(title: &Value, area: &str, related: &Value, target_date: &Option<String>) -> Map {
    let mut answers = map_of(vec![("title", title.clone()), ("area_of_need", Value::from(area)), ("related_areas_of_need", related.clone())]);
    if let Some(d) = target_date {
        answers.insert("target_date".into(), Value::from(d.as_str()));
    }
    answers
}

fn sorted_join(v: &Value) -> String {
    let mut items: Vec<String> = v.as_array().map(|a| a.iter().map(Value::to_js_string).collect()).unwrap_or_default();
    items.sort();
    items.join(",")
}

/// `hasGoalChanged`: whether the edit changes anything about the saved goal.
fn has_goal_changed(goal: &Value, title: &Value, area: &str, related: &Value, status: &str, target_date: &Option<String>) -> bool {
    let saved_target = goal.get("targetDate");
    let target_changed = match (saved_target.truthy(), target_date) {
        (true, Some(edit)) => match (parse(&saved_target.to_js_string()), parse(edit)) {
            (Some(a), Some(b)) => !is_same_local_day(a, b),
            _ => true,
        },
        (saved, edit) => saved != edit.is_some(),
    };
    !goal.get("title").strict_eq(title)
        || goal.get("areaOfNeed").as_str() != Some(area)
        || goal.get("status").as_str() != Some(status)
        || sorted_join(&goal.get("relatedAreasOfNeed")) != sorted_join(related)
        || target_changed
}

/// `snapshotFromGoal`: the goal as plan history shows it, with `overrides`.
pub fn snapshot_from_goal(goal: &Value, overrides: Vec<(&str, Value)>) -> Value {
    let steps: Vec<Value> = goal
        .get("steps")
        .as_array()
        .map(|a| a.iter().map(|s| obj! { "actor": s.get("actor"), "description": s.get("description"), "status": s.get("status") }).collect())
        .unwrap_or_default();
    let mut snapshot = obj! {
        "status": goal.get("status"),
        "targetDate": goal.get("targetDate"),
        "statusDate": nullish_or(goal.get("statusDate"), || Value::from(now_iso())),
        "areaOfNeed": goal.get("areaOfNeed"),
        "relatedAreasOfNeed": nullish_or(goal.get("relatedAreasOfNeed"), || Value::array(vec![])),
        "steps": steps,
    };
    for (k, v) in overrides {
        snapshot.set(k, v);
    }
    snapshot
}

/// `buildAddNoteCommands`: a note on the goal, creating its NOTES collection in the batch the
/// first time (`@<index>` refers to that command's new UUID).
#[allow(clippy::too_many_arguments)]
pub fn add_note_commands(goal: &Value, batch_index: usize, text: &str, note_type: Option<&str>, created_by: &str, assessment_uuid: &str, user: &Json) -> Vec<Json> {
    let existing = goal.get("notesCollectionUuid");
    let mut commands = vec![];
    if !existing.truthy() {
        commands.push(json!({
            "type": "CreateCollectionCommand",
            "name": "NOTES",
            "parentCollectionItemUuid": goal.get("uuid").to_json(),
            "assessmentUuid": assessment_uuid,
            "user": user,
        }));
    }
    let mut properties = map_of(vec![("created_at", Value::from(now_iso()))]);
    if let Some(t) = note_type {
        properties.insert("type".into(), Value::from(t));
    }
    let collection = if existing.truthy() { existing.to_js_string() } else { format!("@{batch_index}") };
    commands.push(json!({
        "type": "AddCollectionItemCommand",
        "collectionUuid": collection,
        "properties": wrap_all(&properties),
        "answers": wrap_all(&map_of(vec![("note", Value::from(text.trim())), ("created_by", Value::from(created_by))])),
        "timeline": { "type": "NOTE_ADDED", "data": {} },
        "assessmentUuid": assessment_uuid,
        "user": user,
    }));
    commands
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

fn resolve_area_label(slug: &Value, areas: &[Value]) -> Value {
    if !slug.truthy() {
        return Value::from("");
    }
    areas.iter().find(|a| a.get("slug").strict_eq(slug)).map_or_else(|| slug.clone(), |a| a.get("text"))
}

fn child_collections(item: &Value, name: &str) -> Vec<Value> {
    item.get("collections").as_array().map(|a| a.iter().filter(|c| c.get("name").as_str() == Some(name)).cloned().collect()).unwrap_or_default()
}

fn items_of(collections: &[Value]) -> Vec<Value> {
    collections.iter().flat_map(|c| c.get("items").as_array().map(|a| a.to_vec()).unwrap_or_default()).collect()
}

/// `deriveGoalsWithSteps`: the plan's goals with their steps and notes, labelled, with each
/// goal's position among the goals of its status.
pub fn derive_goals_with_steps(assessment: &Value, case_data: &Value, labels: &Value, areas: &[Value]) -> (Vec<Value>, Value) {
    let Some(goals_collection) =
        assessment.get("collections").as_array().and_then(|a| a.iter().find(|c| c.get("name").as_str() == Some("GOALS")).cloned())
    else {
        return (vec![], Value::Undefined);
    };
    let person = case_data.get("name").get("forename").as_str().unwrap_or("Person on probation").to_string();
    let mut goals: Vec<Value> = goals_collection
        .get("items")
        .as_array()
        .map(|a| a.to_vec())
        .unwrap_or_default()
        .iter()
        .enumerate()
        .map(|(index, item)| {
            let answers = unwrap_all(&item.get("answers"));
            let properties = unwrap_all(&item.get("properties"));
            let a = |k: &str| answers.get(k).cloned().unwrap_or_default();
            let p = |k: &str| properties.get(k).cloned().unwrap_or_default();
            let steps_collections = child_collections(item, "STEPS");
            let steps: Vec<Value> = items_of(&steps_collections)
                .iter()
                .map(|step| {
                    let sa = unwrap_all(&step.get("answers"));
                    let sp = unwrap_all(&step.get("properties"));
                    let actor = sa.get("actor").cloned().unwrap_or_default();
                    obj! {
                        "uuid": step.get("uuid"),
                        "actor": actor.clone(),
                        "actorLabel": resolve_actor_label(&actor, labels, &person),
                        "status": sa.get("status").cloned().unwrap_or_default(),
                        "description": sa.get("description").cloned().unwrap_or_default(),
                        "statusDate": sp.get("status_date").cloned().unwrap_or_default(),
                    }
                })
                .collect();
            let notes_collections = child_collections(item, "NOTES");
            let mut notes: Vec<Value> = items_of(&notes_collections)
                .iter()
                .map(|note| {
                    let na = unwrap_all(&note.get("answers"));
                    let np = unwrap_all(&note.get("properties"));
                    obj! {
                        "uuid": note.get("uuid"),
                        "type": np.get("type").cloned().unwrap_or_default(),
                        "note": na.get("note").cloned().unwrap_or_default(),
                        "createdBy": na.get("created_by").cloned().unwrap_or_default(),
                        "createdAt": np.get("created_at").cloned().unwrap_or_default(),
                    }
                })
                .collect();
            notes.sort_by(|x, y| newest_first(&x.get("createdAt").to_js_string(), &y.get("createdAt").to_js_string()));
            let related = nullish_or(a("related_areas_of_need"), || Value::array(vec![]));
            let related_labels: Vec<Value> =
                related.as_array().map(|r| r.iter().map(|s| resolve_area_label(s, areas)).collect()).unwrap_or_default();
            obj! {
                "uuid": item.get("uuid"),
                "title": a("title"),
                "status": p("status"),
                "targetDate": sanitize_date_value(&a("target_date")),
                "statusDate": p("status_date"),
                "areaOfNeed": a("area_of_need"),
                "areaOfNeedLabel": resolve_area_label(&a("area_of_need"), areas),
                "relatedAreasOfNeed": related,
                "relatedAreasOfNeedLabels": related_labels,
                "stepsCollectionUuid": steps_collections.first().map_or(Value::Undefined, |c| c.get("uuid")),
                "steps": steps,
                "notesCollectionUuid": notes_collections.first().map_or(Value::Undefined, |c| c.get("uuid")),
                "notes": notes,
                "collectionIndex": index,
                "isFirstInStatus": false,
                "isLastInStatus": false,
                "achievedBy": p("achieved_by"),
            }
        })
        .collect();
    let statuses: Vec<String> = goals.iter().map(|g| g.get("status").to_js_string()).collect();
    for status in &statuses {
        let positions: Vec<usize> = statuses.iter().enumerate().filter(|(_, s)| *s == status).map(|(i, _)| i).collect();
        if let (Some(&first), Some(&last)) = (positions.first(), positions.last()) {
            goals[first].set("isFirstInStatus", Value::Bool(true));
            goals[last].set("isLastInStatus", Value::Bool(true));
        }
    }
    (goals, goals_collection.get("uuid"))
}

/// `resolveActiveGoalFromRequest`: the goal named by the `:uuid` route parameter.
pub fn active_goal_from_request(ctx: &EffectContext) -> Option<(String, Value)> {
    let uuid = ctx.get_request_param("uuid").to_js_string();
    if uuid.is_empty() || uuid == ":uuid" || uuid == "undefined" {
        return None;
    }
    data_list(ctx, "goals").into_iter().find(|g| g.get("uuid").as_str() == Some(uuid.as_str())).map(|g| (uuid, g))
}

fn set_active_goal(ctx: &EffectContext, uuid: &str, goal: Value) -> ForgeResult<()> {
    ctx.set_data("activeGoal", goal)?;
    ctx.set_data("activeGoalUuid", Value::from(uuid))
}

fn areas() -> Vec<Value> {
    areas_of_need_list().iter().map(Value::from_json).collect()
}

fn sorted_other_areas(areas: &[Value], current: &str) -> Value {
    let mut other: Vec<Value> = areas.iter().filter(|a| a.get("slug").as_str() != Some(current)).cloned().collect();
    other.sort_by_key(|a| a.get("text").to_js_string().to_lowercase());
    Value::array(other)
}

fn active_goal(ctx: &EffectContext, effect: &str) -> Result<Value, ForgeError> {
    let goal = ctx.get_data("activeGoal");
    if goal.get("uuid").truthy() { Ok(goal) } else { Err(internal(format!("Active goal is required for {effect}"))) }
}

fn trimmed_answer(ctx: &EffectContext, key: &str) -> Option<String> {
    match ctx.get_answer(key) {
        Value::String(s) if !s.trim().is_empty() => Some(s.trim().to_string()),
        _ => None,
    }
}

fn str_or_undefined(v: &Option<String>) -> Value {
    v.as_ref().map_or(Value::Undefined, |s| Value::from(s.as_str()))
}

// ----- goal telemetry -----

fn normalise(text: &str) -> String {
    let lower = text.to_lowercase().replace('\u{2019}', "'");
    lower.split_whitespace().collect::<Vec<_>>().join(" ")
}

fn hash_goal_text(text: &str) -> String {
    Sha256::digest(normalise(text).as_bytes()).iter().map(|b| format!("{b:02x}")).collect()
}

fn tokenise(text: &str) -> Vec<String> {
    let cleaned: String = text.chars().map(|c| if c.is_ascii_lowercase() || c.is_ascii_digit() || "' -".contains(c) { c } else { ' ' }).collect();
    cleaned.split_whitespace().map(str::to_string).collect()
}

fn match_percentage(submitted: &str, template: &str) -> u32 {
    let (submitted, template) = (normalise(submitted), normalise(template));
    if submitted == template {
        return 100;
    }
    let skeleton = regex::Regex::new(r"\[.*?\]").expect("regex").replace_all(&template, " ").to_string();
    let words = tokenise(&skeleton);
    if words.is_empty() {
        return 0;
    }
    let submitted_words: std::collections::HashSet<String> = tokenise(&submitted).into_iter().collect();
    let matching = words.iter().filter(|w| submitted_words.contains(*w)).count();
    (((matching as f64 / words.len() as f64) * 100.0).round() as u32).min(99)
}

fn rating(percentage: u32) -> Option<&'static str> {
    match percentage {
        100.. => Some("exact"),
        85.. => Some("high"),
        60.. => Some("partial"),
        40.. => Some("low"),
        _ => None,
    }
}

/// `matchSuggestedGoal`: the closest suggested goal (title, rating, percentage).
fn match_suggested_goal(title: &str, suggested: &[String]) -> (Option<String>, Option<&'static str>, u32) {
    if title.is_empty() || suggested.is_empty() {
        return (None, None, 0);
    }
    let mut best: (Option<String>, Option<&'static str>, u32) = (None, None, 0);
    for template in suggested {
        let p = match_percentage(title, template);
        if p > best.2 {
            best = (Some(template.clone()), rating(p), p);
        }
    }
    if best.1.is_none() { (None, None, best.2) } else { best }
}

fn goal_match_properties(title: &str, area: &str) -> serde_json::Map<String, Json> {
    let suggested: Vec<String> = areas_of_need_list()
        .iter()
        .find(|a| a["slug"] == area)
        .and_then(|a| a["goals"].as_array())
        .map(|g| g.iter().filter_map(Json::as_str).map(str::to_string).collect())
        .unwrap_or_default();
    let (suggested_title, rating, percentage) = match_suggested_goal(title, &suggested);
    let mut props = serde_json::Map::new();
    props.insert("goalTitleHash".into(), json!(hash_goal_text(title)));
    props.insert("suggestedGoalMatch".into(), json!(rating.unwrap_or("no match")));
    props.insert("suggestedGoalMatchPercentage".into(), json!(percentage.to_string()));
    props.insert(
        "suggestedGoalTitle".into(),
        json!(if matches!(rating, Some("exact" | "high")) { suggested_title.unwrap_or_default() } else { "N/A".into() }),
    );
    props
}

// ----- effects -----

pub fn entries(deps: &Arc<SentencePlanEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        register_effect!("deriveGoalsWithStepsFromAssessment", |ctx, args| {
            let (goals, uuid) = derive_goals_with_steps(
                &ctx.get_data("assessment"),
                &ctx.get_data("caseData"),
                &ctx.get_data("actorLabels"),
                &data_list(&ctx, "areasOfNeed"),
            );
            ctx.set_data("goals", Value::array(goals))?;
            ctx.set_data("goalsCollectionUuid", uuid)
        }),
        register_effect!("createGoal", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "createGoal")?;
            let area = ctx.get_request_param("areaOfNeed");
            if !area.truthy() {
                return Err(bad_request("Area of need is required to create a goal"));
            }
            let area = area.to_js_string();
            let title = ctx.get_answer("goal_title");
            let related = nullish_or(ctx.get_answer("related_areas_of_need"), || Value::array(vec![]));
            let can_start_now = ctx.get_answer("can_start_now").to_js_string();
            let option_value = ctx.get_answer("target_date_option");
            let option = if option_value.is_nullish() { String::new() } else { option_value.to_js_string() };
            let custom = ctx.get_answer("custom_target_date");
            let custom = if custom.is_nullish() { String::new() } else { custom.to_js_string() };
            let target_date = calculate_target_date(&can_start_now, &option, &custom);
            let status = goal_status(&can_start_now);

            let mut collection_uuid = ctx.get_data("goalsCollectionUuid").as_str().map(str::to_string);
            if collection_uuid.is_none() {
                let created = deps
                    .api
                    .execute_command(json!({ "type": "CreateCollectionCommand", "name": "GOALS", "assessmentUuid": assessment_uuid, "user": user }))
                    .await
                    .map_err(ForgeError::from)?;
                collection_uuid = created.get("collectionUuid").and_then(Json::as_str).map(str::to_string);
            }
            let status_date = now_iso();
            let properties = map_of(vec![("status", Value::from(status)), ("status_date", Value::from(status_date.as_str()))]);
            let added = deps
                .api
                .execute_command(json!({
                    "type": "AddCollectionItemCommand",
                    "collectionUuid": collection_uuid,
                    "properties": wrap_all(&properties),
                    "answers": wrap_all(&goal_answers(&title, &area, &related, &target_date)),
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }))
                .await
                .map_err(ForgeError::from)?;
            let goal_uuid = added.get("collectionItemUuid").and_then(Json::as_str).unwrap_or_default().to_string();
            ctx.set_data("activeGoalUuid", Value::from(goal_uuid.as_str()))?;
            let snapshot = obj! {
                "status": status,
                "targetDate": str_or_undefined(&target_date),
                "statusDate": status_date.as_str(),
                "areaOfNeed": area.as_str(),
                "relatedAreasOfNeed": related.clone(),
                "steps": Value::array(vec![]),
            };
            deps.api
                .execute_command(json!({
                    "type": "UpdateCollectionItemPropertiesCommand",
                    "collectionItemUuid": goal_uuid,
                    "added": {},
                    "removed": [],
                    "timeline": {
                        "type": "GOAL_CREATED",
                        "data": {
                            "goalUuid": goal_uuid,
                            "goalTitle": title.to_json(),
                            "createdBy": practitioner_name(&ctx, &user),
                            "goalSnapshot": snapshot.to_json(),
                        },
                    },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }))
                .await
                .map_err(ForgeError::from)?;
            let related_list: Vec<String> = related.as_array().map(|a| a.iter().map(Value::to_js_string).collect()).unwrap_or_default();
            let mut props = serde_json::Map::new();
            props.insert("assessmentUuid".into(), json!(assessment_uuid));
            props.insert("goalUuid".into(), json!(goal_uuid));
            props.insert("goalStatus".into(), json!(status));
            props.insert("areaOfNeed".into(), json!(area));
            props.insert("isRelatedToOtherAreas".into(), json!(if related_list.is_empty() { "no" } else { "yes" }));
            props.insert("relatedAreasOfNeed".into(), json!(related_list.join(",")));
            props.insert("relatedAreasCount".into(), json!(related_list.len().to_string()));
            props.insert("targetDateOption".into(), json!(option));
            props.insert("targetDate".into(), json!(target_date.clone().unwrap_or_default()));
            props.extend(goal_match_properties(&title.to_js_string(), &area));
            track_business_event(&ctx, "CREATE_GOAL_PAGE_SUBMITTED", Json::Object(props));
            publish_goals_added_event(&deps, &ctx, &goal_uuid).await;
            Ok(())
        }),
        // The goal named in the URL, and its saved steps for the step editor.
        register_effect!("setActiveGoalContext", |ctx, args| {
            let Some((uuid, goal)) = active_goal_from_request(&ctx) else { return Ok(()) };
            let steps: Vec<Value> = goal
                .get("steps")
                .as_array()
                .map(|a| {
                    a.iter()
                        .map(|s| obj! { "id": s.get("uuid"), "actor": s.get("actor"), "description": s.get("description"), "status": s.get("status") })
                        .collect()
                })
                .unwrap_or_default();
            set_active_goal(&ctx, &uuid, goal)?;
            if !steps.is_empty() {
                ctx.set_data("activeGoalStepsOriginal", Value::array(steps))?;
            }
            Ok(())
        }),
        register_effect!("setAreaDataFromActiveGoal", |ctx, args| {
            let goal = ctx.get_data("activeGoal");
            let areas = data_list(&ctx, "areasOfNeed");
            if !goal.truthy() || areas.is_empty() {
                return Ok(());
            }
            let current = areas.iter().find(|a| a.get("slug").strict_eq(&goal.get("areaOfNeed"))).cloned().unwrap_or(Value::Undefined);
            ctx.set_data("currentAreaOfNeed", current)
        }),
        register_effect!("setAreaDataFromUrlParam", |ctx, args| {
            let slug = ctx.get_request_param("areaOfNeed");
            let areas = data_list(&ctx, "areasOfNeed");
            if areas.is_empty() || !slug.truthy() {
                return Ok(());
            }
            let slug = slug.to_js_string();
            ctx.set_data("areaOfNeedSlugs", Value::array(areas.iter().map(|a| a.get("slug")).collect()))?;
            ctx.set_data(
                "currentAreaOfNeed",
                areas.iter().find(|a| a.get("slug").as_str() == Some(slug.as_str())).cloned().unwrap_or(Value::Undefined),
            )?;
            ctx.set_data("otherAreasOfNeed", sorted_other_areas(&areas, &slug))
        }),
        // The goal for the change goal page, its answers pre-filled. A pending area of need
        // (`?area=`, from "Change area of need") is shown but not saved until the goal is.
        register_effect!("loadActiveGoalForEdit", |ctx, args| {
            let areas = data_list(&ctx, "areasOfNeed");
            let Some((uuid, goal)) = active_goal_from_request(&ctx) else { return Ok(()) };
            let pending = ctx.get_query_param("area");
            let pending = pending.as_str().map(str::to_string);
            let saved_area = goal.get("areaOfNeed").to_js_string();
            let effective = match &pending {
                Some(p) if !p.is_empty() && areas.iter().any(|a| a.get("slug").as_str() == Some(p.as_str())) => p.clone(),
                _ => saved_area.clone(),
            };
            let current = areas.iter().find(|a| a.get("slug").as_str() == Some(effective.as_str())).cloned().unwrap_or(Value::Undefined);
            ctx.set_data("currentAreaOfNeed", current)?;
            ctx.set_data("otherAreasOfNeed", sorted_other_areas(&areas, &effective))?;
            set_active_goal(&ctx, &uuid, goal.clone())?;
            ctx.set_answer("goal_title", goal.get("title"))?;
            let related: Vec<Value> = goal
                .get("relatedAreasOfNeed")
                .as_array()
                .map(|a| a.iter().filter(|s| s.as_str() != Some(effective.as_str())).cloned().collect())
                .unwrap_or_default();
            let area_changed = pending.as_ref().is_some_and(|p| *p != saved_area);
            if !related.is_empty() {
                ctx.set_answer("is_related_to_other_areas", Value::from("yes"))?;
                ctx.set_answer("related_areas_of_need", Value::array(related))?;
            } else if !area_changed {
                ctx.set_answer("is_related_to_other_areas", Value::from("no"))?;
            }
            let active = goal.get("status").as_str() == Some("ACTIVE");
            ctx.set_answer("can_start_now", Value::from(if active { "yes" } else { "no" }))?;
            let target = goal.get("targetDate");
            if active && target.truthy() {
                let Some(date) = parse(&target.to_js_string()) else { return Ok(()) };
                match matching_target_date_option(&target.to_js_string()) {
                    Some(option) => ctx.set_answer("target_date_option", Value::from(option))?,
                    None => {
                        ctx.set_answer("target_date_option", Value::from("set_another_date"))?;
                        let local: DateTime<Local> = date.with_timezone(&Local);
                        ctx.set_answer("custom_target_date", Value::from(local.format("%d/%m/%Y").to_string()))?;
                    }
                }
            }
            Ok(())
        }),
        register_effect!("updateActiveGoal", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "updateActiveGoal")?;
            let goal = active_goal(&ctx, "updateActiveGoal")?;
            let title = ctx.get_answer("goal_title");
            let related_answer = ctx.get_answer("is_related_to_other_areas");
            let can_start_now = ctx.get_answer("can_start_now").to_js_string();
            let option = ctx.get_answer("target_date_option");
            let option = if option.is_nullish() { String::new() } else { option.to_js_string() };
            let custom = ctx.get_answer("custom_target_date");
            let custom = if custom.is_nullish() { String::new() } else { custom.to_js_string() };
            let pending = ctx.get_query_param("area").as_str().map(str::to_string);
            let area = match pending {
                Some(p) if !p.is_empty() && areas().iter().any(|a| a.get("slug").as_str() == Some(p.as_str())) => p,
                _ => goal.get("areaOfNeed").to_js_string(),
            };
            let related_list: Vec<Value> = if related_answer.as_str() == Some("yes") {
                ctx.get_answer("related_areas_of_need").as_array().map(|a| a.to_vec()).unwrap_or_default()
            } else {
                vec![]
            };
            let related = Value::array(related_list.into_iter().filter(|a| a.as_str() != Some(area.as_str())).collect());
            let target_date = calculate_target_date(&can_start_now, &option, &custom);
            let status = goal_status(&can_start_now);
            let changed = has_goal_changed(&goal, &title, &area, &related, status, &target_date);
            ctx.set_data("activeGoalChanged", Value::Bool(changed))?;
            let status_date = now_iso();
            let properties = map_of(vec![("status", Value::from(status)), ("status_date", Value::from(status_date.as_str()))]);
            let snapshot = snapshot_from_goal(
                &goal,
                vec![
                    ("status", Value::from(status)),
                    ("statusDate", Value::from(status_date.as_str())),
                    ("targetDate", str_or_undefined(&target_date)),
                    ("relatedAreasOfNeed", related.clone()),
                    ("areaOfNeed", Value::from(area.as_str())),
                ],
            );
            let removed: Vec<&str> = if target_date.is_some() { vec![] } else { vec!["target_date"] };
            let goal_uuid = goal.get("uuid").to_json();
            let commands = vec![
                json!({
                    "type": "UpdateCollectionItemAnswersCommand",
                    "collectionItemUuid": goal_uuid,
                    "added": wrap_all(&goal_answers(&title, &area, &related, &target_date)),
                    "removed": removed,
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }),
                json!({
                    "type": "UpdateCollectionItemPropertiesCommand",
                    "collectionItemUuid": goal_uuid,
                    "added": wrap_all(&properties),
                    "removed": [],
                    "timeline": {
                        "type": "GOAL_UPDATED",
                        "data": {
                            "goalUuid": goal_uuid,
                            "goalTitle": title.to_json(),
                            "updatedBy": practitioner_name(&ctx, &user),
                            "goalSnapshot": snapshot.to_json(),
                        },
                    },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }),
            ];
            if changed {
                deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            }
            let saved_area = goal.get("areaOfNeed").to_js_string();
            let mut props = serde_json::Map::new();
            props.insert("assessmentUuid".into(), json!(assessment_uuid));
            props.insert("goalUuid".into(), goal_uuid);
            props.insert("goalStatus".into(), json!(status));
            props.insert("areaOfNeed".into(), json!(saved_area));
            props.extend(goal_match_properties(&title.to_js_string(), &saved_area));
            track_business_event(&ctx, "UPDATE_GOAL_PAGE_SUBMITTED", Json::Object(props));
            Ok(())
        }),
        // Saves step status changes and a progress note from "Update goal and steps".
        register_effect!("updateGoalProgress", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "updateGoalProgress")?;
            let goal = active_goal(&ctx, "updateGoalProgress")?;
            let practitioner = practitioner_name(&ctx, &user);
            let notes = trimmed_answer(&ctx, "progress_notes");
            let steps = goal.get("steps").as_array().map(|a| a.to_vec()).unwrap_or_default();
            let new_status = |i: usize| ctx.get_answer(&format!("step_status_{i}"));
            let mut commands = vec![];
            let mut status_changes = false;
            for (i, step) in steps.iter().enumerate() {
                let status = new_status(i);
                if status.truthy() && !status.strict_eq(&step.get("status")) {
                    status_changes = true;
                    commands.push(json!({
                        "type": "UpdateCollectionItemAnswersCommand",
                        "collectionItemUuid": step.get("uuid").to_json(),
                        "added": wrap_all(&map_of(vec![("status", status.clone())])),
                        "removed": [],
                        "assessmentUuid": assessment_uuid,
                        "user": user,
                    }));
                    commands.push(json!({
                        "type": "UpdateCollectionItemPropertiesCommand",
                        "collectionItemUuid": step.get("uuid").to_json(),
                        "added": wrap_all(&map_of(vec![("status_date", Value::from(now_iso()))])),
                        "removed": [],
                        "assessmentUuid": assessment_uuid,
                        "user": user,
                    }));
                }
            }
            if let Some(text) = &notes {
                let batch_index = commands.len();
                commands.extend(add_note_commands(&goal, batch_index, text, None, &practitioner, &assessment_uuid, &user));
            }
            if status_changes || notes.is_some() {
                let post_update: Vec<Value> = steps
                    .iter()
                    .enumerate()
                    .map(|(i, s)| {
                        let status = new_status(i);
                        let status = if matches!(&status, Value::String(v) if !v.is_empty()) { status } else { s.get("status") };
                        obj! { "actor": s.get("actor"), "description": s.get("description"), "status": status }
                    })
                    .collect();
                let snapshot = snapshot_from_goal(&goal, vec![("steps", Value::array(post_update))]);
                commands.push(json!({
                    "type": "UpdateCollectionItemPropertiesCommand",
                    "collectionItemUuid": goal.get("uuid").to_json(),
                    "added": {},
                    "removed": [],
                    "timeline": {
                        "type": "GOAL_UPDATED",
                        "data": {
                            "goalUuid": goal.get("uuid").to_json(),
                            "goalTitle": goal.get("title").to_json(),
                            "updatedBy": practitioner,
                            "notes": notes,
                            "goalSnapshot": snapshot.to_json(),
                        },
                    },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            if !commands.is_empty() {
                deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            }
            if status_changes || notes.is_some() {
                track_business_event(
                    &ctx,
                    "UPDATE_STEP_PROGRESS_PAGE_SUBMITTED",
                    json!({ "assessmentUuid": assessment_uuid, "goalUuid": goal.get("uuid").to_json(), "hasProgressNotes": notes.is_some() }),
                );
            }
            let all_completed = !steps.is_empty() && (0..steps.len()).all(|i| new_status(i).as_str() == Some("COMPLETED"));
            ctx.set_data("allStepsCompleted", Value::Bool(all_completed))
        }),
        register_effect!("markGoalAsAchieved", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "markGoalAsAchieved")?;
            let goal = active_goal(&ctx, "markGoalAsAchieved")?;
            let practitioner = practitioner_name(&ctx, &user);
            let how_helped = trimmed_answer(&ctx, "how_helped");
            let status_date = now_iso();
            let snapshot = snapshot_from_goal(&goal, vec![("status", Value::from("ACHIEVED")), ("statusDate", Value::from(status_date.as_str()))]);
            let mut commands = vec![json!({
                "type": "UpdateCollectionItemPropertiesCommand",
                "collectionItemUuid": goal.get("uuid").to_json(),
                "added": wrap_all(&map_of(vec![
                    ("status", Value::from("ACHIEVED")),
                    ("status_date", Value::from(status_date.as_str())),
                    ("achieved_by", Value::from(practitioner.as_str())),
                ])),
                "removed": [],
                "timeline": {
                    "type": "GOAL_ACHIEVED",
                    "data": {
                        "goalUuid": goal.get("uuid").to_json(),
                        "goalTitle": goal.get("title").to_json(),
                        "achievedBy": practitioner,
                        "notes": how_helped,
                        "goalSnapshot": snapshot.to_json(),
                    },
                },
                "assessmentUuid": assessment_uuid,
                "user": user,
            })];
            if let Some(text) = &how_helped {
                commands.extend(add_note_commands(&goal, commands.len(), text, Some("ACHIEVED"), &practitioner, &assessment_uuid, &user));
            }
            deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            track_business_event(&ctx, "ACHIEVE_GOAL_PAGE_SUBMITTED", json!({ "assessmentUuid": assessment_uuid, "goalUuid": goal.get("uuid").to_json() }));
            publish_goals_completed_event(&deps, &ctx, &goal.get("uuid").to_js_string()).await;
            Ok(())
        }),
        register_effect!("markGoalAsRemoved", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "markGoalAsRemoved")?;
            let goal = active_goal(&ctx, "markGoalAsRemoved")?;
            let practitioner = practitioner_name(&ctx, &user);
            let note = trimmed_answer(&ctx, "removal_note");
            let status_date = now_iso();
            let snapshot = snapshot_from_goal(
                &goal,
                vec![("status", Value::from("REMOVED")), ("statusDate", Value::from(status_date.as_str())), ("targetDate", Value::Undefined)],
            );
            let goal_uuid = goal.get("uuid").to_json();
            let mut commands = vec![
                json!({
                    "type": "UpdateCollectionItemPropertiesCommand",
                    "collectionItemUuid": goal_uuid,
                    "added": wrap_all(&map_of(vec![("status", Value::from("REMOVED")), ("status_date", Value::from(status_date.as_str()))])),
                    "removed": [],
                    "timeline": {
                        "type": "GOAL_REMOVED",
                        "data": {
                            "goalUuid": goal_uuid,
                            "goalTitle": goal.get("title").to_json(),
                            "removedBy": practitioner,
                            "reason": note,
                            "goalSnapshot": snapshot.to_json(),
                        },
                    },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }),
                json!({
                    "type": "UpdateCollectionItemAnswersCommand",
                    "collectionItemUuid": goal_uuid,
                    "added": {},
                    "removed": ["target_date"],
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }),
            ];
            if let Some(text) = &note {
                commands.extend(add_note_commands(&goal, commands.len(), text, Some("REMOVED"), &practitioner, &assessment_uuid, &user));
            }
            deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            track_business_event(&ctx, "REMOVE_GOAL_PAGE_SUBMITTED", json!({ "assessmentUuid": assessment_uuid, "goalUuid": goal_uuid }));
            publish_goals_completed_event(&deps, &ctx, &goal.get("uuid").to_js_string()).await;
            Ok(())
        }),
        // Puts a removed goal back in the plan, at the bottom.
        register_effect!("readdGoalToPlan", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "readdGoalToPlan")?;
            let goal = active_goal(&ctx, "readdGoalToPlan")?;
            let practitioner = practitioner_name(&ctx, &user);
            let can_start_now = ctx.get_answer("can_start_now").to_js_string();
            let option = ctx.get_answer("target_date_option");
            let option = if option.is_nullish() { String::new() } else { option.to_js_string() };
            let custom = ctx.get_answer("custom_target_date");
            let custom = if custom.is_nullish() { String::new() } else { custom.to_js_string() };
            let note = trimmed_answer(&ctx, "readd_note");
            let target_date = calculate_target_date(&can_start_now, &option, &custom);
            let status = goal_status(&can_start_now);
            let status_date = now_iso();
            let snapshot = snapshot_from_goal(
                &goal,
                vec![("status", Value::from(status)), ("statusDate", Value::from(status_date.as_str())), ("targetDate", str_or_undefined(&target_date))],
            );
            let goal_uuid = goal.get("uuid").to_json();
            let mut commands = vec![json!({
                "type": "UpdateCollectionItemPropertiesCommand",
                "collectionItemUuid": goal_uuid,
                "added": wrap_all(&map_of(vec![("status", Value::from(status)), ("status_date", Value::from(status_date.as_str()))])),
                "removed": [],
                "timeline": {
                    "type": "GOAL_READDED",
                    "data": {
                        "goalUuid": goal_uuid,
                        "goalTitle": goal.get("title").to_json(),
                        "readdedBy": practitioner,
                        "reason": note,
                        "goalSnapshot": snapshot.to_json(),
                    },
                },
                "assessmentUuid": assessment_uuid,
                "user": user,
            })];
            if let Some(date) = &target_date {
                commands.push(json!({
                    "type": "UpdateCollectionItemAnswersCommand",
                    "collectionItemUuid": goal_uuid,
                    "added": wrap_all(&map_of(vec![("target_date", Value::from(date.as_str()))])),
                    "removed": [],
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            if let Some(text) = &note {
                commands.extend(add_note_commands(&goal, commands.len(), text, Some("READDED"), &practitioner, &assessment_uuid, &user));
            }
            let goals = data_list(&ctx, "goals");
            if goals.len() > 1 {
                let max_index = goals.iter().filter_map(|g| g.get("collectionIndex").as_f64()).fold(f64::MIN, f64::max);
                if goal.get("collectionIndex").as_f64().is_some_and(|i| i < max_index) {
                    commands.push(json!({
                        "type": "ReorderCollectionItemCommand",
                        "collectionItemUuid": goal_uuid,
                        "index": max_index as i64,
                        "assessmentUuid": assessment_uuid,
                        "user": user,
                    }));
                }
            }
            deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            track_business_event(&ctx, "READD_GOAL_PAGE_SUBMITTED", json!({ "assessmentUuid": assessment_uuid, "goalUuid": goal_uuid }));
            publish_goals_added_event(&deps, &ctx, &goal.get("uuid").to_js_string()).await;
            Ok(())
        }),
        register_effect!("deleteActiveGoal", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "deleteActiveGoal")?;
            let goal = active_goal(&ctx, "deleteActiveGoal")?;
            let goal_uuid = goal.get("uuid").to_json();
            deps.api
                .execute_command(json!({
                    "type": "RemoveCollectionItemCommand",
                    "collectionItemUuid": goal_uuid,
                    "timeline": { "type": "GOAL_DELETED", "data": { "goalUuid": goal_uuid } },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }))
                .await
                .map_err(ForgeError::from)?;
            track_business_event(&ctx, "DELETE_GOAL_PAGE_SUBMITTED", json!({ "assessmentUuid": assessment_uuid, "goalUuid": goal_uuid }));
            Ok(())
        }),
        // Moves a goal up or down among the goals of its status (`?goalUuid=&direction=`).
        register_effect!("reorderGoal", deps, |ctx, args| {
            let goal_uuid = ctx.get_query_param("goalUuid");
            let direction = ctx.get_query_param("direction");
            if !goal_uuid.truthy() || !direction.truthy() {
                return Ok(());
            }
            let (user, assessment_uuid) = required_context(&ctx, "reorderGoal")?;
            let goals = data_list(&ctx, "goals");
            let Some(goal) = goals.iter().find(|g| g.get("uuid").strict_eq(&goal_uuid)) else { return Ok(()) };
            let mut same_status: Vec<&Value> = goals.iter().filter(|g| g.get("status").strict_eq(&goal.get("status"))).collect();
            same_status.sort_by(|a, b| {
                a.get("collectionIndex").as_f64().unwrap_or(0.0).total_cmp(&b.get("collectionIndex").as_f64().unwrap_or(0.0))
            });
            let Some(index) = same_status.iter().position(|g| g.get("uuid").strict_eq(&goal_uuid)) else { return Ok(()) };
            let adjacent = if direction.as_str() == Some("up") { index.checked_sub(1) } else { Some(index + 1) };
            let Some(adjacent) = adjacent.and_then(|i| same_status.get(i)) else { return Ok(()) };
            deps.api
                .execute_command(json!({
                    "type": "ReorderCollectionItemCommand",
                    "collectionItemUuid": goal.get("uuid").to_json(),
                    "index": adjacent.get("collectionIndex").to_json(),
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }))
                .await
                .map_err(ForgeError::from)?;
            Ok(())
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn goal_matching_strips_placeholders() {
        let suggested = vec!["I will find a job, so that [add why]".to_string()];
        let (title, rating, percentage) = match_suggested_goal("I will find a job, so that I can pay rent", &suggested);
        assert_eq!(percentage, 99);
        assert_eq!(rating, Some("high"));
        assert_eq!(title.as_deref(), Some("I will find a job, so that [add why]"));
        assert_eq!(match_suggested_goal("I will find a job, so that [add why]", &suggested).2, 100);
        assert_eq!(match_suggested_goal("Something else entirely", &suggested).1, None);
    }

    #[test]
    fn goals_are_derived_with_positions() {
        let wrap = |v: &str| json!({ "type": "Single", "value": v });
        let assessment = Value::from_json(&json!({
            "collections": [{
                "name": "GOALS",
                "uuid": "goals",
                "items": [
                    { "uuid": "g1", "answers": { "title": wrap("A"), "area_of_need": wrap("accommodation") }, "properties": { "status": wrap("ACTIVE") },
                      "collections": [{ "name": "STEPS", "uuid": "s", "items": [
                          { "uuid": "s1", "answers": { "actor": wrap("person_on_probation"), "status": wrap("NOT_STARTED"), "description": wrap("d") }, "properties": {} }
                      ] }] },
                    { "uuid": "g2", "answers": { "title": wrap("B"), "area_of_need": wrap("finances") }, "properties": { "status": wrap("ACTIVE") } },
                ],
            }],
        }));
        let areas: Vec<Value> = areas_of_need_list().iter().map(Value::from_json).collect();
        let case = Value::from_json(&json!({ "name": { "forename": "Sam" } }));
        let (goals, uuid) = derive_goals_with_steps(&assessment, &case, &Value::empty_object(), &areas);
        assert_eq!(uuid.to_js_string(), "goals");
        assert_eq!(goals[0].get("areaOfNeedLabel").to_js_string(), "Accommodation");
        assert_eq!(goals[0].get("steps").get("0").get("actorLabel").to_js_string(), "Sam");
        assert!(goals[0].get("isFirstInStatus").truthy() && !goals[0].get("isLastInStatus").truthy());
        assert!(goals[1].get("isLastInStatus").truthy());
    }
}
