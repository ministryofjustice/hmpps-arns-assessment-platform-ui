//! Creating, changing, achieving, removing, re-adding and viewing
//! goals, and adding, updating and reordering their steps.

use super::common::*;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::sentence_plan::components::*;
use crate::forms::sentence_plan::constants::{actor_label_options, case_data, sorted_areas_of_need};
use crate::forms::sentence_plan::guards::*;

const OVERVIEW: &str = "../../plan/overview";

fn required(message: &str) -> Value {
    validation(obj! { "condition": self_().matches(condition::is_required()), "message": message })
}

fn goal_path(page: &str) -> Ex {
    format(format!("../../goal/%1/{page}"), [data("activeGoal.uuid").into()])
}

fn heading(text: impl IntoValue) -> Value {
    govuk::HEADING.build(obj! { "text": text })
}

fn body(text: impl IntoValue) -> Value {
    govuk::BODY.build(obj! { "text": text })
}

fn action_button(text: &str, value: &str, ai: &str, extra: Value) -> Value {
    let mut props = obj! { "text": text, "name": "action", "value": value };
    for (k, v) in extra.as_object().cloned().unwrap_or_default().iter() {
        props.set(k.clone(), v.clone());
    }
    props.set("attributes", ai_id(ai));
    govuk::BUTTON.build(props)
}

fn template_wrapper(template: &str, slots: Vec<(&str, Value)>) -> Value {
    let mut map = Map::new();
    for (k, v) in slots {
        map.insert(k.into(), v);
    }
    core_blocks::TEMPLATE_WRAPPER.build(obj! { "template": template, "slots": Value::object(map) })
}

fn area_of_need_radio(checked: impl Fn(&str) -> Value) -> Value {
    govuk::RADIO_INPUT.build(obj! {
        "code": "area_of_need",
        "fieldset": obj! { "legend": obj! { "text": "What is the area of need?", "classes": "govuk-fieldset__legend--m" } },
        "items": Value::array(
            sorted_areas_of_need()
                .into_iter()
                .map(|a| {
                    let slug = a["slug"].as_str().unwrap_or_default();
                    obj! { "value": slug, "text": a["text"].as_str().unwrap_or_default(), "checked": checked(slug) }
                })
                .collect(),
        ),
        "validWhen": arr([required("Select an area of need")]),
    })
}

fn continue_button(ai: &str) -> Value {
    action_button("Continue", "continue", ai, obj! { "preventDoubleClick": true })
}

// ----- shared fields -----

pub fn related_areas_of_need() -> Value {
    govuk::CHECKBOX_INPUT.build(obj! {
        "code": "related_areas_of_need",
        "hint": obj! { "text": "Select all that apply", "classes": "app-label--body-text" },
        "fieldset": obj! {
            "legend": obj! {
                "text": "Which other areas of need is this goal related to?",
                "classes": "govuk-fieldset__legend--m govuk-visually-hidden",
            },
        },
        "items": data("otherAreasOfNeed").each(iterator::map(obj! {
            "value": item().path("slug"),
            "text": item().path("text"),
            "attributes": ai_id(format("related-area-of-need-%1-checkbox", [item().path("slug").into()])),
        })),
        "validWhen": arr([required("Select all related areas")]),
        "dependentWhen": answer("is_related_to_other_areas").matches(condition::equals("yes")),
    })
}

pub fn is_related_to_other_areas() -> Value {
    govuk::RADIO_INPUT.build(obj! {
        "code": "is_related_to_other_areas",
        "fieldset": obj! { "legend": obj! { "text": "Does this goal relate to any other areas of need?", "classes": "govuk-fieldset__legend--m" } },
        "items": arr([obj! { "value": "yes", "text": "Yes", "block": related_areas_of_need() }, obj! { "value": "no", "text": "No" }]),
        "validWhen": arr([required("Select yes if this goal is related to any other area of need")]),
    })
}

fn today() -> Ex {
    generator::date::today()
}

pub fn custom_target_date() -> Value {
    let not_valid = || self_().not().matches(condition::date::is_valid());
    moj::DATE_PICKER.build(obj! {
        "code": "custom_target_date",
        "label": obj! { "text": "Select a date" },
        "hint": "For example, 31/3/2028.",
        "minDate": today().pipe([transformer::date::format("DD/MM/YYYY")]),
        "maxDate": today().pipe([transformer::date::add_years(5), transformer::date::format("DD/MM/YYYY")]),
        "formatters": arr([transformer::string::to_iso_date()]),
        "validWhen": arr([
            required("Select a date"),
            validation(obj! {
                "condition": or(vec![self_().not().matches(condition::is_required()), self_().matches(condition::date::is_valid())]),
                "message": "Enter a date in the correct format, for example 31/3/2028",
            }),
            validation(obj! {
                "condition": or(vec![
                    not_valid(),
                    self_().matches(condition::date::is_today()),
                    self_().matches(condition::date::is_future_date()),
                ]),
                "message": "The date must be today or in the future",
            }),
            validation(obj! {
                "condition": or(vec![
                    not_valid(),
                    self_().matches(condition::date::is_before(today().pipe([
                        transformer::date::add_years(5),
                        transformer::date::add_days(1),
                        transformer::date::format("YYYY-MM-DD"),
                    ]))),
                ]),
                "message": "The date must be within the next 5 years",
            }),
        ]),
        "dependentWhen": answer("target_date_option").matches(condition::equals("set_another_date")),
    })
}

pub fn target_date_option() -> Value {
    let in_months = |months: i32| {
        obj! {
            "value": format!("date_in_{months}_months"),
            "text": format(
                format!("In {months} months (%1)"),
                [today().pipe([transformer::date::add_months(months), transformer::date::to_uk_long_date()]).into()],
            ),
            "attributes": ai_id(format!("target-date-option-{months}-months-radio")),
        }
    };
    govuk::RADIO_INPUT.build(obj! {
        "code": "target_date_option",
        "fieldset": obj! { "legend": obj! { "text": format("When does %1 aim to achieve this goal?", [case_data::forename().into()]) } },
        "items": arr([
            in_months(3),
            in_months(6),
            in_months(12),
            obj! { "divider": "or" },
            obj! {
                "value": "set_another_date",
                "text": "Set another date",
                "attributes": ai_id("target-date-option-set-another-date-radio"),
                "block": custom_target_date(),
            },
        ]),
        "validWhen": arr([required("Select when they should aim to achieve this goal")]),
        "dependentWhen": answer("can_start_now").matches(condition::equals("yes")),
    })
}

pub fn can_start_now() -> Value {
    govuk::RADIO_INPUT.build(obj! {
        "code": "can_start_now",
        "fieldset": obj! {
            "legend": obj! {
                "text": format("Can %1 start working on this goal now?", [case_data::forename().into()]),
                "classes": "govuk-fieldset__legend--m",
            },
        },
        "items": arr([
            obj! { "value": "yes", "text": "Yes", "block": target_date_option(), "attributes": ai_id("can-start-now-yes-radio") },
            obj! { "value": "no", "text": "No, it is a future goal", "attributes": ai_id("can-start-now-no-radio") },
        ]),
        "validWhen": arr([required("Select yes if they can start working on this goal now")]),
    })
}

/// The step status tags.
pub fn status_tag() -> Value {
    let tag = |text: &str, classes: Option<&str>, status: &str| {
        let mut props = obj! { "text": text };
        if let Some(c) = classes {
            props.set("classes", Value::from(c));
        }
        props.set("visibleWhen", item_status_is(status));
        govuk::TAG.build(props)
    };
    arr([
        tag("Not started", Some("govuk-tag--grey"), "NOT_STARTED"),
        tag("In progress", None, "IN_PROGRESS"),
        tag("Completed", Some("govuk-tag--green"), "COMPLETED"),
        tag("Cannot be done yet", Some("govuk-tag--pink"), "CANNOT_BE_DONE_YET"),
        tag("No longer needed", Some("govuk-tag--yellow"), "NO_LONGER_NEEDED"),
    ])
}

fn area_of_need_text() -> Ex {
    data("activeGoal.areaOfNeedLabel").pipe([transformer::string::to_lower_case(), escape()])
}

