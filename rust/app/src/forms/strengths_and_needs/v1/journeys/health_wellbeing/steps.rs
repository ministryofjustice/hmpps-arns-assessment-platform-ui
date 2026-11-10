//! The health wellbeing section's steps.

use super::constants::step;
use super::section::section;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators::create_route;
use crate::forms::strengths_and_needs::v1::constants::buttons::save_button;
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::section::HEALTH_AND_WELLBEING as SECTION;
use crate::forms::strengths_and_needs::v1::locales::section_page_title;
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

pub fn health_wellbeing_status_step() -> Value {
    let s = section();
    step(obj! {
        "path": step::health_wellbeing_status.route(),
        "title": section_page_title(&SECTION),
        "reachability": obj! { "entryWhen": true },
        "blocks": [s.q("healthConditions").field(), s.q("mentalHealthProblems").field(), save_button()],
        "onAccess": question_page_view(&SECTION, &step::health_wellbeing_status),
        "validWhen": user_submitted_valid_when(&step::health_wellbeing_status),
        "onSubmission": question_step_submission(&SECTION, &step::health_wellbeing_status, &step::health_wellbeing_summary, vec![
            redirect(obj! { "goto": step::health_wellbeing_details.path }),
        ]),
    })
}

pub fn health_wellbeing_details_step() -> Value {
    let s = section();
    let mut route = base_san_route();
    route.push(Value::from(SECTION.path));
    let names = [
        "prescribedPhysicalHealthMedicationsTreatments",
        "prescribedMentalHealthMedicationsTreatments",
        "psychiatricTreatment",
        "headInjuries",
        "neurodiverseConditions",
        "impactOnLearningAbilities",
        "copeWithDayToDayLife",
        "attitudeTowardsSelf",
        "selfHarm",
        "suicidalTendencies",
        "feelingsAboutFuture",
        "helpedDuringPeriodsGoodHealthWellbeing",
        "changes",
    ];
    let mut blocks: Vec<Value> = names.iter().map(|n| s.q(n).field()).collect();
    blocks.push(save_button());
    step(obj! {
        "path": step::health_wellbeing_details.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "backlink": create_route(route) } },
        "blocks": blocks,
        "onAccess": question_page_view(&SECTION, &step::health_wellbeing_details),
        "validWhen": user_submitted_valid_when(&step::health_wellbeing_details),
        "onSubmission": question_step_submission(&SECTION, &step::health_wellbeing_details, &step::health_wellbeing_summary, vec![
            redirect(obj! { "goto": step::health_wellbeing_summary.path }),
        ]),
    })
}

pub fn summary() -> Value {
    summary_of(
        section(),
        &[
            "healthConditions",
            "mentalHealthProblems",
            "prescribedPhysicalHealthMedicationsTreatments",
            "prescribedMentalHealthMedicationsTreatments",
            "psychiatricTreatment",
            "headInjuries",
            "neurodiverseConditions",
            "impactOnLearningAbilities",
            "copeWithDayToDayLife",
            "attitudeTowardsSelf",
            "selfHarm",
            "suicidalTendencies",
            "feelingsAboutFuture",
            "helpedDuringPeriodsGoodHealthWellbeing",
            "changes",
        ],
    )
}

pub fn health_wellbeing_summary_step() -> Value {
    let blocks = vec![standard_summary_tab(section(), summary(), &step::health_wellbeing_summary)];
    summary_step(&SECTION, &step::health_wellbeing_summary, &step::health_wellbeing_analysis, blocks, true)
}

pub fn health_wellbeing_analysis_step() -> Value {
    analysis_step(&SECTION, &step::health_wellbeing_analysis, vec![standard_analysis_tab(section(), summary(), &step::health_wellbeing_analysis)])
}
