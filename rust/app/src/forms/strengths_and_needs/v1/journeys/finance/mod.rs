//! Finance: finance → finance-summary → finance-analysis.

pub mod constants;
pub mod section;
pub mod steps;

use constants::step;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::v1::constants::section::FINANCE;
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, redirect_to_analysis_if_read_only};
use crate::forms::strengths_and_needs::v1::locales::{section_page_title, section_status_tag};

pub fn journey_() -> Value {
    journey(obj! {
        "code": FINANCE.code,
        "path": FINANCE.path,
        "title": section_page_title(&FINANCE),
        "reachability": obj! { "resumeWhen": and(vec![query("resume").matches(condition::equals("true")), is_edit_mode()]) },
        "onAccess": [redirect_to_analysis_if_read_only(FINANCE.path, step::finance_analysis.path)],
        "view": obj! {
            "locals": obj! {
                "sectionTitle": section_page_title(&FINANCE),
                "sectionStatusTag": section_status_tag(&FINANCE),
            },
        },
        "steps": [steps::finance_step(), steps::finance_summary_step(), steps::finance_analysis_step()],
    })
}
