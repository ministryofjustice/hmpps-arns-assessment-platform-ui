//! Audit hooks for steps.

use super::constants::StepDef;
use super::constants::section::SectionConfig;
use crate::effect;
use crate::forms::dsl::*;

/// Which page an event happened on.
fn page_details(section: &SectionConfig, step: &StepDef) -> Value {
    obj! { "section": section.code, "page": step.code }
}

/// For a step's `onAccess`: an audit event on GET.
pub fn audit_page_view(event: &str, section: &SectionConfig, step: &StepDef) -> Value {
    access(obj! {
        "when": request::method().matches(condition::equals("GET")),
        "effects": [effect!("sendAuditEvent", event, page_details(section, step))],
    })
}

/// For a step's `onValid.effects`, after the save effect.
pub fn audit_page_action(event: &str, section: &SectionConfig, step: &StepDef) -> Value {
    effect!("sendAuditEvent", event, page_details(section, step))
}
