//! The health wellbeing section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const health_wellbeing_physical_health_condition: &str = "health_wellbeing_physical_health_condition";
    pub const health_wellbeing_physical_health_condition_yes_details: &str = "health_wellbeing_physical_health_condition_yes_details";
    pub const health_wellbeing_mental_health_condition_yes_ongoing_severe_details: &str = "health_wellbeing_mental_health_condition_yes_ongoing_severe_details";
    pub const health_wellbeing_mental_health_condition_yes_ongoing_details: &str = "health_wellbeing_mental_health_condition_yes_ongoing_details";
    pub const health_wellbeing_mental_health_condition_yes_in_the_past_details: &str = "health_wellbeing_mental_health_condition_yes_in_the_past_details";
    pub const health_wellbeing_mental_health_condition: &str = "health_wellbeing_mental_health_condition";
    pub const health_wellbeing_prescribed_medication_physical_conditions: &str = "health_wellbeing_prescribed_medication_physical_conditions";
    pub const health_wellbeing_prescribed_medication_mental_conditions: &str = "health_wellbeing_prescribed_medication_mental_conditions";
    pub const health_wellbeing_psychiatric_treatment: &str = "health_wellbeing_psychiatric_treatment";
    pub const health_wellbeing_head_injury_or_illness: &str = "health_wellbeing_head_injury_or_illness";
    pub const health_wellbeing_neurodiverse_conditions_yes_details: &str = "health_wellbeing_neurodiverse_conditions_yes_details";
    pub const health_wellbeing_neurodiverse_conditions: &str = "health_wellbeing_neurodiverse_conditions";
    pub const health_wellbeing_learning_difficulties_yes_significant_difficulties_details: &str = "health_wellbeing_learning_difficulties_yes_significant_difficulties_details";
    pub const health_wellbeing_learning_difficulties_yes_some_difficulties_details: &str = "health_wellbeing_learning_difficulties_yes_some_difficulties_details";
    pub const health_wellbeing_learning_difficulties: &str = "health_wellbeing_learning_difficulties";
    pub const health_wellbeing_coping_day_to_day_life: &str = "health_wellbeing_coping_day_to_day_life";
    pub const health_wellbeing_attitude_towards_self: &str = "health_wellbeing_attitude_towards_self";
    pub const health_wellbeing_self_harmed_yes_details: &str = "health_wellbeing_self_harmed_yes_details";
    pub const health_wellbeing_self_harmed: &str = "health_wellbeing_self_harmed";
    pub const health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details: &str = "health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details";
    pub const health_wellbeing_attempted_suicide_or_suicidal_thoughts: &str = "health_wellbeing_attempted_suicide_or_suicidal_thoughts";
    pub const health_wellbeing_outlook: &str = "health_wellbeing_outlook";
    pub const health_wellbeing_positive_factors_other_details: &str = "health_wellbeing_positive_factors_other_details";
    pub const health_wellbeing_positive_factors: &str = "health_wellbeing_positive_factors";
    pub const health_wellbeing_changes_made_changes_details: &str = "health_wellbeing_changes_made_changes_details";
    pub const health_wellbeing_changes_making_changes_details: &str = "health_wellbeing_changes_making_changes_details";
    pub const health_wellbeing_changes_want_to_make_changes_details: &str = "health_wellbeing_changes_want_to_make_changes_details";
    pub const health_wellbeing_changes_needs_help_to_make_changes_details: &str = "health_wellbeing_changes_needs_help_to_make_changes_details";
    pub const health_wellbeing_changes_thinking_about_making_changes_details: &str = "health_wellbeing_changes_thinking_about_making_changes_details";
    pub const health_wellbeing_changes_does_not_want_to_make_changes_details: &str = "health_wellbeing_changes_does_not_want_to_make_changes_details";
    pub const health_wellbeing_changes_does_not_want_to_answer_details: &str = "health_wellbeing_changes_does_not_want_to_answer_details";
    pub const health_wellbeing_changes: &str = "health_wellbeing_changes";
    pub const health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "health_wellbeing_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const health_wellbeing_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "health_wellbeing_practitioner_analysis_strengths_or_protective_factors_no_details";
    pub const health_wellbeing_practitioner_analysis_strengths_or_protective_factors: &str = "health_wellbeing_practitioner_analysis_strengths_or_protective_factors";
    pub const health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "health_wellbeing_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details: &str = "health_wellbeing_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const health_wellbeing_practitioner_analysis_risk_of_serious_harm: &str = "health_wellbeing_practitioner_analysis_risk_of_serious_harm";
    pub const health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details: &str = "health_wellbeing_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const health_wellbeing_practitioner_analysis_risk_of_reoffending_no_details: &str = "health_wellbeing_practitioner_analysis_risk_of_reoffending_no_details";
    pub const health_wellbeing_practitioner_analysis_risk_of_reoffending: &str = "health_wellbeing_practitioner_analysis_risk_of_reoffending";
}

pub mod option {
    pub const pending_treatment: &str = "PENDING_TREATMENT";
    pub const yes_some_difficulties: &str = "YES_SOME_DIFFICULTIES";
    pub const positive: &str = "POSITIVE";
    pub const some_negative_aspects: &str = "SOME_NEGATIVE_ASPECTS";
    pub const negative: &str = "NEGATIVE";
    pub const optimistic: &str = "OPTIMISTIC";
    pub const not_sure: &str = "NOT_SURE";
    pub const not_optimistic: &str = "NOT_OPTIMISTIC";
    pub const accommodation: &str = "ACCOMMODATION";
    pub const employment: &str = "EMPLOYMENT";
    pub const faith_or_religion: &str = "FAITH_OR_RELIGION";
    pub const community: &str = "COMMUNITY";
    pub const medication_or_treatment: &str = "MEDICATION_OR_TREATMENT";
    pub const money: &str = "MONEY";
    pub const relationships: &str = "RELATIONSHIPS";
    pub const yes_significant_difficulties: &str = "YES_SIGNIFICANT_DIFFICULTIES";
    pub const yes_ongoing_severe: &str = "YES_ONGOING_SEVERE";
    pub const yes_ongoing: &str = "YES_ONGOING";
    pub const yes_in_the_past: &str = "YES_IN_THE_PAST";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const health_wellbeing_status: StepDef = StepDef { code: "health_wellbeing_status", path: "health-wellbeing-status" };
    pub const health_wellbeing_details: StepDef = StepDef { code: "health_wellbeing_details", path: "health-wellbeing-details" };
    pub const health_wellbeing_summary: StepDef = StepDef { code: "health_wellbeing_summary", path: "health-wellbeing-summary" };
    pub const health_wellbeing_analysis: StepDef = StepDef { code: "health_wellbeing_analysis", path: "health-wellbeing-analysis" };
}
