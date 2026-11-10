//! Browse (scenario picker), customise (modify a scenario before creating a session)
//! and sessions (manage sessions, generate handover links).

use super::components::{CRIMINOGENIC_NEEDS_LIST, RANDOMIZABLE_FIELD, TAB_PANEL};
use super::html;
use super::scenarios::stubbed_crns::STUBBED_CRNS;
use super::transformers::relative_time;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::shared::gender::handover_gender_options;

fn escaped(path: &str) -> Value {
    item().path(path).pipe([transformer::string::escape_html()]).into()
}

/// `scenarioDetailsBlock`: the person, flags and criminogenic needs of a scenario or session.
fn scenario_details_block() -> Value {
    let keys = ["givenName", "familyName", "dateOfBirth", "location", "crn", "pnc", "oasysAssessmentPk", "sentencePlanVersion", "sanAssessmentVersion"];
    let mut values = Map::new();
    for key in keys {
        values.insert(key.into(), escaped(key));
    }
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": html::DETAILS_0,
        "values": Value::object(values),
        "slots": obj! {
            "flags": [core_blocks::COLLECTION_BLOCK.build(obj! {
                "collection": item().path("flags").each(iterator::map(govuk::TAG.build(obj! {
                    "text": item().value(),
                    "classes": "govuk-tag--teal",
                }))),
                "fallback": [core_blocks::HTML.build(obj! { "content": "<p class=\"govuk-body-s govuk-!-margin-bottom-0\">No flags set</p>" })],
            })],
            "needs": [CRIMINOGENIC_NEEDS_LIST.build(obj! { "needs": item().path("displayNeeds") })],
        },
    })
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

fn help_text(content: &str) -> Value {
    govuk::DETAILS.build(obj! {
        "summaryText": "What is this page for?",
        "content": [core_blocks::HTML.build(obj! { "content": content })],
    })
}

// Browse ------------------------------------------------------------------------------------

fn scenario_panel_content() -> Vec<Value> {
    let id = || item().path("id");
    vec![
        core_blocks::TEMPLATE_WRAPPER.build(obj! {
            "template": html::BROWSE_2,
            "values": obj! {
                "csrfToken": data("csrfToken"),
                "title": escaped("name"),
                "description": escaped("description"),
                "scenarioId": id(),
                "seed": item().path("rawScenario.seed"),
                "deleteFormStyle": when(item().path("isCustom").matches(condition::equals(true))).then("").otherwise("display:none"),
            },
            "slots": obj! {
                "formControls": [govuk::BUTTON.build(obj! {
                    "text": "Start session",
                    "id": format("start-session-%1", [id().into()]),
                    "preventDoubleClick": true,
                })],
                "deleteButton": [govuk::BUTTON.build(obj! {
                    "text": "Delete scenario",
                    "name": "action",
                    "value": "deleteScenario",
                    "classes": "govuk-button--warning",
                    "id": format("delete-scenario-%1", [id().into()]),
                })],
                "linkButtons": [
                    govuk::LINK_BUTTON.build(obj! {
                        "text": "Customise scenario",
                        "id": format("customize-scenario-%1", [id().into()]),
                        "classes": "govuk-button--secondary",
                        "href": format("customise?scenario=%1", [id().into()]),
                        "attributes": obj! { "tabindex": "0" },
                    }),
                    govuk::LINK_BUTTON.build(obj! {
                        "html": html::RANDOMISE_BUTTON_HTML,
                        "id": format("randomize-scenario-%1", [id().into()]),
                        "classes": "govuk-button--alternative-blue",
                        "href": format("browse?scenario=%1", [id().into()]),
                        "attributes": obj! { "tabindex": "0" },
                    }),
                ],
            },
        }),
        core_blocks::HTML.build(obj! { "content": "<h2 class=\"govuk-heading-m\">Scenario Details</h2>" }),
        scenario_details_block(),
    ]
}

