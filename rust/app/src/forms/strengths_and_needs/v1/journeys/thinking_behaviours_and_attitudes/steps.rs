//! The thinking behaviours and attitudes section's steps.

use super::constants::{question, step};
use super::section::section;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators::create_route;
use crate::forms::strengths_and_needs::v1::constants::buttons::save_button;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::section::THINKING_BEHAVIOURS_AND_ATTITUDES as SECTION;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for, section_page_title, thinking_behaviours_and_attitudes};
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

fn route(more: &[&str]) -> Value {
    let mut route = base_san_route();
    route.extend(more.iter().map(|s| Value::from(*s)));
    create_route(route).into()
}

fn sexual_harm_section_title() -> Value {
    thinking_behaviours_and_attitudes().get("step.thinking_behaviours_attitudes_risk_of_sexual_harm_details", []).into()
}

pub fn thinking_behaviours_attitudes_step() -> Value {
    let this = &step::thinking_behaviours_attitudes;
    let s = section();
    let names = [
        "consequences",
        "stableBehaviour",
        "offendingActivities",
        "peerPressure",
        "problemSolving",
        "peoplesViews",
        "manipulativePredatoryBehaviour",
        "temperManagement",
        "violenceControllingBehaviour",
        "impulsiveBehaviour",
        "positiveAttitude",
        "hostileOrientation",
        "supervision",
        "criminalBehaviour",
        "changes",
    ];
    let mut blocks: Vec<Value> = names.iter().map(|n| s.q(n).field()).collect();
    blocks.push(save_button());
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "reachability": obj! { "entryWhen": true },
        "blocks": blocks,
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::thinking_behaviours_attitudes_summary, vec![
            redirect(obj! { "goto": step::thinking_behaviours_attitudes_risk_of_sexual_harm.path }),
        ]),
    })
}

pub fn risk_of_sexual_harm_step() -> Value {
    let this = &step::thinking_behaviours_attitudes_risk_of_sexual_harm;
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "view": obj! {
            "locals": obj! {
                "sectionTitle": sexual_harm_section_title(),
                "pageSubHeading": common_content_for("sectionTitle.thinking-behaviours-and-attitudes", []),
                "sectionTitleClass": "govuk-body-l",
                "backlink": route(&[SECTION.path, step::thinking_behaviours_attitudes.path]),
            },
        },
        "blocks": [section().q("riskSexualHarm").field(), save_button()],
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::thinking_behaviours_attitudes_summary, vec![
            redirect(obj! {
                "when": answer(question::thinking_behaviours_attitudes_risk_sexual_harm).matches(condition::equals(common_option::yes)),
                "goto": step::thinking_behaviours_attitudes_risk_of_sexual_harm_details.path,
            }),
            redirect(obj! { "goto": step::thinking_behaviours_attitudes_summary.path }),
        ]),
    })
}

pub fn risk_of_sexual_harm_details_step() -> Value {
    let this = &step::thinking_behaviours_attitudes_risk_of_sexual_harm_details;
    let s = section();
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "view": obj! {
            "locals": obj! {
                "sectionTitle": sexual_harm_section_title(),
                "pageSubHeading": common_content_for("sectionTitle.thinking-behaviours-and-attitudes", []),
                "backlink": route(&[SECTION.path, step::thinking_behaviours_attitudes_risk_of_sexual_harm.path]),
            },
        },
        "blocks": [s.q("sexualPreoccupation").field(), s.q("offenceRelatedSexualInterest").field(), s.q("emotionalIntimacy").field(), save_button()],
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::thinking_behaviours_attitudes_summary, vec![
            redirect(obj! { "goto": step::thinking_behaviours_attitudes_summary.path }),
        ]),
    })
}

pub fn summary() -> Value {
    summary_of(
        section(),
        &[
            "consequences",
            "stableBehaviour",
            "offendingActivities",
            "peerPressure",
            "problemSolving",
            "peoplesViews",
            "manipulativePredatoryBehaviour",
            "temperManagement",
            "violenceControllingBehaviour",
            "impulsiveBehaviour",
            "positiveAttitude",
            "hostileOrientation",
            "supervision",
            "criminalBehaviour",
            "changes",
            "riskSexualHarm",
            "sexualPreoccupation",
            "offenceRelatedSexualInterest",
            "emotionalIntimacy",
        ],
    )
}

pub fn summary_step_() -> Value {
    let blocks = vec![standard_summary_tab(section(), summary(), &step::thinking_behaviours_attitudes_summary)];
    summary_step(&SECTION, &step::thinking_behaviours_attitudes_summary, &step::thinking_behaviours_attitudes_analysis, blocks, true)
}

pub fn analysis_step_() -> Value {
    analysis_step(
        &SECTION,
        &step::thinking_behaviours_attitudes_analysis,
        vec![standard_analysis_tab(section(), summary(), &step::thinking_behaviours_attitudes_analysis)],
    )
}
