//! The alcohol use section's steps.

use super::constants::{question, step};
use super::section::section;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators::create_route;
use crate::forms::strengths_and_needs::v1::constants::buttons::save_button;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::section::ALCOHOL_USE;
use crate::forms::strengths_and_needs::v1::locales::section_page_title;
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

pub fn alcohol_use_status_step() -> Value {
    let s = section();
    step(obj! {
        "path": step::alcohol_use_status.route(),
        "title": section_page_title(&ALCOHOL_USE),
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "sectionTitleClass": "govuk-body-l" } },
        "blocks": [s.q("alcoholUse").field(), save_button()],
        "onAccess": question_page_view(&ALCOHOL_USE, &step::alcohol_use_status),
        "validWhen": user_submitted_valid_when(&step::alcohol_use_status),
        "onSubmission": question_step_submission(&ALCOHOL_USE, &step::alcohol_use_status, &step::alcohol_use_summary, vec![
            redirect(obj! {
                "when": answer(question::alcohol_use).matches(condition::equals(common_option::no)),
                "goto": step::alcohol_use_summary.path,
            }),
            redirect(obj! {
                "when": answer(question::alcohol_use).not().matches(condition::equals(common_option::no)),
                "goto": step::alcohol_use_details.path,
            }),
        ]),
    })
}

pub fn alcohol_use_details_step() -> Value {
    let s = section();
    let mut route = base_san_route();
    route.push(Value::from(ALCOHOL_USE.path));
    step(obj! {
        "path": step::alcohol_use_details.route(),
        "title": section_page_title(&ALCOHOL_USE),
        "view": obj! { "locals": obj! { "backlink": create_route(route) } },
        "blocks": [
            s.q("frequency").field(),
            s.q("units").field(),
            s.q("bingeDrinking").field(),
            s.q("evidenceOfExcessDrinking").field(),
            s.q("pastIssues").field(),
            s.q("reasonsForUse").field(),
            s.q("impactOfUse").field(),
            s.q("stoppedOrReduced").field(),
            s.q("changes").field(),
            save_button(),
        ],
        "onAccess": question_page_view(&ALCOHOL_USE, &step::alcohol_use_details),
        "validWhen": user_submitted_valid_when(&step::alcohol_use_details),
        "onSubmission": question_step_submission(&ALCOHOL_USE, &step::alcohol_use_details, &step::alcohol_use_summary, vec![
            redirect(obj! { "goto": step::alcohol_use_summary.path }),
        ]),
    })
}

pub fn summary() -> Value {
    summary_of(
        section(),
        &[
            "alcoholUse",
            "frequency",
            "units",
            "bingeDrinking",
            "evidenceOfExcessDrinking",
            "pastIssues",
            "reasonsForUse",
            "impactOfUse",
            "stoppedOrReduced",
            "changes",
        ],
    )
}

pub fn alcohol_use_summary_step() -> Value {
    let blocks = vec![standard_summary_tab(section(), summary(), &step::alcohol_use_summary)];
    summary_step(&ALCOHOL_USE, &step::alcohol_use_summary, &step::alcohol_use_analysis, blocks, false)
}

pub fn alcohol_use_analysis_step() -> Value {
    analysis_step(
        &ALCOHOL_USE,
        &step::alcohol_use_analysis,
        vec![standard_analysis_tab(section(), summary(), &step::alcohol_use_analysis)],
    )
}