fn browse_step() -> Value {
    let picker = TAB_PANEL.build(obj! {
        "id": "scenario-picker",
        "sidebarTitle": "Scenarios",
        "defaultSelected": "default",
        "queryParam": "scenario",
        "items": data("scenarios").each(iterator::map(obj! {
            "id": item().path("id"),
            "label": item().path("name"),
            "sublabel": item().path("shortDescription"),
            "panel": scenario_panel_content(),
        })),
    });
    step(obj! {
        "path": "/browse",
        "title": "Select a scenario",
        "reachability": obj! { "entryWhen": true },
        "blocks": [
            notification_banners(),
            block(obj! { "variant": "html", "content": html::BROWSE_0 }),
            help_text(html::BROWSE_1),
            picker,
        ],
        "onAccess": [
            access(obj! { "effects": [effect!("loadNotifications", "browse"), effect!("loadScenarios")] }),
            access(obj! {
                "when": query("scenario").not().matches(condition::is_required()),
                "next": [redirect(obj! { "goto": "browse?scenario=default" })],
            }),
        ],
        "onSubmission": [
            submit(obj! {
                "when": post("action").matches(condition::equals("deleteScenario")),
                "onAlways": obj! { "effects": [effect!("deleteScenario")], "next": [redirect(obj! { "goto": "browse" })] },
            }),
            submit(obj! {
                "onAlways": obj! { "effects": [effect!("createSessionFromPreset")], "next": [redirect(obj! { "goto": "sessions" })] },
            }),
        ],
    })
}

// Customise ---------------------------------------------------------------------------------

/// A field with a "Randomise" toggle.
fn randomizable(field_key: &str, field: Value) -> Value {
    RANDOMIZABLE_FIELD.build(obj! {
        "fieldKey": field_key,
        "randomize": data(&format!("{field_key}_isRandomized")),
        "field": field,
    })
}

fn yes_no_items() -> Value {
    Value::array(vec![obj! { "value": "YES", "text": "Yes" }, obj! { "value": "NO", "text": "No" }])
}

fn text_input(code: &str, label: &str, hint: Option<&str>, classes: &str) -> Value {
    let mut props = obj! { "code": code, "label": label };
    if let Some(h) = hint {
        props.set("hint", Value::from(h));
    }
    props.set("classes", Value::from(classes));
    props.set("defaultValue", data(&format!("scenario.{code}")).into());
    govuk::TEXT_INPUT.build(props)
}

