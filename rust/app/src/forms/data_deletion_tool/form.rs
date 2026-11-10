//! The data deletion tool's journey (`form/`): configuration, events, timeline, summary, success
//! and clear steps.

use crate::config::DATA_DELETION_ENVIRONMENTS;
use crate::forms::dsl::*;
use crate::{condition, effect, transformer};

use super::components::OUTDENT;

fn tie(priority: i32) -> Value {
    arr([tie_breaker(obj! { "priority": priority })])
}

fn required(message: &str) -> Value {
    arr([validation(obj! { "condition": self_().matches(condition::is_required()), "message": message })])
}

fn json_stringify() -> Value {
    transformer!("JSONStringify")
}

fn json_parse() -> Value {
    transformer!("JSONParse")
}

fn diff(right: impl IntoValue) -> Value {
    transformer!("Diff", right)
}

fn uuid() -> Ex {
    item().path("uuid")
}

/// `Format('<prefix>-%1', Item().path('uuid'))`: a per-item field code.
fn item_code(prefix: &str) -> Ex {
    format(format!("{prefix}-%1"), [uuid().into()])
}

fn row(key: &str, value: Value) -> Value {
    obj! { "key": obj! { "text": key }, "value": value }
}

fn text_row(key: &str, path: &str) -> Value {
    row(key, obj! { "text": item().path(path) })
}

fn pre_row(key: &str, path: &str) -> Value {
    row(key, obj! { "html": format("<pre>\n%1</pre>", [item().path(path).pipe([json_stringify()]).into()]) })
}

fn button(text: &str, value: &str) -> Value {
    govuk::BUTTON.build(obj! { "text": text, "name": "action", "value": value, "preventDoubleClick": true })
}

/// Valid JSON, unless the item's action isn't an edit.
fn valid_json_when_editing(action_prefix: &str) -> Value {
    arr([validation(obj! {
        "condition": or(vec![
            answer(item_code(action_prefix)).not().matches(condition::array::contains("UPDATE")),
            self_().matches(condition!("IsValidJson")),
        ]),
        "message": "Invalid JSON",
    })])
}

fn json_textarea(code_prefix: &str, label: &str, path: &str, action_prefix: &str) -> Value {
    govuk::TEXTAREA.build(obj! {
        "code": item_code(code_prefix),
        "label": obj! { "text": label, "classes": "govuk-label--s" },
        "rows": 12,
        "defaultValue": item().path(path).pipe([json_stringify()]),
        "validWhen": valid_json_when_editing(action_prefix),
    })
}

fn text_input(code_prefix: &str, label: &str, path: &str) -> Value {
    govuk::TEXT_INPUT.build(obj! {
        "code": item_code(code_prefix),
        "label": obj! { "text": label, "classes": "govuk-label--s" },
        "defaultValue": item().path(path),
    })
}

fn actions_row(action_prefix: &str, edit_block: Value) -> Value {
    row(
        "Actions",
        obj! {
            "blocks": arr([govuk::CHECKBOX_INPUT.build(obj! {
                "code": item_code(action_prefix),
                "classes": "govuk-checkboxes--small",
                "items": arr([
                    obj! { "value": "DELETE", "text": "Delete", "behaviour": "exclusive" },
                    obj! { "value": "UPDATE", "text": "Edit", "behaviour": "exclusive", "block": edit_block },
                ]),
            })]),
        },
    )
}

/// After a valid dry run: the banner pointing to the next step.
fn valid_banner(html: &str) -> Value {
    govuk::NOTIFICATION_BANNER.build(obj! {
        "visibleWhen": and(vec![
            query("valid").matches(condition::is_required()),
            session("deletionResponse").path("success").matches(condition::equals(true)),
        ]),
        "bannerType": "success",
        "html": html,
    })
}

const ERROR_SUMMARY_PREFIX: &str = "\n        <div class=\"govuk-error-summary\" data-module=\"govuk-error-summary\">\n          <div role=\"alert\">\n            <h2 class=\"govuk-error-summary__title\">\n              There is a problem\n            </h2>\n            <div class=\"govuk-error-summary__body\">\n              <ul class=\"govuk-list govuk-error-summary__list\">\n";
const ERROR_SUMMARY_SUFFIX: &str = "              </ul>\n            </div>\n          </div>\n        </div>\n        ";

fn exception() -> Ex {
    session("deletionResponse").path("exception")
}

