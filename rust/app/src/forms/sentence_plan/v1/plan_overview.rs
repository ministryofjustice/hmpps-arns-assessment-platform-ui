//! The plan, its agreement, history, previous versions, historic
//! versions and the print preview.

use super::common::*;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::sentence_plan::components::*;
use crate::forms::sentence_plan::constants::{SENTENCE_PLAN_OVERVIEW_PATH, case_data};
use crate::forms::sentence_plan::guards::*;

const TABS: [&str; 4] = ["current", "future", "achieved", "removed"];

fn plan_history_link(text: &str) -> String {
    format!("{text} <a href=\"plan-history\" class=\"govuk-link govuk-link--no-visited-state govuk-!-display-none-print\" data-ai-id=\"plan-overview-view-plan-history\">View plan history</a>")
}

fn notification_banners() -> Value {
    core_blocks::COLLECTION_BLOCK.build(obj! {
        "collection": data("notifications").each(iterator::map(moj::ALERT.build(obj! {
            "alertVariant": item().path("type"),
            "title": item().path("title"),
            "text": item().path("message"),
            "showTitleAsHeading": true,
        }))),
    })
}

/// The goals of the selected tab (`?goalStatusTab=`).
fn goals_in_tab(source: &str) -> Ex {
    let tab_status = |tab: &str, status: &str| and(vec![query_is("goalStatusTab", tab), item_status_is(status)]);
    data(source).each(iterator::filter(or(vec![
        tab_status("current", "ACTIVE"),
        tab_status("future", "FUTURE"),
        tab_status("achieved", "ACHIEVED"),
        tab_status("removed", "REMOVED"),
    ])))
}

/// The card props both variants share, up to (and excluding) `actions`.
fn card_props(with_error: bool, with_notes: bool) -> Value {
    let mut props = obj! {
        "goalTitle": item().path("title"),
        "goalStatus": item().path("status"),
        "goalUuid": item().path("uuid"),
        "targetDate": item().path("targetDate").pipe([long_date()]),
        "statusDate": item().path("statusDate").pipe([long_date()]),
    };
    if with_error {
        let missing_steps = and(vec![
            post_action_is("agree-plan"),
            item_status_is("ACTIVE"),
            item().path("steps").pipe([transformer::array::length()]).matches(condition::equals(0)),
        ]);
        props.set(
            "errorMessage",
            when(missing_steps).then(format("Add steps to '%1'", [item().path("title").into()])).otherwise("").into(),
        );
    }
    props.set("areaOfNeed", item().path("areaOfNeedLabel").into());
    props.set("relatedAreasOfNeed", item().path("relatedAreasOfNeedLabels").into());
    props.set("steps", card_steps(item().path("steps")).into());
    if with_notes {
        props.set("notes", card_notes(item().path("notes")).into());
    }
    props
}

fn with_tail(mut props: Value, actions: Value, is_read_only: Value, move_props: Value) -> Value {
    props.set("actions", actions);
    props.set("isReadOnly", is_read_only);
    props.set("index", Loop.index0().into());
    for (k, v) in move_props.as_object().cloned().unwrap_or_default().iter() {
        props.set(k.clone(), v.clone());
    }
    props
}

fn card_wrapper(visible_when: Value, slot: &str, card: Value) -> Value {
    let mut slots = Map::new();
    slots.insert(slot.into(), arr([card]));
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "visibleWhen": visible_when,
        "template": format!("{{{{slot:{slot}}}}}"),
        "slots": Value::object(slots),
    })
}

fn goal_list(visible_when: Value, source: &str, item_template: Ex, draft: Value, agreed: Value, post_agreement: Value) -> Value {
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "visibleWhen": visible_when,
        "template": "<ol class=\"goal-list govuk-list govuk-list--number\">{{slot:items}}</ol>",
        "slots": obj! {
            "items": arr([core_blocks::COLLECTION_BLOCK.build(obj! {
                "collection": goals_in_tab(source).each(iterator::map(core_blocks::TEMPLATE_WRAPPER.build(obj! {
                    "template": item_template,
                    "slots": obj! {
                        "card": arr([
                            card_wrapper(not(post_agreement.clone()), "draftCard", GOAL_SUMMARY_CARD_DRAFT.build(draft)),
                            card_wrapper(post_agreement, "agreedCard", GOAL_SUMMARY_CARD_AGREED.build(agreed)),
                        ]),
                    },
                }))),
            })]),
        },
    })
}

// ----- plan overview -----

fn move_button_props() -> Value {
    let hide = |flag: &str| not(or(vec![is_read_only_access(), item().path(flag).matches(condition::equals(true))]));
    obj! {
        "showMoveUp": when(hide("isFirstInStatus")),
        "showMoveDown": when(hide("isLastInStatus")),
        "moveUpHref": format("overview?goalUuid=%1&direction=up&status=%2", [item().path("uuid").into(), item().path("status").into()]),
        "moveDownHref": format("overview?goalUuid=%1&direction=down&status=%2", [item().path("uuid").into(), item().path("status").into()]),
    }
}

fn is_achieved_goal() -> Value {
    item_status_is("ACHIEVED")
}