fn subject_details_tab() -> Vec<Value> {
    let heading = |text: &str| core_blocks::HTML.build(obj! { "content": format!("<h3 class=\"govuk-heading-s govuk-!-margin-top-6\">{text}</h3>") });
    let mut stubbed = vec![obj! { "value": "", "text": "None" }];
    stubbed.extend(STUBBED_CRNS.iter().map(|c| obj! { "value": c.crn, "text": c.crn, "hint": c.description }));
    vec![
        core_blocks::HTML.build(obj! { "content": "<h2 class=\"govuk-heading-m\">Subject Details</h2>" }),
        core_blocks::HTML.build(obj! {
            "content": "<p class=\"govuk-body\">Configure the subject details for this scenario. Check \"Randomise\" to generate a new value each time the scenario is loaded.</p>",
        }),
        heading("Personal Information"),
        randomizable("givenName", text_input("givenName", "Given name", None, "govuk-input--width-10")),
        randomizable("familyName", text_input("familyName", "Family name", None, "govuk-input--width-10")),
        randomizable("dateOfBirth", text_input("dateOfBirth", "Date of birth", Some("Format: YYYY-MM-DD (e.g., 1985-03-15)"), "govuk-input--width-10")),
        randomizable(
            "gender",
            govuk::SELECT_INPUT.build(obj! {
                "code": "gender",
                "label": "Gender",
                "classes": "govuk-input--width-10",
                "defaultValue": data("scenario.gender"),
                "items": handover_gender_options(),
            }),
        ),
        randomizable(
            "location",
            govuk::RADIO_INPUT.build(obj! {
                "code": "location",
                "label": "Location",
                "classes": "govuk-radios--inline",
                "defaultValue": data("scenario.location"),
                "items": [obj! { "value": "COMMUNITY", "text": "Community" }, obj! { "value": "PRISON", "text": "Prison" }],
            }),
        ),
        randomizable(
            "sexuallyMotivatedOffenceHistory",
            govuk::RADIO_INPUT.build(obj! {
                "code": "sexuallyMotivatedOffenceHistory",
                "label": "Sexually motivated offence history",
                "classes": "govuk-radios--inline",
                "defaultValue": data("scenario.sexuallyMotivatedOffenceHistory"),
                "items": yes_no_items(),
            }),
        ),
        heading("Identifiers"),
        randomizable("crn", text_input("crn", "CRN", Some("Case Reference Number"), "govuk-input--width-10")),
        govuk::RADIO_INPUT.build(obj! {
            "code": "stubbedCrn",
            "label": "Stubbed CRN",
            "hint": "Replaces the CRN above with a shared test CRN that has fixed data in local, dev and test, so the About and supervision package pages show that data instead of calling the real services. If you pick one, Sentence Plan shows its canned criminogenic needs, not the ones you set on the Criminogenic Needs tab. The launcher never changes their data.",
            "classes": "govuk-radios--small",
            "defaultValue": data("stubbedCrn"),
            "items": stubbed,
        }),
        randomizable("pnc", text_input("pnc", "PNC", Some("Police National Computer number"), "govuk-input--width-20")),
        randomizable("oasysAssessmentPk", text_input("oasysAssessmentPk", "OASys Assessment PK", Some("7-digit identifier"), "govuk-input--width-10")),
        randomizable("sentencePlanVersion", text_input("sentencePlanVersion", "Sentence Plan Version", Some("Version number"), "govuk-input--width-10")),
        randomizable(
            "sanAssessmentVersion",
            text_input(
                "sanAssessmentVersion",
                "SAN Assessment Version",
                Some("Unix timestamp in milliseconds (leave blank for current version)"),
                "govuk-input--width-10",
            ),
        ),
    ]
}

struct NeedConfig {
    title: &'static str,
    prefix: &'static str,
    max_score: Option<i64>,
}

fn need_fields(config: &NeedConfig) -> Vec<Value> {
    let radio = |suffix: &str, label: &str| {
        let code = format!("{}{suffix}", config.prefix);
        randomizable(
            &code,
            govuk::RADIO_INPUT.build(obj! {
                "code": code.as_str(),
                "label": label,
                "classes": "govuk-radios--inline govuk-radios--small",
                "defaultValue": data(&format!("scenario.{code}")),
                "items": yes_no_items(),
            }),
        )
    };
    let mut fields = vec![
        radio("LinkedToHarm", "Linked to harm"),
        radio("LinkedToReoffending", "Linked to reoffending"),
        radio("Strengths", "Strengths"),
        radio("Threshold", "High scoring (threshold)"),
    ];
    if let Some(max) = config.max_score {
        let code = format!("{}OtherWeightedScore", config.prefix);
        fields.push(randomizable(
            &code,
            govuk::TEXT_INPUT.build(obj! {
                "code": code.as_str(),
                "label": "Score",
                "hint": format!("0 to {max}"),
                "inputType": "number",
                "classes": "govuk-input--width-4",
                "defaultValue": data(&format!("scenario.{code}")),
            }),
        ));
    }
    fields
}

