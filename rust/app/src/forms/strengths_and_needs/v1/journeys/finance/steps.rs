//! The finance section's steps.

use super::constants::step;
use super::section::section;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::audit_events::san_audit_event;
use crate::forms::strengths_and_needs::v1::audit::{audit_page_action, audit_page_view};
use crate::forms::strengths_and_needs::v1::autosave::autosave_submit;
use crate::forms::strengths_and_needs::v1::constants::buttons::save_button;
use crate::forms::strengths_and_needs::v1::constants::section::{FINANCE, section_complete};
use crate::forms::strengths_and_needs::v1::constants::user_submitted::{is_user_submitted, is_user_submitted_condition};
use crate::forms::strengths_and_needs::v1::locales::section_page_title;
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

pub fn finance_step() -> Value {
    let s = section();
    step(obj! {
        "path": step::finance.route(),
        "title": section_page_title(&FINANCE),
        "reachability": obj! { "entryWhen": true },
        "blocks": [
            s.q("income").field(),
            s.q("bankAccount").field(),
            s.q("moneyManagement").field(),
            s.q("gambling").field(),
            s.q("debt").field(),
            s.q("changes").field(),
            save_button(),
        ],
        "view": obj! { "template": "strengths-and-needs/views/san-step" },
        "onAccess": [audit_page_view(san_audit_event::VIEW_QUESTION_PAGE, &FINANCE, &step::finance)],
        "validWhen": [validation(obj! {
            "condition": is_user_submitted_condition(step::finance.code),
            "message": "This step is not user submitted",
        })],
        "onSubmission": [
            autosave_submit(step::finance.code, &FINANCE),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! { "effects": [effect!("setUserSubmitted", step::finance.code)] },
                "onValid": obj! {
                    "effects": [
                        effect!("saveCurrentStepAnswers"),
                        effect!("setSectionProgress", FINANCE.to_value(), section_complete::NO),
                        effect!("setUserSubmitted", step::finance_summary.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                        audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, &FINANCE, &step::finance),
                    ],
                    "next": [redirect(obj! { "goto": step::finance_summary.path })],
                },
                "onInvalid": obj! {
                    "effects": [
                        effect!("saveCurrentStepAnswers", false),
                        effect!("setSectionProgress", FINANCE.to_value(), section_complete::NO),
                        effect!("setUserSubmitted", step::finance_summary.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                        audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, &FINANCE, &step::finance),
                    ],
                },
            }),
        ],
    })
}

/// The finance summary page's answers summary.
pub fn summary() -> Value {
    summary_of(section(), &["income", "bankAccount", "moneyManagement", "gambling", "debt", "changes"])
}

pub fn finance_summary_step() -> Value {
    let blocks = vec![standard_summary_tab(section(), summary(), &step::finance_summary)];
    summary_step(&FINANCE, &step::finance_summary, &step::finance_analysis, blocks, true)
}

pub fn finance_analysis_step() -> Value {
    analysis_step(&FINANCE, &step::finance_analysis, vec![standard_analysis_tab(section(), summary(), &step::finance_analysis)])
}
