//! The "close other applications" step shared by the assessment forms,
//! each providing its own effects, redirects and template.

use crate::forms::dsl::*;

/// `PrivacyScreenConfig`.
pub struct PrivacyScreenConfig {
    /// Effects run on page access, before the page renders.
    pub load_effects: Vec<Value>,
    /// Effects run when the form is submitted successfully.
    pub submit_effects: Vec<Value>,
    /// Where to go after a successful submission (a string or an expression).
    pub submit_redirect_path: Value,
    /// Where to go if privacy has already been accepted this session.
    pub already_accepted_redirect_path: Value,
    pub template: String,
    pub base_path: String,
    pub header_service_name_link: Value,
    /// The person's forename, shown in the content (e.g. `data("caseData.name.forename")`).
    pub person_forename: Value,
    pub title: Value,
    pub feedback_url: String,
}

fn privacy_content(person_forename: Value) -> Value {
    block(obj! {
        "variant": "html",
        "content": format(
            "<h1 class=\"govuk-heading-l\">Remember to close any other applications before starting an appointment with %1</h1>\n    <p class=\"govuk-body\">For example, Outlook, Teams or NDelius.</p>\n    <p class=\"govuk-body\">You must also close other people's assessments or plans if you have them open in other tabs.</p>\n    <p class=\"govuk-body\">Do not let %1 use your device either.</p>\n    <p class=\"govuk-body\">This is to avoid sharing sensitive information.</p>",
            [person_forename],
        ),
    })
}

fn privacy_checkbox() -> Value {
    field(obj! {
        "variant": "govukCheckboxInput",
        "code": "confirm_privacy",
        "items": [obj! {
            "value": "confirmed",
            "text": "I confirm I'll do this before starting an appointment",
            "attributes": obj! { "data-ai-id": "privacy-page-confirm-privacy-checkbox" },
        }],
        "validWhen": [validation(obj! {
            "condition": self_().matches(condition::array::contains("confirmed")),
            "message": "Confirm you will do this before starting an appointment",
        })],
    })
}

fn confirm_button() -> Value {
    block(obj! {
        "variant": "govukButton",
        "text": "Confirm",
        "name": "action",
        "value": "confirm",
        "attributes": obj! { "data-ai-id": "privacy-page-confirm-button" },
        "preventDoubleClick": true,
    })
}

fn return_to_oasys_link() -> Value {
    block(obj! {
        "variant": "html",
        "visibleWhen": data("accessDetails.accessType").matches(condition::equals("OASYS")),
        "content": format(
            "<a href=\"%1\" class=\"govuk-link govuk-link--no-visited-state\" data-ai-id=\"privacy-page-return-to-oasys-link\">Return to OASys</a>",
            [data("accessDetails.oasysRedirectUrl").into()],
        ),
    })
}

fn button_group() -> Value {
    block(obj! {
        "variant": "templateWrapper",
        "template": "<div class=\"govuk-button-group\">{{slot:buttons}}</div>",
        "slots": obj! { "buttons": [confirm_button(), return_to_oasys_link()] },
    })
}

/// `createFormContent`: the privacy content, checkbox and buttons.
pub fn create_form_content(person_forename: Value) -> Value {
    block(obj! {
        "variant": "templateWrapper",
        "template": "\n    <div class=\"govuk-grid-row\">\n      <div class=\"govuk-grid-column-two-thirds\">\n        {{slot:content}}\n      </div>\n    </div>\n  ",
        "slots": obj! {
            "content": [privacy_content(person_forename), privacy_checkbox(), button_group()],
        },
    })
}

/// `createPrivacyScreen`.
pub fn create_privacy_screen(config: PrivacyScreenConfig) -> Value {
    step(obj! {
        "path": "/privacy",
        "title": config.title,
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "template": config.template,
            "locals": obj! {
                "basePath": config.base_path,
                "hideNavigation": true,
                "hideNavigationLinks": true,
                "hidePreviousVersions": true,
                "hideBackToTop": true,
                "hmppsHeaderServiceNameLink": config.header_service_name_link,
                "backlink": when(data("accessDetails.accessType").matches(condition::equals("OASYS")))
                    .then(data("accessDetails.oasysRedirectUrl"))
                    .otherwise(Value::Null),
                "feedbackUrl": config.feedback_url,
            },
        },
        "blocks": [create_form_content(config.person_forename)],
        "onAccess": [access(obj! {
            "effects": config.load_effects,
            "next": [
                // Already accepted this session: skip to the destination
                redirect(obj! {
                    "when": data("privacyAccepted").matches(condition::equals(true)),
                    "goto": config.already_accepted_redirect_path,
                }),
            ],
        })],
        "onSubmission": [submit(obj! {
            "validate": true,
            "onValid": obj! {
                "effects": config.submit_effects,
                "next": [redirect(obj! { "goto": config.submit_redirect_path })],
            },
        })],
    })
}
