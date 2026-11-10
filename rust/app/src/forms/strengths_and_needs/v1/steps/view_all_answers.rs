//! Every answer given so far, across every section.

use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::audit_events::san_audit_event;
use crate::forms::strengths_and_needs::constants::question_content::{QuestionDef, SectionDefinition, answer_row, questions_within};
use crate::forms::strengths_and_needs::v1::constants::form_version::{BASE_PATH, case_data};
use crate::forms::strengths_and_needs::v1::constants::section::{self, SectionConfig, section_complete};
use crate::forms::strengths_and_needs::v1::journeys;
use crate::forms::strengths_and_needs::v1::locales::common_content_for;

/// `ViewAllAnswersSection`.
pub struct ViewAllAnswersSection {
    pub section: SectionConfig,
    pub config: &'static SectionDefinition,
}

pub fn view_all_answers_sections() -> Vec<ViewAllAnswersSection> {
    vec![
        ViewAllAnswersSection { section: section::ACCOMMODATION, config: journeys::accommodation::section::section() },
        ViewAllAnswersSection { section: section::EMPLOYMENT_AND_EDUCATION, config: journeys::employment_and_education::section::section() },
        ViewAllAnswersSection { section: section::FINANCE, config: journeys::finance::section::section() },
        ViewAllAnswersSection { section: section::DRUG_USE, config: journeys::drug_use::section::section() },
        ViewAllAnswersSection { section: section::ALCOHOL_USE, config: journeys::alcohol_use::section::section() },
        ViewAllAnswersSection { section: section::HEALTH_AND_WELLBEING, config: journeys::health_wellbeing::section::section() },
        ViewAllAnswersSection {
            section: section::PERSONAL_RELATIONSHIPS_AND_COMMUNITY,
            config: journeys::personal_relationships_and_community::section::section(),
        },
        ViewAllAnswersSection {
            section: section::THINKING_BEHAVIOURS_AND_ATTITUDES,
            config: journeys::thinking_behaviours_and_attitudes::section::section(),
        },
        ViewAllAnswersSection { section: section::OFFENCE_ANALYSIS, config: journeys::offence_analysis::section::section() },
    ]
}

/// `questionsOf`: a section's questions.
pub fn questions_of(config: &SectionDefinition) -> Vec<&QuestionDef> {
    config.questions.values().collect()
}

/// `analysisOf`: a section's practitioner analysis questions.
pub fn analysis_of(config: &SectionDefinition) -> Vec<&QuestionDef> {
    config.practitioner_analysis.values().collect()
}

/// True once any of the questions (or anything they reveal) has a non-empty answer.
pub fn any_answered(fields: &[&QuestionDef]) -> Value {
    or(fields
        .iter()
        .flat_map(|f| questions_within(&f.content))
        .map(|q| {
            and(vec![
                answer(q.code.clone()).matches(condition::is_required()),
                answer(q.code.clone()).matches(condition::string::has_min_length(1)),
            ])
        })
        .collect())
}

fn section_header(section: &SectionConfig) -> Value {
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<div class=\"govuk-grid-row govuk-!-margin-top-8\"><div class=\"govuk-grid-column-three-quarters\">{{slot:heading}}</div><div class=\"govuk-grid-column-one-quarter govuk-!-text-align-right\">{{slot:status}}</div></div>",
        "slots": obj! {
            "heading": [govuk::HEADING.build(obj! {
                "text": common_content_for(&format!("sectionTitle.{}", section.code), []),
                "size": "l",
                "level": 2,
                "classes": "govuk-!-margin-bottom-0",
            })],
            "status": [
                govuk::TAG.build(obj! {
                    "text": common_content_for("status.complete", []),
                    "visibleWhen": data(section.status_key).matches(condition::equals(section_complete::YES)),
                }),
                govuk::TAG.build(obj! {
                    "text": common_content_for("status.incomplete", []),
                    "classes": "govuk-tag--grey",
                    "visibleWhen": data(section.status_key).not().matches(condition::equals(section_complete::YES)),
                }),
            ],
        },
    })
}

fn group_heading(text: Value, fields: &[&QuestionDef]) -> Value {
    govuk::HEADING.build(obj! { "text": text, "size": "m", "level": 3, "visibleWhen": any_answered(fields) })
}

/// `answersFor`: one row per question (its own `answerRow` mode, or the standard one).
pub fn answers_for(fields: &[&QuestionDef]) -> Value {
    let rows: Vec<Value> =
        fields.iter().map(|f| f.display_modes.get("answerRow").cloned().unwrap_or_else(|| answer_row(&f.content))).collect();
    govuk::SUMMARY_LIST.build(obj! { "rows": rows })
}

fn blocks_for(entry: &ViewAllAnswersSection, include_page_title: bool) -> Vec<Value> {
    let questions = questions_of(entry.config);
    let analysis = analysis_of(entry.config);
    let mut content = vec![];
    if include_page_title {
        content.push(govuk::HEADING.build(obj! {
            "text": common_content_for("all_answers_heading", [case_data::forename_possessive()]),
            "size": "l",
            "level": 1,
            "classes": "pdf-body__heading",
        }));
    }
    content.push(section_header(&entry.section));
    if !questions.is_empty() {
        content.push(group_heading(common_content_for("summary", []), &questions));
        content.push(answers_for(&questions));
    }
    if !analysis.is_empty() {
        content.push(group_heading(common_content_for("practitioner_analysis", []), &analysis));
        content.push(answers_for(&analysis));
    }
    vec![core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<div class=\"pdf-avoid-break\">{{slot:content}}</div>",
        "slots": obj! { "content": content },
    })]
}

pub fn view_all_answers_blocks() -> Vec<Value> {
    let sections: Vec<Value> =
        view_all_answers_sections().iter().enumerate().flat_map(|(index, s)| blocks_for(s, index == 0)).collect();
    vec![core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<div class=\"govuk-!-margin-bottom-9 pdf-body\">{{slot:sections}}</div>",
        "slots": obj! { "sections": sections },
    })]
}

pub fn view_all_answers_step() -> Value {
    step(obj! {
        "path": "/view-all-answers",
        "title": common_content_for("pageTitle.view_all_answers", []),
        "reachability": obj! { "entryWhen": true },
        "onAccess": [access(obj! {
            "effects": [
                effect!("setDynamicBacklink", BASE_PATH),
                effect!("sendAuditEvent", san_audit_event::VIEW_ALL_ANSWERS),
            ],
        })],
        "view": obj! {
            "locals": obj! {
                "hideNavigation": true,
                "hideNavigationLinks": true,
                "backlink": data("dynamicBacklink"),
                "viewAllAnswersPage": true,
                "practitionerName": session("practitionerDetails.displayName"),
            },
        },
        "blocks": view_all_answers_blocks(),
    })
}
