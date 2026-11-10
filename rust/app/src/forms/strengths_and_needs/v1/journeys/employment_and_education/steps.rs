//! The employment and education section's steps.

use super::constants::step;
use super::section::section;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators::create_route;
use crate::forms::strengths_and_needs::v1::constants::buttons::save_button;
use crate::forms::strengths_and_needs::v1::constants::form_version::SECTION_TITLE_CLASS;
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::section::EMPLOYMENT_AND_EDUCATION as SECTION;
use crate::forms::strengths_and_needs::v1::locales::section_page_title;
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

pub fn employment_status_step() -> Value {
    step(obj! {
        "path": step::employment_status.route(),
        "title": section_page_title(&SECTION),
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "sectionTitleClass": SECTION_TITLE_CLASS } },
        "blocks": [section().q("currentEmploymentStatus").field(), save_button()],
        "onAccess": question_page_view(&SECTION, &step::employment_status),
        "validWhen": user_submitted_valid_when(&step::employment_status),
        "onSubmission": question_step_submission(&SECTION, &step::employment_status, &step::employment_education_summary, vec![
            redirect(obj! { "goto": step::employment_education_details.path }),
        ]),
    })
}

pub fn employment_education_details_step() -> Value {
    let s = section();
    let mut route = base_san_route();
    route.push(Value::from(SECTION.path));
    let names = [
        "employmentSector",
        "employmentHistory",
        "dayToDayCommitments",
        "academicQualification",
        "professionalQualification",
        "jobSkills",
        "difficultiesReadingWritingNumeracy",
        "employmentExperience",
        "educationExperience",
        "changes",
    ];
    let mut blocks: Vec<Value> = names.iter().map(|n| s.q(n).field()).collect();
    blocks.push(save_button());
    step(obj! {
        "path": step::employment_education_details.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "backlink": create_route(route) } },
        "blocks": blocks,
        "onAccess": question_page_view(&SECTION, &step::employment_education_details),
        "validWhen": user_submitted_valid_when(&step::employment_education_details),
        "onSubmission": question_step_submission(&SECTION, &step::employment_education_details, &step::employment_education_summary, vec![
            redirect(obj! { "goto": step::employment_education_summary.path }),
        ]),
    })
}

pub fn summary() -> Value {
    summary_of(
        section(),
        &[
            "currentEmploymentStatus",
            "employmentSector",
            "employmentHistory",
            "dayToDayCommitments",
            "academicQualification",
            "professionalQualification",
            "jobSkills",
            "difficultiesReadingWritingNumeracy",
            "employmentExperience",
            "educationExperience",
            "changes",
        ],
    )
}

pub fn employment_education_summary_step() -> Value {
    let blocks = vec![standard_summary_tab(section(), summary(), &step::employment_education_summary)];
    summary_step_with(
        &SECTION,
        &step::employment_education_summary,
        &step::employment_education_analysis,
        blocks,
        true,
        vec![effect!("setUserSubmitted", step::employment_education_summary.code)],
    )
}

pub fn employment_education_analysis_step() -> Value {
    analysis_step(
        &SECTION,
        &step::employment_education_analysis,
        vec![standard_analysis_tab(section(), summary(), &step::employment_education_analysis)],
    )
}
