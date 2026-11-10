//! Drug use:
//! drug-use-status → (YES) → types → details → history → summary; (NO) → summary; summary → analysis.

pub mod constants;
pub mod drugs;
pub mod section;
pub mod steps;

use constants::step;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::v1::constants::section::DRUG_USE as SECTION;
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, redirect_to_analysis_if_read_only};
use crate::forms::strengths_and_needs::v1::locales::{section_page_title, section_status_tag};

pub fn journey_() -> Value {
    journey(obj! {
        "code": SECTION.code,
        "title": section_page_title(&SECTION),
        "path": SECTION.path,
        "reachability": obj! { "resumeWhen": and(vec![query("resume").matches(condition::equals("true")), is_edit_mode()]) },
        "onAccess": [redirect_to_analysis_if_read_only(SECTION.path, step::drug_use_analysis.path)],
        "view": obj! {
            "locals": obj! { "sectionTitle": section_page_title(&SECTION), "sectionStatusTag": section_status_tag(&SECTION) },
        },
        "steps": [
            steps::drug_use_status_step(),
            steps::drug_use_types_step(),
            steps::drug_use_details_step(),
            steps::drug_use_history_step(),
            steps::drug_use_summary_step(),
            steps::drug_use_analysis_step(),
        ],
    })
}
