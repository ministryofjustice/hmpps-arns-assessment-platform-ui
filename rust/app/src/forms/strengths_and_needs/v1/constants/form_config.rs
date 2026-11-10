//! The v1.0 form config, built from every section.

use std::sync::OnceLock;

use forge_core::Value;

use super::form_version::FORM_VERSION;
use super::section::ALL;
use crate::forms::strengths_and_needs::constants::form_config::build_form_config;
use crate::forms::strengths_and_needs::v1::journeys;

/// The v1.0 `FormConfig`, built once.
pub fn v1_form_config() -> &'static Value {
    static CONFIG: OnceLock<Value> = OnceLock::new();
    CONFIG.get_or_init(|| {
        let section_status_keys: Vec<&str> = ALL.iter().map(|s| s.status_key).collect();
        let sections = [
            journeys::accommodation::section::section().clone(),
            journeys::alcohol_use::section::section().clone(),
            journeys::drug_use::section::section().clone(),
            journeys::employment_and_education::section::section().clone(),
            journeys::finance::section::section().clone(),
            journeys::health_wellbeing::section::section().clone(),
            journeys::personal_relationships_and_community::section::section().clone(),
            journeys::thinking_behaviours_and_attitudes::section::section().clone(),
            journeys::offence_analysis::section::section().clone(),
        ];
        build_form_config(FORM_VERSION, &sections, &section_status_keys)
    })
}
