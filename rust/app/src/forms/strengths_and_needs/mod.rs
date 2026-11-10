//! Strengths and Needs.

pub mod audit_events;
pub mod components;
pub mod conditions;
pub mod effects;
pub mod constants;
pub mod generators;
pub mod html_encoder;
pub mod i18n;
pub mod transformers;
pub mod v1;

use std::sync::Arc;

use forge_core::ForgePackage;

use crate::config::config;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::shared::audit::common_audit_event;
use crate::forms::shared::privacy_screen::{PrivacyScreenConfig, create_privacy_screen};
use generators::create_route_with_query;
use v1::constants::form_version::{BASE_PATH, FORM_ROOT_PATH, case_data};
use v1::constants::path::CURRENT_VERSION;
use v1::constants::section::ACCOMMODATION;
use v1::guards::is_historic_version;
use v1::locales::common_content_for;

pub use effects::StrengthsAndNeedsEffectsDeps;

/// Where privacy acceptance sends the user: the accommodation section of the loaded assessment,
/// resuming where they left off. (The session identifier only has a UUID for OASys access, so
/// the loaded assessment's UUID is used.)
fn privacy_screen_redirect_path() -> Value {
    create_route_with_query(
        vec![
            Value::from(BASE_PATH),
            Value::from("edit"),
            data("assessmentUuid").into(),
            Value::from(CURRENT_VERSION),
            Value::from(ACCOMMODATION.side_nav_href),
        ],
        &[("resume", "true")],
    )
    .into()
}

fn privacy_screen_step() -> Value {
    create_privacy_screen(PrivacyScreenConfig {
        load_effects: vec![],
        submit_effects: vec![
            effect!("setPrivacyAccepted"),
            effect!("sendAuditEvent", common_audit_event::CONFIRM_PRIVACY_SCREEN),
        ],
        submit_redirect_path: privacy_screen_redirect_path(),
        already_accepted_redirect_path: privacy_screen_redirect_path(),
        template: "strengths-and-needs/views/san-step".into(),
        base_path: BASE_PATH.into(),
        header_service_name_link: privacy_screen_redirect_path(),
        person_forename: case_data::forename(),
        title: common_content_for("pageTitle.privacy", []),
        feedback_url: config().private_beta_feedback_url.clone(),
    })
}

/// The entry step: redirects to where the access lands (`resolveEntryRoute`).
fn version_redirect_step() -> Value {
    step(obj! {
        "path": "/",
        "title": common_content_for("strengths_and_needs", []),
        "onAccess": [access(obj! {
            "effects": [effect!("resolveEntryRoute")],
            "next": [redirect(obj! {
                "goto": format(
                    format!("{FORM_ROOT_PATH}/%1/%2/%3/%4"),
                    [
                        data("assessment.formVersion").into(),
                        data("entryRoute.mode").into(),
                        data("assessmentUuid").into(),
                        data("entryRoute.versionUuid").into(),
                    ],
                ),
            })],
        })],
    })
}

pub fn strengths_and_needs_root_journey() -> Value {
    journey(obj! {
        "code": "strengths-and-needs",
        "title": common_content_for("strengths_and_needs", []),
        "path": FORM_ROOT_PATH,
        "onAccess": [
            access(obj! {
                "effects": [
                    effect!("initializeSessionFromAccess"),
                    effect!("loadSessionData"),
                    effect!("validateModeAndVersionUuidFromUrl"),
                ],
            }),
            access(obj! { "when": is_historic_version(), "effects": [effect!("resolveHistoricVersion")] }),
            access(obj! { "effects": [effect!("loadAssessment")] }),
        ],
        "steps": [version_redirect_step(), privacy_screen_step()],
        "children": [v1::strengths_and_needs_v1_journey()],
    })
}

/// The strengths and needs package.
pub fn package(deps: Arc<StrengthsAndNeedsEffectsDeps>) -> ForgePackage {
    let mut package = ForgePackage::new(strengths_and_needs_root_journey())
        .with_components(components::components())
        .with_functions(effects::entries(&deps))
        .with_functions(generators::entries())
        .with_functions(transformers::entries())
        .with_functions(conditions::entries());
    package.enabled = config().forms.strengths_and_needs_enabled;
    package
}