fn developer_message() -> Ex {
    session("deletionResponse").path("exception.cause.developerMessage")
}

/// The dry run's validation onSubmission: save, then validate the request.
fn validate_submission(next: &str) -> Value {
    arr([submit(obj! {
        "validate": true,
        "onAlways": obj! { "effects": arr([effect!("saveAnswers"), effect!("clearDeletionResponse")]) },
        "onValid": obj! {
            "effects": arr([effect!("createDeletionRequest"), effect!("deletionDryRun")]),
            "next": arr([redirect(obj! { "goto": next })]),
        },
    })])
}

fn current_data_loaded() -> Value {
    session("currentData").matches(condition::object::is_object())
}

pub fn configuration_step() -> Value {
    let mut items = vec![obj! { "value": "", "text": "" }];
    items.extend(DATA_DELETION_ENVIRONMENTS.iter().map(|(key, env)| obj! { "value": *key, "text": env.api_url }));
    step(obj! {
        "path": "/configuration",
        "title": "Configuration",
        "reachability": obj! { "entryWhen": true, "tieBreakers": tie(10) },
        "onSubmission": arr([submit(obj! {
            "validate": true,
            "onValid": obj! {
                "effects": arr([effect!("saveAnswers"), effect!("loadAssessmentData")]),
                "next": arr([redirect(obj! { "goto": "events" })]),
            },
        })]),
        "blocks": arr([
            govuk::SELECT_INPUT.build(obj! {
                "code": "environment",
                "label": "Environment",
                "items": Value::array(items),
                "validWhen": required("Select an environment"),
            }),
            govuk::TEXT_INPUT.build(obj! { "code": "clientId", "label": "Client ID", "validWhen": required("Enter a Client ID") }),
            govuk::PASSWORD_INPUT.build(obj! {
                "code": "clientSecret",
                "label": "Client Secret",
                "validWhen": required("Enter a Client Secret"),
            }),
            govuk::TEXT_INPUT.build(obj! {
                "code": "assessmentUuid",
                "label": "Assessment UUID",
                "validWhen": required("Enter an Assessment UUID"),
            }),
            button("Load data", "next"),
        ]),
    })
}

pub fn events_step() -> Value {
    let error_for_item = exception().path("eventUuid").matches(condition::equals(uuid()));
    let card = govuk::SUMMARY_LIST.build(obj! {
        "card": obj! {
            "title": obj! { "text": item().path("data.type") },
            "attributes": obj! { "id": uuid() },
            "classes": format(
                "govuk-summary-card %1",
                [when(error_for_item.clone()).then("govuk-summary-card--error").otherwise("").into()],
            ),
        },
        "rows": arr([
            obj! {
                "key": obj! { "text": "Error" },
                "value": obj! {
                    "blocks": arr([core_blocks::HTML.build(obj! {
                        "tag": "p",
                        "classes": "govuk-error-message",
                        "content": developer_message(),
                    })]),
                },
                "visibleWhen": error_for_item,
            },
            text_row("Position", "position"),
            text_row("Created", "createdAt"),
            text_row("UUID", "uuid"),
            pre_row("Data", "data"),
            actions_row("event-action", json_textarea("event-data", "Data", "data", "event-action")),
        ]),
    });
    let error_link = when(exception().matches(condition::object::is_object()))
        .then(
            when(exception().matches(condition::object::property_has_value("eventUuid")))
                .then(format(
                    "<a href=\"#%1\">Could not aggregate %2</a>",
                    [exception().path("eventUuid").into(), exception().path("eventName").into()],
                ))
                .otherwise(format("<a href=\"#\">%1</a>", [developer_message().into()])),
        )
        .otherwise("");
    step(obj! {
        "path": "/events",
        "title": "Events",
        "reachability": obj! { "entryWhen": current_data_loaded(), "tieBreakers": tie(15) },
        "onAccess": arr([access(obj! {
            "when": session("currentData").not().matches(condition::object::is_object()),
            "next": arr([redirect(obj! { "goto": "configuration" })]),
        })]),
        "onSubmission": validate_submission("events?valid=true"),
        "blocks": arr([
            valid_banner("<p>The events deletion data is valid. Continue to <a href=\"timeline\">Timeline</a></p>"),
            core_blocks::HTML.build(obj! {
                "visibleWhen": exception().matches(condition::object::is_object()),
                "content": format(
                    format!("{ERROR_SUMMARY_PREFIX}                <li>%1</li>\n{ERROR_SUMMARY_SUFFIX}"),
                    [error_link.into()],
                ),
            }),
            core_blocks::HTML.build(obj! {
                "classes": "data-list",
                "content": session("currentData.events").each(iterator::map(OUTDENT.build(obj! { "outdentBy": 10, "block": card }))),
            }),
            button("Validate", "validate"),
        ]),
    })
}

