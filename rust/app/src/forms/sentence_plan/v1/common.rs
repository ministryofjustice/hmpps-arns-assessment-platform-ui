//! Small builders the sentence plan steps share.

use crate::forms::dsl::*;
use crate::{effect, transformer};

/// `Transformer.String.FormatDate({ dateStyle: 'long' })`.
pub fn long_date() -> Value {
    transformer::string::format_date(obj! { "dateStyle": "long" })
}

/// `Transformer.String.FormatDate()`.
pub fn default_date() -> Value {
    transformer!("String.FormatDate")
}

pub fn escape() -> Value {
    transformer::string::escape_html()
}

pub fn strings(values: &[&str]) -> Value {
    Value::array(values.iter().map(|v| Value::from(*v)).collect())
}

/// `Item().path('status').match(Condition.Equals(status))`.
pub fn item_status_is(status: &str) -> Value {
    item().path("status").matches(condition::equals(status))
}

pub fn query_is(key: &str, value: &str) -> Value {
    query(key).matches(condition::equals(value))
}

pub fn post_action_is(value: &str) -> Value {
    post("action").matches(condition::equals(value))
}

pub fn data_is(key: &str, value: impl IntoValue) -> Value {
    data(key).matches(condition::equals(value))
}

pub fn redirect_to(goto: impl IntoValue) -> Value {
    redirect(obj! { "goto": goto })
}

pub fn redirect_when(when: Value, goto: impl IntoValue) -> Value {
    redirect(obj! { "when": when, "goto": goto })
}

/// `SentencePlanEffects.sendAuditEvent(event[, details])`.
pub fn audit(event: &str) -> Value {
    effect!("sendAuditEvent", event)
}

pub fn audit_with(event: &str, details: Value) -> Value {
    effect!("sendAuditEvent", event, details)
}

/// `SentencePlanEffects.addNotification({...})`.
pub fn notify(props: Value) -> Value {
    effect!("addNotification", props)
}

pub fn effects(list: Vec<Value>) -> Value {
    access(obj! { "effects": Value::array(list) })
}

/// A `data-ai-id` attributes object.
pub fn ai_id(id: impl IntoValue) -> Value {
    obj! { "data-ai-id": id }
}

/// The goal-to-plan-overview redirects every goal step falls back to: future goals land on the
/// future tab, everything else on current.
pub fn overview_by_goal_status() -> Vec<Value> {
    vec![
        redirect_when(data_is("activeGoal.status", "FUTURE"), "../../plan/overview?goalStatusTab=future"),
        redirect_to("../../plan/overview?goalStatusTab=current"),
    ]
}

/// A goal card's steps, as the cards take them.
pub fn card_steps(source: Ex) -> Ex {
    source.each(iterator::map(obj! {
        "actor": item().path("actorLabel"),
        "description": item().path("description"),
        "status": item().path("status"),
    }))
}

pub fn card_notes(source: Ex) -> Ex {
    source.each(iterator::map(obj! { "type": item().path("type"), "note": item().path("note") }))
}

/// `Data(...).each(Iterator.Count(status === X))`.
pub fn count_with_status(source: &str, status: &str) -> Ex {
    data(source).each(iterator::count(item_status_is(status)))
}

pub fn some_with_status(source: &str, status: &str) -> Value {
    data(source).each(iterator::some(item_status_is(status))).into()
}

/// A submit handler run on a `when` condition.
pub fn submit_when(when: Value, validate: bool, handler_key: &str, handler: Value) -> Value {
    let mut def = obj! { "when": when, "validate": validate };
    def.set(handler_key, handler);
    submit(def)
}

pub fn handler(effects: Vec<Value>, next: Vec<Value>) -> Value {
    obj! { "effects": Value::array(effects), "next": Value::array(next) }
}
