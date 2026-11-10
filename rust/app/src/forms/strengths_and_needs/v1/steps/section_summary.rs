//! The summary and practitioner analysis pages every section has: the same layout, filled with
//! each section's rows.

use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::audit_events::san_audit_event;
use crate::forms::strengths_and_needs::constants::question_content::SectionDefinition;
use crate::forms::strengths_and_needs::v1::audit::{audit_page_action, audit_page_view};
use crate::forms::strengths_and_needs::v1::autosave::autosave_submit;
use crate::forms::strengths_and_needs::v1::constants::StepDef;
use crate::forms::strengths_and_needs::v1::constants::buttons::{go_to_practitioner_analysis_button, mark_as_complete_button};
use crate::forms::strengths_and_needs::v1::constants::section::{SectionConfig, section_complete};
use crate::forms::strengths_and_needs::v1::constants::user_submitted::is_user_submitted_condition;
use crate::forms::strengths_and_needs::v1::guards::is_read_only_mode;
use crate::forms::strengths_and_needs::v1::locales::{analysis_page_title, common_content_for, summary_page_title};
use crate::forms::strengths_and_needs::v1::steps::view_all_answers::{analysis_of, any_answered, questions_of};

/// A summary list of the named questions' summary rows.
pub fn summary_of(section: &SectionDefinition, names: &[&str]) -> Value {
    govuk::SUMMARY_LIST.build(obj! { "rows": names.iter().map(|n| section.q(n).summary_row()).collect::<Vec<_>>() })
}

/// A summary list of the named practitioner analysis questions' summary rows.
pub fn analysis_summary_of(section: &SectionDefinition, names: &[&str]) -> Value {
    govuk::SUMMARY_LIST.build(obj! { "rows": names.iter().map(|n| section.pa(n).summary_row()).collect::<Vec<_>>() })
}

/// The practitioner analysis fields every section asks.
pub fn analysis_fields(section: &SectionDefinition) -> Vec<Value> {
    section.practitioner_analysis.values().map(|q| q.field()).collect()
}

/// `summary` + "Go to practitioner analysis".
pub fn summary_panel(summary: Value, path: &str) -> Vec<Value> {
    vec![summary, go_to_practitioner_analysis_button(path)]
}

fn not_started_banner(section: &SectionDefinition) -> Value {
    moj::BANNER.build(obj! {
        "bannerType": "information",
        "text": common_content_for("section_has_not_been_started", []),
        "visibleWhen": not(any_answered(&questions_of(section))),
    })
}

/// The summary page's tabs: the answers, and the practitioner analysis fields.
pub fn summary_tab(section: &SectionDefinition, summary_panel: Vec<Value>, analysis_blocks: Vec<Value>) -> Value {
    core_blocks::HTML.build(obj! {
        "content": [
            not_started_banner(section),
            govuk::TABS.build(obj! {
                "id": "summaries",
                "items": [
                    obj! {
                        "id": "summary",
                        "label": common_content_for("summary", []),
                        "panel": obj! { "blocks": summary_panel },
                    },
                    obj! {
                        "id": "practitioner-analysis",
                        "label": common_content_for("practitioner_analysis", []),
                        "panel": obj! { "blocks": analysis_blocks },
                    },
                ],
                "visibleWhen": any_answered(&questions_of(section)),
            }),
        ],
    })
}

/// The standard edit summary tab: the analysis fields then "Mark as complete".
pub fn standard_summary_tab(section: &SectionDefinition, summary: Value, summary_step: &StepDef) -> Value {
    let mut analysis = analysis_fields(section);
    analysis.push(mark_as_complete_button());
    summary_tab(section, summary_panel(summary, summary_step.path), analysis)
}

/// The analysis page's tabs: the answers, and the practitioner analysis answers.
pub fn analysis_summary_tab(section: &SectionDefinition, summary_panel: Vec<Value>, analysis_summary: Value) -> Value {
    core_blocks::HTML.build(obj! {
        "content": [
            not_started_banner(section),
            govuk::TABS.build(obj! {
                "id": "summaries",
                "items": [
                    obj! {
                        "id": "summary",
                        "label": common_content_for("summary", []),
                        "panel": obj! { "blocks": summary_panel },
                    },
                    obj! {
                        "id": "practitioner-analysis",
                        "label": common_content_for("practitioner_analysis", []),
                        "panel": obj! { "blocks": [analysis_summary] },
                        "visibleWhen": any_answered(&analysis_of(section)),
                    },
                ],
                "visibleWhen": any_answered(&questions_of(section)),
            }),
        ],
    })
}