fn related_areas_text(separator: &str) -> Ex {
    data("activeGoal.relatedAreasOfNeedLabels").pipe([
        transformer::array::sort(),
        transformer::array::join(separator),
        transformer::string::to_lower_case(),
        escape(),
    ])
}

fn area_block_content(separator: &str) -> When {
    when(data("activeGoal.relatedAreasOfNeedLabels").matches(condition::is_required()))
        .then(format(
            "<p>Area of need: <strong>%1</strong><br>Also relates to: %2</p>",
            [area_of_need_text().into(), related_areas_text(separator).into()],
        ))
        .otherwise(format("<p>Area of need: <strong>%1</strong></p>", [area_of_need_text().into()]))
}

fn goal_block_content() -> Ex {
    format("<p>Goal: %1</p>", [data("activeGoal.title").pipe([escape()]).into()])
}

pub fn goal_context_inset_text() -> Value {
    govuk::INSET_TEXT.build(obj! {
        "classes": "govuk-!-margin-top-2",
        "blocks": arr([
            core_blocks::HTML.build(obj! { "content": area_block_content(", ") }),
            core_blocks::HTML.build(obj! { "content": goal_block_content() }),
        ]),
    })
}

// ----- shared step pieces -----

fn assessment_info_details(full_width: bool) -> Value {
    let mut props = obj! {
        "personName": case_data::forename(),
        "areaName": data("currentAreaOfNeed.text"),
        "assessmentData": data("currentAreaAssessment"),
        "status": data("currentAreaAssessmentStatus"),
    };
    if full_width {
        props.set("fullWidth", Value::Bool(true));
    }
    props.set("visibleWhen", can_access_san_content());
    ASSESSMENT_INFO_DETAILS.build(props)
}

fn goal_title_autocomplete(label: Ex, hint: &str, message: &str) -> Value {
    ACCESSIBLE_AUTOCOMPLETE.build(obj! {
        "data": data("currentAreaOfNeed.goals"),
        "classes": "govuk-!-width-two-thirds",
        "field": govuk::TEXT_INPUT.build(obj! {
            "code": "goal_title",
            "label": obj! { "text": label, "classes": "govuk-label--m" },
            "hint": hint,
            "validWhen": arr([required(message)]),
        }),
    })
}

fn area_of_need_inset(change_href: Ex, ai: &str) -> Value {
    govuk::INSET_TEXT.build(obj! {
        "blocks": arr([
            body(format(
                "Area of need: <strong>%1</strong>",
                [data("currentAreaOfNeed.text").pipe([transformer::string::to_lower_case(), escape()]).into()],
            )),
            govuk::BODY.build(obj! {
                "classes": "govuk-!-margin-bottom-0",
                "text": format(
                    format!("<a class=\"govuk-link govuk-link--no-visited-state\" href=\"%1\" data-ai-id=\"{ai}\">Change area of need</a>"),
                    [change_href.into()],
                ),
            }),
        ]),
    })
}

fn goal_card(component: Component, with_target: bool, with_status: bool, with_notes: bool) -> Value {
    let mut props = obj! { "goalTitle": data("activeGoal.title"), "goalStatus": data("activeGoal.status") };
    if with_target {
        props.set("targetDate", data("activeGoal.targetDate").pipe([long_date()]).into());
    }
    if with_status {
        props.set("statusDate", data("activeGoal.statusDate").pipe([long_date()]).into());
    }
    props.set("areaOfNeed", data("activeGoal.areaOfNeedLabel").into());
    props.set("relatedAreasOfNeed", data("activeGoal.relatedAreasOfNeedLabels").into());
    if with_notes {
        props.set("notes", card_notes(data("activeGoal.notes")).into());
    }
    props.set("steps", card_steps(data("activeGoal.steps")).into());
    component.build(props)
}

/// A cancel link: `href` is the link template (with `%1`) and `arg` fills it.
fn cancel_link(href: &str, arg: Value, ai: &str, text: &str) -> Value {
    body(format(format!("<a href=\"{href}\" class=\"govuk-link\" data-ai-id=\"{ai}\">{text}</a>"), [arg]))
}

fn confirm_button(ai: &str, prevent_double_click: bool) -> Value {
    let extra = if prevent_double_click { obj! { "preventDoubleClick": true } } else { obj! {} };
    action_button("Confirm", "confirm", ai, extra)
}

fn two_thirds(blocks: Vec<Value>) -> Value {
    govuk::GRID_ROW.build(obj! { "columns": arr([obj! { "width": "two-thirds", "blocks": Value::array(blocks) }]) })
}

fn textarea(code: &str, label: Value, rows: &str, validate: Option<&str>) -> Value {
    let mut props = obj! { "code": code, "label": label, "rows": rows };
    if let Some(message) = validate {
        props.set("validWhen", arr([required(message)]));
    }
    govuk::TEXTAREA.build(props)
}

fn notes_collection() -> Value {
    let created = || item().path("createdAt").pipe([long_date()]);
    let type_label = |kind: &str, text: &str| {
        govuk::BODY.build(obj! {
            "visibleWhen": item().path("type").matches(condition::equals(kind)),
            "text": format(text, [created().into()]),
        })
    };
    core_blocks::COLLECTION_BLOCK.build(obj! {
        "collection": data("activeGoal.notes").each(iterator::map(core_blocks::TEMPLATE_WRAPPER.build(obj! {
            "template": "<label class=\"govuk-heading-s\">{{createdAt}} by {{createdBy}}</label>\n                       {{slot:typeLabel}}\n                       <p class=\"goal-note\">{{note}}</p>",
            "values": obj! { "createdAt": created(), "createdBy": item().path("createdBy"), "note": item().path("note") },
            "slots": obj! {
                "typeLabel": arr([
                    type_label("READDED", "Goal added back into plan on %1."),
                    type_label("REMOVED", "Goal removed on %1."),
                ]),
            },
        }))),
        "fallback": arr([body("There are no notes on this goal yet.")]),
    })
}

fn steps_table(status_slot: Value) -> Value {
    let row_template = "<tr class=\"govuk-table__row\">\n                  <td class=\"govuk-table__cell\">{{actorLabel}}</td>\n                  <td class=\"govuk-table__cell\">{{description}}</td>\n                  <td class=\"govuk-table__cell\">{{slot:statusField}}</td>\n                </tr>";
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "visibleWhen": data("activeGoal.steps").matches(condition::is_required()),
        "template": "\n    <table class=\"govuk-table goal-summary-card__steps\">\n      <thead class=\"govuk-table__head\">\n        <tr class=\"govuk-table__row\">\n          <th scope=\"col\" class=\"govuk-table__header\">Who will do this</th>\n          <th scope=\"col\" class=\"govuk-table__header\">Steps</th>\n          <th scope=\"col\" class=\"govuk-table__header\">Status</th>\n        </tr>\n      </thead>\n      <tbody class=\"govuk-table__body\">\n        {{slot:steps}}\n      </tbody>\n    </table>\n  ",
        "slots": obj! {
            "steps": arr([core_blocks::COLLECTION_BLOCK.build(obj! {
                "collection": data("activeGoal.steps").each(iterator::map(core_blocks::TEMPLATE_WRAPPER.build(obj! {
                    "template": row_template,
                    "values": obj! {
                        "actorLabel": item().path("actorLabel").pipe([escape()]),
                        "description": item().path("description").pipe([escape()]),
                    },
                    "slots": obj! { "statusField": status_slot },
                }))),
            })]),
        },
    })
}

const STEP_STATUSES: [(&str, &str); 5] = [
    ("NOT_STARTED", "Not started"),
    ("IN_PROGRESS", "In progress"),
    ("COMPLETED", "Completed"),
    ("CANNOT_BE_DONE_YET", "Cannot be done yet"),
    ("NO_LONGER_NEEDED", "No longer needed"),
];

// ----- select area of need / add goal -----

