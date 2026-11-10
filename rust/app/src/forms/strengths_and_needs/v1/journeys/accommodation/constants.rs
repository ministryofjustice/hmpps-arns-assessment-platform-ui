//! The accommodation section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const short_term_accommodation_end_date: &str = "short_term_accommodation_end_date";
    pub const type_of_temporary_accommodation: &str = "type_of_temporary_accommodation";
    pub const approved_premises_end_date: &str = "approved_premises_end_date";
    pub const cas2_end_date: &str = "cas2_end_date";
    pub const cas3_end_date: &str = "cas3_end_date";
    pub const immigration_accommodation_end_date: &str = "immigration_accommodation_end_date";
    pub const type_of_settled_accommodation: &str = "type_of_settled_accommodation";
    pub const current_accommodation: &str = "current_accommodation";
    pub const type_of_no_accommodation: &str = "type_of_no_accommodation";
    pub const living_with_partner_details: &str = "living_with_partner_details";
    pub const living_with_other_details: &str = "living_with_other_details";
    pub const living_with: &str = "living_with";
    pub const suitable_housing_location_concerns_other_details: &str = "suitable_housing_location_concerns_other_details";
    pub const suitable_housing_location_concerns: &str = "suitable_housing_location_concerns";
    pub const suitable_housing_location: &str = "suitable_housing_location";
    pub const suitable_housing_concerns_other_details: &str = "suitable_housing_concerns_other_details";
    pub const suitable_housing_concerns: &str = "suitable_housing_concerns";
    pub const unsuitable_housing_concerns_other_details: &str = "unsuitable_housing_concerns_other_details";
    pub const unsuitable_housing_concerns: &str = "unsuitable_housing_concerns";
    pub const suitable_housing: &str = "suitable_housing";
    pub const accommodation_changes: &str = "accommodation_changes";
    pub const accommodation_changes_made_changes_details: &str = "accommodation_changes_made_changes_details";
    pub const accommodation_changes_making_changes_details: &str = "accommodation_changes_making_changes_details";
    pub const accommodation_changes_want_to_make_changes_details: &str = "accommodation_changes_want_to_make_changes_details";
    pub const accommodation_changes_needs_help_to_make_changes_details: &str = "accommodation_changes_needs_help_to_make_changes_details";
    pub const accommodation_changes_thinking_about_making_changes_details: &str = "accommodation_changes_thinking_about_making_changes_details";
    pub const accommodation_changes_does_not_want_to_make_changes_details: &str = "accommodation_changes_does_not_want_to_make_changes_details";
    pub const accommodation_changes_does_not_want_to_answer_details: &str = "accommodation_changes_does_not_want_to_answer_details";
    pub const future_accommodation_type_awaiting_assessment_details: &str = "future_accommodation_type_awaiting_assessment_details";
    pub const future_accommodation_type_awaiting_placement_details: &str = "future_accommodation_type_awaiting_placement_details";
    pub const future_accommodation_type_other_details: &str = "future_accommodation_type_other_details";
    pub const future_accommodation_type: &str = "future_accommodation_type";
    pub const suitable_housing_planned: &str = "suitable_housing_planned";
    pub const no_accommodation_reason_other_details: &str = "no_accommodation_reason_other_details";
    pub const no_accommodation_reason: &str = "no_accommodation_reason";
    pub const past_accommodation_details: &str = "past_accommodation_details";
    pub const accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "accommodation_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const accommodation_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "accommodation_practitioner_analysis_strengths_or_protective_factors_no_details";
    pub const accommodation_practitioner_analysis_strengths_or_protective_factors: &str = "accommodation_practitioner_analysis_strengths_or_protective_factors";
    pub const accommodation_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "accommodation_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const accommodation_practitioner_analysis_risk_of_serious_harm_no_details: &str = "accommodation_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const accommodation_practitioner_analysis_risk_of_serious_harm: &str = "accommodation_practitioner_analysis_risk_of_serious_harm";
    pub const accommodation_practitioner_analysis_risk_of_reoffending_yes_details: &str = "accommodation_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const accommodation_practitioner_analysis_risk_of_reoffending_no_details: &str = "accommodation_practitioner_analysis_risk_of_reoffending_no_details";
    pub const accommodation_practitioner_analysis_risk_of_reoffending: &str = "accommodation_practitioner_analysis_risk_of_reoffending";
}

