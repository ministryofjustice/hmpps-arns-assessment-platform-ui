//! The add/update steps editor, which keeps unsaved rows in the session
//! (`session.stepChanges[goalUuid]`), and reordering steps.

use std::collections::{HashMap, HashSet};
use std::sync::Arc;

use forge_core::{EffectContext, ForgeError, ForgeResult, FunctionEntry, Value, obj};
use serde_json::{Value as Json, json};

use super::dates::now_iso;
use super::goals::snapshot_from_goal;
use super::{SentencePlanEffectsDeps, data_list, practitioner_name, required_context, track_business_event};
use crate::data::wrap_all;
use crate::forms::dsl::{nullish_or, remove_key};
use crate::register_effect;

/// One goal's step edits (`StepChanges`).
#[derive(Clone, Default)]
struct StepChanges {
    steps: Vec<Value>,
    to_create: Vec<String>,
    to_update: Vec<String>,
    to_delete: Vec<String>,
    collection_uuid: Value,
    reordered_draft: Option<Vec<String>>,
}

fn strings(v: &Value) -> Vec<String> {
    v.as_array().map(|a| a.iter().map(Value::to_js_string).collect()).unwrap_or_default()
}

fn string_values(v: &[String]) -> Value {
    Value::array(v.iter().map(|s| Value::from(s.as_str())).collect())
}

impl StepChanges {
    fn from_value(v: &Value) -> Self {
        Self {
            steps: v.get("steps").as_array().map(|a| a.to_vec()).unwrap_or_default(),
            to_create: strings(&v.get("toCreate")),
            to_update: strings(&v.get("toUpdate")),
            to_delete: strings(&v.get("toDelete")),
            collection_uuid: v.get("collectionUuid"),
            reordered_draft: v.get("reorderedStepsDraft").as_array().map(|_| strings(&v.get("reorderedStepsDraft"))),
        }
    }

    fn to_value(&self) -> Value {
        let mut v = obj! {
            "steps": Value::array(self.steps.clone()),
            "toCreate": string_values(&self.to_create),
            "toUpdate": string_values(&self.to_update),
            "toDelete": string_values(&self.to_delete),
            "collectionUuid": self.collection_uuid.clone(),
        };
        if let Some(draft) = &self.reordered_draft {
            v.set("reorderedStepsDraft", string_values(draft));
        }
        v
    }

    fn empty() -> Self {
        Self::default()
    }
}

fn load(ctx: &EffectContext, goal_uuid: &str) -> Option<StepChanges> {
    let v = ctx.get_session().get("stepChanges").get(goal_uuid);
    v.truthy().then(|| StepChanges::from_value(&v))
}

fn store(ctx: &EffectContext, goal_uuid: &str, changes: &StepChanges) {
    let value = changes.to_value();
    ctx.update_session(|s| {
        let mut storage = match s.get("stepChanges") {
            v @ Value::Object(_) => v,
            _ => Value::empty_object(),
        };
        storage.set(goal_uuid, value);
        s.set("stepChanges", storage);
    });
}

fn discard(ctx: &EffectContext, goal_uuid: &str) {
    ctx.update_session(|s| {
        let mut storage = s.get("stepChanges");
        if storage.truthy() {
            remove_key(&mut storage, goal_uuid);
            s.set("stepChanges", storage);
        }
    });
}

fn empty_step(id: &str) -> Value {
    obj! { "id": id, "actor": "", "description": "", "status": "NOT_STARTED" }
}

/// A new step id (`step_<Date.now()>`).
fn new_step_id() -> String {
    format!("step_{}", chrono::Utc::now().timestamp_millis())
}

/// Copies the submitted row values into the session steps (`?? step.x`).
fn capture_answers(ctx: &EffectContext, steps: &mut [Value]) {
    for (i, step) in steps.iter_mut().enumerate() {
        for field in ["actor", "description", "status"] {
            let answer = ctx.get_answer(&format!("step_{field}_{i}"));
            step.set(field, nullish_or(answer, || step.get(field)));
        }
    }
}

/// Exposes the rows to the page and sets their field answers.
fn publish(ctx: &EffectContext, steps: &[Value]) -> ForgeResult<()> {
    ctx.set_data("activeGoalStepsEdited", Value::array(steps.to_vec()))?;
    for (i, step) in steps.iter().enumerate() {
        for field in ["actor", "description", "status"] {
            ctx.set_answer(&format!("step_{field}_{i}"), step.get(field))?;
        }
    }
    Ok(())
}

fn goal_uuid(ctx: &EffectContext) -> Option<String> {
    let v = ctx.get_data("activeGoalUuid");
    v.truthy().then(|| v.to_js_string())
}