fn criminogenic_needs_tab() -> Vec<Value> {
    let needs = [
        NeedConfig { title: "Accommodation", prefix: "acc", max_score: Some(6) },
        NeedConfig { title: "Employment & Education", prefix: "ete", max_score: Some(4) },
        NeedConfig { title: "Finance", prefix: "finance", max_score: None },
        NeedConfig { title: "Drug Use", prefix: "drug", max_score: Some(8) },
        NeedConfig { title: "Alcohol Use", prefix: "alcohol", max_score: Some(4) },
        NeedConfig { title: "Health & Wellbeing", prefix: "emo", max_score: None },
        NeedConfig { title: "Relationships", prefix: "rel", max_score: Some(6) },
        NeedConfig { title: "Thinking & Behaviour", prefix: "think", max_score: Some(10) },
        NeedConfig { title: "Lifestyle", prefix: "lifestyle", max_score: Some(6) },
    ];
    let mut blocks = vec![
        core_blocks::HTML.build(obj! { "content": "<h2 class=\"govuk-heading-m\">Criminogenic Needs</h2>" }),
        core_blocks::HTML.build(obj! { "content": html::NEEDS_TAB_0 }),
        govuk::CHECKBOX_INPUT.build(obj! {
            "code": "useMockedCriminogenicNeeds",
            "classes": "govuk-checkboxes--small",
            "defaultValue": data("mockedCriminogenicNeedsSelection"),
            "items": [obj! {
                "value": "YES",
                "text": "Use mocked criminogenic needs",
                "hint": "The values below are returned in place of the ARNS API for this CRN. Only used with the SAN Private Beta flag, as Sentence Plan only shows criminogenic needs for Private Beta. Untick to use the data held by the real ARNS API in dev and test. When running locally, unticking gives the canned needs Wiremock returns for every CRN.",
            }],
        }),
    ];
    blocks.extend(needs.iter().map(|n| govuk::DETAILS.build(obj! { "summaryText": n.title, "content": need_fields(n) })));
    blocks
}

fn flags_tab() -> Vec<Value> {
    vec![
        core_blocks::HTML.build(obj! { "content": "<h2 class=\"govuk-heading-m\">Scenario Flags</h2>" }),
        core_blocks::HTML.build(obj! { "content": html::FLAGS_TAB_0 }),
        govuk::CHECKBOX_INPUT.build(obj! {
            "code": "flags",
            "label": "Active flags",
            "hint": "Select the flags to enable for this scenario",
            "defaultValue": data("flags"),
            "items": [
                obj! {
                    "value": "SAN_BETA",
                    "text": "SAN Private Beta",
                    "hint": "Enables Strengths and Needs private beta features and criminogenic needs",
                },
                obj! {
                    "value": "NEW_PERIOD_OF_SUPERVISION",
                    "text": "New Period of Supervision",
                    "hint": "Simulates a new period of supervision. The session will be created with the plan in a reset state.",
                },
                obj! {
                    "value": "MERGED",
                    "text": "Merged",
                    "hint": "Simulates an OASys merge. The plan will be created then merged to a new PK, setting the MERGED flag. Do not combine with New Period of Supervision.",
                    "block": govuk::TEXT_INPUT.build(obj! {
                        "code": "mergeOldPk",
                        "label": "Previous OASys Assessment PK",
                        "hint": "The OASys Assessment PK of the existing session to merge from.",
                        "classes": "govuk-input--width-10",
                    }),
                },
                obj! {
                    "value": "TIERING_ASSESSMENT",
                    "text": "Tiering Assessment Private Beta",
                    "hint": "Enables Tiering Assessment Private Beta features",
                },
            ],
        }),
    ]
}

fn practitioner_details_tab() -> Vec<Value> {
    let access_mode = |code: &str, label: &str, hint: &str| {
        randomizable(
            code,
            govuk::RADIO_INPUT.build(obj! {
                "code": code,
                "label": label,
                "hint": hint,
                "defaultValue": data(&format!("scenario.{code}")),
                "items": [obj! { "value": "READ_WRITE", "text": "Read and Write" }, obj! { "value": "READ_ONLY", "text": "Read Only" }],
            }),
        )
    };
    vec![
        core_blocks::HTML.build(obj! { "content": "<h2 class=\"govuk-heading-m\">Practitioner Details</h2>" }),
        core_blocks::HTML.build(obj! { "content": html::PRACTITIONER_TAB_0 }),
        randomizable(
            "practitionerIdentifier",
            text_input("practitionerIdentifier", "Practitioner identifier", Some("Unique identifier for the practitioner"), "govuk-input--width-20"),
        ),
        randomizable(
            "practitionerDisplayName",
            text_input("practitionerDisplayName", "Display name", Some("Name shown in the target application"), "govuk-input--width-20"),
        ),
        access_mode("accessMode", "Access mode (general)", "Controls overall access mode for the practitioner"),
        access_mode("planAccessMode", "Plan access mode", "Controls whether the practitioner can edit or only view the plan"),
    ]
}

