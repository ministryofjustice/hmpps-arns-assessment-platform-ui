//! The drug use section's steps.

use super::constants::{option, question, step};
use super::drugs::DRUGS_LIST;
use super::section::*;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::audit_events::san_audit_event;
use crate::forms::strengths_and_needs::generators::{self, create_route};
use crate::forms::strengths_and_needs::v1::audit::{audit_page_action, audit_page_view};
use crate::forms::strengths_and_needs::v1::autosave::autosave_submit;
use crate::forms::strengths_and_needs::v1::constants::buttons::{mark_as_complete_button, save_button};
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::{SECTION_TITLE_CLASS, case_data};
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::question_content::change_link_actions;
use crate::forms::strengths_and_needs::v1::constants::section::{DRUG_USE as SECTION, section_complete};
use crate::forms::strengths_and_needs::v1::constants::user_submitted::is_user_submitted;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for, section_page_title};
use crate::forms::strengths_and_needs::v1::steps::section_summary::*;

fn route(more: &[&str]) -> Value {
    let mut route = base_san_route();
    route.extend(more.iter().map(|s| Value::from(*s)));
    create_route(route).into()
}

fn derive_drug_categories() -> Value {
    access(obj! { "effects": [effect!("deriveDrugCategories")] })
}

pub fn drug_use_status_step() -> Value {
    let this = &step::drug_use_status;
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "sectionTitleClass": SECTION_TITLE_CLASS } },
        "blocks": [section().q("drugUse").field(), save_button()],
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::drug_use_summary, vec![
            redirect(obj! {
                "when": answer(question::drug_use).matches(condition::equals(common_option::yes)),
                "goto": step::drug_use_types.path,
            }),
            redirect(obj! {
                "when": answer(question::drug_use).matches(condition::equals(common_option::no)),
                "goto": step::drug_use_summary.path,
            }),
        ]),
    })
}

pub fn drug_use_types_step() -> Value {
    let this = &step::drug_use_types;
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path]) } },
        "cleardownFieldCodes": ["^trip_*$"],
        "blocks": [section().q("selectMisusedDrugs").field(), save_button()],
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": [
            autosave_submit(this.code, &SECTION),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": obj! { "groups": ["default", "drugs"] },
                "onAlways": obj! { "effects": [effect!("setUserSubmitted", this.code), effect!("commitPendingCommands")] },
                "onValid": obj! {
                    "effects": [
                        effect!("saveCurrentStepAnswers"),
                        effect!("clearUnselectedDrugAnswers"),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                        effect!("setUserSubmitted", step::drug_use_summary.code, is_user_submitted::FALSE),
                        effect!("setUserSubmitted", step::drug_use_details.code, is_user_submitted::FALSE),
                        effect!("setUserSubmitted", step::drug_use_history.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                        audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, &SECTION, this),
                    ],
                    "next": [redirect(obj! { "goto": step::drug_use_details.path })],
                },
                "onInvalid": obj! {
                    "effects": [
                        effect!("saveCurrentStepAnswers", false),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                        effect!("setUserSubmitted", step::drug_use_summary.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                        audit_page_action(san_audit_event::SAVE_QUESTION_PAGE, &SECTION, this),
                    ],
                },
            }),
        ],
    })
}

/// The drug's name for a collection item (`Item().path('value')`), "Other" being the typed name.
/// (The details page's inset compares against the drug list's `OTHER_DRUG`.)
fn drug_heading(other_value: &str, transform: Option<Value>) -> Value {
    let escaped = || item().path("value").pipe([transformer::string::escape_html()]);
    let mut label = generators::get_text_from_list_definition(section().q("selectMisusedDrugs").content.entries(), escaped());
    if let Some(t) = transform {
        label = label.pipe([t]);
    }
    when(escaped().matches(condition::equals(other_value)))
        .then(answer(question::other_drug_name).pipe([transformer::string::escape_html()]))
        .otherwise(label)
        .into()
}

fn used_in_last_six_months_section() -> Value {
    let drug_value_lower: Value = item().path("value").pipe([transformer::string::to_lower_case()]).into();
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<h2 class=\"govuk-heading-l\">{{heading}}</h2>{{slot:content}}",
        "values": obj! { "heading": cf("option.LAST_SIX", []) },
        "slots": obj! {
            "content": [
                govuk::DETAILS.build(obj! {
                    "summaryText": cf("question.how_often_used_last_six_months.summaryText", []),
                    "html": cf("question.how_often_used_last_six_months.summaryHtml", []),
                }),
                core_blocks::COLLECTION_BLOCK.build(obj! {
                    "collection": literal(Value::array(DRUGS_LIST.iter().map(|d| d.to_value()).collect())).each(iterator::map(
                        core_blocks::TEMPLATE_WRAPPER.build(obj! {
                            "template": "<h2 class=\"govuk-heading-m\">{{heading}}</h2>{{slot:fields}}",
                            "values": obj! {
                                "heading": drug_heading(common_option::other, None),
                            },
                            "slots": obj! {
                                "fields": [drug_how_often_used().over(drug_value_lower.clone()), drug_how_often_used_details().over(drug_value_lower.clone())],
                            },
                            "visibleWhen": drug_used_in_last_six_months(&drug_value_lower),
                        }),
                    )),
                }),
            ],
        },
        "visibleWhen": any_drug_used_in_last_six(),
    })
}