fn form_values(ctx: &EffectContext, index: usize) -> (Value, Value, Value) {
    let a = |f: &str| ctx.get_answer(&format!("step_{f}_{index}"));
    (a("actor"), a("description"), a("status"))
}

pub fn entries(deps: &Arc<SentencePlanEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // Starts (or resumes) the editor for the goal: its saved steps, or one empty row. Saved
        // rows are refreshed from the API so edits made elsewhere don't show stale.
        register_effect!("initializeStepEditSession", |ctx, args| {
            let Some(goal_uuid) = goal_uuid(&ctx) else { return Ok(()) };
            let original = data_list(&ctx, "activeGoalStepsOriginal");
            let mut changes = load(&ctx, &goal_uuid).unwrap_or_else(|| {
                if !original.is_empty() {
                    StepChanges {
                        steps: original.clone(),
                        collection_uuid: ctx.get_data("activeGoal").get("stepsCollectionUuid"),
                        ..StepChanges::empty()
                    }
                } else {
                    StepChanges { steps: vec![empty_step("step_0")], to_create: vec!["step_0".into()], ..StepChanges::empty() }
                }
            });
            let new_ids: HashSet<&String> = changes.to_create.iter().collect();
            let by_id: HashMap<String, Value> = original.iter().map(|s| (s.get("id").to_js_string(), s.clone())).collect();
            changes.steps = changes
                .steps
                .iter()
                .map(|s| {
                    let id = s.get("id").to_js_string();
                    if new_ids.contains(&id) { s.clone() } else { by_id.get(&id).cloned().unwrap_or_else(|| s.clone()) }
                })
                .collect();
            store(&ctx, &goal_uuid, &changes);
            publish(&ctx, &changes.steps)
        }),
        register_effect!("discardStepEditSession", |ctx, args| {
            if let Some(goal_uuid) = goal_uuid(&ctx) {
                discard(&ctx, &goal_uuid);
            }
            Ok(())
        }),
        register_effect!("addStepToStepEditSession", |ctx, args| {
            let Some(goal_uuid) = goal_uuid(&ctx) else { return Ok(()) };
            let mut changes = load(&ctx, &goal_uuid).unwrap_or_default();
            capture_answers(&ctx, &mut changes.steps);
            let id = new_step_id();
            changes.steps.push(empty_step(&id));
            changes.to_create.push(id);
            store(&ctx, &goal_uuid, &changes);
            publish(&ctx, &changes.steps)
        }),
        // "Remove" (`remove_<index>`): drops the row, or with one row left, clears it. Saved
        // steps are deleted on save.
        register_effect!("removeStepFromStepEditSession", |ctx, args| {
            let Some(goal_uuid) = goal_uuid(&ctx) else { return Ok(()) };
            let mut changes = load(&ctx, &goal_uuid).unwrap_or_default();
            let action = ctx.get_post_data("action").to_js_string();
            let Ok(index) = action.replacen("remove_", "", 1).parse::<usize>() else {
                store(&ctx, &goal_uuid, &changes);
                return Ok(());
            };
            if index >= changes.steps.len() {
                store(&ctx, &goal_uuid, &changes);
                return Ok(());
            }
            capture_answers(&ctx, &mut changes.steps);
            if changes.steps.len() <= 1 {
                let id = changes.steps[0].get("id").to_js_string();
                if !changes.to_create.contains(&id) {
                    changes.to_delete.push(id);
                }
                let new_id = new_step_id();
                changes.steps[0] = empty_step(&new_id);
                changes.to_create.push(new_id);
            } else {
                let id = changes.steps[index].get("id").to_js_string();
                if !changes.to_create.contains(&id) {
                    changes.to_delete.push(id);
                }
                changes.steps.remove(index);
            }
            store(&ctx, &goal_uuid, &changes);
            publish(&ctx, &changes.steps)
        }),
        // Saves the edited steps in one batch: deletes, updates, creates (making the STEPS
        // collection first if needed, "@0" being its new UUID), a GOAL_UPDATED history event and
        // the new order.
        register_effect!("saveStepEditSession", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "saveStepEditSession")?;
            let goal_uuid = ctx.get_data("activeGoalUuid").to_js_string();
            let goal = ctx.get_data("activeGoal");
            let changes = load(&ctx, &goal_uuid).unwrap_or_default();
            let original = data_list(&ctx, "activeGoalStepsOriginal");
            let original_by_id = |id: &str| original.iter().find(|s| s.get("id").as_str() == Some(id)).cloned().unwrap_or_default();
            let new_ids: HashSet<&String> = changes.to_create.iter().collect();
            let (mut new_steps, mut existing) = (vec![], vec![]);
            for (index, step) in changes.steps.iter().enumerate() {
                let id = step.get("id").to_js_string();
                if new_ids.contains(&id) { new_steps.push(index) } else { existing.push((index, id)) }
            }
            let modified: Vec<&(usize, String)> = existing
                .iter()
                .filter(|(index, id)| {
                    let (actor, description, status) = form_values(&ctx, *index);
                    let o = original_by_id(id);
                    !actor.strict_eq(&o.get("actor")) || !description.strict_eq(&o.get("description")) || !status.strict_eq(&o.get("status"))
                })
                .collect();
            let has_changes = !new_steps.is_empty() || !modified.is_empty() || !changes.to_delete.is_empty();
            let creating_goal = ctx.get_data("navigationReferrer").as_str() == Some("add-goal");
            let mut commands: Vec<Json> = vec![];
            let collection = if changes.collection_uuid.truthy() { changes.collection_uuid.to_js_string() } else { "@0".into() };
            if !new_steps.is_empty() && !changes.collection_uuid.truthy() {
                commands.push(json!({
                    "type": "CreateCollectionCommand",
                    "name": "STEPS",
                    "parentCollectionItemUuid": goal_uuid,
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            for id in &changes.to_delete {
                commands.push(json!({
                    "type": "RemoveCollectionItemCommand",
                    "collectionItemUuid": id,
                    "timeline": { "type": "STEP_REMOVED", "data": {} },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            let answers = |index: usize, order: [&str; 3]| {
                let (actor, description, status) = form_values(&ctx, index);
                let mut m = forge_core::value::Map::new();
                for key in order {
                    let v = match key {
                        "actor" => actor.clone(),
                        "description" => description.clone(),
                        _ => status.clone(),
                    };
                    m.insert(key.into(), v);
                }
                wrap_all(&m)
            };
            let status_date = |now: String| {
                let mut m = forge_core::value::Map::new();
                m.insert("status_date".into(), Value::from(now));
                wrap_all(&m)
            };
            for (index, id) in &modified {
                commands.push(json!({
                    "type": "UpdateCollectionItemAnswersCommand",
                    "collectionItemUuid": id,
                    "added": answers(*index, ["actor", "description", "status"]),
                    "removed": [],
                    "timeline": { "type": "STEP_UPDATED", "data": {} },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
                if !form_values(&ctx, *index).2.strict_eq(&original_by_id(id).get("status")) {
                    commands.push(json!({
                        "type": "UpdateCollectionItemPropertiesCommand",
                        "collectionItemUuid": id,
                        "added": status_date(now_iso()),
                        "removed": [],
                        "assessmentUuid": assessment_uuid,
                        "user": user,
                    }));
                }
            }
            for index in &new_steps {
                commands.push(json!({
                    "type": "AddCollectionItemCommand",
                    "collectionUuid": collection,
                    "properties": status_date(now_iso()),
                    "answers": answers(*index, ["status", "actor", "description"]),
                    "timeline": { "type": "STEP_ADDED", "data": {} },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            if has_changes && goal.get("uuid").truthy() {
                let post_edit: Vec<Value> = (0..changes.steps.len())
                    .map(|i| {
                        let (actor, description, status) = form_values(&ctx, i);
                        obj! { "actor": actor, "description": description, "status": status }
                    })
                    .collect();
                let mut data = json!({
                    "goalUuid": goal.get("uuid").to_json(),
                    "goalTitle": goal.get("title").to_json(),
                    "updatedBy": practitioner_name(&ctx, &user),
                    "goalSnapshot": snapshot_from_goal(&goal, vec![("steps", Value::array(post_edit))]).to_json(),
                });
                if creating_goal {
                    data["isInitialStepAdd"] = json!(true);
                }
                commands.push(json!({
                    "type": "UpdateCollectionItemPropertiesCommand",
                    "collectionItemUuid": goal.get("uuid").to_json(),
                    "added": {},
                    "removed": [],
                    "timeline": { "type": "GOAL_UPDATED", "data": data },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            for (index, id) in &existing {
                commands.push(json!({
                    "type": "ReorderCollectionItemCommand",
                    "collectionItemUuid": id,
                    "index": index,
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            if !commands.is_empty() {
                deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            }
            if has_changes {
                let event = if creating_goal { "ADD_STEPS_PAGE_SUBMITTED" } else { "EDIT_STEPS_PAGE_SUBMITTED" };
                track_business_event(&ctx, event, json!({ "assessmentUuid": assessment_uuid, "goalUuid": goal_uuid }));
            }
            discard(&ctx, &goal_uuid);
            let all_completed = !changes.steps.is_empty() && (0..changes.steps.len()).all(|i| form_values(&ctx, i).2.as_str() == Some("COMPLETED"));
            ctx.set_data("allStepsCompleted", Value::Bool(all_completed))
        }),
        // The reorder page's moves (`moveUp_<i>` / `moveDown_<i>`), kept as a draft order in the
        // session until saved; other actions discard the draft (save keeps it for saving).
        register_effect!("reorderStepsInSession", |ctx, args| {
            let Some(goal_uuid) = goal_uuid(&ctx) else { return Ok(()) };
            let action = ctx.get_post_data("action");
            let action = action.as_str().unwrap_or_default().to_string();
            if action == "saveAndContinue" {
                return Ok(());
            }
            let is_move = action.starts_with("moveUp_") || action.starts_with("moveDown_");
            if !is_move {
                if let Some(mut changes) = load(&ctx, &goal_uuid) {
                    changes.reordered_draft = None;
                    store(&ctx, &goal_uuid, &changes);
                }
                return Ok(());
            }
            let mut goal = ctx.get_data("activeGoal");
            let mut changes = load(&ctx, &goal_uuid).unwrap_or_else(|| StepChanges {
                steps: data_list(&ctx, "activeGoalStepsOriginal"),
                collection_uuid: goal.get("stepsCollectionUuid"),
                ..StepChanges::empty()
            });
            let ids: Vec<String> = changes.steps.iter().map(|s| s.get("id").to_js_string()).collect();
            let mut draft = changes.reordered_draft.clone().unwrap_or(ids);
            let index = action.split('_').nth(1).and_then(|i| i.parse::<usize>().ok());
            let Some(index) = index.filter(|i| *i < draft.len()) else {
                store(&ctx, &goal_uuid, &changes);
                return Ok(());
            };
            let target = if action.starts_with("moveUp_") { index.checked_sub(1) } else { Some(index + 1) };
            let Some(target) = target.filter(|t| *t < draft.len()) else {
                store(&ctx, &goal_uuid, &changes);
                return Ok(());
            };
            draft.swap(index, target);
            changes.reordered_draft = Some(draft.clone());
            store(&ctx, &goal_uuid, &changes);
            if let Some(steps) = goal.get("steps").as_array() {
                let by_uuid: HashMap<String, Value> = steps.iter().map(|s| (s.get("uuid").to_js_string(), s.clone())).collect();
                let reordered: Vec<Value> = draft.iter().filter_map(|id| by_uuid.get(id).cloned()).collect();
                goal.set("steps", Value::array(reordered));
                ctx.set_data("activeGoal", goal)?;
            }
            Ok(())
        }),
        register_effect!("saveReorderedSteps", deps, |ctx, args| {
            let (user, assessment_uuid) = required_context(&ctx, "saveReorderedSteps")?;
            let goal_uuid = ctx.get_data("activeGoalUuid").to_js_string();
            let Some(mut changes) = load(&ctx, &goal_uuid) else { return Ok(()) };
            let Some(draft) = changes.reordered_draft.clone() else { return Ok(()) };
            let original: Vec<String> = changes.steps.iter().map(|s| s.get("id").to_js_string()).collect();
            if draft.iter().enumerate().all(|(i, id)| original.get(i) == Some(id)) {
                changes.reordered_draft = None;
                store(&ctx, &goal_uuid, &changes);
                return Ok(());
            }
            let by_id: HashMap<String, Value> = changes.steps.iter().map(|s| (s.get("id").to_js_string(), s.clone())).collect();
            let reordered: Vec<Value> = draft.iter().filter_map(|id| by_id.get(id).cloned()).collect();
            let mut commands: Vec<Json> = reordered
                .iter()
                .enumerate()
                .map(|(index, step)| {
                    json!({
                        "type": "ReorderCollectionItemCommand",
                        "collectionItemUuid": step.get("id").to_json(),
                        "index": index,
                        "assessmentUuid": assessment_uuid,
                        "user": user,
                    })
                })
                .collect();
            let goal = ctx.get_data("activeGoal");
            if goal.get("uuid").truthy() {
                let steps: Vec<Value> =
                    reordered.iter().map(|s| obj! { "actor": s.get("actor"), "description": s.get("description"), "status": s.get("status") }).collect();
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
                            "updatedBy": practitioner_name(&ctx, &user),
                            "goalSnapshot": snapshot_from_goal(&goal, vec![("steps", Value::array(steps))]).to_json(),
                        },
                    },
                    "assessmentUuid": assessment_uuid,
                    "user": user,
                }));
            }
            if !commands.is_empty() {
                deps.api.execute_commands(commands).await.map_err(ForgeError::from)?;
            }
            changes.steps = reordered;
            changes.reordered_draft = None;
            store(&ctx, &goal_uuid, &changes);
            Ok(())
        }),
    ]
}
