//! The steps outside the versioned journey: the merged plan warning and the "unsaved
//! information deleted" page the session timeout lands on.

use super::guards::{is_merged_plan, is_mpop_access};
use crate::config::config;
use crate::effect;
use crate::forms::dsl::*;

pub fn merged_plan_warning_step() -> Value {
    step(obj! {
        "path": "/merged-plan-warning",
        "title": "You need to use OASys to access this plan",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "template": "sentence-plan/views/sentence-plan-step",
            "locals": obj! {
                "hideNavigation": true,
                "hidePlanHeader": true,
                "hidePreviousVersions": true,
                "hmppsHeaderServiceNameLink": "/sentence-plan/merged-plan-warning",
            },
        },
        "blocks": arr([block(obj! {
            "variant": "html",
            "content": format!(
                "\n    <div class=\"govuk-grid-column-two-thirds\">\n      <h1 class=\"govuk-heading-l govuk-!-margin-top-6\">You need to use OASys to access this plan</h1>\n      <p class=\"govuk-body\">This is because it is a merged case.</p>\n      <p class=\"govuk-body\">\n        <a href=\"{}\" class=\"govuk-link\" data-ai-id=\"merged-plan-go-to-oasys-sentence-plan-link\">Go to OASys to access the sentence plan.</a>\n      </p>\n    </div>\n  ",
                config().oasys_url
            ),
        })]),
        "onAccess": arr([
            access(obj! {
                "effects": arr([
                    effect!("loadFeatureFlags"),
                    effect!("initializeSessionFromAccess"),
                    effect!("loadSessionData"),
                    effect!("loadPlan"),
                ]),
            }),
            access(obj! {
                "when": not(and(vec![is_mpop_access(), is_merged_plan()])),
                "next": arr([redirect(obj! { "goto": "/sentence-plan/v1.0/plan/overview" })]),
            }),
        ]),
    })
}

pub fn unsaved_information_deleted_step() -> Value {
    step(obj! {
        "path": "/unsaved-information-deleted",
        "title": "Your unsaved information has been deleted",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "template": "sentence-plan/views/simple-page",
            "locals": obj! {
                "pageTitle": "Your unsaved information has been deleted - Sentence plan",
                "hideSessionTimeoutModal": true,
                "hmppsHeaderServiceNameLink": "/sentence-plan/v1.0/plan/overview",
            },
        },
        "blocks": arr([
            core_blocks::HTML.build(obj! {
                "content": "\n        <h1 class=\"govuk-heading-l\">Your unsaved information has been deleted</h1>\n        <div data-qa=\"unsaved-information-deleted-content\">\n          <p class=\"govuk-body\">This is to protect your information.</p>\n          <p class=\"govuk-body\">You can go to the plan to start again.</p>\n        </div>\n      ",
            }),
            govuk::LINK_BUTTON.build(obj! {
                "text": "Go to the plan",
                "href": conditional(
                    query("auth").matches(condition::equals("OASYS")),
                    "/sign-in/handover?service=sentence-plan",
                    "/sentence-plan/v1.0/plan/overview",
                ),
                "attributes": obj! { "data-ai-id": "unsaved-information-deleted-go-to-plan-button" },
            }),
        ]),
    })
}
