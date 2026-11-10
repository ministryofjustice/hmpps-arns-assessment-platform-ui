//! Alcohol use:
//! alcohol-use-status → (YES) → alcohol-use-details → alcohol-use-summary;
//! alcohol-use-status → (NO) → alcohol-use-summary; alcohol-use-summary → alcohol-use-analysis.

pub mod constants;
pub mod section;
pub mod steps;

use constants::step;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::v1::constants::section::ALCOHOL_USE;
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, redirect_to_analysis_if_read_only};
use crate::forms::strengths_and_needs::v1::locales::{section_page_title, section_status_tag};

pub fn journey_() -> Value {
    journey(obj! {
        "code": ALCOHOL_USE.code,
        "title": section_page_title(&ALCOHOL_USE),
        "path": ALCOHOL_USE.path,
        "reachability": obj! { "resumeWhen": and(vec![query("resume").matches(condition::equals("true")), is_edit_mode()]) },
        "onAccess": [redirect_to_analysis_if_read_only(ALCOHOL_USE.path, step::alcohol_use_analysis.path)],
        "view": obj! {
            "locals": obj! {
                "sectionTitle": section_page_title(&ALCOHOL_USE),
                "sectionStatusTag": section_status_tag(&ALCOHOL_USE),
            },
        },
        "steps": [
            steps::alcohol_use_status_step(),
            steps::alcohol_use_details_step(),
            steps::alcohol_use_summary_step(),
            steps::alcohol_use_analysis_step(),
        ],
    })
}