fn plan_goals_section() -> Value {
    let achieved = is_achieved_goal;
    let goal_link = |page: &str| format(format!("../goal/%1/{page}"), [item().path("uuid").into()]);
    let draft_actions = arr([
        obj! {
            "text": when(achieved()).then("View details").otherwise("Update goal"),
            "href": when(achieved()).then(goal_link("view-inactive-goal")).otherwise(goal_link("change-goal")),
            "dataAiId": when(achieved())
                .then("goal-summary-card-view-inactive-goal-link")
                .otherwise("goal-summary-card-update-draft-goal-link"),
        },
        obj! {
            "text": "Add or update steps",
            "href": goal_link("add-steps"),
            "dataAiId": "goal-summary-card-add-or-update-goal-steps-link",
            "hidden": or(vec![
                achieved(),
                item().path("steps").pipe([transformer::array::length()]).matches(condition::equals(0)),
            ]),
        },
        obj! {
            "text": "Delete",
            "href": goal_link("confirm-delete-goal"),
            "dataAiId": "goal-summary-card-delete-goal-link",
            "hidden": achieved(),
        },
    ]);
    let inactive = || item().path("status").matches(condition::array::is_in(strings(&["ACHIEVED", "REMOVED"])));
    let agreed_actions = arr([obj! {
        "text": when(inactive()).then("View details").otherwise("Update"),
        "href": when(inactive()).then(goal_link("view-inactive-goal")).otherwise(goal_link("update-goal-steps")),
        "dataAiId": when(inactive())
            .then("goal-summary-card-view-inactive-goal-link")
            .otherwise("goal-summary-card-update-goal-link"),
    }]);
    let read_only: Value = when(is_read_only_access()).into();
    goal_list(
        data("goals").matches(condition::is_required()),
        "goals",
        format("<li class=\"goal-list__item\" id=\"goal-%1\" tabindex=\"-1\">{{slot:card}}</li>", [item().path("uuid").into()]),
        with_tail(card_props(true, true), draft_actions, read_only.clone(), move_button_props()),
        with_tail(card_props(true, true), agreed_actions, read_only, move_button_props()),
        has_post_agreement_status(),
    )
}

fn plan_sub_navigation() -> Value {
    let tab = |text: &str, status: &str, tab: &str, visible: Option<Value>| {
        let mut item = obj! {
            "text": format(format!("{text} (%1)"), [count_with_status("goals", status).into()]),
            "href": format!("overview?goalStatusTab={tab}"),
            "active": when(query_is("goalStatusTab", tab)),
        };
        if let Some(v) = visible {
            item.set("visibleWhen", v);
        }
        item.set("attributes", ai_id(format!("plan-overview-{tab}-goals-tab")));
        item
    };
    let has_removed = count_with_status("goals", "REMOVED").matches(condition::number::greater_than(0));
    moj::SUB_NAVIGATION.build(obj! {
        "label": "Plan sections",
        "items": arr([
            tab("Goals to work on now", "ACTIVE", "current", None),
            tab("Future goals", "FUTURE", "future", None),
            tab("Achieved goals", "ACHIEVED", "achieved", Some(count_with_status("goals", "ACHIEVED").matches(condition::number::greater_than(0)))),
            tab("Removed goals", "REMOVED", "removed", Some(and(vec![has_removed, has_post_agreement_status()]))),
        ]),
    })
}

fn plan_last_updated_message() -> Value {
    govuk::BODY.build(obj! {
        "visibleWhen": not(or(vec![
            data("isUpdatedAfterAgreement").not().matches(condition::equals(true)),
            and(vec![has_could_not_answer_status(), not(is_read_only_access())]),
        ])),
        "text": format(
            plan_history_link("Last updated on %1 by %2."),
            [data("lastUpdatedDate").pipe([long_date()]).into(), data("lastUpdatedByName").into()],
        ),
    })
}

fn plan_agreed_message() -> Value {
    govuk::BODY.build(obj! {
        "visibleWhen": not(or(vec![
            data("latestAgreementStatus").not().matches(condition::array::is_in(strings(&["UPDATED_AGREED", "AGREED"]))),
            data_is("isUpdatedAfterAgreement", true),
        ])),
        "text": format(
            plan_history_link("%1 agreed to their plan on %2."),
            [case_data::forename().into(), data("latestAgreementDate").pipe([long_date()]).into()],
        ),
    })
}

fn plan_created_message() -> Value {
    govuk::BODY.build(obj! {
        "visibleWhen": not(or(vec![
            data("latestAgreementStatus").not().matches(condition::array::is_in(strings(&["DO_NOT_AGREE", "UPDATED_DO_NOT_AGREE"]))),
            data_is("isUpdatedAfterAgreement", true),
        ])),
        "text": format(plan_history_link("Plan created on %1."), [data("latestAgreementDate").pipe([long_date()]).into()]),
    })
}

fn update_agreement_message() -> Value {
    govuk::BODY.build(obj! {
        "visibleWhen": and(vec![not(is_read_only_access()), has_could_not_answer_status()]),
        "text": format(
            "<a href=\"update-agree-plan\" class=\"govuk-link govuk-link--no-visited-state\" data-ai-id=\"plan-overview-update-plan-agreement\">Update %1's agreement</a> when you've shared the plan with them.",
            [case_data::forename().into()],
        ),
    })
}