/// The standard analysis tab.
pub fn standard_analysis_tab(section: &SectionDefinition, summary: Value, analysis_step: &StepDef) -> Value {
    analysis_summary_tab(
        section,
        summary_panel(summary, analysis_step.path),
        govuk::SUMMARY_LIST.build(obj! {
            "rows": section.practitioner_analysis.values().map(|q| q.summary_row()).collect::<Vec<_>>(),
        }),
    )
}

/// The summary step: marking the section complete saves the analysis and goes to the analysis
/// page. `audit_invalid` audits a failed save as a question page save (most sections do).
pub fn summary_step(section: &SectionConfig, summary_step: &StepDef, analysis_step: &StepDef, blocks: Vec<Value>, audit_invalid: bool) -> Value {
    summary_step_with(section, summary_step, analysis_step, blocks, audit_invalid, vec![])
}

/// [`summary_step`] with extra effects after the section is marked complete.
pub fn summary_step_with(
    section: &SectionConfig,
    summary_step: &StepDef,
    analysis_step: &StepDef,
    blocks: Vec<Value>,
    audit_invalid: bool,
    extra_valid_effects: Vec<Value>,
) -> Value {
    let mut on_valid = vec![effect!("saveCurrentStepAnswers"), effect!("setSectionProgress", section.to_value(), section_complete::YES)];
    on_valid.extend(extra_valid_effects);
    on_valid.push(effect!("commitPendingCommands"));
    on_valid.push(audit_page_action(san_audit_event::MARK_SECTION_COMPLETE, section, summary_step));
    let mut on_invalid = vec![
        effect!("saveCurrentStepAnswers", false),
        effect!("setSectionProgress", section.to_value(), section_complete::NO),
        effect!("commitPendingCommands"),
    ];
    if audit_invalid {
        on_invalid.push(audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, section, summary_step));
    }
    step(obj! {
        "path": summary_step.route(),
        "title": summary_page_title(section),
        "blocks": blocks,
        "onAccess": [audit_page_view(san_audit_event::VIEW_SECTION_SUMMARY, section, summary_step)],
        "validWhen": [validation(obj! {
            "condition": is_user_submitted_condition(summary_step.code),
            "message": "This step is not user submitted",
        })],
        "onSubmission": [
            autosave_submit(summary_step.code, section),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! { "effects": [effect!("setUserSubmitted", summary_step.code)] },
                "onValid": obj! {
                    "effects": on_valid,
                    "next": [redirect(obj! { "goto": format!("{}#practitioner-analysis", analysis_step.path) })],
                },
                "onInvalid": obj! { "effects": on_invalid },
            }),
        ],
    })
}

/// The analysis step: the landing page for read-only users.
pub fn analysis_step(section: &SectionConfig, analysis_step: &StepDef, blocks: Vec<Value>) -> Value {
    step(obj! {
        "path": analysis_step.route(),
        "title": analysis_page_title(section),
        "blocks": blocks,
        "reachability": obj! { "entryWhen": is_read_only_mode() },
        "onAccess": [audit_page_view(san_audit_event::VIEW_PRACTITIONER_ANALYSIS, section, analysis_step)],
    })
}

/// A question step's `validWhen`: it counts as answered once the user has submitted it.
pub fn user_submitted_valid_when(step: &StepDef) -> Vec<Value> {
    vec![validation(obj! { "condition": is_user_submitted_condition(step.code), "message": "This step is not user submitted" })]
}

/// A question step's `onAccess`: audit the page view.
pub fn question_page_view(section: &SectionConfig, step: &StepDef) -> Vec<Value> {
    vec![audit_page_view(san_audit_event::VIEW_QUESTION_PAGE, section, step)]
}

/// A question step's `onSubmission`: autosave, and on save the answers are saved, the section
/// and its summary marked incomplete, then `next` (valid) or the page shown again (invalid).
pub fn question_step_submission(section: &SectionConfig, step: &StepDef, summary_step: &StepDef, next: Vec<Value>) -> Vec<Value> {
    use crate::forms::strengths_and_needs::v1::constants::user_submitted::is_user_submitted;
    let effects = |clear: Option<bool>| {
        vec![
            match clear {
                None => effect!("saveCurrentStepAnswers"),
                Some(c) => effect!("saveCurrentStepAnswers", c),
            },
            effect!("setSectionProgress", section.to_value(), section_complete::NO),
            effect!("setUserSubmitted", summary_step.code, is_user_submitted::FALSE),
            effect!("commitPendingCommands"),
            audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, section, step),
        ]
    };
    vec![
        autosave_submit(step.code, section),
        submit(obj! {
            "when": post("action").matches(condition::equals("save")),
            "validate": true,
            "onAlways": obj! { "effects": [effect!("setUserSubmitted", step.code)] },
            "onValid": obj! { "effects": effects(None), "next": next },
            "onInvalid": obj! { "effects": effects(Some(false)) },
        }),
    ]
}
