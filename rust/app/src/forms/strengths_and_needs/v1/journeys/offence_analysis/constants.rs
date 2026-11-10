//! The offence analysis section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const offence_analysis_description_of_offence: &str = "offence_analysis_description_of_offence";
    pub const offence_analysis_elements: &str = "offence_analysis_elements";
    pub const offence_analysis_elements_victim_targeted_details: &str = "offence_analysis_elements_victim_targeted_details";
    pub const offence_weapon_details: &str = "offence_weapon_details";
    pub const offence_analysis_reason: &str = "offence_analysis_reason";
    pub const offence_analysis_motivations: &str = "offence_analysis_motivations";
    pub const offence_analysis_motivations_other_details: &str = "offence_analysis_motivations_other_details";
    pub const offence_analysis_victim_relationship: &str = "offence_analysis_victim_relationship";
    pub const offence_analysis_victim_relationship_other_details: &str = "offence_analysis_victim_relationship_other_details";
    pub const offence_analysis_victim_age: &str = "offence_analysis_victim_age";
    pub const offence_analysis_victim_sex: &str = "offence_analysis_victim_sex";
    pub const offence_analysis_victim_race: &str = "offence_analysis_victim_race";
    pub const offence_analysis_who_was_the_victim: &str = "offence_analysis_who_was_the_victim";
    pub const offence_analysis_who_was_the_victim_other_details: &str = "offence_analysis_who_was_the_victim_other_details";
    pub const offence_analysis_how_many_involved: &str = "offence_analysis_how_many_involved";
    pub const offence_analysis_leader: &str = "offence_analysis_leader";
    pub const offence_analysis_leader_yes_details: &str = "offence_analysis_leader_yes_details";
    pub const offence_analysis_leader_no_details: &str = "offence_analysis_leader_no_details";
    pub const offence_analysis_impact_on_victims: &str = "offence_analysis_impact_on_victims";
    pub const offence_analysis_impact_on_victims_yes_details: &str = "offence_analysis_impact_on_victims_yes_details";
    pub const offence_analysis_impact_on_victims_no_details: &str = "offence_analysis_impact_on_victims_no_details";
    pub const offence_analysis_accept_responsibility: &str = "offence_analysis_accept_responsibility";
    pub const offence_analysis_accept_responsibility_yes_details: &str = "offence_analysis_accept_responsibility_yes_details";
    pub const offence_analysis_accept_responsibility_no_details: &str = "offence_analysis_accept_responsibility_no_details";
    pub const offence_analysis_escalation: &str = "offence_analysis_escalation";
    pub const offence_analysis_escalation_yes_details: &str = "offence_analysis_escalation_yes_details";
    pub const offence_analysis_escalation_no_details: &str = "offence_analysis_escalation_no_details";
    pub const offence_analysis_perpetrator_of_domestic_abuse: &str = "offence_analysis_perpetrator_of_domestic_abuse";
    pub const offence_analysis_perpetrator_of_domestic_abuse_type: &str = "offence_analysis_perpetrator_of_domestic_abuse_type";
    pub const offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details: &str = "offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details";
    pub const offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details: &str = "offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details";
    pub const offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_intimate_partner_details: &str = "offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_intimate_partner_details";
    pub const offence_analysis_victim_of_domestic_abuse: &str = "offence_analysis_victim_of_domestic_abuse";
    pub const offence_analysis_victim_of_domestic_abuse_type: &str = "offence_analysis_victim_of_domestic_abuse_type";
    pub const offence_analysis_victim_of_domestic_abuse_type_family_member_details: &str = "offence_analysis_victim_of_domestic_abuse_type_family_member_details";
    pub const offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details: &str = "offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details";
    pub const offence_analysis_victim_of_domestic_abuse_type_family_member_and_intimate_partner_details: &str = "offence_analysis_victim_of_domestic_abuse_type_family_member_and_intimate_partner_details";
    pub const offence_analysis_patterns_of_offending: &str = "offence_analysis_patterns_of_offending";
    pub const offence_analysis_risk: &str = "offence_analysis_risk";
    pub const offence_analysis_risk_yes_details: &str = "offence_analysis_risk_yes_details";
    pub const offence_analysis_risk_no_details: &str = "offence_analysis_risk_no_details";
}