pub fn select_area_of_need_step() -> Value {
    let tab = || query("goalStatusTab").matches(condition::is_required());
    step(obj! {
        "path": "/select-area-of-need",
        "title": "Create a goal",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "backlink": when(query("change").matches(condition::is_required()))
                    .then(
                        when(tab())
                            .then(format("add-goal/%1?goalStatusTab=%2", [query("area").into(), query("goalStatusTab").into()]))
                            .otherwise(format("add-goal/%1", [query("area").into()])),
                    )
                    .otherwise(
                        when(tab())
                            .then(format("../../plan/overview?goalStatusTab=%1", [query("goalStatusTab").into()]))
                            .otherwise("../../plan/overview"),
                    ),
            },
        },
        "blocks": arr([
            heading(format("Create a goal with %1", [case_data::forename().into()])),
            area_of_need_radio(|slug| query("area").matches(condition::equals(slug))),
            continue_button("select-area-of-need-continue-button"),
        ]),
        "onAccess": arr([effects(vec![audit("VIEW_SELECT_AREA_OF_NEED")])]),
        "onSubmission": arr([submit(obj! {
            "validate": true,
            "onValid": obj! {
                "next": arr([
                    redirect_when(tab(), format("add-goal/%1?goalStatusTab=%2", [answer("area_of_need").into(), query("goalStatusTab").into()])),
                    redirect_to(format("add-goal/%1", [answer("area_of_need").into()])),
                ]),
            },
        })]),
    })
}

fn goal_created_notification(message: &str, clear_others: bool) -> Value {
    let mut props = obj! {
        "type": "success",
        "message": format(message, [case_data::forename_possessive().into()]),
        "target": "plan-overview",
    };
    if clear_others {
        props.set("clearOtherNotifications", Value::Bool(true));
    }
    notify(props)
}

pub fn create_goal_step() -> Value {
    let tab = || query("goalStatusTab").matches(condition::is_required());
    let area_link = |extra: &str| {
        when(tab())
            .then(format(
                format!("../select-area-of-need?area=%1&goalStatusTab=%2{extra}"),
                [params("areaOfNeed").into(), query("goalStatusTab").into()],
            ))
            .otherwise(format(format!("../select-area-of-need?area=%1{extra}"), [params("areaOfNeed").into()]))
    };
    let created = || {
        vec![
            effect!("createGoal"),
            audit_with("CREATE_GOAL", obj! { "areaOfNeed": params("areaOfNeed") }),
            goal_created_notification("You added a goal to %1 plan", false),
        ]
    };
    step(obj! {
        "path": "/add-goal/:areaOfNeed",
        "title": "Add goal details",
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "backlink": area_link("") } },
        "blocks": arr([
            heading(format("What goal does %1 aim to achieve?", [case_data::forename().into()])),
            assessment_info_details(true),
            goal_title_autocomplete(
                literal("Search goals or enter your own"),
                "Start typing keywords to view suggested goals or enter your own.",
                "Select or enter a goal",
            ),
            area_of_need_inset(Ex::from_value(area_link("&change=true")), "create-goal-change-area-of-need-link"),
            is_related_to_other_areas(),
            can_start_now(),
            govuk::BUTTON_GROUP.build(obj! {
                "buttons": arr([
                    action_button("Add steps", "addSteps", "create-goal-add-steps-button", obj! { "preventDoubleClick": true }),
                    govuk::BUTTON.build(obj! {
                        "classes": "govuk-button--secondary",
                        "text": "Save without steps",
                        "name": "action",
                        "value": "saveWithoutSteps",
                        "preventDoubleClick": true,
                        "attributes": ai_id("create-goal-save-without-steps-button"),
                    }),
                ]),
                "classes": "govuk-!-margin-top-4",
            }),
        ]),
        "onAccess": arr([
            effects(vec![
                effect!("setAreaDataFromUrlParam"),
                effect!("loadAreaAssessmentInfo"),
                audit_with("VIEW_CREATE_GOAL", obj! { "areaOfNeed": params("areaOfNeed") }),
            ]),
            access(obj! {
                "when": params("uuid").matches(condition::equals(":uuid")),
                "next": arr([redirect_to(format("../new/add-goal/%1", [params("areaOfNeed").into()]))]),
            }),
            access(obj! {
                "when": params("areaOfNeed").not().matches(condition::array::is_in(data("areaOfNeedSlugs"))),
                "next": arr([
                    redirect_when(tab(), format("../select-area-of-need?goalStatusTab=%1", [query("goalStatusTab").into()])),
                    redirect_to("../select-area-of-need"),
                ]),
            }),
        ]),
        "onSubmission": arr([
            submit(obj! {
                "when": post_action_is("addSteps"),
                "validate": true,
                "onValid": handler(created(), vec![redirect_to(format("../../%1/add-steps", [data("activeGoalUuid").into()]))]),
            }),
            submit(obj! {
                "when": post_action_is("saveWithoutSteps"),
                "validate": true,
                "onValid": handler(
                    created(),
                    vec![
                        redirect_when(answer("can_start_now").matches(condition::equals("no")), "../../../plan/overview?goalStatusTab=future"),
                        redirect_to("../../../plan/overview?goalStatusTab=current"),
                    ],
                ),
            }),
        ]),
    })
}

// ----- add steps / reorder steps -----

const STEP_ACTOR_LABEL: &str = "Who will do the step?";
const STEP_DESCRIPTION_LABEL: &str = "What should they do to achieve the goal?";
const STEP_STATUS_LABEL: &str = "What is the status?";

fn add_steps_title() -> When {
    when(or(vec![
        data_is("navigationReferrer", "add-goal"),
        data("activeGoal.steps").not().matches(condition::is_required()),
    ]))
    .then("Add steps")
    .otherwise("Add or update steps")
}

fn column(width: &str, blocks: Vec<Value>) -> Value {
    obj! { "width": width, "blocks": Value::array(blocks) }
}

fn bold_label(text: &str) -> Value {
    govuk::BODY.build(obj! { "text": text, "classes": "govuk-!-font-weight-bold govuk-!-margin-bottom-1" })
}

fn hidden_label(text: &str) -> Value {
    obj! { "text": text, "classes": "govuk-visually-hidden" }
}

fn status_options() -> Value {
    Value::array(STEP_STATUSES.iter().map(|(value, text)| obj! { "value": *value, "text": *text }).collect())
}

fn step_rows() -> Value {
    let is_single_step = || data("activeGoalStepsEdited").pipe([transformer::array::length()]).matches(condition::equals(1));
    let index_code = |prefix: &str| format(format!("{prefix}_%1"), [Loop.index0().into()]);
    let row = govuk::GRID_ROW.build(obj! {
        "classes": "step-row",
        "attributes": obj! { "data-qa": "step-row" },
        "columns": arr([
            column("one-sixth", vec![WRAPPING_SELECT.build(obj! {
                "field": govuk::SELECT_INPUT.build(obj! {
                    "code": index_code("step_actor"),
                    "label": hidden_label(STEP_ACTOR_LABEL),
                    "items": actor_label_options(),
                    "defaultValue": item().path("actor"),
                    "validWhen": arr([required("Select who will do the step")]),
                }),
            })]),
            column("one-half", vec![govuk::TEXTAREA.build(obj! {
                "code": index_code("step_description"),
                "label": hidden_label(STEP_DESCRIPTION_LABEL),
                "autocomplete": "off",
                "rows": "1",
                "classes": "govuk-!-width-full app-autosize-textarea",
                "attributes": obj! { "data-autosize": "true" },
                "defaultValue": item().path("description"),
                "validWhen": arr([required("Enter what they should do to achieve the goal")]),
            })]),
            column("one-sixth", vec![WRAPPING_SELECT.build(obj! {
                "field": govuk::SELECT_INPUT.build(obj! {
                    "code": index_code("step_status"),
                    "label": hidden_label(STEP_STATUS_LABEL),
                    "items": status_options(),
                    "defaultValue": item().path("status"),
                }),
            })]),
            column("one-sixth", vec![BUTTON_AS_LINK.build(obj! {
                "text": when(is_single_step()).then("Clear").otherwise("Remove"),
                "name": "action",
                "value": format("remove_%1", [Loop.index0().into()]),
                "classes": "govuk-!-margin-bottom-0",
                "attributes": obj! {
                    "data-ai-id": when(is_single_step())
                        .then("add-update-steps-clear-step-link")
                        .otherwise(format("add-update-steps-remove-step-link-%1", [Loop.index0().into()])),
                },
            })]),
        ]),
    });
    core_blocks::HTML.build(obj! {
        "tag": "div",
        "classes": "step-rows",
        "content": data("activeGoalStepsEdited").each(iterator::map(row)),
    })
}