fn blank_plan_read_only(visible_when: Value) -> Value {
    core_blocks::HTML.build(obj! {
        "visibleWhen": visible_when,
        "content": format(
            "<div id=\"blank-plan-content\">\n      <p class=\"govuk-body\">%1 does not have any goals to work on now.</p>\n    </div>",
            [case_data::forename().into()],
        ),
    })
}

fn hide_blank_plan(source_has_active: Value) -> Value {
    or(vec![query("goalStatusTab").matches(condition::array::is_in(strings(&["future", "achieved", "removed"]))), source_has_active])
}

fn blank_plan_content() -> Value {
    let agree = || post_action_is("agree-plan");
    let san = format(
        "<p class=\"govuk-body govuk-!-display-none-print\">%1 does not have any goals to work on now. You can either:</p>\n      <ul class=\"govuk-list govuk-list--bullet govuk-!-display-none-print\">\n        <li><a href=\"../goal/new/select-area-of-need\" class=\"govuk-link govuk-link--no-visited-state\" data-ai-id=\"plan-overview-create-goal-link\">create a goal with %1</a></li>\n        <li><a href=\"../about-person\" class=\"govuk-link govuk-link--no-visited-state\" data-ai-id=\"about-page-blank-plan-link\">view information from %1's assessment</a></li>\n      </ul>",
        [case_data::forename().into()],
    );
    let plain = format(
        "<p class=\"govuk-body govuk-!-display-none-print\">%1 does not have any goals to work on now. You can <a href=\"../goal/new/select-area-of-need\" class=\"govuk-link govuk-link--no-visited-state\" data-ai-id=\"plan-overview-create-goal-link\">create a goal with %1</a>.</p>",
        [case_data::forename().into()],
    );
    core_blocks::HTML.build(obj! {
        "visibleWhen": not(or(vec![is_read_only_access(), hide_blank_plan(has_at_least_one_active_goal())])),
        "content": format(
            "<div id=\"blank-plan-content\" class=\"%1\">%2%3</div>",
            [
                when(agree()).then("govuk-form-group govuk-form-group--error").otherwise("").into(),
                when(agree())
                    .then("<p class=\"govuk-error-message\"><span class=\"govuk-visually-hidden\">Error:</span> To agree the plan, create a goal to work on now</p>")
                    .otherwise("")
                    .into(),
                when(can_access_san_content()).then(san).otherwise(plain).into(),
            ],
        ),
    })
}

fn future_goals_content(source: &str) -> Value {
    govuk::BODY.build(obj! {
        "visibleWhen": not(or(vec![query("goalStatusTab").not().matches(condition::equals("future")), some_with_status(source, "FUTURE")])),
        "text": format("%1 does not have any future goals in their plan.", [case_data::forename().into()]),
        "classes": "govuk-!-display-none-print",
    })
}

pub fn plan_step() -> Value {
    let has_goals_in_displayed_tabs: Value = data("goals")
        .each(iterator::some(item().path("status").matches(condition::array::is_in(strings(&["ACTIVE", "FUTURE", "ACHIEVED"])))))
        .into();
    let show_print = and(vec![is_print_and_share_enabled(), or(vec![has_post_agreement_status(), has_goals_in_displayed_tabs])]);
    let tab_redirect = |status: &str, tab: &str| redirect_when(query_is("status", status), format!("overview?goalStatusTab={tab}"));
    step(obj! {
        "path": "/overview",
        "title": "Plan",
        "code": "plan-overview",
        "view": obj! {
            "locals": obj! {
                "headerPageHeading": format("%1 plan", [case_data::forename_possessive().into()]),
                "currentTab": query("goalStatusTab"),
                "buttons": obj! {
                    "showPrintAllGoalsButton": show_print,
                    "showReturnToOasysButton": is_oasys_access(),
                    "showCreateGoalButton": not(is_read_only_access()),
                    "showAgreePlanButton": and(vec![not(has_post_agreement_status()), not(is_read_only_access())]),
                },
            },
        },
        "validWhen": arr([
            validation(obj! {
                "condition": has_at_least_one_active_goal(),
                "message": "To agree the plan, create a goal to work on now",
                "details": obj! { "href": "#blank-plan-content" },
            }),
            data("goals")
                .each(iterator::filter(item_status_is("ACTIVE")))
                .each(iterator::map(validation(obj! {
                    "condition": item().path("steps").pipe([transformer::array::length()]).matches(condition::number::greater_than(0)),
                    "message": format("Add steps to '%1'", [item().path("title").into()]),
                    "details": obj! { "href": format("#goal-%1", [item().path("uuid").into()]) },
                })))
                .into(),
        ]),
        "reachability": obj! { "entryWhen": true },
        "blocks": arr([
            plan_last_updated_message(),
            plan_agreed_message(),
            plan_created_message(),
            update_agreement_message(),
            notification_banners(),
            plan_sub_navigation(),
            plan_goals_section(),
            blank_plan_read_only(not(or(vec![not(is_read_only_access()), hide_blank_plan(has_at_least_one_active_goal())]))),
            blank_plan_content(),
            future_goals_content("goals"),
        ]),
        "onAccess": arr([
            access(obj! {
                "when": and(vec![query("goalUuid").matches(condition::is_required()), not(is_read_only_access())]),
                "effects": arr([effect!("reorderGoal")]),
                "next": arr([
                    tab_redirect("FUTURE", "future"),
                    tab_redirect("ACHIEVED", "achieved"),
                    tab_redirect("REMOVED", "removed"),
                    redirect_to("overview?goalStatusTab=current"),
                ]),
            }),
            access(obj! {
                "effects": arr([effect!("loadPlanTimeline"), effect!("derivePlanLastUpdated")]),
                "next": arr([redirect_when(
                    query("goalStatusTab").not().matches(condition::array::is_in(strings(&TABS))),
                    "overview?goalStatusTab=current",
                )]),
            }),
            effects(vec![
                effect!("loadNotifications", "plan-overview"),
                audit_with("VIEW_PLAN_OVERVIEW", obj! { "tab": query("goalStatusTab") }),
            ]),
        ]),
        "onSubmission": arr([submit(obj! {
            "when": post_action_is("agree-plan"),
            "validate": true,
            "onValid": obj! { "next": arr([redirect_to("agree-plan")]) },
        })]),
    })
}

