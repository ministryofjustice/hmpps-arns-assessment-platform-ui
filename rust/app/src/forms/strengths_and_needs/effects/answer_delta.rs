//! What a submission changed, from the
//! answers' mutation histories.

use forge_core::engine::runtime::context::{AnswerHistory, Answers};
use forge_core::value::Map;
use forge_core::{EffectContext, ForgeResult, Value};

const USER_MUTATION_SOURCES: [&str; 4] = ["post", "processed", "dependentWhen", "action"];

/// The ways Forge empties an answer by itself, without the practitioner doing it.
const SYSTEM_CLEARING_SOURCES: [&str; 2] = ["dependentWhen", "cleardown"];

fn is_user_mutation_source(source: &str) -> bool {
    USER_MUTATION_SOURCES.contains(&source)
}

fn has_existing_persisted_value(history: &AnswerHistory) -> bool {
    history.mutations.iter().any(|m| !m.value.is_undefined() && !is_user_mutation_source(&m.source))
}

fn has_user_mutation(history: &AnswerHistory) -> bool {
    history.mutations.iter().any(|m| is_user_mutation_source(&m.source))
}

/// What the submission adds (current values of user-changed answers) and removes (answers the
/// user emptied that the record holds).
#[derive(Default)]
pub struct AnswerDelta {
    pub added: Map,
    pub removed: Vec<String>,
}

pub fn build_answer_delta(histories: &Answers) -> AnswerDelta {
    let mut delta = AnswerDelta::default();
    for (code, history) in histories {
        if !has_user_mutation(history) {
            continue;
        }
        if history.current.is_undefined() {
            if has_existing_persisted_value(history) {
                delta.removed.push(code.to_string());
            }
            continue;
        }
        delta.added.insert(code.clone(), history.current.clone());
    }
    delta
}

/// The value the record holds: the last mutation that did not come from this submission.
fn persisted_value(history: &AnswerHistory) -> Value {
    history.mutations.iter().rev().find(|m| !is_user_mutation_source(&m.source)).map_or(Value::Undefined, |m| m.value.clone())
}

pub fn stored_answer_of(history: Option<&AnswerHistory>) -> Value {
    history.map_or(Value::Undefined, persisted_value)
}

fn is_same_answer(a: &Value, b: &Value) -> bool {
    match (a, b) {
        (Value::Array(x), Value::Array(y)) => x.len() == y.len() && x.iter().zip(y.iter()).all(|(p, q)| p.strict_eq(q)),
        _ => a.strict_eq(b),
    }
}

/// Codes the user actually changed on this submission.
pub fn build_changed_answer_codes(histories: &Answers) -> Vec<String> {
    histories
        .iter()
        .filter(|(_, h)| has_user_mutation(h))
        .filter(|(_, h)| !is_same_answer(&h.current, &persisted_value(h)))
        .map(|(code, _)| code.to_string())
        .collect()
}

/// Did Forge empty this answer (`dependentWhen` / `cleardown`), rather than the practitioner?
fn was_cleared_by_runtime(history: &AnswerHistory) -> bool {
    history.mutations.last().is_some_and(|m| m.value.is_undefined() && SYSTEM_CLEARING_SOURCES.contains(&m.source.as_ref()))
}

/// What the browser sent for this field on this submission.
fn submitted_value_of(history: &AnswerHistory) -> Value {
    history.mutations.iter().rev().find(|m| m.source.as_ref() == "post").map_or(Value::Undefined, |m| m.value.clone())
}

/// `restoreSuppressedAnswers`: puts back answers a save chose not to delete, so the page shows
/// them (preferring what the browser sent, then the stored value).
pub fn restore_suppressed_answers(ctx: &EffectContext, histories: &Answers, codes: &[String]) -> ForgeResult<()> {
    for code in codes {
        let Some(history) = histories.get(code.as_str()) else { continue };
        if !was_cleared_by_runtime(history) {
            continue;
        }
        let restored = match submitted_value_of(history) {
            Value::Undefined => stored_answer_of(Some(history)),
            v => v,
        };
        if !restored.is_undefined() {
            ctx.set_answer(code, restored)?;
        }
    }
    Ok(())
}

/// `[...new Set(items)]`.
pub fn unique(items: impl IntoIterator<Item = String>) -> Vec<String> {
    let mut out: Vec<String> = Vec::new();
    for item in items {
        if !out.contains(&item) {
            out.push(item);
        }
    }
    out
}
