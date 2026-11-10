//! The personal relationships and community section's steps.

use super::constants::{option, question, step};
use super::section::section;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators::create_route;
use crate::forms::strengths_and_needs::v1::constants::buttons::save_button;
use crate::forms::strengths_and_needs::v1::constants::form_version::SECTION_TITLE_CLASS;
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::section::PERSONAL_RELATIONSHIPS_AND_COMMUNITY as SECTION;
use crate::forms::strengths_and_needs::v1::locales::section_page_title;
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

fn route(more: &[&str]) -> Value {
    let mut route = base_san_route();
    route.extend(more.iter().map(|s| Value::from(*s)));
    create_route(route).into()
}

pub fn children_information_step() -> Value {
    let this = &step::personal_relationships_children_information;
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "sectionTitleClass": SECTION_TITLE_CLASS } },
        "blocks": [section().q("childrenDetails").field(), save_button()],
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::personal_relationships_community_summary, vec![
            redirect(obj! { "goto": step::personal_relationships.path }),
        ]),
    })
}

pub fn personal_relationships_step() -> Value {
    let this = &step::personal_relationships;
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "sectionTitleClass": SECTION_TITLE_CLASS, "backlink": route(&[SECTION.path]) } },
        "blocks": [section().q("importantPeople").field(), save_button()],
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::personal_relationships_community_summary, vec![
            redirect(obj! { "goto": step::personal_relationships_community.path }),
        ]),
    })
}

pub fn personal_relationships_community_step() -> Value {
    let this = &step::personal_relationships_community;
    let s = section();
    let names = [
        "currentRelationship",
        "intimateRelationship",
        "challengesIntimateRelationship",
        "parentalResponsibilities",
        "familyRelationship",
        "childhood",
        "childhoodBehaviour",
        "belonging",
        "changes",
    ];
    let mut blocks: Vec<Value> = names.iter().map(|n| s.q(n).field()).collect();
    blocks.push(save_button());
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path, step::personal_relationships.path]) } },
        "blocks": blocks,
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::personal_relationships_community_summary, vec![
            // The summary is only reachable once parenting responsibilities are answered, when
            // they apply.
            redirect(obj! {
                "when": or(vec![
                    answer(question::personal_relationships_community_important_people)
                        .matches(condition::array::contains(option::child_parental_responsibilities)),
                    not(answer(question::personal_relationships_community_parental_responsibilities).matches(condition::is_required())),
                ]),
                "goto": step::personal_relationships_community_summary.path,
            }),
        ]),
    })
}

pub fn summary() -> Value {
    summary_of(
        section(),
        &[
            "childrenDetails",
            "importantPeople",
            "currentRelationship",
            "intimateRelationship",
            "challengesIntimateRelationship",
            "parentalResponsibilities",
            "familyRelationship",
            "childhood",
            "childhoodBehaviour",
            "belonging",
            "changes",
        ],
    )
}

pub fn summary_step_() -> Value {
    let blocks = vec![standard_summary_tab(section(), summary(), &step::personal_relationships_community_summary)];
    summary_step(&SECTION, &step::personal_relationships_community_summary, &step::personal_relationships_community_analysis, blocks, true)
}

pub fn analysis_step_() -> Value {
    analysis_step(
        &SECTION,
        &step::personal_relationships_community_analysis,
        vec![standard_analysis_tab(section(), summary(), &step::personal_relationships_community_analysis)],
    )
}
