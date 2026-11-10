//! Health and wellbeing:
//! health-wellbeing-status → health-wellbeing-details → health-wellbeing-summary → health-wellbeing-analysis.

pub mod constants;
pub mod section;
pub mod steps;

use constants::step;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::v1::constants::section::HEALTH_AND_WELLBEING as SECTION;
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, redirect_to_analysis_if_read_only};
use crate::forms::strengths_and_needs::v1::locales::{section_page_title, section_status_tag};

pub fn journey_() -> Value {
    journey(obj! {
        "code": SECTION.code,
        "title": section_page_title(&SECTION),
        "path": SECTION.path,
        "reachability": obj! { "resumeWhen": and(vec![query("resume").matches(condition::equals("true")), is_edit_mode()]) },
        "onAccess": [redirect_to_analysis_if_read_only(SECTION.path, step::health_wellbeing_analysis.path)],
        "view": obj! {
            "locals": obj! { "sectionTitle": section_page_title(&SECTION), "sectionStatusTag": section_status_tag(&SECTION) },
        },
        "steps": [
            steps::health_wellbeing_status_step(),
            steps::health_wellbeing_details_step(),
            steps::health_wellbeing_summary_step(),
            steps::health_wellbeing_analysis_step(),
        ],
    })
}
