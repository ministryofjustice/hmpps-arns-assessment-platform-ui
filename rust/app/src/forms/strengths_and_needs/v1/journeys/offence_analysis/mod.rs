//! Offence analysis:
//! offence-analysis → (one or more people) → victim (create) → victim summary → (add another)
//! victim … → involved parties → impact → summary; otherwise straight to involved parties.

pub mod constants;
pub mod section;
pub mod steps;

use constants::{question, step};
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::constants::collection::Collection;
use crate::forms::strengths_and_needs::v1::constants::section::OFFENCE_ANALYSIS as SECTION;
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, redirect_to_analysis_if_read_only};
use crate::forms::strengths_and_needs::v1::locales::{section_page_title, section_status_tag};

/// `offence_analysis_victim_edit.templatePath`.
pub const VICTIM_EDIT_TEMPLATE_PATH: &str = "offence-analysis-victim/edit/:itemId";
pub const VICTIM_DELETE_TEMPLATE_PATH: &str = "offence-analysis-victim/delete/:itemId";

/// `victimsCollection`.
pub fn victims_collection() -> &'static Collection {
    static FIELDS: [&str; 5] = [
        question::offence_analysis_victim_relationship,
        question::offence_analysis_victim_relationship_other_details,
        question::offence_analysis_victim_age,
        question::offence_analysis_victim_sex,
        question::offence_analysis_victim_race,
    ];
    static COLLECTION: Collection = Collection { name: "OFFENCE_ANALYSIS_VICTIM", fields: &FIELDS };
    &COLLECTION
}

pub fn journey_() -> Value {
    journey(obj! {
        "code": SECTION.code,
        "title": "Offence analysis",
        "path": SECTION.path,
        "reachability": obj! { "resumeWhen": and(vec![query("resume").matches(condition::equals("true")), is_edit_mode()]) },
        "onAccess": [
            access(obj! { "effects": [effect!("loadAnswersFromCollection", victims_collection().to_value())] }),
            redirect_to_analysis_if_read_only(SECTION.path, step::offence_analysis_summary.path),
        ],
        "view": obj! {
            "locals": obj! { "sectionTitle": section_page_title(&SECTION), "sectionStatusTag": section_status_tag(&SECTION) },
        },
        "steps": [
            steps::offence_analysis_step(),
            steps::victim_summary_step(),
            steps::victim_step(),
            steps::edit_victim_step(),
            steps::involved_parties_step(),
            steps::impact_step(),
            steps::summary_step_(),
        ],
    })
}