// ----- agree plan / update agreement -----

fn required(message: &str) -> Value {
    arr([validation(obj! { "condition": self_().matches(condition::is_required()), "message": message })])
}

fn details_field(code: &str, question: &str, value: &str, message: &str) -> Value {
    govuk::TEXTAREA.build(obj! {
        "code": code,
        "label": "Enter details",
        "dependentWhen": answer(question).matches(condition::equals(value)),
        "validWhen": required(message),
    })
}

fn legend(text: Ex) -> Value {
    obj! { "legend": obj! { "text": text, "classes": "govuk-fieldset__legend--l", "isPageHeading": true } }
}

fn notes_field(code: &str) -> Value {
    govuk::TEXTAREA.build(obj! { "code": code, "label": obj! { "text": "Add any notes (optional)", "classes": "govuk-label--m" } })
}

fn save_button(ai: &str) -> Value {
    govuk::BUTTON.build(obj! { "text": "Save", "name": "action", "value": "save", "attributes": ai_id(ai) })
}

pub fn agree_plan_step() -> Value {
    let question = govuk::RADIO_INPUT.build(obj! {
        "code": "plan_agreement_question",
        "fieldset": legend(format("Does %1 agree to this plan?", [case_data::forename().into()])),
        "hint": format("%1 must answer this question, or you must record why %1 could not.", [case_data::forename().into()]),
        "items": arr([
            obj! { "value": "yes", "text": "Yes, I agree", "attributes": ai_id("plan-overview-agree-plan-radio-yes") },
            obj! {
                "value": "no",
                "text": "No, I do not agree",
                "attributes": ai_id("plan-overview-agree-plan-radio-no"),
                "block": details_field("plan_agreement_details_no", "plan_agreement_question", "no", "Enter details about why they do not agree"),
            },
            obj! { "divider": "or" },
            obj! {
                "value": "could_not_answer",
                "text": format("%1 could not answer this question", [case_data::forename().into()]),
                "hint": format("Share this plan with %1 next time you see them.", [case_data::forename().into()]),
                "block": details_field(
                    "plan_agreement_details_could_not_answer",
                    "plan_agreement_question",
                    "could_not_answer",
                    "Enter details about why they could not answer",
                ),
                "attributes": ai_id("plan-overview-agree-plan-radio-could-not-answer"),
            },
        ]),
        "validWhen": required("Select if they agree to the plan, or that they could not answer this question"),
    });
    step(obj! {
        "path": "/agree-plan",
        "title": "Do they agree to this plan?",
        "reachability": obj! { "entryWhen": true },
        "blocks": arr([question, notes_field("plan_agreement_notes"), save_button("agree-plan-save-button")]),
        "view": obj! { "locals": obj! { "backlink": format("overview?goalStatusTab=%1", [query("goalStatusTab").nullish("current").into()]) } },
        "onAccess": arr([
            redirect_to_overview_if_read_only(),
            redirect_unless_all_active_goals_have_steps("overview"),
            effects(vec![audit("VIEW_PLAN_AGREEMENT")]),
        ]),
        "onSubmission": arr([submit(obj! {
            "when": post_action_is("save"),
            "validate": true,
            "onValid": handler(
                vec![
                    effect!("updatePlanAgreementStatus"),
                    audit_with("EDIT_PLAN_AGREEMENT", obj! { "agreementStatus": post("plan_agreement_question") }),
                ],
                vec![redirect_to("overview")],
            ),
        })]),
    })
}