pub fn timeline_step() -> Value {
    let card = govuk::SUMMARY_LIST.build(obj! {
        "card": obj! { "title": obj! { "text": item().path("event") } },
        "rows": arr([
            text_row("Position", "position"),
            text_row("Created", "timestamp"),
            text_row("UUID", "uuid"),
            pre_row("Data", "data"),
            text_row("Custom type", "customType"),
            pre_row("Custom data", "customData"),
            actions_row(
                "timeline-action",
                arr([
                    text_input("timeline-event", "Event", "event"),
                    json_textarea("timeline-data", "Data", "data", "timeline-action"),
                    text_input("timeline-custom-type", "Custom type", "customType"),
                    json_textarea("timeline-custom-data", "Custom data", "customData", "timeline-action"),
                ]),
            ),
        ]),
    });
    step(obj! {
        "path": "/timeline",
        "title": "Timeline",
        "reachability": obj! { "entryWhen": current_data_loaded(), "tieBreakers": tie(20) },
        "onSubmission": validate_submission("timeline?valid=true"),
        "blocks": arr([
            valid_banner("<p>The timeline deletion data is valid. Continue to <a href=\"summary\">Summary</a></p>"),
            core_blocks::HTML.build(obj! {
                "visibleWhen": exception().matches(condition::object::is_object()),
                "content": format(
                    format!(
                        "{ERROR_SUMMARY_PREFIX}                <li>\n                  <a href=\"#\">%1</a>\n                </li>\n{ERROR_SUMMARY_SUFFIX}"
                    ),
                    [developer_message().into()],
                ),
            }),
            core_blocks::HTML.build(obj! {
                "classes": "data-list",
                "content": session("currentData.timeline").each(iterator::map(OUTDENT.build(obj! { "outdentBy": 10, "block": card }))),
            }),
            button("Validate", "validate"),
        ]),
    })
}

/// The item's chosen action is an edit.
fn editing(action_prefix: &str) -> Value {
    and(vec![
        answer(item_code(action_prefix)).matches(condition::is_required()),
        answer(item_code(action_prefix)).matches(condition::array::contains("UPDATE")),
    ])
}

/// A summary row diffing the item's value against the edit (or, without one, `otherwise`).
fn diff_row(key: &str, path: &str, action_prefix: &str, edited: Ex, otherwise: Value) -> Value {
    row(
        key,
        obj! { "html": item().path(path).pipe([diff(when(editing(action_prefix)).then(edited).otherwise(otherwise))]) },
    )
}

/// `when(<present>).then(present).else(null)`: what an unedited value diffs against.
fn present_or_null(predicate: Value, present: impl IntoValue) -> Value {
    when(predicate).then(present).otherwise(Value::Null).into()
}

fn summary_card(action_prefix: &str, title_path: &str, created_path: &str, rows: Vec<Value>) -> Value {
    let mut all = vec![
        text_row("Position", "position"),
        text_row("Created", created_path),
        text_row("UUID", "uuid"),
        row("Operation", obj! { "text": answer(item_code(action_prefix)).pipe([transformer::array::first()]) }),
    ];
    all.extend(rows);
    govuk::SUMMARY_LIST.build(obj! {
        "visibleWhen": and(vec![
            answer(item_code(action_prefix)).matches(condition::is_required()),
            answer(item_code(action_prefix)).matches(condition::array::contains_any(arr([Value::from("UPDATE"), Value::from("DELETE")]))),
        ]),
        "card": obj! { "title": obj! { "text": item().path(title_path) } },
        "rows": Value::array(all),
    })
}

fn summary_panel(warning: &str, request_key: &str, list: &str, card: Value) -> Value {
    obj! {
        "blocks": arr([
            govuk::WARNING_TEXT.build(obj! {
                "text": warning,
                "classes": "govuk-!-margin-0",
                "visibleWhen": session(request_key).matches(condition::array::contains_all(arr([Value::from("dummyValue")]))),
            }),
            core_blocks::HTML.build(obj! { "classes": "data-list", "content": session(list).each(iterator::map(card)) }),
        ]),
    }
}