fn add_steps_layout() -> Value {
    let is_single_step = data("activeGoalStepsEdited").pipe([transformer::array::length()]).matches(condition::equals(1));
    let secondary = |text: &str, value: &str, ai: &str| {
        obj! { "text": text, "name": "action", "value": value, "classes": "govuk-button--secondary", "attributes": ai_id(ai) }
    };
    let mut reorder = secondary("Reorder steps", "reorderSteps", "add-steps-reorder-steps-button");
    reorder.set("visibleWhen", not(is_single_step));
    let reorder = govuk::BUTTON.build(reorder);
    template_wrapper(
        "\n      {{slot:hiddenDefaultSubmit}}\n      <div>\n        {{slot:pageHeading}}\n        {{slot:assessmentInfoDetails}}\n        {{slot:goalContextInsetText}}\n        {{slot:columnHeaders}}\n        {{slot:stepRows}}\n        {{slot:stepActionsButtonGroup}}\n      </div>\n      {{slot:saveAndContinueButton}}\n  ",
        vec![
            (
                "hiddenDefaultSubmit",
                arr([core_blocks::HTML.build(obj! {
                    "content": "<button aria-hidden=\"true\" tabindex=\"-1\" value=\"addStep\" type=\"submit\" name=\"action\" class=\"govuk-visually-hidden\">Add another step</button>",
                })]),
            ),
            ("pageHeading", arr([heading(add_steps_title())])),
            ("assessmentInfoDetails", arr([assessment_info_details(false)])),
            ("goalContextInsetText", arr([goal_context_inset_text()])),
            (
                "columnHeaders",
                arr([govuk::GRID_ROW.build(obj! {
                    "classes": "govuk-!-margin-bottom-2 step-row-headers",
                    "columns": arr([
                        column("one-sixth", vec![bold_label(STEP_ACTOR_LABEL)]),
                        column("one-half", vec![bold_label(STEP_DESCRIPTION_LABEL)]),
                        column("one-sixth", vec![bold_label(STEP_STATUS_LABEL)]),
                    ]),
                })]),
            ),
            ("stepRows", arr([step_rows()])),
            (
                "saveAndContinueButton",
                arr([action_button("Save and continue", "saveAndContinue", "add-steps-save-and-continue-button", obj! { "preventDoubleClick": true })]),
            ),
            (
                "stepActionsButtonGroup",
                arr([govuk::BUTTON_GROUP.build(obj! {
                    "buttons": arr([govuk::BUTTON.build(secondary("Add another step", "addStep", "add-steps-add-another-step-button")), reorder]),
                })]),
            ),
        ],
    )
}

pub fn add_steps_step() -> Value {
    let from_add_goal = || data_is("navigationReferrer", "add-goal");
    let save = || effect!("saveStepEditSession");
    let added = || goal_created_notification("You added a goal with steps to %1 plan", true);
    let to_confirm_if_achieved = || redirect_when(data_is("allStepsCompleted", true), goal_path("confirm-if-achieved"));
    let mut existing_next = vec![
        to_confirm_if_achieved(),
        redirect_when(data_is("navigationReferrer", "update-goal-steps"), goal_path("update-goal-steps")),
    ];
    existing_next.extend(overview_by_goal_status());
    let mut new_next = vec![to_confirm_if_achieved()];
    new_next.extend(overview_by_goal_status());
    step(obj! {
        "path": "/add-steps",
        "title": "Add steps",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "dynamicTitle": add_steps_title(),
                "backlink": match_(data("navigationReferrer"))
                    .case("add-goal", goal_path("change-goal"))
                    .case("update-goal-steps", goal_path("update-goal-steps"))
                    .otherwise(
                        when(data_is("activeGoal.status", "ACTIVE"))
                            .then("../../plan/overview?goalStatusTab=current")
                            .otherwise("../../plan/overview?goalStatusTab=future"),
                    ),
            },
        },
        "blocks": arr([add_steps_layout()]),
        "onAccess": arr([
            effects(vec![effect!("setActiveGoalContext"), effect!("setAreaDataFromActiveGoal"), effect!("loadAreaAssessmentInfo")]),
            access(obj! {
                "when": request::method().matches(condition::equals("GET")),
                "effects": arr([effect!("discardStepEditSession"), audit("VIEW_ADD_STEPS")]),
            }),
            effects(vec![effect!("initializeStepEditSession")]),
            redirect_if_goal_not_found(OVERVIEW),
            redirect_unless_goal_is_active_or_future(OVERVIEW),
        ]),
        "onSubmission": arr([
            submit(obj! {
                "when": post_action_is("addStep"),
                "validate": false,
                "onAlways": obj! { "effects": arr([effect!("addStepToStepEditSession")]) },
            }),
            submit(obj! {
                "when": post("action").matches(condition::string::starts_with("remove_")),
                "validate": false,
                "onAlways": obj! { "effects": arr([effect!("removeStepFromStepEditSession")]) },
            }),
            submit(obj! {
                "when": and(vec![post_action_is("reorderSteps"), from_add_goal()]),
                "validate": true,
                "onValid": handler(vec![save(), audit("ADD_STEPS"), added()], vec![redirect_to("reorder-steps")]),
            }),
            submit(obj! {
                "when": post_action_is("reorderSteps"),
                "validate": true,
                "onValid": handler(vec![save(), audit("EDIT_STEPS")], vec![redirect_to("reorder-steps")]),
            }),
            submit(obj! {
                "when": and(vec![post_action_is("saveAndContinue"), from_add_goal()]),
                "validate": true,
                "onValid": handler(vec![save(), audit("ADD_STEPS"), added()], new_next),
            }),
            submit(obj! {
                "when": post_action_is("saveAndContinue"),
                "validate": true,
                "onValid": handler(vec![save(), audit("EDIT_STEPS")], existing_next),
            }),
        ]),
    })
}

/// `StepSummaryCardTable`: the reorderable steps table.
fn step_summary_card_table(page: &str, focus_selector: Option<&str>) -> Value {
    let step_count = data("activeGoal.steps").pipe([transformer::array::length()]);
    let is_first = || Loop.index0().matches(condition::equals(0));
    let is_last = || Loop.index0().matches(condition::equals(step_count.pipe([transformer::number::subtract(1)])));
    let description = || item().path("description").pipe([escape()]);
    let move_attributes = |direction: &str, offset: &str| {
        let mut a = obj! { "data-ai-id": format(format!("{page}-move-{direction}-%1"), [Loop.index0().into()]) };
        if let Some(focus) = focus_selector {
            a.set("data-scroll-restore-focus", Value::from(focus));
            a.set("data-scroll-restore-offset", Value::from(offset));
        }
        a
    };
    let move_button = |label: &str, value: &str, hidden_when: Value, direction: &str, offset: &str| {
        govuk::BUTTON.build(obj! {
            "html": format(format!("{label}<span class=\"govuk-visually-hidden\"> (%1)</span>"), [description().into()]),
            "name": "action",
            "value": format(format!("{value}_%1"), [Loop.index0().into()]),
            "classes": "govuk-button--secondary govuk-!-margin-bottom-0",
            "visibleWhen": when(hidden_when).then(false).otherwise(true),
            "attributes": move_attributes(direction, offset),
        })
    };
    let spacer = core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<tr aria-hidden=\"true\" class=\"reorder-steps-table__spacer\"><td colspan=\"4\"></td></tr>",
        "visibleWhen": when(is_last()).then(false).otherwise(true),
    });
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "<table class=\"govuk-table reorder-steps-table\" aria-label=\"Reorder steps\">\n      <thead class=\"govuk-table__head\">\n        <tr class=\"govuk-table__row\">\n          <th scope=\"col\" class=\"govuk-table__header reorder-steps-table__counter-header\"><span class=\"govuk-visually-hidden\">Step number</span></th>\n          <th scope=\"col\" class=\"govuk-table__header reorder-steps-table__actor-header\">Who will do this</th>\n          <th scope=\"col\" class=\"govuk-table__header reorder-steps-table__steps-header\">Steps</th>\n          <th scope=\"col\" class=\"govuk-table__header\">Status</th>\n        </tr>\n      </thead>\n      {{slot:steps}}\n    </table>",
        "slots": obj! {
            "steps": arr([core_blocks::COLLECTION_BLOCK.build(obj! {
                "collection": data("activeGoal.steps").each(iterator::map(core_blocks::TEMPLATE_WRAPPER.build(obj! {
                    "template": "<tbody id=\"step-{{stepIndex}}\" tabindex=\"-1\">\n                  <tr class=\"govuk-table__row reorder-steps-table__data-row\">\n                    <td class=\"govuk-table__cell reorder-steps-table__counter\" rowspan=\"2\">{{stepNumber}}.</td>\n                    <td class=\"govuk-table__cell\">{{actorLabel}}</td>\n                    <td class=\"govuk-table__cell\">{{description}}</td>\n                    <td class=\"govuk-table__cell\">{{slot:status}}</td>\n                  </tr>\n                  <tr class=\"govuk-table__row reorder-steps-table__actions-row\">\n                    <td class=\"govuk-table__cell\" colspan=\"3\">\n                      <div class=\"govuk-button-group govuk-!-margin-bottom-0\">\n                        {{slot:moveButtons}}\n                      </div>\n                    </td>\n                  </tr>\n                  {{slot:spacer}}\n                </tbody>",
                    "values": obj! {
                        "stepIndex": Loop.index0(),
                        "stepNumber": Loop.index0().pipe([transformer::number::add(1)]),
                        "actorLabel": item().path("actorLabel").pipe([escape()]),
                        "description": description(),
                    },
                    "slots": obj! {
                        "status": status_tag(),
                        "moveButtons": arr([
                            move_button("Move up", "moveUp", is_first(), "up", "-1"),
                            move_button("Move down", "moveDown", is_last(), "down", "1"),
                        ]),
                        "spacer": arr([spacer]),
                    },
                }))),
            })]),
        },
    })
}