pub fn update_agree_plan_step() -> Value {
    let question = govuk::RADIO_INPUT.build(obj! {
        "code": "update_plan_agreement_question",
        "fieldset": legend(format("Does %1 agree to their plan?", [case_data::forename().into()])),
        "hint": format("%1 must answer this question.", [case_data::forename().into()]),
        "items": arr([
            obj! { "value": "yes", "text": "Yes, I agree", "attributes": ai_id("update-agree-plan-agree-plan-radio-yes") },
            obj! {
                "value": "no",
                "text": "No, I do not agree",
                "attributes": ai_id("update-agree-plan-agree-plan-radio-no"),
                "block": details_field(
                    "update_plan_agreement_details_no",
                    "update_plan_agreement_question",
                    "no",
                    "Enter details about why they do not agree",
                ),
            },
        ]),
        "validWhen": required("Select if they agree to the plan"),
    });
    let go_back = core_blocks::HTML.build(obj! {
        "content": format(
            "<a href=\"overview?goalStatusTab=current\" class=\"govuk-link govuk-link--no-visited-state\" data-ai-id=\"update-agree-plan-back-to-plan-link\">Go back to %1's plan</a>",
            [case_data::forename().into()],
        ),
    });
    step(obj! {
        "path": "/update-agree-plan",
        "title": "Do they agree to their plan?",
        "blocks": arr([
            question,
            notes_field("update_plan_agreement_notes"),
            govuk::BUTTON_GROUP.build(obj! { "buttons": arr([save_button("update-agree-plan-save-button"), go_back]) }),
        ]),
        "onAccess": arr([
            redirect_to_overview_if_read_only(),
            redirect_unless_could_not_answer(SENTENCE_PLAN_OVERVIEW_PATH),
            effects(vec![audit("VIEW_PLAN_AGREEMENT_UPDATE")]),
        ]),
        "view": obj! {
            "locals": obj! {
                "backlink": when(data_is("navigationReferrer", "plan-history")).then("plan-history").otherwise("overview?goalStatusTab=current"),
            },
        },
        "onSubmission": arr([submit(obj! {
            "when": post_action_is("save"),
            "validate": true,
            "onValid": handler(
                vec![
                    effect!("updatePlanAgreement"),
                    audit_with("EDIT_PLAN_AGREEMENT_UPDATE", obj! { "agreementStatus": post("update_plan_agreement_question") }),
                ],
                vec![redirect_to("overview?goalStatusTab=current")],
            ),
        })]),
    })
}

// ----- plan history -----

const GOAL_EVENT_TYPES: [&str; 5] = ["goal_created", "goal_achieved", "goal_removed", "goal_readded", "goal_updated"];

fn p_body(source: Ex) -> Ex {
    format("<p class=\"govuk-body\">%1</p>", [source.pipe([escape()]).into()])
}

fn goal_heading(action: &str, actor: &str) -> Ex {
    format(
        "<strong>%1</strong> on %2 by %3",
        [Value::from(action), item().path("date").pipe([default_date()]).into(), item().path(actor).nullish("Unknown").pipe([escape()]).into()],
    )
}

fn goal_summary_with_notes(notes: &str) -> Ex {
    format(
        "<p class=\"govuk-body\"><strong>%1</strong></p>%2",
        [
            item().path("goalTitle").pipe([escape()]).into(),
            when(item().path(notes).matches(condition::is_required())).then(p_body(item().path(notes))).otherwise("").into(),
        ],
    )
}

fn agreement_heading() -> Ex {
    format(
        "<strong>%1</strong> on %2 by %3%4",
        [
            match_(item().path("status"))
                .branch(condition::array::is_in(strings(&["UPDATED_AGREED", "UPDATED_DO_NOT_AGREE"])), "Agreement updated")
                .case("AGREED", "Plan agreed")
                .otherwise("Plan created")
                .into(),
            item().path("date").pipe([default_date()]).into(),
            item().path("createdBy").nullish("Unknown").into(),
            when(item().path("status").matches(condition::array::is_in(strings(&["AGREED", "UPDATED_AGREED"]))))
                .then(format(" and %1", [case_data::forename().into()]))
                .otherwise("")
                .into(),
        ],
    )
}

fn agreement_summary() -> Ex {
    let statement = match_(item().path("status"))
        .branch(
            condition::array::is_in(strings(&["AGREED", "UPDATED_AGREED"])),
            format("%1 agreed to this plan.", [case_data::forename().into()]),
        )
        .branch(
            condition::array::is_in(strings(&["DO_NOT_AGREE", "UPDATED_DO_NOT_AGREE"])),
            format("%1 did not agree to this plan.", [case_data::forename().into()]),
        )
        .otherwise(format("%1 could not agree to this plan.", [case_data::forename().into()]));
    format("<p class=\"govuk-body\">%1</p>", [statement.into()])
}

fn agreement_content() -> Ex {
    let required_details = when(item().path("detailsNo").matches(condition::is_required()))
        .then(p_body(item().path("detailsNo")))
        .otherwise(
            when(item().path("detailsCouldNotAnswer").matches(condition::is_required()))
                .then(p_body(item().path("detailsCouldNotAnswer")))
                .otherwise(""),
        );
    let notes = when(item().path("status").matches(condition::array::is_in(strings(&[
        "AGREED",
        "DO_NOT_AGREE",
        "COULD_NOT_ANSWER",
        "UPDATED_AGREED",
        "UPDATED_DO_NOT_AGREE",
        "UPDATED_AGREED",
    ]))))
    .then(
        when(item().path("notes").matches(condition::is_required()))
            .then(p_body(item().path("notes")))
            .otherwise("<p class=\"govuk-body\">No additional notes.</p>"),
    )
    .otherwise("");
    let update_link = when(has_could_not_answer_status())
        .then(when(is_read_only_access()).then("").otherwise(format(
            "<p class=\"govuk-body\">\n                <a href=\"update-agree-plan\"\n                   class=\"govuk-link govuk-link--no-visited-state govuk-!-display-none-print\"\n                   data-qa=\"plan-history-update-agreement-link\"\n                   data-ai-id=\"plan-history-update-agreement-link\">\n                     Update %1 agreement\n                </a>\n            </p>",
            [case_data::forename_possessive().into()],
        )))
        .otherwise("");
    format("%1 %2 %3", [required_details.into(), notes.into(), update_link.into()])
}

