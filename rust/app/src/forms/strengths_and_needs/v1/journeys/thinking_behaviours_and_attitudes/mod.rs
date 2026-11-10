//! Thinking, behaviours and attitudes:
//! questions → risk of sexual harm → (YES) details → summary → analysis.

pub mod constants;
pub mod section;
pub mod steps;

use constants::step;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::v1::constants::section::THINKING_BEHAVIOURS_AND_ATTITUDES as SECTION;
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, redirect_to_analysis_if_read_only};
use crate::forms::strengths_and_needs::v1::locales::{section_page_title, section_status_tag};

pub fn journey_() -> Value {
    journey(obj! {
        "code": SECTION.code,
        "path": SECTION.path,
        "title": section_page_title(&SECTION),
        "reachability": obj! { "resumeWhen": and(vec![query("resume").matches(condition::equals("true")), is_edit_mode()]) },
        "onAccess": [redirect_to_analysis_if_read_only(SECTION.path, step::thinking_behaviours_attitudes_analysis.path)],
        "view": obj! {
            "locals": obj! { "sectionTitle": section_page_title(&SECTION), "sectionStatusTag": section_status_tag(&SECTION) },
        },
        "steps": [
            steps::thinking_behaviours_attitudes_step(),
            steps::risk_of_sexual_harm_step(),
            steps::risk_of_sexual_harm_details_step(),
            steps::summary_step_(),
            steps::analysis_step_(),
        ],
    })
}
