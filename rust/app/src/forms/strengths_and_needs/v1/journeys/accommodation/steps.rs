//! The accommodation section's steps.

use super::constants::step;
use super::section::section;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::audit_events::san_audit_event;
use crate::forms::strengths_and_needs::generators::create_route;
use crate::forms::strengths_and_needs::v1::audit::audit_page_action;
use crate::forms::strengths_and_needs::v1::autosave::auto_save_accommodation_submit;
use crate::forms::strengths_and_needs::v1::constants::buttons::save_button;
use crate::forms::strengths_and_needs::v1::constants::form_version::SECTION_TITLE_CLASS;
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::section::{ACCOMMODATION as SECTION, section_complete};
use crate::forms::strengths_and_needs::v1::constants::user_submitted::is_user_submitted;
use crate::forms::strengths_and_needs::v1::locales::section_page_title;
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

pub fn accommodation_status_step() -> Value {
    let status = &step::accommodation_status;
    step(obj! {
        "path": status.route(),
        "title": section_page_title(&SECTION),
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "sectionTitleClass": SECTION_TITLE_CLASS } },
        "blocks": [section().q("currentAccommodation").field(), save_button()],
        "onAccess": question_page_view(&SECTION, status),
        "validWhen": user_submitted_valid_when(status),
        "onSubmission": [
            auto_save_accommodation_submit(status.code),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! { "effects": [effect!("setUserSubmitted", status.code)] },
                "onValid": obj! {
                    "effects": [
                        effect!("saveCurrentAccommodationStepAnswers"),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                        effect!("setUserSubmitted", step::accommodation_summary.code, is_user_submitted::FALSE),
                        effect!("setUserSubmitted", step::accommodation_details.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                        audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, &SECTION, status),
                    ],
                    "next": [redirect(obj! { "goto": step::accommodation_details.path })],
                },
                "onInvalid": obj! {
                    "effects": [
                        effect!("saveCurrentAccommodationStepAnswers", false),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                        effect!("setUserSubmitted", step::accommodation_summary.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                        audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, &SECTION, status),
                    ],
                },
            }),
        ],
    })
}

pub fn accommodation_details_step() -> Value {
    let s = section();
    let mut route = base_san_route();
    route.push(Value::from(SECTION.path));
    let names =
        ["livingWith", "noAccommodationReason", "pastAccommodationDetails", "suitableHousingLocation", "suitableHousing", "suitableHousingPlanned", "changes"];
    let mut blocks: Vec<Value> = names.iter().map(|n| s.q(n).field()).collect();
    blocks.push(save_button());
    step(obj! {
        "path": step::accommodation_details.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "backlink": create_route(route) } },
        "blocks": blocks,
        "onAccess": question_page_view(&SECTION, &step::accommodation_details),
        "validWhen": user_submitted_valid_when(&step::accommodation_details),
        "onSubmission": question_step_submission(&SECTION, &step::accommodation_details, &step::accommodation_summary, vec![
            redirect(obj! { "goto": step::accommodation_summary.path }),
        ]),
    })
}

pub fn summary() -> Value {
    summary_of(
        section(),
        &[
            "currentAccommodation",
            "livingWith",
            "suitableHousingLocation",
            "suitableHousing",
            "noAccommodationReason",
            "pastAccommodationDetails",
            "suitableHousingPlanned",
            "changes",
        ],
    )
}

pub fn accommodation_summary_step() -> Value {
    let blocks = vec![standard_summary_tab(section(), summary(), &step::accommodation_summary)];
    summary_step(&SECTION, &step::accommodation_summary, &step::accommodation_analysis, blocks, true)
}

pub fn accommodation_analysis_step() -> Value {
    analysis_step(&SECTION, &step::accommodation_analysis, vec![standard_analysis_tab(section(), summary(), &step::accommodation_analysis)])
}