fn customise_step() -> Value {
    let tab = |id: &str, label: &str, sublabel: &str, panel: Vec<Value>| obj! { "id": id, "label": label, "sublabel": sublabel, "panel": panel };
    let tab_panel = TAB_PANEL.build(obj! {
        "id": "customise-scenario",
        "sidebarTitle": "Configuration",
        "defaultSelected": "subject-details",
        "queryParam": "tab",
        "items": [
            tab("subject-details", "Subject Details", "Name, DOB, identifiers", subject_details_tab()),
            tab("criminogenic-needs", "Criminogenic Needs", "Need scores and flags", criminogenic_needs_tab()),
            tab("flags", "Scenario Flags", "Feature toggles", flags_tab()),
            tab("practitioner", "Practitioner Details", "Access and identity", practitioner_details_tab()),
        ],
    });
    let form = core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "template": html::CUSTOMISE_1,
        "values": obj! {
            "originalScenarioName": data("originalScenarioName").pipe([transformer::string::escape_html()]),
            "csrfToken": data("csrfToken"),
            "scenarioId": query("scenario").pipe([transformer::string::escape_html()]),
        },
        "slots": obj! {
            "scenarioNameInput": [govuk::TEXT_INPUT.build(obj! {
                "code": "scenarioName",
                "label": "Scenario name",
                "classes": "govuk-input--width-20",
                "defaultValue": format("%1 (Customised)", [data("originalScenarioName").into()]),
            })],
            "actions": [
                govuk::BUTTON.build(obj! { "text": "Create session", "name": "action", "value": "createSession" }),
                govuk::BUTTON.build(obj! { "text": "Save as preset", "name": "action", "value": "savePreset", "classes": "govuk-button--secondary" }),
                core_blocks::HTML.build(obj! { "content": "<a href=\"browse\" class=\"govuk-link\">Cancel</a>" }),
            ],
            "tabPanel": [tab_panel],
        },
    });
    step(obj! {
        "path": "/customise",
        "title": "Customise scenario",
        "reachability": obj! { "entryWhen": true },
        "blocks": [block(obj! { "variant": "html", "content": html::CUSTOMISE_0 }), form],
        "onAccess": [
            access(obj! {
                "when": query("scenario").not().matches(condition::is_required()),
                "next": [redirect(obj! { "goto": "browse" })],
            }),
            access(obj! { "effects": [effect!("loadScenarioForCustomise")] }),
        ],
        "onSubmission": [
            submit(obj! {
                "when": post("action").matches(condition::equals("createSession")),
                "onAlways": obj! { "effects": [effect!("createSessionFromCustomize")], "next": [redirect(obj! { "goto": "sessions" })] },
            }),
            submit(obj! {
                "when": post("action").matches(condition::equals("savePreset")),
                "onAlways": obj! { "effects": [effect!("saveCustomPreset")], "next": [redirect(obj! { "goto": "browse" })] },
            }),
        ],
    })
}

// Sessions ----------------------------------------------------------------------------------

