//! The employment and education section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const employment_status: &str = "employment_status";
    pub const employment_type: &str = "employment_type";
    pub const employment_other_responsibilities: &str = "employment_other_responsibilities";
    pub const has_been_employed: &str = "has_been_employed";
    pub const employment_history: &str = "employment_history";
    pub const employment_area: &str = "employment_area";
    pub const employment_history_stable_details: &str = "employment_history_stable_details";
    pub const employment_history_periods_of_instability_details: &str = "employment_history_periods_of_instability_details";
    pub const employment_history_unstable_details: &str = "employment_history_unstable_details";
    pub const employment_history_unknown_details: &str = "employment_history_unknown_details";
    pub const employment_other_responsibilities_carer_details: &str = "employment_other_responsibilities_carer_details";
    pub const employment_other_responsibilities_volunteer_details: &str = "employment_other_responsibilities_volunteer_details";
    pub const employment_education_changes: &str = "employment_education_changes";
    pub const employment_education_changes_does_not_want_to_answer_details: &str = "employment_education_changes_does_not_want_to_answer_details";
    pub const employment_education_changes_does_not_want_to_make_changes_details: &str = "employment_education_changes_does_not_want_to_make_changes_details";
    pub const employment_education_changes_thinking_about_making_changes_details: &str = "employment_education_changes_thinking_about_making_changes_details";
    pub const employment_education_changes_needs_help_to_make_changes_details: &str = "employment_education_changes_needs_help_to_make_changes_details";
    pub const employment_education_changes_want_to_make_changes_details: &str = "employment_education_changes_want_to_make_changes_details";
    pub const employment_education_changes_making_changes_details: &str = "employment_education_changes_making_changes_details";
    pub const employment_education_changes_made_changes_details: &str = "employment_education_changes_made_changes_details";
    pub const education_experience: &str = "education_experience";
    pub const education_experience_negative_details: &str = "education_experience_negative_details";
    pub const education_experience_mostly_negative_details: &str = "education_experience_mostly_negative_details";
    pub const education_experience_positive_and_negative_details: &str = "education_experience_positive_and_negative_details";
    pub const education_experience_mostly_positive_details: &str = "education_experience_mostly_positive_details";
    pub const education_experience_positive_details: &str = "education_experience_positive_details";
    pub const employment_experience: &str = "employment_experience";
    pub const employment_experience_negative_details: &str = "employment_experience_negative_details";
    pub const employment_experience_mostly_negative_details: &str = "employment_experience_mostly_negative_details";
    pub const employment_experience_positive_and_negative_details: &str = "employment_experience_positive_and_negative_details";
    pub const employment_experience_mostly_positive_details: &str = "employment_experience_mostly_positive_details";
    pub const employment_experience_positive_details: &str = "employment_experience_positive_details";
    pub const education_difficulties: &str = "education_difficulties";
    pub const education_difficulties_numeracy_severity: &str = "education_difficulties_numeracy_severity";
    pub const education_difficulties_writing_severity: &str = "education_difficulties_writing_severity";
    pub const education_difficulties_reading_severity: &str = "education_difficulties_reading_severity";
    pub const education_transferable_skills: &str = "education_transferable_skills";
    pub const education_transferable_skills_yes_some_skills_details: &str = "education_transferable_skills_yes_some_skills_details";
    pub const education_transferable_skills_yes_details: &str = "education_transferable_skills_yes_details";
    pub const education_professional_or_vocational_qualifications: &str = "education_professional_or_vocational_qualifications";
    pub const education_professional_or_vocational_qualifications_yes_details: &str = "education_professional_or_vocational_qualifications_yes_details";
    pub const education_highest_level_completed: &str = "education_highest_level_completed";
    pub const employment_other_responsibilities_other_details: &str = "employment_other_responsibilities_other_details";
    pub const employment_other_responsibilities_child_details: &str = "employment_other_responsibilities_child_details";
    pub const employment_education_practitioner_analysis_strengths_or_protective_factors: &str = "employment_education_practitioner_analysis_strengths_or_protective_factors";
    pub const employment_education_practitioner_analysis_risk_of_serious_harm: &str = "employment_education_practitioner_analysis_risk_of_serious_harm";
    pub const employment_education_practitioner_analysis_risk_of_reoffending: &str = "employment_education_practitioner_analysis_risk_of_reoffending";
    pub const employment_education_practitioner_analysis_risk_of_reoffending_yes_details: &str = "employment_education_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const employment_education_practitioner_analysis_risk_of_reoffending_no_details: &str = "employment_education_practitioner_analysis_risk_of_reoffending_no_details";
    pub const employment_education_practitioner_analysis_risk_of_serious_harm_no_details: &str = "employment_education_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const employment_education_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "employment_education_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "employment_education_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const employment_education_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "employment_education_practitioner_analysis_strengths_or_protective_factors_no_details";
}