pub fn reorder_steps_step() -> Value {
    let back = || {
        match_(data("navigationReferrer")).case("add-steps", goal_path("add-steps")).otherwise(goal_path("update-goal-steps"))
    };
    let layout = template_wrapper(
        "\n    <div>\n      {{slot:pageHeading}}\n      {{slot:goalContextInsetText}}\n      {{slot:stepSummaryCardTable}}\n      {{slot:actionButtons}}\n    </div>\n  ",
        vec![
            ("pageHeading", arr([heading("Reorder steps")])),
            ("goalContextInsetText", arr([goal_context_inset_text()])),
            ("stepSummaryCardTable", arr([step_summary_card_table("reorder-steps", Some("tbody"))])),
            (
                "actionButtons",
                arr([govuk::BUTTON_GROUP.build(obj! {
                    "buttons": arr([
                        action_button("Save and continue", "saveAndContinue", "reorder-steps-save-and-continue-button", obj! { "preventDoubleClick": true }),
                        action_button(
                            "Cancel",
                            "cancel",
                            "reorder-steps-cancel-button",
                            obj! { "classes": "govuk-button--secondary", "preventDoubleClick": true },
                        ),
                    ]),
                })]),
            ),
        ],
    );
    step(obj! {
        "path": "/reorder-steps",
        "title": "Reorder steps",
        "code": "reorder-steps",
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "backlink": back() } },
        "blocks": arr([layout]),
        "onAccess": arr([
            effects(vec![
                effect!("setActiveGoalContext"),
                effect!("setAreaDataFromActiveGoal"),
                effect!("reorderStepsInSession"),
                audit("VIEW_REORDER_STEPS"),
            ]),
            redirect_if_goal_not_found(OVERVIEW),
            redirect_if_goal_has_less_than_two_steps(OVERVIEW),
        ]),
        "onSubmission": arr([
            submit(obj! {
                "when": post_action_is("cancel"),
                "validate": false,
                "onAlways": obj! { "next": arr([redirect_to(back())]) },
            }),
            submit(obj! {
                "when": post_action_is("saveAndContinue"),
                "validate": false,
                "onAlways": handler(vec![effect!("saveReorderedSteps"), audit("REORDER_STEPS")], vec![redirect_to(back())]),
            }),
        ]),
    })
}

// ----- change goal / change area of need -----

pub fn change_goal_step() -> Value {
    let save_and_notify = || {
        vec![
            effect!("updateActiveGoal"),
            audit_with(
                "EDIT_GOAL",
                obj! { "planStatus": when(has_post_agreement_status()).then("POST_AGREE").otherwise("PRE_AGREE") },
            ),
            notify(obj! {
                "type": "success",
                "message": format("You changed a goal in %1 plan", [case_data::forename_possessive().into()]),
                "target": "plan-overview",
                "onlyWhen": data("activeGoalChanged"),
            }),
        ]
    };
    let save_goal = action_button("Save goal", "saveGoal", "change-goal-save-button", obj! { "preventDoubleClick": true });
    let add_steps = govuk::BUTTON.build(obj! {
        "text": when(data("activeGoal.steps").matches(condition::is_required())).then("Add or update steps").otherwise("Add steps"),
        "classes": "govuk-button--secondary",
        "name": "action",
        "value": "addSteps",
        "preventDoubleClick": true,
        "attributes": ai_id("update-goal-add-steps-button"),
    });
    let layout = template_wrapper(
        "\n    <div>\n      {{slot:pageHeading}}\n      {{slot:assessmentInfoDetails}}\n      {{slot:goalTitle}}\n      {{slot:areaOfNeedInset}}\n      {{slot:isRelatedToOtherAreas}}\n      {{slot:canStartNow}}\n      {{slot:buttonGroup}}\n    </div>\n  ",
        vec![
            ("pageHeading", arr([heading("Update goal")])),
            ("assessmentInfoDetails", arr([assessment_info_details(false)])),
            (
                "goalTitle",
                arr([goal_title_autocomplete(
                    format("What goal does %1 aim to achieve?", [case_data::forename().into()]),
                    "Search for a suggested goal or enter your own. Add one goal at a time.",
                    "Select or enter what goal they should aim to achieve",
                )]),
            ),
            (
                "areaOfNeedInset",
                arr([area_of_need_inset(
                    format(
                        "../../goal/%1/change-area-of-need?area=%2",
                        [data("activeGoal.uuid").into(), data("currentAreaOfNeed.slug").into()],
                    ),
                    "update-goal-change-area-of-need-link",
                )]),
            ),
            ("isRelatedToOtherAreas", arr([is_related_to_other_areas()])),
            ("canStartNow", arr([can_start_now()])),
            (
                "buttonGroup",
                arr([template_wrapper(
                    "\n      <div class=\"govuk-button-group\">\n        {{slot:saveGoalButton}}\n        {{slot:addOrUpdateStepsButton}}\n      </div>\n    ",
                    vec![("saveGoalButton", arr([save_goal])), ("addOrUpdateStepsButton", arr([add_steps]))],
                )]),
            ),
        ],
    );
    step(obj! {
        "path": "/change-goal",
        "title": "Update goal details",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "backlink": when(data_is("navigationReferrer", "update-goal-steps"))
                    .then(goal_path("update-goal-steps"))
                    .otherwise(
                        when(data_is("activeGoal.status", "ACTIVE"))
                            .then("../../plan/overview?goalStatusTab=current")
                            .otherwise("../../plan/overview?goalStatusTab=future"),
                    ),
            },
        },
        "blocks": arr([layout]),
        "onAccess": arr([
            effects(vec![effect!("loadActiveGoalForEdit"), effect!("loadAreaAssessmentInfo"), audit("VIEW_CHANGE_GOAL")]),
            redirect_if_goal_not_found(OVERVIEW),
            redirect_unless_goal_is_active_or_future(OVERVIEW),
        ]),
        "onSubmission": arr([
            submit(obj! {
                "when": post_action_is("saveGoal"),
                "validate": true,
                "onValid": handler(
                    save_and_notify(),
                    vec![
                        redirect_when(data_is("navigationReferrer", "add-steps"), goal_path("add-steps")),
                        redirect_when(
                            has_post_agreement_status(),
                            when(and(vec![
                                answer("can_start_now").matches(condition::equals("yes")),
                                data("activeGoal.steps").not().matches(condition::is_required()),
                            ]))
                            .then(goal_path("add-steps"))
                            .otherwise(goal_path("update-goal-steps")),
                        ),
                        redirect_when(answer("can_start_now").matches(condition::equals("no")), "../../plan/overview?goalStatusTab=future"),
                        redirect_to("../../plan/overview?goalStatusTab=current"),
                    ],
                ),
            }),
            submit(obj! {
                "when": post_action_is("addSteps"),
                "validate": true,
                "onValid": handler(save_and_notify(), vec![redirect_to(goal_path("add-steps"))]),
            }),
        ]),
    })
}