fn by_event_type(otherwise: Ex, cases: [(&str, Ex); 5]) -> Value {
    let mut m = match_(item().path("type"));
    for (case, value) in cases {
        m = m.case(case, value);
    }
    m.otherwise(otherwise).into()
}

pub fn plan_history_step() -> Value {
    let date_or_empty = |key: &str| {
        when(item().path(key).matches(condition::is_required())).then(item().path(key).pipe([default_date()])).otherwise("")
    };
    let history_card = GOAL_SUMMARY_CARD_HISTORY.build(obj! {
        "visibleWhen": item().path("type").matches(condition::array::is_in(strings(&GOAL_EVENT_TYPES))),
        "goalTitle": item().path("goalTitle"),
        "goalStatus": item().path("goalStatus"),
        "goalUuid": item().path("goalUuid"),
        "targetDate": date_or_empty("targetDate"),
        "statusDate": date_or_empty("statusDate"),
        "areaOfNeed": item().path("areaOfNeedLabel"),
        "relatedAreasOfNeed": item().path("relatedAreasOfNeedLabels"),
        "steps": item().path("steps"),
        "actions": arr([obj! {
            "text": "View goal",
            "href": when(item().path("currentGoalStatus").matches(condition::array::is_in(strings(&["ACHIEVED", "REMOVED"]))))
                .then(format("../goal/%1/view-inactive-goal", [item().path("goalUuid").into()]))
                .otherwise(format("../goal/%1/update-goal-steps", [item().path("goalUuid").into()])),
            "dataAiId": "plan-history-summary-card-view-goal-link",
            "hidden": when(is_read_only_access()),
        }]),
    });
    let agreement_block = core_blocks::HTML.build(obj! {
        "visibleWhen": item().path("type").matches(condition::equals("agreement")),
        "content": agreement_content(),
    });
    let goal_added_summary = format("<p class=\"govuk-body\"><strong>%1</strong></p>", [item().path("goalTitle").pipe([escape()]).into()]);
    let accordion = govuk::ACCORDION.build(obj! {
        "id": "plan-history-accordion",
        "rememberExpanded": false,
        "items": data("planHistoryEntries").each(iterator::map(obj! {
            "heading": obj! {
                "html": by_event_type(agreement_heading(), [
                    ("goal_achieved", goal_heading("Goal marked as achieved", "achievedBy")),
                    ("goal_created", goal_heading("Goal created", "createdBy")),
                    ("goal_removed", goal_heading("Goal removed", "removedBy")),
                    ("goal_readded", goal_heading("Goal added back into plan", "readdedBy")),
                    ("goal_updated", goal_heading("Goal updated", "updatedBy")),
                ]),
            },
            "summary": obj! {
                "html": by_event_type(agreement_summary(), [
                    ("goal_achieved", goal_summary_with_notes("notes")),
                    ("goal_created", goal_added_summary),
                    ("goal_removed", goal_summary_with_notes("reason")),
                    ("goal_readded", goal_summary_with_notes("reason")),
                    ("goal_updated", goal_summary_with_notes("notes")),
                ]),
            },
            "content": obj! { "blocks": arr([history_card, agreement_block]) },
        })),
    });
    step(obj! {
        "path": "/plan-history",
        "title": "Plan history",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "headerPageHeading": "Plan history",
                "buttons": obj! { "showCreateGoalButton": not(is_read_only_access()), "showReturnToOasysButton": is_oasys_access() },
            },
        },
        "blocks": arr([govuk::BODY.build(obj! { "text": "View all updates to this plan." }), accordion]),
        "onAccess": arr([
            redirect_to_privacy_unless_accepted(),
            redirect_if_not_post_agreement("overview"),
            effects(vec![effect!("loadPlanTimeline"), effect!("derivePlanHistoryEntries"), audit("VIEW_PLAN_HISTORY")]),
        ]),
    })
}

pub fn previous_versions_step() -> Value {
    step(obj! {
        "path": "/previous-versions",
        "title": "Previous versions",
        "view": obj! {
            "locals": obj! {
                "hidePreviousVersions": true,
                "headerPageHeading": "Previous versions",
                "buttons": obj! { "showReturnToOasysButton": is_oasys_access() },
            },
        },
        "reachability": obj! { "entryWhen": true },
        "blocks": arr([PREVIOUS_VERSIONS.build(obj! {
            "personName": case_data::forename(),
            "previousVersions": data("previousVersions"),
            "showAssessmentColumn": data("showAssessmentColumn"),
        })]),
        "onAccess": arr([
            redirect_to_privacy_unless_accepted(),
            effects(vec![effect!("loadPreviousVersions"), audit("VIEW_PREVIOUS_VERSIONS")]),
        ]),
    })
}

// ----- print preview -----

