//! Personal relationships and community:
//! children information → personal relationships → community → summary → analysis.

pub mod constants;
pub mod section;
pub mod steps;

use constants::step;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::v1::constants::section::PERSONAL_RELATIONSHIPS_AND_COMMUNITY as SECTION;
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, redirect_to_analysis_if_read_only};
use crate::forms::strengths_and_needs::v1::locales::{section_page_title, section_status_tag};

pub fn journey_() -> Value {
    journey(obj! {
        "code": SECTION.code,
        "title": section_page_title(&SECTION),
        "path": SECTION.path,
        "reachability": obj! { "resumeWhen": and(vec![query("resume").matches(condition::equals("true")), is_edit_mode()]) },
        "onAccess": [redirect_to_analysis_if_read_only(SECTION.path, step::personal_relationships_community_analysis.path)],
        "view": obj! {
            "locals": obj! { "sectionTitle": section_page_title(&SECTION), "sectionStatusTag": section_status_tag(&SECTION) },
        },
        "steps": [
            steps::children_information_step(),
            steps::personal_relationships_step(),
            steps::personal_relationships_community_step(),
            steps::summary_step_(),
            steps::analysis_step_(),
        ],
    })
}