fn pre_panel(key: &str) -> Value {
    obj! { "html": format("<pre>%1</pre>", [session(key).pipe([json_stringify()]).into()]) }
}

pub fn summary_step() -> Value {
    let event_card = summary_card(
        "event-action",
        "data.type",
        "createdAt",
        vec![diff_row("Data", "data", "event-action", answer(item_code("event-data")).pipe([json_parse()]), obj! {})],
    );
    let timeline_card = summary_card(
        "timeline-action",
        "event",
        "timestamp",
        vec![
            diff_row(
                "Event",
                "event",
                "timeline-action",
                answer(item_code("timeline-event")),
                present_or_null(item().value().matches(condition::object::property_has_value("event")), ""),
            ),
            diff_row(
                "Data",
                "data",
                "timeline-action",
                answer(item_code("timeline-data")).pipe([json_parse()]),
                present_or_null(item().path("data").matches(condition::object::is_object()), obj! {}),
            ),
            diff_row(
                "Custom type",
                "customType",
                "timeline-action",
                answer(item_code("timeline-custom-type")),
                present_or_null(item().value().matches(condition::object::property_has_value("customType")), ""),
            ),
            diff_row(
                "Custom data",
                "customData",
                "timeline-action",
                answer(item_code("timeline-custom-data")).pipe([json_parse()]),
                present_or_null(item().path("customData").matches(condition::object::is_object()), obj! {}),
            ),
        ],
    );
    step(obj! {
        "path": "/summary",
        "title": "Summary",
        "reachability": obj! {
            "entryWhen": session("deletionResponse").path("success").matches(condition::equals(true)),
            "tieBreakers": tie(25),
        },
        "onSubmission": arr([submit(obj! {
            "validate": true,
            "onValid": obj! {
                "effects": arr([effect!("deletionPersist"), effect!("clearSession"), effect!("loadAssessmentData")]),
                "next": arr([redirect(obj! { "goto": "success" })]),
            },
        })]),
        "blocks": arr([
            OUTDENT.build(obj! {
                "outdentBy": 4,
                "block": govuk::TABS.build(obj! {
                    "id": "summary",
                    "items": arr([
                        obj! {
                            "id": "events",
                            "label": "Events",
                            "panel": summary_panel("No event data to delete", "deletionRequest.events", "currentData.events", event_card),
                        },
                        obj! {
                            "id": "timeline",
                            "label": "Timeline",
                            "panel": summary_panel(
                                "No timeline data to delete",
                                "deletionRequest.timeline",
                                "currentData.timeline",
                                timeline_card,
                            ),
                        },
                        obj! { "id": "request", "label": "Request", "panel": pre_panel("deletionRequest") },
                        obj! { "id": "response", "label": "Dry-run response", "panel": pre_panel("deletionResponse") },
                    ]),
                }),
            }),
            button("Persist", "persist"),
        ]),
    })
}

pub fn success_step() -> Value {
    step(obj! {
        "path": "/success",
        "title": "Data deletion complete",
        "reachability": obj! { "entryWhen": true, "tieBreakers": tie(0) },
        "blocks": arr([govuk::PANEL.build(obj! {
            "titleText": "Data deletion complete",
            "text": "The assessment data has been reloaded.",
            "headingLevel": 3,
            "classes": "govuk-!-width-two-thirds",
        })]),
    })
}

pub fn clear_step() -> Value {
    step(obj! {
        "path": "/clear",
        "title": "Clear session",
        "reachability": obj! { "entryWhen": true, "tieBreakers": tie(0) },
        "onAccess": arr([access(obj! {
            "effects": arr([effect!("clearSession")]),
            "next": arr([redirect(obj! { "goto": "configuration" })]),
        })]),
    })
}

pub fn data_deletion_tool_journey() -> Value {
    journey(obj! {
        "code": "data-deletion-tool",
        "title": "Data Deletion Tool",
        "path": "/data-deletion-tool",
        "onAccess": arr([access(obj! { "effects": arr([effect!("loadAnswers")]) })]),
        "view": obj! {
            "template": "data-deletion-tool/views/template",
            "locals": obj! { "applicationName": "AAP Data Deletion", "hmppsHeaderServiceNameLink": "/data-deletion-tool" },
        },
        "steps": arr([configuration_step(), events_step(), timeline_step(), summary_step(), success_step(), clear_step()]),
    })
}
