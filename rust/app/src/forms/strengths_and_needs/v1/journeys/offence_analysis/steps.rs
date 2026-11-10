//! The offence analysis section's steps.

use super::constants::{option, question, step};
use super::section::{cf, section, victim_questions};
use super::{VICTIM_EDIT_TEMPLATE_PATH, victims_collection};
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::audit_events::san_audit_event;
use crate::forms::strengths_and_needs::components::MODAL;
use crate::forms::strengths_and_needs::generators::{self, create_route};
use crate::forms::strengths_and_needs::v1::audit::audit_page_view;
use crate::forms::strengths_and_needs::v1::autosave::{auto_save_victim_edit_submit, autosave_submit};
use crate::forms::strengths_and_needs::v1::constants::buttons::{mark_as_complete_button, save_button};
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::path::base_san_route;
use crate::forms::strengths_and_needs::v1::constants::question_content::change_href_of;
use crate::forms::strengths_and_needs::v1::constants::section::{OFFENCE_ANALYSIS as SECTION, section_complete};
use crate::forms::strengths_and_needs::v1::constants::user_submitted::{is_user_submitted, is_user_submitted_condition};
use crate::forms::strengths_and_needs::v1::guards::{is_edit_mode, is_read_only_mode};
use crate::forms::strengths_and_needs::v1::locales::{common, common_content_for, summary_page_title};

fn route(more: &[&str]) -> Value {
    let mut route = base_san_route();
    route.extend(more.iter().map(|s| Value::from(*s)));
    create_route(route).into()
}

fn valid_when_user_submitted(code: &str) -> Value {
    validation(obj! { "condition": is_user_submitted_condition(code), "message": "This step is not user submitted" })
}

fn summary_view(this: &crate::forms::strengths_and_needs::v1::constants::StepDef) -> Value {
    audit_page_view(san_audit_event::VIEW_SECTION_SUMMARY, &SECTION, this)
}

fn has_victims() -> Value {
    answer(question::offence_analysis_who_was_the_victim).matches(condition::array::contains(option::one_or_more_person))
}

pub fn offence_analysis_step() -> Value {
    let this = &step::offence_analysis;
    let s = section();
    step(obj! {
        "path": this.route(),
        "title": "Offence analysis",
        "reachability": obj! { "entryWhen": true },
        "blocks": [
            s.q("indexOffenceDescription").field(),
            s.q("offenceElements").field(),
            s.q("whyOffenceHappened").field(),
            s.q("motivations").field(),
            s.q("offenceCommitedAgainst").field(),
            save_button(),
        ],
        "onAccess": [summary_view(this)],
        "validWhen": [valid_when_user_submitted(this.code)],
        "onSubmission": [
            autosave_submit(this.code, &SECTION),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! {
                    "effects": [
                        effect!("setUserSubmitted", this.code),
                        effect!("setUserSubmitted", step::offence_analysis_impact.code, is_user_submitted::FALSE),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                    ],
                },
                "onValid": obj! {
                    "effects": [
                        effect!("saveCurrentStepAnswers"),
                        effect!("commitPendingCommands"),
                        effect!("emptyCollection", victims_collection().to_value()),
                    ],
                    "next": [
                        redirect(obj! {
                            "when": and(vec![has_victims(), data(victims_collection().name).matches(condition::is_required())]),
                            "goto": step::offence_analysis_victim_summary.path,
                        }),
                        redirect(obj! { "when": has_victims(), "goto": step::offence_analysis_victim.path }),
                        redirect(obj! { "goto": step::offence_analysis_involved_parties.path }),
                    ],
                },
                "onInvalid": obj! { "effects": [effect!("saveCurrentStepAnswers", false), effect!("commitPendingCommands")] },
            }),
        ],
    })
}

fn victim_card_actions() -> Value {
    obj! {
        "items": [
            obj! {
                "href": change_href_of(format(step::offence_analysis_victim_edit.path, [Loop.index0().into()]), &Value::from(question::offence_analysis_victim_relationship)),
                "text": "Change",
            },
            obj! {
                "href": "#",
                "text": "Delete",
                "attributes": obj! { "data-toggle": "modal", "data-target": Loop.index() },
            },
        ],
    }
}

