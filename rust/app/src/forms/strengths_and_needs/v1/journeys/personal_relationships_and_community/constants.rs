//! The personal relationships and community section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const personal_relationships_community_children_details: &str = "personal_relationships_community_children_details";
    pub const personal_relationships_community_children_details_yes_children_living_with_pop_details: &str = "personal_relationships_community_children_details_yes_children_living_with_pop_details";
    pub const personal_relationships_community_children_details_yes_children_not_living_with_pop_details: &str = "personal_relationships_community_children_details_yes_children_not_living_with_pop_details";
    pub const personal_relationships_community_children_details_yes_children_visiting_details: &str = "personal_relationships_community_children_details_yes_children_visiting_details";
    pub const personal_relationships_community_important_people: &str = "personal_relationships_community_important_people";
    pub const personal_relationships_community_important_people_partner_intimate_relationship_details: &str = "personal_relationships_community_important_people_partner_intimate_relationship_details";
    pub const personal_relationships_community_important_people_child_parental_responsibilities_details: &str = "personal_relationships_community_important_people_child_parental_responsibilities_details";
    pub const personal_relationships_community_important_people_other_children_details: &str = "personal_relationships_community_important_people_other_children_details";
    pub const personal_relationships_community_important_people_family_details: &str = "personal_relationships_community_important_people_family_details";
    pub const personal_relationships_community_important_people_friends_details: &str = "personal_relationships_community_important_people_friends_details";
    pub const personal_relationships_community_important_people_other_details: &str = "personal_relationships_community_important_people_other_details";
    pub const personal_relationships_community_current_relationship: &str = "personal_relationships_community_current_relationship";
    pub const personal_relationships_community_current_relationship_happy_relationship_details: &str = "personal_relationships_community_current_relationship_happy_relationship_details";
    pub const personal_relationships_community_current_relationship_concerns_happy_relationship_details: &str = "personal_relationships_community_current_relationship_concerns_happy_relationship_details";
    pub const personal_relationships_community_current_relationship_unhappy_relationship_details: &str = "personal_relationships_community_current_relationship_unhappy_relationship_details";
    pub const personal_relationships_community_intimate_relationship: &str = "personal_relationships_community_intimate_relationship";
    pub const personal_relationships_community_intimate_relationship_stable_relationships_details: &str = "personal_relationships_community_intimate_relationship_stable_relationships_details";
    pub const personal_relationships_community_intimate_relationship_positive_and_negative_relationships_details: &str = "personal_relationships_community_intimate_relationship_positive_and_negative_relationships_details";
    pub const personal_relationships_community_intimate_relationship_unstable_relationships_details: &str = "personal_relationships_community_intimate_relationship_unstable_relationships_details";
    pub const personal_relationships_community_challenges_intimate_relationship: &str = "personal_relationships_community_challenges_intimate_relationship";
    pub const personal_relationships_community_parental_responsibilities: &str = "personal_relationships_community_parental_responsibilities";
    pub const personal_relationships_community_parental_responsibilities_yes_details: &str = "personal_relationships_community_parental_responsibilities_yes_details";
    pub const personal_relationships_community_parental_responsibilities_sometimes_details: &str = "personal_relationships_community_parental_responsibilities_sometimes_details";
    pub const personal_relationships_community_parental_responsibilities_no_details: &str = "personal_relationships_community_parental_responsibilities_no_details";
    pub const personal_relationships_community_family_relationship: &str = "personal_relationships_community_family_relationship";
    pub const personal_relationships_community_family_relationship_stable_relationship_details: &str = "personal_relationships_community_family_relationship_stable_relationship_details";
    pub const personal_relationships_community_family_relationship_mixed_relationship_details: &str = "personal_relationships_community_family_relationship_mixed_relationship_details";
    pub const personal_relationships_community_family_relationship_unstable_relationship_details: &str = "personal_relationships_community_family_relationship_unstable_relationship_details";
    pub const personal_relationships_community_childhood: &str = "personal_relationships_community_childhood";
    pub const personal_relationships_community_childhood_positive_childhood_details: &str = "personal_relationships_community_childhood_positive_childhood_details";
    pub const personal_relationships_community_childhood_mixed_childhood_details: &str = "personal_relationships_community_childhood_mixed_childhood_details";
    pub const personal_relationships_community_childhood_negative_childhood_details: &str = "personal_relationships_community_childhood_negative_childhood_details";
    pub const personal_relationships_community_childhood_behaviour: &str = "personal_relationships_community_childhood_behaviour";
    pub const personal_relationships_community_childhood_behaviour_yes_details: &str = "personal_relationships_community_childhood_behaviour_yes_details";
    pub const personal_relationships_community_childhood_behaviour_no_details: &str = "personal_relationships_community_childhood_behaviour_no_details";
    pub const personal_relationships_community_belonging: &str = "personal_relationships_community_belonging";
    pub const personal_relationships_community_changes: &str = "personal_relationships_community_changes";
    pub const personal_relationships_community_changes_made_changes_details: &str = "personal_relationships_community_changes_made_changes_details";
    pub const personal_relationships_community_changes_making_changes_details: &str = "personal_relationships_community_changes_making_changes_details";
    pub const personal_relationships_community_changes_want_to_make_changes_details: &str = "personal_relationships_community_changes_want_to_make_changes_details";
    pub const personal_relationships_community_changes_needs_help_to_make_changes_details: &str = "personal_relationships_community_changes_needs_help_to_make_changes_details";
    pub const personal_relationships_community_changes_thinking_about_making_changes_details: &str = "personal_relationships_community_changes_thinking_about_making_changes_details";
    pub const personal_relationships_community_changes_does_not_want_to_make_changes_details: &str = "personal_relationships_community_changes_does_not_want_to_make_changes_details";
    pub const personal_relationships_community_changes_does_not_want_to_answer_details: &str = "personal_relationships_community_changes_does_not_want_to_answer_details";
    pub const personal_relationships_community_practitioner_analysis_strengths_or_protective_factors: &str = "personal_relationships_community_practitioner_analysis_strengths_or_protective_factors";
    pub const personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "personal_relationships_community_practitioner_analysis_strengths_or_protective_factors_no_details";
    pub const personal_relationships_community_practitioner_analysis_risk_of_serious_harm: &str = "personal_relationships_community_practitioner_analysis_risk_of_serious_harm";
    pub const personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "personal_relationships_community_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details: &str = "personal_relationships_community_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const personal_relationships_community_practitioner_analysis_risk_of_reoffending: &str = "personal_relationships_community_practitioner_analysis_risk_of_reoffending";
    pub const personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details: &str = "personal_relationships_community_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details: &str = "personal_relationships_community_practitioner_analysis_risk_of_reoffending_no_details";
}

