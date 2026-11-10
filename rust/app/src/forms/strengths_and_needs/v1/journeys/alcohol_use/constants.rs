//! The alcohol use section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const alcohol_use: &str = "alcohol_use";
    pub const alcohol_frequency: &str = "alcohol_frequency";
    pub const alcohol_units: &str = "alcohol_units";
    pub const alcohol_binge_drinking: &str = "alcohol_binge_drinking";
    pub const alcohol_binge_drinking_frequency: &str = "alcohol_binge_drinking_frequency";
    pub const alcohol_evidence_of_excess_drinking: &str = "alcohol_evidence_of_excess_drinking";
    pub const alcohol_past_issues: &str = "alcohol_past_issues";
    pub const alcohol_past_issues_yes_details: &str = "alcohol_past_issues_yes_details";
    pub const alcohol_reasons_for_use: &str = "alcohol_reasons_for_use";
    pub const alcohol_reasons_for_use_other_details: &str = "alcohol_reasons_for_use_other_details";
    pub const alcohol_impact_of_use: &str = "alcohol_impact_of_use";
    pub const alcohol_impact_of_use_other_details: &str = "alcohol_impact_of_use_other_details";
    pub const alcohol_stopped_or_reduced: &str = "alcohol_stopped_or_reduced";
    pub const alcohol_stopped_or_reduced_yes_details: &str = "alcohol_stopped_or_reduced_yes_details";
    pub const alcohol_use_changes: &str = "alcohol_use_changes";
    pub const alcohol_use_changes_made_changes_details: &str = "alcohol_use_changes_made_changes_details";
    pub const alcohol_use_changes_making_changes_details: &str = "alcohol_use_changes_making_changes_details";
    pub const alcohol_use_changes_want_to_make_changes_details: &str = "alcohol_use_changes_want_to_make_changes_details";
    pub const alcohol_use_changes_needs_help_to_make_changes_details: &str = "alcohol_use_changes_needs_help_to_make_changes_details";
    pub const alcohol_use_changes_thinking_about_making_changes_details: &str = "alcohol_use_changes_thinking_about_making_changes_details";
    pub const alcohol_use_changes_does_not_want_to_make_changes_details: &str = "alcohol_use_changes_does_not_want_to_make_changes_details";
    pub const alcohol_use_changes_does_not_want_to_answer_details: &str = "alcohol_use_changes_does_not_want_to_answer_details";
    pub const alcohol_use_practitioner_analysis_strengths_or_protective_factors: &str = "alcohol_use_practitioner_analysis_strengths_or_protective_factors";
    pub const alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "alcohol_use_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "alcohol_use_practitioner_analysis_strengths_or_protective_factors_no_details";
    pub const alcohol_use_practitioner_analysis_risk_of_serious_harm: &str = "alcohol_use_practitioner_analysis_risk_of_serious_harm";
    pub const alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "alcohol_use_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details: &str = "alcohol_use_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const alcohol_use_practitioner_analysis_risk_of_reoffending: &str = "alcohol_use_practitioner_analysis_risk_of_reoffending";
    pub const alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details: &str = "alcohol_use_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const alcohol_use_practitioner_analysis_risk_of_reoffending_no_details: &str = "alcohol_use_practitioner_analysis_risk_of_reoffending_no_details";
}

pub mod option {
    pub const yes_within_last_three_months: &str = "YES_WITHIN_LAST_THREE_MONTHS";
    pub const yes_not_in_last_three_months: &str = "YES_NOT_IN_LAST_THREE_MONTHS";
    pub const once_a_month_or_less: &str = "ONCE_A_MONTH_OR_LESS";
    pub const multiple_times_a_month: &str = "MULTIPLE_TIMES_A_MONTH";
    pub const less_than_4_times_a_week: &str = "LESS_THAN_4_TIMES_A_WEEK";
    pub const more_than_4_times_a_week: &str = "MORE_THAN_4_TIMES_A_WEEK";
    pub const units_1_to_2: &str = "UNITS_1_TO_2";
    pub const units_3_to_4: &str = "UNITS_3_TO_4";
    pub const units_5_to_6: &str = "UNITS_5_TO_6";
    pub const units_7_to_9: &str = "UNITS_7_TO_9";
    pub const units_10_or_more: &str = "UNITS_10_OR_MORE";
    pub const less_than_a_month: &str = "LESS_THAN_A_MONTH";
    pub const monthly: &str = "MONTHLY";
    pub const weekly: &str = "WEEKLY";
    pub const daily: &str = "DAILY";
    pub const no_evidence: &str = "NO_EVIDENCE";
    pub const yes_with_some_evidence: &str = "YES_WITH_SOME_EVIDENCE";
    pub const yes_with_evidence: &str = "YES_WITH_EVIDENCE";
    pub const cultural_or_religious: &str = "CULTURAL_OR_RELIGIOUS";
    pub const curiosity_or_experimentation: &str = "CURIOSITY_OR_EXPERIMENTATION";
    pub const enjoyment: &str = "ENJOYMENT";
    pub const managing_emotional_issues: &str = "MANAGING_EMOTIONAL_ISSUES";
    pub const special_occasions: &str = "SPECIAL_OCCASIONS";
    pub const peer_pressure: &str = "PEER_PRESSURE";
    pub const self_medication: &str = "SELF_MEDICATION";
    pub const social: &str = "SOCIAL";
    pub const behavioural: &str = "BEHAVIOURAL";
    pub const community: &str = "COMMUNITY";
    pub const finances: &str = "FINANCES";
    pub const links_to_reoffending: &str = "LINKS_TO_REOFFENDING";
    pub const physical_or_mental_health: &str = "PHYSICAL_OR_MENTAL_HEALTH";
    pub const relationships: &str = "RELATIONSHIPS";
    pub const no_negative_impact: &str = "NO_NEGATIVE_IMPACT";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const alcohol_use_status: StepDef = StepDef { code: "alcohol_use_status", path: "alcohol-use-status" };
    pub const alcohol_use_details: StepDef = StepDef { code: "alcohol_use_details", path: "alcohol-use-details" };
    pub const alcohol_use_summary: StepDef = StepDef { code: "alcohol_use_summary", path: "alcohol-use-summary" };
    pub const alcohol_use_analysis: StepDef = StepDef { code: "alcohol_use_analysis", path: "alcohol-use-analysis" };
}
