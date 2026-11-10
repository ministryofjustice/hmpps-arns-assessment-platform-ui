//! The drug use section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const drug_use: &str = "drug_use";
    pub const drug_last_used: &str = "drug_last_used";
    pub const drug_last_used_value: &str = "drug_last_used_%1";
    pub const select_misused_drugs: &str = "select_misused_drugs";
    pub const other_drug_name: &str = "other_drug_name";
    pub const type_of_temporary_drugs: &str = "type_of_temporary_drugs";
    pub const how_often_used_last_six_months: &str = "how_often_used_last_six_months";
    pub const how_often_used_value: &str = "how_often_used_last_six_months_%1";
    pub const how_often_used_other: &str = "how_often_used_other";
    pub const how_often_used_details: &str = "how_often_used_last_six_months_%1_details";
    pub const not_used_in_last_six_months_details: &str = "not_used_in_last_six_months_details";
    pub const drugs_injected: &str = "drugs_injected";
    pub const drugs_injected_value: &str = "drugs_injected_%1";
    pub const drugs_injected_months: &str = "drugs_injected_months";
    pub const drugs_is_receiving_treatment: &str = "drugs_is_receiving_treatment";
    pub const drugs_is_receiving_treatment_yes_details: &str = "drugs_is_receiving_treatment_yes_details";
    pub const drugs_is_receiving_treatment_no_details: &str = "drugs_is_receiving_treatment_no_details";
    pub const drugs_reasons_for_use: &str = "drugs_reasons_for_use";
    pub const drugs_reasons_for_use_details: &str = "drugs_reasons_for_use_details";
    pub const drugs_affected_their_life: &str = "drugs_affected_their_life";
    pub const drugs_affected_their_life_details: &str = "drugs_affected_their_life_details";
    pub const drugs_anything_helped_stop_or_reduce_use: &str = "drugs_anything_helped_stop_or_reduce_use";
    pub const drugs_what_could_help_not_use_drugs_in_future: &str = "drugs_what_could_help_not_use_drugs_in_future";
    pub const drug_use_changes: &str = "drug_use_changes";
    pub const drug_use_changes_made_changes_details: &str = "drug_use_changes_made_changes_details";
    pub const drug_use_changes_making_changes_details: &str = "drug_use_changes_making_changes_details";
    pub const drug_use_changes_want_to_make_changes_details: &str = "drug_use_changes_want_to_make_changes_details";
    pub const drug_use_changes_needs_help_to_make_changes_details: &str = "drug_use_changes_needs_help_to_make_changes_details";
    pub const drug_use_changes_thinking_about_making_changes_details: &str = "drug_use_changes_thinking_about_making_changes_details";
    pub const drug_use_changes_does_not_want_to_make_changes_details: &str = "drug_use_changes_does_not_want_to_make_changes_details";
    pub const drug_use_changes_does_not_want_to_answer_details: &str = "drug_use_changes_does_not_want_to_answer_details";
    pub const drugs_practitioner_analysis_motivated_to_stop: &str = "drugs_practitioner_analysis_motivated_to_stop";
    pub const drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "drug_use_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const drug_use_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "drug_use_practitioner_analysis_strengths_or_protective_factors_no_details";
    pub const drug_use_practitioner_analysis_strengths_or_protective_factors: &str = "drug_use_practitioner_analysis_strengths_or_protective_factors";
    pub const drug_use_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "drug_use_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const drug_use_practitioner_analysis_risk_of_serious_harm_no_details: &str = "drug_use_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const drug_use_practitioner_analysis_risk_of_serious_harm: &str = "drug_use_practitioner_analysis_risk_of_serious_harm";
    pub const drug_use_practitioner_analysis_risk_of_reoffending_yes_details: &str = "drug_use_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const drug_use_practitioner_analysis_risk_of_reoffending_no_details: &str = "drug_use_practitioner_analysis_risk_of_reoffending_no_details";
    pub const drug_use_practitioner_analysis_risk_of_reoffending: &str = "drug_use_practitioner_analysis_risk_of_reoffending";
}

pub mod option {
    pub const last_six: &str = "LAST_SIX";
    pub const in_the_last_six: &str = "IN_THE_LAST_SIX";
    pub const more_than_six: &str = "MORE_THAN_SIX";
    pub const used_more_than_six: &str = "USED_MORE_THAN_SIX";
    pub const amphetamines: &str = "AMPHETAMINES";
    pub const benzodiazepines: &str = "BENZODIAZEPINES";
    pub const cannabis: &str = "CANNABIS";
    pub const cocaine: &str = "COCAINE";
    pub const crack: &str = "CRACK";
    pub const ecstasy: &str = "ECSTASY";
    pub const hallucinogenics: &str = "HALLUCINOGENICS";
    pub const heroin: &str = "HEROIN";
    pub const methadone_not_prescribed: &str = "METHADONE_NOT_PRESCRIBED";
    pub const misused_prescribed_drugs: &str = "MISUSED_PRESCRIBED_DRUGS";
    pub const other_opiates: &str = "OTHER_OPIATES";
    pub const solvents: &str = "SOLVENTS";
    pub const steroids: &str = "STEROIDS";
    pub const spice: &str = "SPICE";
    pub const other_drug: &str = "OTHER_DRUG";
    pub const daily: &str = "DAILY";
    pub const weekly: &str = "WEEKLY";
    pub const monthly: &str = "MONTHLY";
    pub const occasionally: &str = "OCCASIONALLY";
    pub const cultural_or_religious: &str = "CULTURAL_OR_RELIGIOUS";
    pub const curiosity_or_experimentation: &str = "CURIOSITY_OR_EXPERIMENTATION";
    pub const enhance_performance: &str = "ENHANCE_PERFORMANCE";
    pub const escapism_or_avoidance: &str = "ESCAPISM_OR_AVOIDANCE";
    pub const managing_emotional_issues: &str = "MANAGING_EMOTIONAL_ISSUES";
    pub const peer_pressure: &str = "PEER_PRESSURE";
    pub const recreation_or_pleasure: &str = "RECREATION_OR_PLEASURE";
    pub const self_medication: &str = "SELF_MEDICATION";
    pub const behaviour: &str = "BEHAVIOUR";
    pub const community: &str = "COMMUNITY";
    pub const finances: &str = "FINANCES";
    pub const links_to_offending: &str = "LINKS_TO_OFFENDING";
    pub const health: &str = "HEALTH";
    pub const relationships: &str = "RELATIONSHIPS";
    pub const no_motivation: &str = "NO_MOTIVATION";
    pub const partial_motivation: &str = "PARTIAL_MOTIVATION";
    pub const full_motivation: &str = "FULL_MOTIVATION";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const drug_use_status: StepDef = StepDef { code: "drug_use_status", path: "drug-use-status" };
    pub const drug_use_details: StepDef = StepDef { code: "drug_use_details", path: "drug-use-details" };
    pub const drug_use_history: StepDef = StepDef { code: "drug_use_history", path: "drug-use-history" };
    pub const drug_use_types: StepDef = StepDef { code: "drug_use_types", path: "drug-use-types" };
    pub const drug_use_summary: StepDef = StepDef { code: "drug_use_summary", path: "drug-use-summary" };
    pub const drug_use_analysis: StepDef = StepDef { code: "drug_use_analysis", path: "drug-use-analysis" };
}