fn session_card_block() -> Value {
    core_blocks::TEMPLATE_WRAPPER.build(obj! {
        "classes": "session-card",
        "template": html::SESSIONS_4,
        "values": obj! {
            "csrfToken": data("csrfToken"),
            "sessionId": item().path("id"),
            "scenarioName": escaped("scenarioName"),
            "givenName": escaped("givenName"),
            "familyName": escaped("familyName"),
            "crn": escaped("crn"),
            "location": escaped("location"),
            "createdAt": item().path("createdAt").pipe([relative_time()]),
            "openAttr": when(Loop.index0().matches(condition::equals(0))).then("open").otherwise(""),
        },
        "slots": obj! {
            "details": [govuk::DETAILS.build(obj! { "summaryText": "View scenario details", "content": [scenario_details_block()] })],
            "actions": [
                govuk::SELECT_INPUT.build(obj! {
                    "code": "targetApplication",
                    "label": obj! { "text": "Target service", "classes": "govuk-!-font-weight-bold" },
                    "items": item().path("availableServices"),
                }),
                govuk::BUTTON.build(obj! { "text": "Generate link", "name": "action", "value": "generateLink" }),
                govuk::BUTTON.build(obj! { "text": "Delete session", "name": "action", "value": "deleteSession", "classes": "govuk-button--secondary" }),
            ],
        },
    })
}

fn sessions_step() -> Value {
    let has_sessions = || data("sessions").matches(condition::is_required());
    step(obj! {
        "path": "/sessions",
        "title": "Active Sessions",
        "reachability": obj! { "entryWhen": true },
        "blocks": [
            notification_banners(),
            core_blocks::HTML.build(obj! {
                "visibleWhen": data("handoverApiFailure").matches(condition::equals(true)),
                "content": html::SESSIONS_0,
            }),
            core_blocks::HTML.build(obj! { "content": html::SESSIONS_1 }),
            help_text(html::SESSIONS_2),
            core_blocks::HTML.build(obj! { "visibleWhen": data("sessions").not().matches(condition::is_required()), "content": html::SESSIONS_3 }),
            core_blocks::COLLECTION_BLOCK.build(obj! {
                "visibleWhen": has_sessions(),
                "collection": data("sessions").each(iterator::map(session_card_block())),
                "fallback": [core_blocks::HTML.build(obj! { "content": "<p class=\"govuk-body\">No sessions to display.</p>" })],
            }),
            core_blocks::HTML.build(obj! { "content": "<hr class=\"govuk-section-break govuk-section-break--l govuk-section-break--visible\">" }),
            govuk::LINK_BUTTON.build(obj! { "text": "+ New session", "href": "browse", "classes": "govuk-button--secondary" }),
            core_blocks::TEMPLATE_WRAPPER.build(obj! {
                "visibleWhen": has_sessions(),
                "template": html::SESSIONS_5,
                "values": obj! { "csrfToken": data("csrfToken") },
                "slots": obj! {
                    "button": [govuk::BUTTON.build(obj! {
                        "text": "Reset all sessions",
                        "name": "action",
                        "value": "resetAllSessions",
                        "classes": "govuk-button--warning",
                    })],
                },
            }),
        ],
        "onAccess": [access(obj! { "effects": [effect!("loadNotifications", "sessions")] })],
        "onSubmission": [
            submit(obj! {
                "when": post("action").matches(condition::equals("generateLink")),
                "onAlways": obj! { "effects": [effect!("generateHandoverLink")], "next": [redirect(obj! { "goto": data("handoverLink") })] },
            }),
            submit(obj! {
                "when": post("action").matches(condition::equals("deleteSession")),
                "onAlways": obj! { "effects": [effect!("deleteSession")], "next": [redirect(obj! { "goto": "sessions" })] },
            }),
            submit(obj! {
                "when": post("action").matches(condition::equals("resetAllSessions")),
                "onAlways": obj! { "effects": [effect!("deleteAllSessions")], "next": [redirect(obj! { "goto": "sessions" })] },
            }),
        ],
    })
}

pub fn training_session_launcher_journey() -> Value {
    journey(obj! {
        "code": "training-session-launcher",
        "title": "Training Session Launcher",
        "path": "/training-session-launcher",
        "view": obj! {
            "template": "training-session-launcher/views/template",
            "locals": obj! { "footerBaseUrl": "/platform" },
        },
        "onAccess": [access(obj! {
            "effects": [effect!("setTargetService", "sentence-plan"), effect!("storeCsrf"), effect!("loadPreferences")],
        })],
        "steps": [browse_step(), customise_step(), sessions_step()],
    })
}
