//! What each scenario flag changes about session creation and handover.

use serde_json::{Value as Json, json};

use super::scenarios::fields_by_group;
use super::scenarios::schema::{Group, random_oasys_assessment_pk, rng};
use crate::config::config;

pub type TargetApplication = &'static str;

pub fn map_flag_to_target_application(flag: &str) -> TargetApplication {
    match flag {
        "SAN_BETA" => "strengths-and-needs",
        "TIERING_ASSESSMENT" => "tiering-assessment",
        _ => "sentence-plan",
    }
}

fn all_targets() -> Vec<TargetApplication> {
    config().handover_targets.iter().map(|t| t.key).collect()
}

/// The handover configuration from all flags: the services offered (Sentence Plan by default,
/// others revealed by flags), URL parameters and request changes, in flag order.
pub struct ResolvedHandoverConfig {
    pub available_services: Vec<TargetApplication>,
    pub url_params: Vec<(String, String)>,
    pub strip_sentence_plan_version: bool,
}

pub fn resolve_handover_config(flags: &[String]) -> ResolvedHandoverConfig {
    let mut resolved = ResolvedHandoverConfig { available_services: vec!["sentence-plan"], url_params: vec![], strip_sentence_plan_version: false };
    for flag in flags {
        let (available, strip): (Option<Vec<TargetApplication>>, bool) = match flag.as_str() {
            "SAN_BETA" | "TIERING_ASSESSMENT" => (Some(all_targets()), false),
            // The plan is reset (new period of supervision) or may have changed (merge): strip the
            // version so the UI shows the current state, not a historic snapshot.
            "NEW_PERIOD_OF_SUPERVISION" | "MERGED" => (None, true),
            _ => continue,
        };
        let target = map_flag_to_target_application(flag);
        if available.is_some_and(|a| a.contains(&target)) && !resolved.available_services.contains(&target) {
            resolved.available_services.push(target);
        }
        resolved.strip_sentence_plan_version |= strip;
    }
    resolved
}

/// `getExcludedFields`: the criminogenic needs fields are left out only when SAN_BETA is off and
/// the scenario turned the mocked needs off.
pub fn excluded_fields(flags: &[String], fixed_values: &forge_core::Value) -> Vec<&'static str> {
    let mocks_off = fixed_values.get("useMockedCriminogenicNeeds").as_str() == Some("NO");
    if flags.iter().any(|f| f == "SAN_BETA") || !mocks_off {
        return vec![];
    }
    fields_by_group(Group::CriminogenicNeeds)
}

/// `applyCreateSessionModifiers`: each flag's change to the coordinator request, in order.
pub fn apply_create_session_modifiers(flags: &[String], mut request: Json) -> Json {
    for flag in flags {
        match flag.as_str() {
            "SAN_BETA" => request["assessmentType"] = json!("SAN_SP"),
            "NEW_PERIOD_OF_SUPERVISION" => {
                request["newPeriodOfSupervision"] = json!("Y");
                request["previousOasysSpPk"] = request["oasysAssessmentPk"].clone();
                request["oasysAssessmentPk"] = json!(random_oasys_assessment_pk(&mut rng(None)));
            }
            _ => {}
        }
    }
    request
}

pub fn flags_of(value: &forge_core::Value) -> Vec<String> {
    value.as_array().map(|a| a.iter().map(forge_core::Value::to_js_string).collect()).unwrap_or_default()
}