fn goal_section(heading: &str, status: &str, show_when_empty: bool) -> Value {
    let lower = status.to_lowercase();
    let card = PRINT_GOAL_SUMMARY_CARD.build(obj! {
        "goalTitle": item().path("title"),
        "goalStatus": item().path("status"),
        "targetDate": item().path("targetDate").pipe([long_date()]),
        "statusDate": item().path("statusDate").pipe([long_date()]),
        "areaOfNeed": item().path("areaOfNeedLabel"),
        "relatedAreasOfNeed": item().path("relatedAreasOfNeedLabels"),
        "steps": card_steps(item().path("steps")),
    });
    let mut collection = obj! {
        "collection": data("goals").each(iterator::filter(item().path("status").matches(condition::equals(status)))).each(iterator::map(card)),
    };
    if status == "ACTIVE" {
        collection.set(
            "fallback",
            arr([govuk::BODY.build(obj! { "text": format("%1 does not have any goals to work on now.", [case_data::forename().into()]) })]),
        );
    }
    let mut def = obj! {};
    if !show_when_empty {
        def.set("visibleWhen", some_with_status("goals", status));
    }
    def.set(
        "template",
        Value::from(format!(
            "<section class=\"print-goal-section print-goal-section--{lower} govuk-!-margin-top-6\" aria-labelledby=\"goal-section-{lower}\">\n      <h2 class=\"govuk-heading-m\" id=\"goal-section-{lower}\">{heading}</h2>\n      {{{{slot:goals}}}}\n    </section>"
        )),
    );
    def.set("slots", obj! { "goals": arr([core_blocks::COLLECTION_BLOCK.build(collection)]) });
    core_blocks::TEMPLATE_WRAPPER.build(def)
}

pub fn print_preview_step() -> Value {
    let has_last_updated = || {
        and(vec![
            data_is("isUpdatedAfterAgreement", true),
            data("lastUpdatedDate").matches(condition::is_required()),
            data("lastUpdatedByName").matches(condition::is_required()),
        ])
    };
    let agreement_message = |statuses: &[&str], text: &str, args: Vec<Value>| {
        govuk::BODY.build(obj! {
            "visibleWhen": and(vec![
                not(has_last_updated()),
                data("latestAgreementDate").matches(condition::is_required()),
                data("latestAgreementStatus").matches(condition::array::is_in(strings(statuses))),
            ]),
            "text": format(text, args),
        })
    };
    let agreement_date: Value = data("latestAgreementDate").pipe([long_date()]).into();
    step(obj! {
        "path": "/print-preview",
        "title": "Print preview",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "user": Value::Null,
                "disableHeaderLink": true,
                "hideNavigation": true,
                "hidePreviousVersions": true,
                "hidePhaseBanner": true,
                "hideBackToTop": true,
                "showPrintPageHeaders": true,
                "headerPageHeading": format("%1 plan", [case_data::forename_possessive().into()]),
                "buttons": obj! { "showExportAsPdfButton": true, "showPrintButton": true },
            },
        },
        "blocks": arr([
            core_blocks::TEMPLATE_WRAPPER.build(obj! {
                "visibleWhen": or(vec![not(has_post_agreement_status()), has_could_not_answer_status()]),
                "template": "<div class=\"draft-plan-watermark\" aria-hidden=\"true\">DRAFT</div>",
            }),
            govuk::BODY.build(obj! {
                "visibleWhen": has_last_updated(),
                "text": format(
                    "Last updated on %1 by %2.",
                    [data("lastUpdatedDate").pipe([long_date()]).into(), data("lastUpdatedByName").into()],
                ),
            }),
            agreement_message(&["AGREED", "UPDATED_AGREED"], "%1 agreed to their plan on %2.", vec![case_data::forename().into(), agreement_date.clone()]),
            agreement_message(&["DO_NOT_AGREE", "UPDATED_DO_NOT_AGREE"], "Plan created on %1.", vec![agreement_date]),
            goal_section("Goals to work on now", "ACTIVE", true),
            goal_section("Future goals", "FUTURE", false),
            goal_section("Achieved goals", "ACHIEVED", false),
            goal_section("Removed goals", "REMOVED", false),
        ]),
        "onAccess": arr([
            redirect_to_overview_unless_print_and_share_enabled(),
            effects(vec![effect!("loadPlanTimeline"), effect!("derivePlanLastUpdated")]),
            access(obj! { "when": not(is_pdf_render_request()), "effects": arr([audit("PRINT_ALL_GOALS")]) }),
            access(obj! {
                "when": is_pdf_render_request(),
                "effects": arr([audit_with("PRINT_ALL_GOALS", obj! { "exportedAsPdf": true })]),
            }),
        ]),
    })
}

// ----- view historic -----

fn historic_post_agreement() -> Value {
    data("historic.latestAgreementStatus").matches(condition::array::is_in(strings(&POST_AGREEMENT_PROCESS_STATUSES)))
}

fn historic_sub_navigation() -> Value {
    let tab = |text: &str, status: &str, tab: &str| {
        obj! {
            "text": format(format!("{text} (%1)"), [count_with_status("historic.goals", status).into()]),
            "href": format(format!("%1?goalStatusTab={tab}"), [params("timestamp").into()]),
            "active": when(query_is("goalStatusTab", tab)),
            "attributes": ai_id(format!("view-historic-{tab}-goals-tab")),
        }
    };
    let current = tab("Goals to work on now", "ACTIVE", "current");
    let future = tab("Future goals", "FUTURE", "future");
    let achieved = tab("Achieved goals", "ACHIEVED", "achieved");
    let removed = tab("Removed goals", "REMOVED", "removed");
    let has = |status: &str| count_with_status("historic.goals", status).matches(condition::number::greater_than(0));
    moj::SUB_NAVIGATION.build(obj! {
        "label": "Plan sections",
        "items": when(has("ACHIEVED"))
            .then(
                when(has("REMOVED"))
                    .then(arr([current.clone(), future.clone(), achieved.clone(), removed.clone()]))
                    .otherwise(arr([current.clone(), future.clone(), achieved])),
            )
            .otherwise(
                when(has("REMOVED")).then(arr([current.clone(), future.clone(), removed])).otherwise(arr([current, future])),
            ),
    })
}

