//! The finance section's questions, options and steps.
#![allow(non_upper_case_globals, dead_code)]

pub mod question {
    pub const finance_income: &str = "finance_income";
    pub const finance_income_no_money_details: &str = "finance_income_no_money_details";
    pub const finance_income_other_details: &str = "finance_income_other_details";
    pub const family_or_friends_details: &str = "family_or_friends_details";
    pub const finance_bank_account: &str = "finance_bank_account";
    pub const finance_money_management: &str = "finance_money_management";
    pub const finance_money_management_good_details: &str = "finance_money_management_good_details";
    pub const finance_money_management_fairly_good_details: &str = "finance_money_management_fairly_good_details";
    pub const finance_money_management_fairly_bad_details: &str = "finance_money_management_fairly_bad_details";
    pub const finance_money_management_bad_details: &str = "finance_money_management_bad_details";
    pub const finance_gambling: &str = "finance_gambling";
    pub const finance_gambling_yes_their_gambling_details: &str = "finance_gambling_yes_their_gambling_details";
    pub const finance_gambling_yes_someone_elses_gambling_details: &str = "finance_gambling_yes_someone_elses_gambling_details";
    pub const finance_gambling_unknown_details: &str = "finance_gambling_unknown_details";
    pub const finance_debt: &str = "finance_debt";
    pub const yes_type_of_debt: &str = "yes_type_of_debt";
    pub const yes_someone_elses_type_of_debt: &str = "yes_someone_elses_type_of_debt";
    pub const finance_debt_unknown_details: &str = "finance_debt_unknown_details";
    pub const yes_type_of_debt_debt_to_others_details: &str = "yes_type_of_debt_debt_to_others_details";
    pub const yes_type_of_debt_formal_debt_details: &str = "yes_type_of_debt_formal_debt_details";
    pub const yes_someone_elses_type_of_debt_debt_to_others_details: &str = "yes_someone_elses_type_of_debt_debt_to_others_details";
    pub const yes_someone_elses_type_of_debt_formal_debt_details: &str = "yes_someone_elses_type_of_debt_formal_debt_details";
    pub const finance_changes: &str = "finance_changes";
    pub const finance_changes_made_changes_details: &str = "finance_changes_made_changes_details";
    pub const finance_changes_making_changes_details: &str = "finance_changes_making_changes_details";
    pub const finance_changes_want_to_make_changes_details: &str = "finance_changes_want_to_make_changes_details";
    pub const finance_changes_needs_help_to_make_changes_details: &str = "finance_changes_needs_help_to_make_changes_details";
    pub const finance_changes_thinking_about_making_changes_details: &str = "finance_changes_thinking_about_making_changes_details";
    pub const finance_changes_does_not_want_to_make_changes_details: &str = "finance_changes_does_not_want_to_make_changes_details";
    pub const finance_changes_does_not_want_to_answer_details: &str = "finance_changes_does_not_want_to_answer_details";
    pub const finance_practitioner_analysis_strengths_or_protective_factors_yes_details: &str = "finance_practitioner_analysis_strengths_or_protective_factors_yes_details";
    pub const finance_practitioner_analysis_strengths_or_protective_factors_no_details: &str = "finance_practitioner_analysis_strengths_or_protective_factors_no_details";
    pub const finance_practitioner_analysis_strengths_or_protective_factors: &str = "finance_practitioner_analysis_strengths_or_protective_factors";
    pub const finance_practitioner_analysis_risk_of_serious_harm: &str = "finance_practitioner_analysis_risk_of_serious_harm";
    pub const finance_practitioner_analysis_risk_of_serious_harm_yes_details: &str = "finance_practitioner_analysis_risk_of_serious_harm_yes_details";
    pub const finance_practitioner_analysis_risk_of_serious_harm_no_details: &str = "finance_practitioner_analysis_risk_of_serious_harm_no_details";
    pub const finance_practitioner_analysis_risk_of_reoffending: &str = "finance_practitioner_analysis_risk_of_reoffending";
    pub const finance_practitioner_analysis_risk_of_reoffending_yes_details: &str = "finance_practitioner_analysis_risk_of_reoffending_yes_details";
    pub const finance_practitioner_analysis_risk_of_reoffending_no_details: &str = "finance_practitioner_analysis_risk_of_reoffending_no_details";
}

pub mod option {
    pub const carers_allowance: &str = "CARERS_ALLOWANCE";
    pub const disability_benefits: &str = "DISABILITY_BENEFITS";
    pub const employment: &str = "EMPLOYMENT";
    pub const family_or_friends: &str = "FAMILY_OR_FRIENDS";
    pub const offending: &str = "OFFENDING";
    pub const pension: &str = "PENSION";
    pub const student_loan: &str = "STUDENT_LOAN";
    pub const undeclared: &str = "Undeclared";
    pub const work_related_benefits: &str = "WORK_RELATED_BENEFITS";
    pub const no_money: &str = "NO_MONEY";
    pub const good: &str = "GOOD";
    pub const fairly_good: &str = "FAIRLY_GOOD";
    pub const fairly_bad: &str = "FAIRLY_BAD";
    pub const bad: &str = "BAD";
    pub const yes_their_gambling: &str = "YES_THEIR_GAMBLING";
    pub const yes_someone_elses_gambling: &str = "YES_SOMEONE_ELSES_GAMBLING";
    pub const yes_their_debt: &str = "YES_THEIR_DEBT";
    pub const yes_someone_elses_debt: &str = "YES_SOMEONE_ELSES_DEBT";
    pub const debt_to_others: &str = "DEBT_TO_OTHERS";
    pub const formal_debt: &str = "FORMAL_DEBT";
}

pub mod step {
    use crate::forms::strengths_and_needs::v1::constants::StepDef;

    pub const finance: StepDef = StepDef { code: "finance", path: "finance" };
    pub const finance_summary: StepDef = StepDef { code: "finance_summary", path: "finance-summary" };
    pub const finance_analysis: StepDef = StepDef { code: "finance_analysis", path: "finance-analysis" };
}