pub mod option {
    pub const yes_children_living_with_pop: &str = "YES_CHILDREN_LIVING_WITH_POP";
    pub const yes_children_not_living_with_pop: &str = "YES_CHILDREN_NOT_LIVING_WITH_POP";
    pub const yes_children_visiting: &str = "YES_CHILDREN_VISITING";
    pub const no_children: &str = "NO_CHILDREN";
    pub const partner_intimate_relationship: &str = "PARTNER_INTIMATE_RELATIONSHIP";
    pub const child_parental_responsibilities: &str = "CHILD_PARENTAL_RESPONSIBILITIES";
    pub const other_children: &str = "OTHER_CHILDREN";
    pub const family: &str = "FAMILY";
    pub const friends: &str = "FRIENDS";
    pub const happy_relationship: &str = "HAPPY_RELATIONSHIP";
    pub const concerns_happy_relationship: &str = "CONCERNS_HAPPY_RELATIONSHIP";
    pub const unhappy_relationship: &str = "UNHAPPY_RELATIONSHIP";
    pub const stable_relationships: &str = "STABLE_RELATIONSHIPS";
    pub const positive_and_negative_relationships: &str = "POSITIVE_AND_NEGATIVE_RELATIONSHIPS";
    pub const unstable_relationships: &str = "UNSTABLE_RELATIONSHIPS";
    pub const sometimes: &str = "SOMETIMES";
    pub const stable_relationship: &str = "STABLE_RELATIONSHIP";
    pub const mixed_relationship: &str = "MIXED_RELATIONSHIP";
    pub const unstable_relationship: &str = "UNSTABLE_RELATIONSHIP";
    pub const positive_childhood: &str = "POSITIVE_CHILDHOOD";
    pub const mixed_childhood: &str = "MIXED_CHILDHOOD";
    pub const negative_childhood: &str = "NEGATIVE_CHILDHOOD";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const personal_relationships_children_information: StepDef = StepDef { code: "personal_relationships_children_information", path: "personal-relationships-children-information" };
    pub const personal_relationships: StepDef = StepDef { code: "personal_relationships", path: "personal-relationships" };
    pub const personal_relationships_community: StepDef = StepDef { code: "personal_relationships_community", path: "personal-relationships-community" };
    pub const personal_relationships_community_summary: StepDef = StepDef { code: "personal_relationships_community_summary", path: "personal-relationships-community-summary" };
    pub const personal_relationships_community_analysis: StepDef = StepDef { code: "personal_relationships_community_analysis", path: "personal-relationships-community-analysis" };
}