pub mod option {
    pub const short_term: &str = "SHORT_TERM";
    pub const approved_premises: &str = "APPROVED_PREMISES";
    pub const cas2: &str = "CAS2";
    pub const cas3: &str = "CAS3";
    pub const immigration: &str = "IMMIGRATION";
    pub const settled: &str = "SETTLED";
    pub const homeowner: &str = "HOMEOWNER";
    pub const friends_or_family: &str = "FRIENDS_OR_FAMILY";
    pub const renting_privately: &str = "RENTING_PRIVATELY";
    pub const renting_other: &str = "RENTING_OTHER";
    pub const residential_healthcare: &str = "RESIDENTIAL_HEALTHCARE";
    pub const supported_accommodation: &str = "SUPPORTED_ACCOMMODATION";
    pub const temporary: &str = "TEMPORARY";
    pub const no_accommodation: &str = "NO_ACCOMMODATION";
    pub const campsite: &str = "CAMPSITE";
    pub const emergency_hostel: &str = "EMERGENCY_HOSTEL";
    pub const homeless: &str = "HOMELESS";
    pub const rough_sleeping: &str = "ROUGH_SLEEPING";
    pub const shelter: &str = "SHELTER";
    pub const family: &str = "FAMILY";
    pub const friends: &str = "FRIENDS";
    pub const partner: &str = "PARTNER";
    pub const person_under_18: &str = "PERSON_UNDER_18";
    pub const alone: &str = "ALONE";
    pub const criminal_associates: &str = "CRIMINAL_ASSOCIATES";
    pub const victimisation: &str = "VICTIMISATION";
    pub const victim_proximity: &str = "VICTIM_PROXIMITY";
    pub const neighbour_difficulty: &str = "NEIGHBOUR_DIFFICULTY";
    pub const area_safety: &str = "AREA_SAFETY";
    pub const facilities: &str = "FACILITIES";
    pub const overcrowding: &str = "OVERCROWDING";
    pub const exploitation: &str = "EXPLOITATION";
    pub const safety: &str = "SAFETY";
    pub const lives_with_victim: &str = "LIVES_WITH_VICTIM";
    pub const yes_with_concerns: &str = "YES_WITH_CONCERNS";
    pub const awaiting_assessment: &str = "AWAITING_ASSESSMENT";
    pub const awaiting_placement: &str = "AWAITING_PLACEMENT";
    pub const buying_house: &str = "BUYING_HOUSE";
    pub const living_with_friends_or_family: &str = "LIVING_WITH_FRIENDS_OR_FAMILY";
    pub const rent_privately: &str = "RENT_PRIVATELY";
    pub const rent_social: &str = "RENT_SOCIAL";
    pub const alcohol_problems: &str = "ALCOHOL_PROBLEMS";
    pub const drug_problems: &str = "DRUG_PROBLEMS";
    pub const financial_difficulties: &str = "FINANCIAL_DIFFICULTIES";
    pub const risk_to_others: &str = "RISK_TO_OTHERS";
    pub const prison_release: &str = "PRISON_RELEASE";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const accommodation_status: StepDef = StepDef { code: "accommodation_status", path: "accommodation-status" };
    pub const accommodation_details: StepDef = StepDef { code: "accommodation_details", path: "accommodation-details" };
    pub const accommodation_summary: StepDef = StepDef { code: "accommodation_summary", path: "accommodation-summary" };
    pub const accommodation_analysis: StepDef = StepDef { code: "accommodation_analysis", path: "accommodation-analysis" };
}
