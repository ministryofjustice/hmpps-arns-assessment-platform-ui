//! Sentence plan: plans with goals and steps, their agreement,
//! history and previous versions. Access goes through the access form (OASys handover or CRN).

pub mod components;
pub mod constants;
pub mod effects;
pub mod guards;
pub mod navigation;
pub mod root_steps;
pub mod transformers;
pub mod v1;

use std::sync::Arc;

use forge_core::ForgePackage;

use crate::config::config;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::shared::audit::common_audit_event;
use crate::forms::shared::privacy_screen::{PrivacyScreenConfig, create_privacy_screen};
use constants::case_data;

pub use effects::SentencePlanEffectsDeps;

fn privacy_screen_step() -> Value {
    create_privacy_screen(PrivacyScreenConfig {
        load_effects: vec![effect!("loadSessionData")],
        submit_effects: vec![
            effect!("setPrivacyAccepted"),
            effect!("sendAuditEvent", common_audit_event::CONFIRM_PRIVACY_SCREEN),
        ],
        submit_redirect_path: Value::from("v1.0/plan/overview"),
        already_accepted_redirect_path: Value::from("v1.0/plan/overview"),
        template: "sentence-plan/views/sentence-plan-step".into(),
        base_path: "/sentence-plan/v1.0".into(),
        header_service_name_link: Value::from("/sentence-plan/v1.0/plan/overview"),
        person_forename: case_data::forename().into(),
        title: Value::from("Close other applications"),
        feedback_url: config().national_rollout_feedback_url.clone(),
    })
}

/// The root sentence plan journey.
pub fn sentence_plan_journey() -> Value {
    journey(obj! {
        "code": "sentence-plan",
        "title": "Sentence plan",
        "path": "/sentence-plan",
        "children": arr([v1::sentence_plan_v1_journey()]),
        "steps": arr([root_steps::merged_plan_warning_step(), privacy_screen_step(), root_steps::unsaved_information_deleted_step()]),
    })
}

pub fn package(deps: Arc<SentencePlanEffectsDeps>) -> ForgePackage {
    let mut package = ForgePackage::new(sentence_plan_journey())
        .with_components(components::components())
        .with_functions(effects::entries(&deps))
        .with_functions(transformers::entries());
    package.enabled = config().forms.sentence_plan_enabled;
    package
}