pub mod option {
    pub const employed: &str = "EMPLOYED";
    pub const self_employed: &str = "SELF_EMPLOYED";
    pub const retired: &str = "RETIRED";
    pub const unemployed_looking_for_work: &str = "UNEMPLOYED_LOOKING_FOR_WORK";
    pub const unemployed_not_looking_for_work: &str = "UNEMPLOYED_NOT_LOOKING_FOR_WORK";
    pub const currently_unavailable_for_work: &str = "CURRENTLY_UNAVAILABLE_FOR_WORK";
    pub const carer: &str = "CARER";
    pub const full_time: &str = "FULL_TIME";
    pub const part_time: &str = "PART_TIME";
    pub const temporary_or_casual: &str = "TEMPORARY_OR_CASUAL";
    pub const apprenticeship: &str = "APPRENTICESHIP";
    pub const stable: &str = "STABLE";
    pub const periods_of_instability: &str = "PERIODS_OF_INSTABILITY";
    pub const unstable: &str = "UNSTABLE";
    pub const entry_level: &str = "ENTRY_LEVEL";
    pub const child: &str = "CHILD";
    pub const studying: &str = "STUDYING";
    pub const volunteer: &str = "VOLUNTEER";
    pub const level_1: &str = "LEVEL_1";
    pub const level_2: &str = "LEVEL_2";
    pub const level_3: &str = "LEVEL_3";
    pub const level_4: &str = "LEVEL_4";
    pub const level_5: &str = "LEVEL_5";
    pub const level_6: &str = "LEVEL_6";
    pub const level_7: &str = "LEVEL_7";
    pub const level_8: &str = "LEVEL_8";
    pub const not_sure: &str = "NOT_SURE";
    pub const significant_difficulties: &str = "SIGNIFICANT_DIFFICULTIES";
    pub const some_difficulties: &str = "SOME_DIFFICULTIES";
    pub const positive: &str = "POSITIVE";
    pub const mostly_positive: &str = "MOSTLY_POSITIVE";
    pub const positive_and_negative: &str = "POSITIVE_AND_NEGATIVE";
    pub const mostly_negative: &str = "MOSTLY_NEGATIVE";
    pub const negative: &str = "NEGATIVE";
    pub const some: &str = "SOME";
    pub const yes_some_skills: &str = "YES_SOME_SKILLS";
    pub const reading: &str = "READING";
    pub const writing: &str = "WRITING";
    pub const numeracy: &str = "NUMERACY";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const employment_status: StepDef = StepDef { code: "employment_status", path: "employment-status" };
    pub const employment_education_details: StepDef = StepDef { code: "employment_education_details", path: "employment-education-details" };
    pub const employment_education_summary: StepDef = StepDef { code: "employment_education_summary", path: "employment-education-summary" };
    pub const employment_education_analysis: StepDef = StepDef { code: "employment_education_analysis", path: "employment-education-analysis" };
}
