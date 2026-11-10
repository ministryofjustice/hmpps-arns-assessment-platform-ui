//! The v1 form's buttons.

use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::v1::guards::is_edit_mode;
use crate::forms::strengths_and_needs::v1::locales::common_content_for;

pub fn save_button() -> Value {
    block(obj! {
        "variant": "govukButton",
        "text": common_content_for("save_and_continue", []),
        "name": "action",
        "value": "save",
        "visibleWhen": is_edit_mode(),
    })
}

pub fn mark_as_complete_button() -> Value {
    block(obj! {
        "variant": "govukButton",
        "text": common_content_for("mark_as_complete", []),
        "name": "action",
        "value": "save",
        "visibleWhen": is_edit_mode(),
    })
}

pub fn go_to_practitioner_analysis_button(section_summary_path: &str) -> Value {
    go_to_practitioner_analysis_button_anchored(section_summary_path, "practitioner-analysis")
}

pub fn go_to_practitioner_analysis_button_anchored(section_summary_path: &str, anchor: &str) -> Value {
    govuk::LINK_BUTTON.build(obj! {
        "text": common_content_for("go_to_practitioner_analysis", []),
        "href": format!("{section_summary_path}#{anchor}"),
        "classes": "govuk-button--secondary",
        "visibleWhen": is_edit_mode(),
    })
}