fn historic_goals_section() -> Value {
    let no_steps_error = || {
        and(vec![
            query_is("error", "no-steps"),
            item().path("steps").pipe([transformer::array::length()]).matches(condition::equals(0)),
        ])
    };
    let template = format(
        "<li class=\"goal-list__item %2\" id=\"goal-%1\">%3{{slot:card}}</li>",
        [
            item().path("uuid").into(),
            when(no_steps_error()).then("govuk-form-group govuk-form-group--error").otherwise("").into(),
            when(no_steps_error())
                .then(format(
                    "<span class=\"govuk-error-message\"><span class=\"govuk-visually-hidden\">Error:</span>Add steps to '%1'</span>",
                    [item().path("title").pipe([escape()]).into()],
                ))
                .otherwise("")
                .into(),
        ],
    );
    let moves = obj! { "showMoveUp": false, "showMoveDown": false, "moveUpHref": "", "moveDownHref": "" };
    goal_list(
        data("historic.goals").matches(condition::is_required()),
        "historic.goals",
        template,
        with_tail(card_props(false, false), arr([]), Value::Bool(true), moves.clone()),
        with_tail(card_props(false, false), arr([]), Value::Bool(true), moves),
        historic_post_agreement(),
    )
}

pub fn view_historic_step() -> Value {
    let historic_message = |statuses: &[&str], text: &str, args: Vec<Value>| {
        govuk::BODY.build(obj! {
            "visibleWhen": not(or(vec![
                data("historic.latestAgreementStatus").not().matches(condition::array::is_in(strings(statuses))),
                data_is("historic.isUpdatedAfterAgreement", true),
            ])),
            "text": format(text, args),
        })
    };
    let agreement_date: Value = data("historic.latestAgreementDate").pipe([long_date()]).into();
    step(obj! {
        "path": "/view-historic/:timestamp",
        "title": "View historic version",
        "view": obj! {
            "locals": obj! {
                "hidePreviousVersions": true,
                "hideNavigation": true,
                "hideFooter": true,
                "disableHeaderLink": true,
                "headerPageHeading": format("%1's plan", [case_data::forename().into()]),
                "currentTab": query("goalStatusTab"),
                "buttons": obj! {
                    "showReturnToOasysButton": and(vec![is_oasys_access(), data("navigationReferrer").not().matches(condition::is_required())]),
                    "showCreateGoalButton": false,
                    "showAgreePlanButton": false,
                },
                "hasPlanOverviewErrors": false,
                "alert": obj! {
                    "title": "Plan version date",
                    "message": format(
                        "This version is from %1",
                        [params("timestamp").pipe([transformer::string::to_timestamp_date(), transformer::date::format("Do MMMM YYYY")]).into()],
                    ),
                },
            },
        },
        "reachability": obj! { "entryWhen": true },
        "blocks": arr([
            govuk::BODY.build(obj! {
                "visibleWhen": data_is("historic.isUpdatedAfterAgreement", true),
                "text": format(
                    "Last updated on %1 by %2.",
                    [data("historic.lastUpdatedDate").pipe([long_date()]).into(), data("historic.lastUpdatedByName").into()],
                ),
            }),
            historic_message(&["UPDATED_AGREED", "AGREED"], "%1 agreed to their plan on %2.", vec![case_data::forename().into(), agreement_date.clone()]),
            historic_message(&["DO_NOT_AGREE", "UPDATED_DO_NOT_AGREE"], "Plan created on %1.", vec![agreement_date]),
            notification_banners(),
            historic_sub_navigation(),
            historic_goals_section(),
            blank_plan_read_only(not(hide_blank_plan(some_with_status("historic.goals", "ACTIVE")))),
            future_goals_content("historic.goals"),
        ]),
        "onAccess": arr([
            access(obj! {
                "effects": arr([effect!("loadPlanTimeline"), effect!("loadHistoricPlan"), effect!("derivePlanLastUpdatedForHistoric")]),
                "next": arr([redirect_when(
                    query("goalStatusTab").not().matches(condition::array::is_in(strings(&TABS))),
                    format("view-historic/%1?goalStatusTab=current", [params("timestamp").into()]),
                )]),
            }),
            effects(vec![audit_with("VIEW_HISTORIC_PLAN", obj! { "planVersionTimestamp": params("timestamp") })]),
        ]),
    })
}

pub fn plan_overview_journey() -> Value {
    journey(obj! {
        "code": "plan-overview",
        "title": "Plan Overview",
        "path": "/plan",
        "steps": arr([
            plan_step(),
            print_preview_step(),
            agree_plan_step(),
            update_agree_plan_step(),
            plan_history_step(),
            previous_versions_step(),
            view_historic_step(),
        ]),
    })
}