fn victim_card_title() -> Value {
    let ordinal: Value = common().expr(format("ordinals.%1", [Loop.index().into()]).into(), []).into();
    obj! { "text": Ex::from_value(cf("victim_card_title", [ordinal])).pipe([transformer::string::capitalize()]) }
}

fn item_answer(code: &str) -> Ex {
    item().path("answers").path(code).path("value")
}

fn victim_card_rows() -> Vec<Value> {
    let v = victim_questions();
    let listed = |label_code: &str, q: &crate::forms::strengths_and_needs::constants::question_content::QuestionDef| {
        obj! {
            "key": obj! { "text": cf(&format!("question.{label_code}.text"), []) },
            "value": obj! { "text": generators::get_text_from_list_definition(q.content.entries(), item_answer(label_code)) },
        }
    };
    vec![
        obj! {
            "key": obj! { "text": cf("question.offence_analysis_victim_relationship.text", []) },
            "value": obj! {
                "blocks": [
                    govuk::BODY.build(obj! {
                        "text": generators::get_text_from_list_definition(
                            v.victim_type.content.entries(),
                            item_answer(question::offence_analysis_victim_relationship),
                        ),
                    }),
                    govuk::BODY.build(obj! {
                        "text": item_answer(question::offence_analysis_victim_relationship_other_details),
                        "size": "s",
                        "visibleWhen": item_answer(question::offence_analysis_victim_relationship).matches(condition::equals(common_option::other)),
                    }),
                ],
            },
        },
        listed(question::offence_analysis_victim_age, &v.victim_age),
        listed(question::offence_analysis_victim_sex, &v.victim_sex),
        listed(question::offence_analysis_victim_race, &v.victim_ethnicity),
    ]
}

/// One card per victim, each with its delete confirmation modal.
pub fn victim_cards() -> Value {
    let modal = MODAL.build(obj! {
        "id": Loop.index(),
        "title": cf("are_you_sure_you_want_to_delete", []),
        "buttonText": common_content_for("delete", []),
    });
    core_blocks::COLLECTION_BLOCK.build(obj! {
        "collection": data(victims_collection().name).each(iterator::map(
            when(is_edit_mode())
                .then(core_blocks::HTML.build(obj! {
                    "visibleWhen": is_edit_mode(),
                    "content": [
                        modal.clone(),
                        govuk::SUMMARY_LIST.build(obj! {
                            "card": obj! { "title": victim_card_title(), "actions": victim_card_actions() },
                            "rows": victim_card_rows(),
                        }),
                    ],
                }))
                .otherwise(core_blocks::HTML.build(obj! {
                    "visibleWhen": is_read_only_mode(),
                    "content": [
                        modal,
                        govuk::SUMMARY_LIST.build(obj! { "card": obj! { "title": victim_card_title() }, "rows": victim_card_rows() }),
                    ],
                })),
        )),
        "fallback": [govuk::INSET_TEXT.build(obj! { "text": cf("fallback.there_are_no_victims", []) })],
        "visibleWhen": has_victims(),
    })
}

pub fn victim_summary_step() -> Value {
    let this = &step::offence_analysis_victim_summary;
    let add_another = govuk::BUTTON.build(obj! {
        "text": "Add another victim",
        "name": "action",
        "value": "add_another",
        "classes": "govuk-button--secondary",
    });
    step(obj! {
        "path": this.route(),
        "title": "Victims summary",
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path]) } },
        "blocks": [victim_cards(), save_button(), add_another],
        "onAccess": [summary_view(this)],
        "validWhen": [
            valid_when_user_submitted(this.code),
            validation(obj! {
                "condition": or(vec![
                    data(victims_collection().name).matches(condition::is_required()),
                    answer(question::offence_analysis_who_was_the_victim).not().matches(condition::array::contains(option::one_or_more_person)),
                ]),
                "message": cf("validation.add_one_or_more_victims", []),
            }),
        ],
        "onSubmission": [
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! { "effects": [effect!("setUserSubmitted", this.code), effect!("commitPendingCommands")] },
                "onValid": obj! { "next": [redirect(obj! { "goto": step::offence_analysis_involved_parties.path })] },
            }),
            submit(obj! {
                "when": post("action").matches(condition::equals("add_another")),
                "onValid": obj! { "next": [redirect(obj! { "goto": step::offence_analysis_victim.path })] },
            }),
            submit(obj! {
                "when": post("delete").matches(condition::is_required()),
                "validate": true,
                "onAlways": obj! {
                    "effects": [
                        effect!("setUserSubmitted", step::offence_analysis_impact.code, is_user_submitted::FALSE),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                        effect!("commitPendingCommands"),
                    ],
                },
                "onValid": obj! {
                    "effects": [effect!("removeItemFromCollection", victims_collection().to_value(), post("delete"))],
                    "next": [redirect(obj! { "goto": this.path })],
                },
            }),
        ],
    })
}