pub mod option {
    pub const arson: &str = "ARSON";
    pub const domestic_abuse: &str = "DOMESTIC_ABUSE";
    pub const excessive_or_sadistic_violence: &str = "EXCESSIVE_OR_SADISTIC_VIOLENCE";
    pub const hatred_of_identifiable_groups: &str = "HATRED_OF_IDENTIFIABLE_GROUPS";
    pub const physical_damage_to_property: &str = "PHYSICAL_DAMAGE_TO_PROPERTY";
    pub const sexual_element: &str = "SEXUAL_ELEMENT";
    pub const victim_targeted: &str = "VICTIM_TARGETED";
    pub const violence_or_coercion: &str = "VIOLENCE_OR_COERCION";
    pub const weapon: &str = "WEAPON";
    pub const addictions_or_perceived_needs: &str = "ADDICTIONS_OR_PERCEIVED_NEEDS";
    pub const pressurised_by_others: &str = "PRESSURISED_BY_OTHERS";
    pub const emotional_state: &str = "EMOTIONAL_STATE";
    pub const financial_motivation: &str = "FINANCIAL_MOTIVATION";
    pub const seeking_or_exerting_power: &str = "SEEKING_OR_EXERTING_POWER";
    pub const sexual_motivation: &str = "SEXUAL_MOTIVATION";
    pub const thrill_seeking: &str = "THRILL_SEEKING";
    pub const one_or_more_person: &str = "ONE_OR_MORE_PERSON";
    pub const stranger: &str = "STRANGER";
    pub const criminal_justice_staff: &str = "CRIMINAL_JUSTICE_STAFF";
    pub const pop_parent_or_step_parent: &str = "POP_PARENT_OR_STEP_PARENT";
    pub const pop_partner: &str = "POP_PARTNER";
    pub const pop_ex_partner: &str = "POP_EX_PARTNER";
    pub const pop_child_or_step_child: &str = "POP_CHILD_OR_STEP_CHILD";
    pub const other_family_member: &str = "OTHER_FAMILY_MEMBER";
    pub const age_0_to_4_years: &str = "AGE_0_TO_4_YEARS";
    pub const age_5_to_11_years: &str = "AGE_5_TO_11_YEARS";
    pub const age_12_to_15_years: &str = "AGE_12_TO_15_YEARS";
    pub const age_16_to_17_years: &str = "AGE_16_TO_17_YEARS";
    pub const age_18_to_20_years: &str = "AGE_18_TO_20_YEARS";
    pub const age_21_to_25_years: &str = "AGE_21_TO_25_YEARS";
    pub const age_26_to_49_years: &str = "AGE_26_TO_49_YEARS";
    pub const age_50_to_64_years: &str = "AGE_50_TO_64_YEARS";
    pub const age_65_and_over: &str = "AGE_65_AND_OVER";
    pub const male: &str = "MALE";
    pub const female: &str = "FEMALE";
    pub const intersex: &str = "INTERSEX";
    pub const white_irish: &str = "WHITE_IRISH";
    pub const white_english_welsh_scottish_northern_irish_or_british: &str = "WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH";
    pub const white_gypsy_or_irish_traveller: &str = "WHITE_GYPSY_OR_IRISH_TRAVELLER";
    pub const white_roma: &str = "WHITE_ROMA";
    pub const white_any_other_white_background: &str = "WHITE_ANY_OTHER_WHITE_BACKGROUND";
    pub const mixed_any_other_mixed_or_multiple_ethnic_background_background: &str = "MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND_BACKGROUND";
    pub const mixed_white_and_black_caribbean: &str = "MIXED_WHITE_AND_BLACK_CARIBBEAN";
    pub const mixed_white_and_black_african: &str = "MIXED_WHITE_AND_BLACK_AFRICAN";
    pub const mixed_white_and_asian: &str = "MIXED_WHITE_AND_ASIAN";
    pub const mixed_any_other_mixed_or_multiple_ethnic_background: &str = "MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND";
    pub const asian_or_asian_british_indian: &str = "ASIAN_OR_ASIAN_BRITISH_INDIAN";
    pub const asian_or_asian_british_pakistani: &str = "ASIAN_OR_ASIAN_BRITISH_PAKISTANI";
    pub const asian_or_asian_british_bangladeshi: &str = "ASIAN_OR_ASIAN_BRITISH_BANGLADESHI";
    pub const asian_or_asian_british_chinese: &str = "ASIAN_OR_ASIAN_BRITISH_CHINESE";
    pub const asian_or_asian_british_any_other_asian_background: &str = "ASIAN_OR_ASIAN_BRITISH_ANY_OTHER_ASIAN_BACKGROUND";
    pub const black_or_black_british_caribbean: &str = "BLACK_OR_BLACK_BRITISH_CARIBBEAN";
    pub const black_or_black_british_african: &str = "BLACK_OR_BLACK_BRITISH_AFRICAN";
    pub const black_or_black_british_any_other_black_background: &str = "BLACK_OR_BLACK_BRITISH_ANY_OTHER_BLACK_BACKGROUND";
    pub const arab: &str = "ARAB";
    pub const any_other_ethnic_group: &str = "ANY_OTHER_ETHNIC_GROUP";
    pub const one: &str = "ONE";
    pub const two: &str = "TWO";
    pub const three: &str = "THREE";
    pub const four: &str = "FOUR";
    pub const five: &str = "FIVE";
    pub const six_to_ten: &str = "SIX_TO_10";
    pub const eleven_to_fifteen: &str = "ELEVEN_TO_15";
    pub const more_than_fifteen: &str = "MORE_THAN_15";
    pub const family_member: &str = "FAMILY_MEMBER";
    pub const intimate_partner: &str = "INTIMATE_PARTNER";
    pub const family_member_and_intimate_partner: &str = "FAMILY_MEMBER_AND_INTIMATE_PARTNER";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const offence_analysis: StepDef = StepDef { code: "offence_analysis", path: "offence-analysis" };
    pub const offence_analysis_involved_parties: StepDef = StepDef { code: "offence_analysis_involved_parties", path: "offence-analysis-involved-parties" };
    pub const offence_analysis_impact: StepDef = StepDef { code: "offence_analysis_impact", path: "offence-analysis-impact" };
    pub const offence_analysis_summary: StepDef = StepDef { code: "offence_analysis_summary", path: "offence-analysis-summary" };
    pub const offence_analysis_victim: StepDef = StepDef { code: "offence_analysis_victim", path: "offence-analysis-victim/create" };
    pub const offence_analysis_victim_edit: StepDef = StepDef { code: "offence_analysis_victim_edit", path: "offence-analysis-victim/edit/%1" };
    pub const offence_analysis_victim_delete: StepDef = StepDef { code: "offence-analysis-victim_delete", path: "offence-analysis-victim/delete/%1" };
    pub const offence_analysis_victim_summary: StepDef = StepDef { code: "offence_analysis_victim_summary", path: "offence-analysis-victim-summary" };
}