pub fn change_area_of_need_step() -> Value {
    step(obj! {
        "path": "/change-area-of-need",
        "title": "Change area of need",
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "backlink": goal_path("change-goal") } },
        "blocks": arr([
            heading("Change area of need"),
            area_of_need_radio(|slug| query("area").nullish(data("activeGoal.areaOfNeed")).matches(condition::equals(slug))),
            continue_button("change-area-of-need-continue-button"),
        ]),
        "onAccess": arr([
            effects(vec![effect!("setActiveGoalContext"), audit("VIEW_CHANGE_AREA_OF_NEED")]),
            redirect_if_goal_not_found(OVERVIEW),
            redirect_unless_goal_is_active_or_future(OVERVIEW),
        ]),
        "onSubmission": arr([submit(obj! {
            "validate": true,
            "onValid": obj! {
                "next": arr([redirect_to(format(
                    "../../goal/%1/change-goal?area=%2",
                    [data("activeGoal.uuid").into(), answer("area_of_need").into()],
                ))]),
            },
        })]),
    })
}

// ----- achieving goals -----

fn congratulations(clear_others: bool) -> Value {
    let mut props = obj! {
        "type": "success",
        "message": format("Congratulations on achieving a goal, %1", [case_data::forename().into()]),
        "target": "plan-overview",
    };
    if clear_others {
        props.set("clearOtherNotifications", Value::Bool(true));
    }
    notify(props)
}

pub fn confirm_if_achieved_step() -> Value {
    let has_achieved = govuk::RADIO_INPUT.build(obj! {
        "code": "has_achieved_goal",
        "fieldset": obj! {
            "legend": obj! { "text": format("Has %1 achieved this goal?", [case_data::forename().into()]), "classes": "govuk-fieldset__legend--m" },
        },
        "items": arr([
            obj! {
                "value": "yes",
                "text": "Yes, mark it as achieved",
                "block": govuk::TEXTAREA.build(obj! {
                    "code": "how_helped",
                    "label": format("Enter how achieving this goal has helped %1 (optional)", [case_data::forename().into()]),
                    "classes": "govuk-!-width-two-thirds",
                    "rows": "3",
                }),
            },
            obj! { "value": "no", "text": format("No, go to %1's plan", [case_data::forename().into()]) },
        ]),
        "validWhen": arr([required("Select if they have achieved this goal")]),
    });
    step(obj! {
        "path": "/confirm-if-achieved",
        "title": "Confirm if they have achieved this goal",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "backlink": match_(data("navigationReferrer")).case("add-steps", goal_path("add-steps")).otherwise(goal_path("update-goal-steps")),
            },
        },
        "blocks": arr([
            heading(format("Confirm if %1 has achieved this goal", [case_data::forename().into()])),
            body("All steps have been completed. Check if this goal can now be marked as achieved."),
            goal_card(GOAL_SUMMARY_CARD_DRAFT, true, false, false),
            has_achieved,
            action_button("Save and continue", "saveAndContinue", "confirm-if-achieved-save-and-continue-button", obj! { "preventDoubleClick": true }),
        ]),
        "onAccess": arr([
            effects(vec![effect!("setActiveGoalContext"), audit("VIEW_CONFIRM_GOAL_ACHIEVED")]),
            redirect_if_goal_not_found(OVERVIEW),
            access(obj! {
                "when": data_is("activeGoal.status", "ACHIEVED"),
                "next": arr([redirect_to("../../plan/overview?goalStatusTab=achieved")]),
            }),
            redirect_unless_all_steps_completed(OVERVIEW),
        ]),
        "onSubmission": arr([
            submit(obj! {
                "when": post("has_achieved_goal").matches(condition::equals("yes")),
                "validate": true,
                "onValid": handler(
                    vec![effect!("markGoalAsAchieved"), audit("EDIT_GOAL_ACHIEVED"), congratulations(true)],
                    vec![redirect_to("../../plan/overview?goalStatusTab=achieved")],
                ),
            }),
            submit(obj! {
                "when": post("has_achieved_goal").matches(condition::equals("no")),
                "validate": true,
                "onValid": obj! { "next": Value::array(overview_by_goal_status()) },
            }),
            submit(obj! { "validate": true }),
        ]),
    })
}

pub fn confirm_achieved_goal_step() -> Value {
    step(obj! {
        "path": "/confirm-achieved-goal",
        "title": "Confirm they have achieved this goal",
        "reachability": obj! { "entryWhen": true },
        "blocks": arr([
            heading(format("Confirm %1 has achieved this goal", [case_data::forename().into()])),
            goal_card(GOAL_SUMMARY_CARD_DRAFT, true, false, false),
            govuk::TEXTAREA.build(obj! {
                "code": "how_helped",
                "label": obj! {
                    "text": format("How has achieving this goal helped %1? (optional)", [case_data::forename().into()]),
                    "classes": "govuk-label govuk-label--m",
                },
                "classes": "govuk-!-width-two-thirds",
                "rows": "3",
            }),
            govuk::BUTTON_GROUP.build(obj! {
                "buttons": arr([
                    confirm_button("confirm-achieved-goal-confirm-button", false),
                    cancel_link("../../goal/%1/update-goal-steps", data("activeGoal.uuid").into(), "confirm-achieved-goal-cancel-link", "Do not mark as achieved"),
                ]),
            }),
        ]),
        "onAccess": arr([
            effects(vec![effect!("setActiveGoalContext"), audit("VIEW_CONFIRM_GOAL_ACHIEVED")]),
            redirect_if_not_post_agreement(OVERVIEW),
            redirect_if_goal_not_found(OVERVIEW),
            redirect_unless_goal_is_active_or_future(OVERVIEW),
        ]),
        "onSubmission": arr([submit(obj! {
            "when": post_action_is("confirm"),
            "validate": true,
            "onValid": handler(
                vec![effect!("markGoalAsAchieved"), audit("EDIT_GOAL_ACHIEVED"), congratulations(false)],
                vec![redirect_to("../../plan/overview?goalStatusTab=achieved")],
            ),
        })]),
    })
}

// ----- deleting, removing and re-adding goals -----

fn overview_tab_for_goal() -> When {
    when(data_is("activeGoal.status", "FUTURE"))
        .then("../../plan/overview?goalStatusTab=future")
        .otherwise("../../plan/overview?goalStatusTab=current")
}

pub fn confirm_delete_goal_step() -> Value {
    step(obj! {
        "path": "/confirm-delete-goal",
        "title": "Confirm you want to delete this goal",
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "backlink": overview_tab_for_goal() } },
        "blocks": arr([
            heading("Confirm you want to delete this goal"),
            body(format("Delete this goal if it’s not needed. It will not be saved to %1's plan.", [case_data::forename().into()])),
            body("Alternatively, you can <a href=\"change-goal\" class=\"govuk-link\" data-ai-id=\"confirm-delete-change-goal-link\">update the goal</a> instead."),
            goal_card(GOAL_SUMMARY_CARD_DRAFT, true, false, false),
            govuk::BUTTON_GROUP.build(obj! {
                "buttons": arr([
                    confirm_button("confirm-delete-goal-confirm-button", false),
                    cancel_link("%1", overview_tab_for_goal().into(), "confirm-delete-goal-cancel-link", "Do not delete goal"),
                ]),
            }),
        ]),
        "onAccess": arr([
            effects(vec![effect!("setActiveGoalContext"), audit("VIEW_DELETE_GOAL")]),
            redirect_if_post_agreement(OVERVIEW),
            redirect_if_goal_not_found(OVERVIEW),
            access(obj! {
                "when": data_is("activeGoal.status", "ACHIEVED"),
                "next": arr([redirect_to("../../plan/overview?goalStatusTab=achieved")]),
            }),
        ]),
        "onSubmission": arr([submit(obj! {
            "when": post_action_is("confirm"),
            "onAlways": handler(
                vec![
                    effect!("deleteActiveGoal"),
                    audit("DELETE_GOAL"),
                    notify(obj! {
                        "type": "success",
                        "message": format("You deleted a goal from %1 plan", [case_data::forename_possessive().into()]),
                        "target": "plan-overview",
                    }),
                ],
                overview_by_goal_status(),
            ),
        })]),
    })
}