fn victim_fields() -> Vec<Value> {
    let v = victim_questions();
    vec![v.victim_type.field(), v.victim_age.field(), v.victim_sex.field(), v.victim_ethnicity.field(), save_button()]
}

pub fn victim_step() -> Value {
    let this = &step::offence_analysis_victim;
    step(obj! {
        "path": this.route(),
        "title": "Add victim",
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path]) } },
        "blocks": victim_fields(),
        "validWhen": [valid_when_user_submitted(step::offence_analysis.code)],
        "onAccess": [summary_view(this)],
        "onSubmission": [submit(obj! {
            "when": post("action").matches(condition::equals("save")),
            "validate": true,
            "onAlways": obj! {
                "effects": [
                    effect!("setUserSubmitted", step::offence_analysis_impact.code, is_user_submitted::FALSE),
                    effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                    effect!("commitPendingCommands"),
                ],
            },
            "onValid": obj! {
                "effects": [effect!("addItemToCollection", victims_collection().to_value())],
                "next": [redirect(obj! { "goto": step::offence_analysis_victim_summary.path })],
            },
        })],
    })
}

pub fn edit_victim_step() -> Value {
    let this = &step::offence_analysis_victim_edit;
    let item_id = || params("itemId").pipe([transformer::string::to_int()]);
    step(obj! {
        "path": format!("/{VICTIM_EDIT_TEMPLATE_PATH}"),
        "title": "Add victim",
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path, step::offence_analysis_victim_summary.path]) } },
        "reachability": obj! { "entryWhen": true },
        "blocks": victim_fields(),
        "onAccess": [
            access(obj! { "effects": [effect!("loadItemFromCollection", victims_collection().to_value(), item_id())] }),
            summary_view(this),
        ],
        "validWhen": [valid_when_user_submitted(step::offence_analysis.code)],
        "onSubmission": [
            auto_save_victim_edit_submit(step::offence_analysis_victim_summary.code, victims_collection().to_value(), item_id().into()),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! {
                    "effects": [
                        effect!("setUserSubmitted", step::offence_analysis_victim_summary.code, is_user_submitted::FALSE),
                        effect!("setUserSubmitted", step::offence_analysis_impact.code, is_user_submitted::FALSE),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                        effect!("commitPendingCommands"),
                    ],
                },
                "onValid": obj! {
                    "effects": [
                        effect!("updateItemFromCollection", victims_collection().to_value(), item_id()),
                        effect!("setUserSubmitted", step::offence_analysis_summary.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                    ],
                    "next": [redirect(obj! { "goto": step::offence_analysis_victim_summary.path })],
                },
            }),
        ],
    })
}

pub fn involved_parties_step() -> Value {
    let this = &step::offence_analysis_involved_parties;
    step(obj! {
        "path": this.route(),
        "title": "Offence analysis Involved Parties",
        "view": obj! {
            "locals": obj! {
                "backlink": when(has_victims())
                    .then(route(&[SECTION.path, step::offence_analysis_victim_summary.path]))
                    .otherwise(route(&[SECTION.path])),
            },
        },
        "blocks": [section().q("offenceAnalysisWhoWasTheOffenceCommittedAgainst").field(), save_button()],
        "onAccess": [summary_view(this)],
        "validWhen": [valid_when_user_submitted(this.code)],
        "onSubmission": [
            autosave_submit(this.code, &SECTION),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! {
                    "effects": [
                        effect!("setUserSubmitted", this.code),
                        effect!("setUserSubmitted", step::offence_analysis_impact.code, is_user_submitted::FALSE),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                    ],
                },
                "onValid": obj! {
                    "effects": [effect!("saveCurrentStepAnswers"), effect!("commitPendingCommands")],
                    "next": [redirect(obj! { "goto": step::offence_analysis_impact.path })],
                },
                "onInvalid": obj! { "effects": [effect!("saveCurrentStepAnswers", false), effect!("commitPendingCommands")] },
            }),
        ],
    })
}