fn section_divider() -> Value {
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<hr class=\"govuk-section-break govuk-section-break--l govuk-section-break--visible\">",
        "visibleWhen": and(vec![any_drug_used_in_last_six(), any_drug_used_more_than_six()]),
    })
}

fn used_more_than_six_months_section() -> Value {
    let names: Value = data("drugsUsedMoreThanSix")
        .each(iterator::map(drug_heading(option::other_drug, Some(transformer::string::to_lower_case()))))
        .pipe([transformer::array::join(", ")])
        .into();
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<h2 class=\"govuk-heading-l\">{{heading}}</h2>{{slot:content}}",
        "values": obj! { "heading": cf("heading.not_used_in_last_six_months", []) },
        "slots": obj! {
            "content": [
                govuk::INSET_TEXT.build(obj! {
                    "text": cf("inset.used_more_than_six_months_ago", [case_data::forename(), names]),
                }),
                section().q("moreThanSixMonthsDetails").field(),
            ],
        },
        "visibleWhen": any_drug_used_more_than_six(),
    })
}

pub fn drug_use_details_step() -> Value {
    let this = &step::drug_use_details;
    let s = section();
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path, step::drug_use_types.path]) } },
        "onAccess": [derive_drug_categories(), audit_page_view(san_audit_event::VIEW_QUESTION_PAGE, &SECTION, this)],
        "validWhen": user_submitted_valid_when(this),
        "blocks": [
            used_in_last_six_months_section(),
            section_divider(),
            used_more_than_six_months_section(),
            s.q("drugsInjected").field(),
            s.q("receivingTreatment").field(),
            save_button(),
        ],
        "onSubmission": question_step_submission(&SECTION, this, &step::drug_use_summary, vec![
            redirect(obj! { "goto": step::drug_use_history.path }),
        ]),
    })
}

pub fn drug_use_history_step() -> Value {
    let this = &step::drug_use_history;
    let s = section();
    let names = [
        "reasonsForUse",
        "reasonsForUseDetails",
        "affectedTheirLife",
        "affectedTheirLifeDetails",
        "anythingHelpedStopOrReduce",
        "whatCouldHelpNotUseInFuture",
        "drugUseChanges",
    ];
    let mut blocks: Vec<Value> = names.iter().map(|n| s.q(n).field()).collect();
    blocks.push(save_button());
    step(obj! {
        "path": this.route(),
        "title": section_page_title(&SECTION),
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path, step::drug_use_details.path]) } },
        "blocks": blocks,
        "onAccess": question_page_view(&SECTION, this),
        "validWhen": user_submitted_valid_when(this),
        "onSubmission": question_step_submission(&SECTION, this, &step::drug_use_summary, vec![
            redirect(obj! { "goto": step::drug_use_summary.path }),
        ]),
    })
}