pub fn remove_goal_step() -> Value {
    step(obj! {
        "path": "/confirm-remove-goal",
        "title": "Confirm you want to remove this goal",
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "backlink": "update-goal-steps" } },
        "blocks": arr([
            heading("Confirm you want to remove this goal"),
            two_thirds(vec![
                body(format("Remove a goal if it is no longer relevant to %1.", [case_data::forename().into()])),
                body(format(
                    "You will still be able to see it in 'Removed goals', but %1 will not be expected to achieve it.",
                    [case_data::forename().into()],
                )),
            ]),
            goal_card(GOAL_SUMMARY_CARD_AGREED, true, false, false),
            two_thirds(vec![textarea(
                "removal_note",
                obj! { "text": "Why do you want to remove this goal?", "classes": "govuk-label--m" },
                "3",
                Some("Enter why you want to remove this goal"),
            )]),
            govuk::BUTTON_GROUP.build(obj! {
                "buttons": arr([
                    confirm_button("confirm-remove-goal-confirm-button", false),
                    body("<a href=\"update-goal-steps\" class=\"govuk-link\" data-ai-id=\"confirm-remove-goal-cancel-link\">Do not remove goal</a>"),
                ]),
            }),
        ]),
        "onAccess": arr([
            effects(vec![effect!("setActiveGoalContext"), audit("VIEW_CONFIRM_GOAL_REMOVED")]),
            redirect_if_not_post_agreement(OVERVIEW),
            redirect_if_goal_not_found(OVERVIEW),
            redirect_unless_goal_is_active_or_future(OVERVIEW),
        ]),
        "onSubmission": arr([submit(obj! {
            "when": post_action_is("confirm"),
            "validate": true,
            "onValid": handler(
                vec![
                    effect!("markGoalAsRemoved"),
                    audit("EDIT_GOAL_REMOVED"),
                    notify(obj! {
                        "type": "success",
                        "message": format("You removed a goal from %1 plan", [case_data::forename_possessive().into()]),
                        "target": "plan-overview",
                    }),
                ],
                vec![redirect_to("../../plan/overview?goalStatusTab=removed")],
            ),
        })]),
    })
}

pub fn confirm_add_goal_step() -> Value {
    step(obj! {
        "path": "/confirm-readd-goal",
        "title": "Confirm you want to add this goal back into the plan",
        "reachability": obj! { "entryWhen": true },
        "view": obj! { "locals": obj! { "backlink": "view-inactive-goal" } },
        "blocks": arr([
            heading(format("Confirm you want to add this goal back into %1 plan", [case_data::forename_possessive().into()])),
            goal_card(GOAL_SUMMARY_CARD_AGREED, false, true, true),
            two_thirds(vec![textarea(
                "readd_note",
                obj! {
                    "text": format("Why do you want to add this goal back into %1 plan?", [case_data::forename_possessive().into()]),
                    "classes": "govuk-label--m",
                },
                "3",
                Some("Enter why you want to add this goal back into their plan"),
            )]),
            two_thirds(vec![can_start_now()]),
            govuk::BUTTON_GROUP.build(obj! {
                "buttons": arr([
                    confirm_button("confirm-readd-goal-confirm-button", true),
                    body("<a href=\"view-inactive-goal\" class=\"govuk-link\" data-ai-id=\"confirm-readd-goal-cancel-link\">Do not add goal back into plan</a>"),
                ]),
            }),
        ]),
        "onAccess": arr([
            effects(vec![effect!("setActiveGoalContext"), audit("VIEW_CONFIRM_RE_ADD_GOAL")]),
            redirect_if_not_post_agreement(OVERVIEW),
            redirect_if_goal_not_found(OVERVIEW),
            access(obj! {
                "when": data("activeGoal.status").not().matches(condition::equals("REMOVED")),
                "next": arr([redirect_to(OVERVIEW)]),
            }),
        ]),
        "onSubmission": arr([submit(obj! {
            "when": post_action_is("confirm"),
            "validate": true,
            "onValid": handler(
                vec![
                    effect!("readdGoalToPlan"),
                    audit("CREATE_RE_ADD_GOAL"),
                    notify(obj! {
                        "type": "success",
                        "message": format("You added a goal back into %1 plan", [case_data::forename_possessive().into()]),
                        "target": "plan-overview",
                    }),
                ],
                vec![
                    redirect_when(answer("can_start_now").matches(condition::equals("no")), "../../plan/overview?goalStatusTab=future"),
                    redirect_to("../../plan/overview?goalStatusTab=current"),
                ],
            ),
        })]),
    })
}

// ----- update goal and steps -----