pub fn impact_step() -> Value {
    let this = &step::offence_analysis_impact;
    let s = section();
    let names = [
        "offenceAnalysisLeader",
        "offenceImpactOnVictims",
        "offenceAnalysisAcceptResponsibility",
        "offenceAnalysisEscalation",
        "offenceAnalysisPerpetratorOfDomesticAbuse",
        "offenceAnalysisVictimOfDomesticAbuse",
        "patternsOfOffending",
        "offenceAnalysisRisk",
    ];
    let mut blocks: Vec<Value> = names.iter().map(|n| s.q(n).field()).collect();
    blocks.push(mark_as_complete_button());
    step(obj! {
        "path": this.route(),
        "title": "Offence analysis impact",
        "view": obj! { "locals": obj! { "backlink": route(&[SECTION.path, step::offence_analysis_involved_parties.path]) } },
        "blocks": blocks,
        "onAccess": [summary_view(this)],
        "validWhen": [valid_when_user_submitted(this.code)],
        "onSubmission": [
            autosave_submit(this.code, &SECTION),
            submit(obj! {
                "when": post("action").matches(condition::equals("save")),
                "validate": true,
                "onAlways": obj! { "effects": [effect!("setUserSubmitted", this.code)] },
                "onValid": obj! {
                    "effects": [
                        effect!("saveCurrentStepAnswers"),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::YES),
                        effect!("commitPendingCommands"),
                    ],
                    "next": [redirect(obj! { "goto": step::offence_analysis_summary.path })],
                },
                "onInvalid": obj! {
                    "effects": [
                        effect!("saveCurrentStepAnswers", false),
                        effect!("setSectionProgress", SECTION.to_value(), section_complete::NO),
                        effect!("setUserSubmitted", step::offence_analysis_summary.code, is_user_submitted::FALSE),
                        effect!("commitPendingCommands"),
                    ],
                },
            }),
        ],
    })
}

pub fn summary() -> Value {
    crate::forms::strengths_and_needs::v1::steps::section_summary::summary_of(
        section(),
        &[
            "indexOffenceDescription",
            "offenceElements",
            "whyOffenceHappened",
            "motivations",
            "offenceCommitedAgainst",
            "offenceAnalysisWhoWasTheOffenceCommittedAgainst",
            "offenceAnalysisLeader",
            "offenceImpactOnVictims",
            "offenceAnalysisAcceptResponsibility",
            "offenceAnalysisEscalation",
            "offenceAnalysisPerpetratorOfDomesticAbuse",
            "offenceAnalysisVictimOfDomesticAbuse",
            "patternsOfOffending",
            "offenceAnalysisRisk",
        ],
    )
}

pub fn summary_step_() -> Value {
    let this = &step::offence_analysis_summary;
    let tab = govuk::TABS.build(obj! {
        "id": "summaries",
        "items": [obj! {
            "id": "summary",
            "label": common_content_for("summary", []),
            "panel": obj! { "blocks": [summary(), victim_cards()] },
        }],
    });
    step(obj! {
        "path": this.route(),
        "title": summary_page_title(&SECTION),
        "blocks": [tab],
        "reachability": obj! { "entryWhen": is_read_only_mode() },
        "onAccess": [summary_view(this)],
        "onSubmission": [submit(obj! {
            "when": post("delete").matches(condition::is_required()),
            "validate": true,
            "onValid": obj! {
                "effects": [effect!("removeItemFromCollection", victims_collection().to_value(), post("delete"))],
                "next": [redirect(obj! { "when": has_victims(), "goto": step::offence_analysis_victim_summary.path })],
            },
        })],
    })
}
