//! The thinking behaviours and attitudes section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const thinking_behaviours_attitudes_consequences: &str = "thinking_behaviours_attitudes_consequences";
    pub const thinking_behaviours_attitudes_stable_behaviour: &str = "thinking_behaviours_attitudes_stable_behaviour";
    pub const thinking_behaviours_attitudes_offending_activities: &str = "thinking_behaviours_attitudes_offending_activities";
    pub const thinking_behaviours_attitudes_peer_pressure: &str = "thinking_behaviours_attitudes_peer_pressure";
    pub const thinking_behaviours_attitudes_peer_pressure_yes_details: &str = "thinking_behaviours_attitudes_peer_pressure_yes_details";
    pub const thinking_behaviours_attitudes_peer_pressure_some_details: &str = "thinking_behaviours_attitudes_peer_pressure_some_details";
    pub const thinking_behaviours_attitudes_peer_pressure_no_details: &str = "thinking_behaviours_attitudes_peer_pressure_no_details";
    pub const thinking_behaviours_attitudes_problem_solving: &str = "thinking_behaviours_attitudes_problem_solving";
    pub const thinking_behaviours_attitudes_peoples_views: &str = "thinking_behaviours_attitudes_peoples_views";
    pub const thinking_behaviours_attitudes_manipulative_predatory_behaviour: &str = "thinking_behaviours_attitudes_manipulative_predatory_behaviour";
    pub const thinking_behaviours_attitudes_temper_management: &str = "thinking_behaviours_attitudes_temper_management";
    pub const thinking_behaviours_attitudes_violence_controlling_behaviour: &str = "thinking_behaviours_attitudes_violence_controlling_behaviour";
    pub const thinking_behaviours_attitudes_impulsive_behaviour: &str = "thinking_behaviours_attitudes_impulsive_behaviour";
    pub const thinking_behaviours_attitudes_positive_attitude: &str = "thinking_behaviours_attitudes_positive_attitude";
    pub const thinking_behaviours_attitudes_hostile_orientation: &str = "thinking_behaviours_attitudes_hostile_orientation";
    pub const thinking_behaviours_attitudes_supervision: &str = "thinking_behaviours_attitudes_supervision";
    pub const thinking_behaviours_attitudes_criminal_behaviour: &str = "thinking_behaviours_attitudes_criminal_behaviour";
    pub const thinking_behaviours_attitudes_risk_sexual_harm: &str = "thinking_behaviours_attitudes_risk_sexual_harm";
    pub const thinking_behaviours_attitudes_sexual_preoccupation: &str = "thinking_behaviours_attitudes_sexual_preoccupation";
    pub const thinking_behaviours_attitudes_offence_related_sexual_interest: &str = "thinking_behaviours_attitudes_offence_related_sexual_interest";
    pub const thinking_behaviours_attitudes_emotional_intimacy: &str = "thinking_behaviours_attitudes_emotional_intimacy";
    pub const thinking_behaviours_attitudes_changes: &str = "thinking_behaviours_attitudes_changes";
    pub const thinking_behaviours_attitudes_changes_made_changes_details: &str = "thinking_behaviours_attitudes_changes_made_changes_details";
    pub const thinking_behaviours_attitudes_changes_making_changes_details: &str = "thinking_behaviours_attitudes_changes_making_changes_details";
    pub const thinking_behaviours_attitudes_changes_want_to_make_changes_details: &str = "thinking_behaviours_attitudes_changes_want_to_make_changes_details";
    pub const thinking_behaviours_attitudes_changes_needs_help_to_make_changes_details: &str = "thinking_behaviours_attitudes_changes_needs_help_to_make_changes_details";
    pub const thinking_behaviours_attitudes_changes_thinking_about_making_changes_details: &str = "thinking_behaviours_attitudes_changes_thinking_about_making_changes_details";
    pub const thinking_behaviours_attitudes_changes_does_not_want_to_make_changes_details: &str = "thinking_behaviours_attitudes_changes_does_not_want_to_make_changes_details";
    pub const thinking_behaviours_attitudes_changes_does_not_want_to_answer_details: &str = "thinking_behaviours_attitudes_changes_does_not_want_to_answer_details";
    pub const thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors: &str = "thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors";
    pub const thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors_no_details";
    pub const thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm: &str = "thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm";
    pub const thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_no_details: &str = "thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending: &str = "thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending";
    pub const thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details: &str = "thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_no_details: &str = "thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending_no_details";
}

pub mod option {
    pub const sometimes: &str = "SOMETIMES";
    pub const no_offending_activities: &str = "NO_OFFENDING_ACTIVITIES";
    pub const sometimes_offending_activities: &str = "SOMETIMES_OFFENDING_ACTIVITIES";
    pub const yes_offending_activities: &str = "YES_OFFENDING_ACTIVITIES";
    pub const some: &str = "SOME";
    pub const limited_problem_solving: &str = "LIMITED_PROBLEM_SOLVING";
    pub const yes_offence_related_sexual_interest: &str = "YES_OFFENCE_RELATED_SEXUAL_INTEREST";
    pub const some_offence_related_sexual_interest: &str = "SOME_OFFENCE_RELATED_SEXUAL_INTEREST";
    pub const no_offence_related_sexual_interest: &str = "NO_OFFENCE_RELATED_SEXUAL_INTEREST";
    pub const no_violence: &str = "NO_VIOLENCE";
    pub const yes_violence: &str = "YES_VIOLENCE";
    pub const yes_positive: &str = "YES_POSITIVE";
    pub const negative_attitude_no_concerns: &str = "NEGATIVE_ATTITUDE_NO_CONCERNS";
    pub const negative_attitude_and_concerns: &str = "NEGATIVE_ATTITUDE_AND_CONCERNS";
    pub const yes_supervision: &str = "YES_SUPERVISION";
    pub const unsure_supervision: &str = "UNSURE_SUPERVISION";
    pub const no_supervision: &str = "NO_SUPERVISION";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const thinking_behaviours_attitudes: StepDef = StepDef { code: "thinking_behaviours_attitudes", path: "thinking-behaviours-attitudes" };
    pub const thinking_behaviours_attitudes_risk_of_sexual_harm: StepDef = StepDef { code: "thinking_behaviours_attitudes_risk_of_sexual_harm", path: "thinking-behaviours-attitudes-risk-of-sexual-harm" };
    pub const thinking_behaviours_attitudes_risk_of_sexual_harm_details: StepDef = StepDef { code: "thinking_behaviours_attitudes_risk_of_sexual_harm_details", path: "thinking-behaviours-attitudes-risk-of-sexual-harm-details" };
    pub const thinking_behaviours_attitudes_summary: StepDef = StepDef { code: "thinking_behaviours_attitudes_summary", path: "thinking-behaviours-attitudes-summary" };
    pub const thinking_behaviours_attitudes_analysis: StepDef = StepDef { code: "thinking_behaviours_attitudes_analysis", path: "thinking-behaviours-attitudes-analysis" };
}