pub fn update_goal_and_steps_step() -> Value {
    let has_steps = || data("activeGoal.steps").matches(condition::is_required());
    let secondary = |text: &str, value: &str, ai: &str, visible: Value| {
        govuk::BUTTON.build(obj! {
            "text": text,
            "name": "action",
            "value": value,
            "classes": "govuk-button--secondary",
            "attributes": ai_id(ai),
            "visibleWhen": visible,
        })
    };
    let achieve_by = when(data_is("activeGoal.status", "FUTURE"))
        .then("<p>This is a future goal.</p>")
        .otherwise(format("<p>Aim to achieve this by %1.</p>", [data("activeGoal.targetDate").pipe([long_date()]).into()]));
    let details_link_id = when(data_is("activeGoal.status", "FUTURE"))
        .then("update-goal-and-steps-future-goal-details-link")
        .otherwise("update-goal-and-steps-active-goal-details-link");
    let inset = govuk::INSET_TEXT.build(obj! {
        "classes": "guidance-panel govuk-!-margin-top-2",
        "blocks": arr([
            core_blocks::HTML.build(obj! { "content": area_block_content("; ") }),
            core_blocks::HTML.build(obj! { "content": goal_block_content() }),
            core_blocks::HTML.build(obj! { "content": achieve_by }),
            core_blocks::HTML.build(obj! {
                "content": format(
                    "<p><a href=\"../../goal/%1/change-goal\" class=\"govuk-link\" data-ai-id=\"%2\">Update goal details</a></p>",
                    [data("activeGoal.uuid").into(), details_link_id.into()],
                ),
            }),
        ]),
    });
    let status_select = WRAPPING_SELECT.build(obj! {
        "field": govuk::SELECT_INPUT.build(obj! {
            "code": format("step_status_%1", [Loop.index0().into()]),
            "label": obj! { "text": "Status", "classes": "govuk-visually-hidden" },
            "classes": "govuk-select--auto-width",
            "formGroup": obj! { "classes": "govuk-!-margin-bottom-0" },
            "items": Value::array(STEP_STATUSES.iter().map(|(value, text)| obj! { "text": *text, "value": *value }).collect()),
            "defaultValue": item().path("status"),
        }),
    });
    let no_steps = core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "visibleWhen": data("activeGoal.steps").not().matches(condition::is_required()),
        "template": "\n    <div class=\"govuk-body\">\n      <span class=\"govuk-!-display-inline-block govuk-!-padding-top-1 govuk-!-padding-right-1\">No steps added.</span>\n      {{slot:addStepsButton}}\n    </div>\n  ",
        "slots": obj! {
            "addStepsButton": arr([secondary("Add steps", "addSteps", "update-goal-and-steps-add-steps-button", not(has_steps()))]),
        },
    });
    let progress_notes = two_thirds(vec![govuk::TEXTAREA.build(obj! {
        "code": "progress_notes",
        "label": obj! { "text": "Add notes about progress (optional)", "classes": "govuk-label govuk-label--m" },
        "hint": format(
            "For example, how %1 feels about their progress, any strengths or protective factors they have developed, or any support they need.",
            [case_data::forename().into()],
        ),
        "rows": "3",
    })]);
    let notes = core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": "\n    <details class=\"govuk-details\">\n      <summary class=\"govuk-details__summary\" data-ai-id=\"update-goal-and-steps-view-all-notes-details\">\n        <span class=\"govuk-details__summary-text\">View all notes</span>\n      </summary>\n      <div class=\"govuk-details__text\">{{slot:notes}}</div>\n    </details>\n  ",
        "slots": obj! { "notes": arr([notes_collection()]) },
    });
    let actions = template_wrapper(
        "\n    <div class=\"govuk-button-group\">\n      {{slot:saveButton}}\n      {{slot:markAsAchievedButton}}\n    </div>\n    {{slot:removeGoalLink}}\n  ",
        vec![
            (
                "saveButton",
                arr([action_button("Save goal and steps", "save", "update-goal-and-steps-save-button", obj! { "preventDoubleClick": true })]),
            ),
            (
                "markAsAchievedButton",
                arr([action_button(
                    "Mark as achieved",
                    "mark-achieved",
                    "update-goal-and-steps-mark-achieved-button",
                    obj! { "classes": "govuk-button--secondary", "preventDoubleClick": true },
                )]),
            ),
            (
                "removeGoalLink",
                arr([body(format(
                    "<a href=\"../../goal/%1/confirm-remove-goal\" class=\"govuk-link\" data-ai-id=\"update-goal-and-steps-remove-goal-link\">Remove goal from plan</a>",
                    [data("activeGoal.uuid").into()],
                ))]),
            ),
        ],
    );
    let progress = |action: Value| {
        vec![
            effect!("updateGoalProgress"),
            audit_with("EDIT_STEP_PROGRESS", obj! { "goalStatus": data("activeGoal.status"), "action": action }),
        ]
    };
    let mut save_next = vec![redirect_when(data_is("allStepsCompleted", true), goal_path("confirm-if-achieved"))];
    save_next.extend(overview_by_goal_status());
    step(obj! {
        "path": "/update-goal-steps",
        "title": "Update goal and steps",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "backlink": when(data_is("activeGoal.status", "ACTIVE"))
                    .then("../../plan/overview?goalStatusTab=current")
                    .otherwise("../../plan/overview?goalStatusTab=future"),
            },
        },
        "blocks": arr([
            heading("Update goal and steps"),
            inset,
            govuk::HEADING.build(obj! { "text": "Review steps", "size": "m" }),
            steps_table(arr([status_select])),
            govuk::BUTTON_GROUP.build(obj! {
                "buttons": arr([
                    secondary("Add or update steps", "addOrUpdateSteps", "update-goal-and-steps-add-or-update-steps-button", has_steps()),
                    secondary(
                        "Reorder steps",
                        "reorderSteps",
                        "update-goal-and-steps-reorder-steps-button",
                        data("activeGoal.steps").pipe([transformer::array::length()]).matches(condition::number::greater_than(1)),
                    ),
                ]),
            }),
            no_steps,
            progress_notes,
            notes,
            actions,
        ]),
        "onAccess": arr([
            effects(vec![effect!("loadActiveGoalForEdit"), audit("VIEW_UPDATE_GOAL_AND_STEPS")]),
            redirect_if_not_post_agreement(OVERVIEW),
            redirect_if_goal_not_found(OVERVIEW),
            redirect_unless_goal_is_active_or_future(OVERVIEW),
        ]),
        "onSubmission": arr([
            submit(obj! {
                "when": post_action_is("reorderSteps"),
                "validate": false,
                "onAlways": handler(progress(Value::from("reorderSteps")), vec![redirect_to("reorder-steps")]),
            }),
            submit(obj! {
                "when": or(vec![post_action_is("addSteps"), post_action_is("addOrUpdateSteps")]),
                "validate": false,
                "onAlways": handler(
                    progress(when(post_action_is("addSteps")).then("addSteps").otherwise("addOrUpdateSteps").into()),
                    vec![redirect_to("add-steps")],
                ),
            }),
            submit(obj! {
                "when": post_action_is("save"),
                "validate": false,
                "onAlways": handler(progress(Value::from("save")), save_next),
            }),
            submit(obj! {
                "when": post_action_is("mark-achieved"),
                "validate": false,
                "onAlways": handler(progress(Value::from("mark-achieved")), vec![redirect_to(goal_path("confirm-achieved-goal"))]),
            }),
        ]),
    })
}

// ----- view inactive goal -----

pub fn view_inactive_goal_step() -> Value {
    let related = data("activeGoal.relatedAreasOfNeedLabels").pipe([transformer::array::join(", "), transformer::string::to_lower_case()]);
    let page_heading = govuk::HEADING.build(obj! {
        "caption": when(data("activeGoal.relatedAreasOfNeedLabels").matches(condition::is_required()))
            .then(format(
                "%1 (and %2)",
                [data("activeGoal.areaOfNeedLabel").pipe([escape()]).into(), related.pipe([escape()]).into()],
            ))
            .otherwise(data("activeGoal.areaOfNeedLabel").pipe([escape()])),
        "text": "View goal details",
        "classes": "govuk-!-margin-bottom-2",
    });
    let status_info = |status: &str, text: &str| {
        govuk::BODY.build(obj! {
            "visibleWhen": data_is("activeGoal.status", status),
            "text": format(text, [data("activeGoal.statusDate").pipe([long_date()]).into()]),
        })
    };
    step(obj! {
        "path": "/view-inactive-goal",
        "title": "View inactive goal",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "locals": obj! {
                "backlink": when(data_is("navigationReferrer", "plan-history"))
                    .then("../../plan/plan-history")
                    .otherwise(
                        when(data_is("activeGoal.status", "ACHIEVED"))
                            .then("../../plan/overview?goalStatusTab=achieved")
                            .otherwise("../../plan/overview?goalStatusTab=removed"),
                    ),
                "dynamicTitle": format("View %1 goal", [data("activeGoal.status").pipe([transformer::string::to_lower_case()]).into()]),
            },
        },
        "blocks": arr([
            page_heading,
            govuk::HEADING.build(obj! {
                "text": format("Goal: %1", [data("activeGoal.title").pipe([escape()]).into()]),
                "size": "m",
                "classes": "govuk-!-margin-bottom-2",
            }),
            status_info("ACHIEVED", "Marked as achieved on %1."),
            status_info("REMOVED", "Removed on %1."),
            steps_table(status_tag()),
            govuk::BODY.build(obj! {
                "visibleWhen": data("activeGoal.steps").not().matches(condition::is_required()),
                "text": "No steps were added to this goal.",
            }),
            govuk::DETAILS.build(obj! {
                "summaryText": "View all notes",
                "content": arr([notes_collection()]),
                "attributes": ai_id("view-inactive-goal-view-all-notes-details"),
            }),
            govuk::LINK_BUTTON.build(obj! {
                "text": "Add to plan",
                "href": "confirm-readd-goal",
                "classes": "govuk-button--secondary",
                "visibleWhen": data_is("activeGoal.status", "REMOVED"),
                "attributes": ai_id("view-inactive-goal-add-to-plan-button"),
            }),
        ]),
        "onAccess": arr([
            effects(vec![effect!("loadActiveGoalForEdit"), audit_with("VIEW_INACTIVE_GOAL", obj! { "goalStatus": data("activeGoal.status") })]),
            redirect_if_goal_not_found(OVERVIEW),
        ]),
    })
}

pub fn goal_management_journey() -> Value {
    journey(obj! {
        "code": "goal-management",
        "title": "Goal Management",
        "path": "/goal/:uuid",
        "onAccess": arr([redirect_to_overview_if_read_only()]),
        "steps": arr([
            select_area_of_need_step(),
            create_goal_step(),
            add_steps_step(),
            reorder_steps_step(),
            change_goal_step(),
            change_area_of_need_step(),
            confirm_if_achieved_step(),
            confirm_achieved_goal_step(),
            confirm_delete_goal_step(),
            remove_goal_step(),
            update_goal_and_steps_step(),
            confirm_add_goal_step(),
            view_inactive_goal_step(),
        ]),
    })
}