/// One summary card per drug: last used, how often, details, and whether it was injected.
fn drugs_summary_cards(drug_value: Ex) -> Value {
    let drug_value_lower: Value = drug_value.pipe([transformer::string::to_lower_case()]).into();
    let s = section();
    let select_content = &s.q("selectMisusedDrugs").content;
    let injected = || answer(question::drugs_injected).matches(condition::array::contains(drug_value.clone()));
    let injected_months = || answer(format(question::drugs_injected_value, [generators::get_drug_value_lower(drug_value.clone()).into()]));
    let months_row = |label: &str, value: &str| {
        govuk::BODY.build(obj! {
            "text": cf(label, []),
            "visibleWhen": and(vec![
                injected(),
                and(vec![
                    injected_months().matches(condition::is_required()),
                    injected_months().matches(condition::array::contains(value)),
                ]),
            ]),
        })
    };
    govuk::SUMMARY_LIST.build(obj! {
        "card": obj! {
            "title": obj! {
                "text": when(drug_value.matches(condition::equals(common_option::other)))
                    .then(answer(question::other_drug_name))
                    .otherwise(generators::get_text_from_list_definition(select_content.entries(), drug_value.clone())),
            },
            "actions": change_link_actions(step::drug_use_types.path, &select_content.code, &select_content.text),
        },
        "rows": [
            drug_last_used().summary_row_over(drug_value_lower.clone()),
            drug_how_often_used().summary_row_over(drug_value_lower.clone()),
            drug_how_often_used_details().summary_row_over(drug_value_lower),
            // Bespoke row: the injected answer, the per-drug months answer and the last-used answer.
            obj! {
                "key": obj! { "text": cf("text.injected.text", []) },
                "value": obj! {
                    "blocks": [
                        govuk::BODY.build(obj! {
                            "text": when(injected()).then(common_content_for("option.YES", [])),
                            "visibleWhen": injected(),
                        }),
                        months_row("option.IN_THE_LAST_SIX", option::last_six),
                        months_row("option.MORE_THAN_SIX", option::more_than_six),
                        govuk::BODY.build(obj! {
                            "text": cf("option.MORE_THAN_SIX", []),
                            "visibleWhen": and(vec![
                                answer(format(question::drug_last_used_value, [generators::get_drug_value_lower(drug_value.clone()).into()]))
                                    .matches(condition::equals(option::more_than_six)),
                                injected(),
                            ]),
                        }),
                    ],
                },
                "actions": change_link_actions(step::drug_use_details.path, &Value::from(question::drugs_injected), &cf("text.injected.text", [])),
                "visibleWhen": and(vec![data("injectableSelectedDrugs").matches(condition::is_required()), injected()]),
            },
        ],
    })
}

fn drugs_summary_section(data_key: &str, heading: &str) -> Value {
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<h2 class=\"govuk-heading-m\">{{slot:heading}}</h2>{{slot:content}}",
        "slots": obj! {
            "heading": [govuk::HEADING.build(obj! {
                "text": cf(heading, []),
                "visibleWhen": data(data_key).matches(condition::is_required()),
            })],
            "content": [core_blocks::COLLECTION_BLOCK.build(obj! {
                "collection": data(data_key).each(iterator::map(drugs_summary_cards(item().path("value")))),
            })],
        },
    })
}

pub fn summary() -> Value {
    let s = section();
    core_blocks::HTML.build(obj! {
        "content": [
            govuk::SUMMARY_LIST.build(obj! { "rows": [s.q("drugUse").summary_row()] }),
            drugs_summary_section("drugsUsedInLastSix", "option.LAST_SIX"),
            drugs_summary_section("drugsUsedMoreThanSix", "heading.not_used_in_last_six_months"),
            govuk::HEADING.build(obj! {
                "text": cf("text.more_information", []),
                "visibleWhen": answer(question::drug_use).matches(condition::equals(common_option::yes)),
            }),
            govuk::SUMMARY_LIST.build(obj! { "rows": [s.q("moreThanSixMonthsDetails").summary_row()] }),
            summary_of(
                s,
                &[
                    "receivingTreatment",
                    "reasonsForUse",
                    "reasonsForUseDetails",
                    "affectedTheirLife",
                    "affectedTheirLifeDetails",
                    "anythingHelpedStopOrReduce",
                    "whatCouldHelpNotUseInFuture",
                    "drugUseChanges",
                ],
            ),
        ],
    })
}

pub fn drug_use_summary_step() -> Value {
    let this = &step::drug_use_summary;
    let s = section();
    let mut analysis = analysis_fields(s);
    analysis.push(mark_as_complete_button());
    let tab = summary_tab(s, summary_panel(summary(), this.path), analysis);
    let summary_step = summary_step(&SECTION, this, &step::drug_use_analysis, vec![tab], true);
    // The drug use summary derives the drug categories first, and lists its keys in its own order.
    let mut out = obj! {
        "path": summary_step.get("path"),
        "title": summary_step.get("title"),
        "onAccess": [derive_drug_categories(), audit_page_view(san_audit_event::VIEW_SECTION_SUMMARY, &SECTION, this)],
        "validWhen": summary_step.get("validWhen"),
        "blocks": summary_step.get("blocks"),
        "onSubmission": summary_step.get("onSubmission"),
    };
    out.set("type", summary_step.get("type"));
    out
}

pub fn drug_use_analysis_step() -> Value {
    let this = &step::drug_use_analysis;
    step(obj! {
        "path": this.route(),
        "title": crate::forms::strengths_and_needs::v1::locales::analysis_page_title(&SECTION),
        "onAccess": [derive_drug_categories(), audit_page_view(san_audit_event::VIEW_PRACTITIONER_ANALYSIS, &SECTION, this)],
        "blocks": [standard_analysis_tab(section(), summary(), this)],
        "reachability": obj! { "entryWhen": crate::forms::strengths_and_needs::v1::guards::is_read_only_mode() },
    })
}
