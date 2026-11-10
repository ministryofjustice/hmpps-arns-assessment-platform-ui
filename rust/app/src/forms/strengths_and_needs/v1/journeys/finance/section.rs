//! The finance section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::FINANCE;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for as cc, finance};

fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    finance().get(code, replacements).into()
}

fn over_reliant_on_family_or_friends_revealed() -> RevealedQuestion {
    revealed_question(
        content(question::family_or_friends_details, QuestionFormat::Radio, cf("question.family_or_friends_details.text", [case_data::forename()]))
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).summary_text(cf("question.finance_income.summary.option.YES", [])),
                opt(common_option::no, cc("option.NO", [])).summary_text(cf("question.finance_income.summary.option.NO", [])),
                opt(common_option::unknown, cc("option.UNKNOWN", [])).summary_text(cf("question.finance_income.summary.option.UNKNOWN", [])),
            ])
            .validation(cf("question.family_or_friends_details.validation", [])),
        radio_details(None),
    )
}

fn type_of_debt_revealed(code: &str, text: Value, debt_to_others_details_code: &str, formal_debt_details_code: &str) -> RevealedQuestion {
    revealed_question(
        content(code, QuestionFormat::Checkbox, text)
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                opt(option::debt_to_others, cf("common.option.DEBT_TO_OTHERS", []))
                    .reveals(optional_details_with(debt_to_others_details_code, cf("common.hint.DEBT_TO_OTHERS", []), 2000)),
                opt(option::formal_debt, cf("common.option.FORMAL_DEBT", []))
                    .reveals(optional_details_with(formal_debt_details_code, cf("common.hint.FORMAL_DEBT", []), 2000)),
            ])
            .validation(cf("common.validation.select_type_of_debt", [])),
        checkbox_details(None),
    )
}

fn summary(change_href: &str) -> Mode {
    itemised_summary_row(row_placement(change_href))
}

fn income() -> QuestionDef {
    question(
        content(question::finance_income, QuestionFormat::Checkbox, cf("question.finance_income.text", [case_data::forename()]))
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                opt(option::carers_allowance, cf("question.finance_income.option.CARERS_ALLOWANCE", [])),
                opt(option::disability_benefits, cf("question.finance_income.option.DISABILITY_BENEFITS.text", []))
                    .hint(cf("question.finance_income.option.DISABILITY_BENEFITS.hint", [])),
                opt(option::employment, cf("question.finance_income.option.EMPLOYMENT", [])),
                opt(option::family_or_friends, cf("question.finance_income.option.FAMILY_OR_FRIENDS", []))
                    .reveals(over_reliant_on_family_or_friends_revealed()),
                opt(option::offending, cf("question.finance_income.option.OFFENDING", [])),
                opt(option::pension, cf("question.finance_income.option.PENSION", [])),
                opt(option::student_loan, cf("question.finance_income.option.STUDENT_LOAN", [])),
                opt(option::undeclared, cf("question.finance_income.option.Undeclared", [])),
                opt(option::work_related_benefits, cf("question.finance_income.option.WORK_RELATED_BENEFITS.text", []))
                    .hint(cf("question.finance_income.option.WORK_RELATED_BENEFITS.hint", [])),
                opt(common_option::other, cc("option.OTHER", [])).reveals(optional_details(question::finance_income_other_details)),
                opt(common_option::unknown, cc("option.UNKNOWN", [])).exclusive(),
                divider(cc("or", [])),
                opt(option::no_money, cf("question.finance_income.option.NO_MONEY", []))
                    .exclusive()
                    .reveals(optional_details(question::finance_income_no_money_details)),
            ])
            .validation(cf("question.finance_income.validation", [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", summary(step::finance.path))],
    )
}

fn bank_account() -> QuestionDef {
    let mut options = yes_no(None, None);
    options.push(opt(common_option::unknown, cc("option.UNKNOWN", [])));
    question(
        content(question::finance_bank_account, QuestionFormat::Radio, cf("question.finance_bank_account.text", [case_data::forename()]))
            .options(options)
            .validation(cf("question.finance_bank_account.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", summary(step::finance.path))],
    )
}

fn money_management() -> QuestionDef {
    let managed = |value: &str, label: &str, details: &str| {
        opt(value, cf(&format!("question.finance_money_management.option.{label}"), [])).reveals(optional_details(details))
    };
    question(
        content(question::finance_money_management, QuestionFormat::Radio, cf("question.finance_money_management.text", [case_data::forename()]))
            .hint(cf("question.finance_money_management.hint", []))
            .options(vec![
                managed(option::good, "GOOD", question::finance_money_management_good_details),
                managed(option::fairly_good, "FAIRLY_GOOD", question::finance_money_management_fairly_good_details),
                managed(option::fairly_bad, "FAIRLY_BAD", question::finance_money_management_fairly_bad_details),
                managed(option::bad, "BAD", question::finance_money_management_bad_details),
            ])
            .validation(cf("question.finance_money_management.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", summary(step::finance.path))],
    )
}

fn gambling() -> QuestionDef {
    question(
        content(question::finance_gambling, QuestionFormat::Checkbox, cf("question.finance_gambling.text", [case_data::forename()]))
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                opt(option::yes_their_gambling, cf("question.finance_gambling.option.YES_THEIR_GAMBLING", []))
                    .reveals(optional_details(question::finance_gambling_yes_their_gambling_details)),
                opt(option::yes_someone_elses_gambling, cf("question.finance_gambling.option.YES_SOMEONE_ELSES_GAMBLING", []))
                    .reveals(optional_details(question::finance_gambling_yes_someone_elses_gambling_details)),
                divider(cc("or", [])),
                opt(common_option::no, cc("option.NO", [])).exclusive(),
                opt(common_option::unknown, cc("option.UNKNOWN", []))
                    .exclusive()
                    .reveals(optional_details(question::finance_gambling_unknown_details)),
            ])
            .validation(cf("question.finance_gambling.validation", [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", summary(step::finance.path))],
    )
}

fn debt() -> QuestionDef {
    question(
        content(question::finance_debt, QuestionFormat::Checkbox, cf("question.finance_debt.text", [case_data::forename()]))
            .options(vec![
                opt(option::yes_their_debt, cf("question.finance_debt.option.YES_THEIR_DEBT", [])).reveals(type_of_debt_revealed(
                    question::yes_type_of_debt,
                    cf("question.finance_debt.option.YES_THEIR_DEBT", []),
                    question::yes_type_of_debt_debt_to_others_details,
                    question::yes_type_of_debt_formal_debt_details,
                )),
                opt(option::yes_someone_elses_debt, cf("question.finance_debt.option.YES_SOMEONE_ELSES_DEBT", [])).reveals(
                    type_of_debt_revealed(
                        question::yes_someone_elses_type_of_debt,
                        cf("question.finance_debt.option.YES_SOMEONE_ELSES_DEBT", []),
                        question::yes_someone_elses_type_of_debt_debt_to_others_details,
                        question::yes_someone_elses_type_of_debt_formal_debt_details,
                    ),
                ),
                divider(cc("or", [])),
                opt(common_option::no, cc("option.NO", [])).exclusive(),
                opt(common_option::unknown, cc("option.UNKNOWN", []))
                    .exclusive()
                    .reveals(optional_details(question::finance_debt_unknown_details)),
            ])
            .validation(cf("question.finance_debt.validation", [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", summary(step::finance.path))],
    )
}

fn changes() -> QuestionDef {
    question(
        content(question::finance_changes, QuestionFormat::Radio, cf("question.finance_changes.text", [case_data::forename()]))
            .hint(cf("question.finance_changes.hint", [case_data::forename()]))
            .options(changes_options(question::finance_changes))
            .validation(cf("question.finance_changes.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", summary(step::finance.path))],
    )
}

pub fn section() -> &'static SectionDefinition {
    static SECTION: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION.get_or_init(|| {
        SectionDefinition::new(FINANCE.code)
            .question("income", income())
            .question("bankAccount", bank_account())
            .question("moneyManagement", money_management())
            .question("gambling", gambling())
            .question("debt", debt())
            .question("changes", changes())
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(finance(), question::finance_practitioner_analysis_strengths_or_protective_factors, true, C1425, summary(step::finance_summary.path)),
            )
            .analysis(
                "riskOfSeriousHarm",
                practitioner_analysis_question(finance(), question::finance_practitioner_analysis_risk_of_serious_harm, false, C1425, summary(step::finance_summary.path)),
            )
            .analysis(
                "riskOfReoffending",
                practitioner_analysis_question(finance(), question::finance_practitioner_analysis_risk_of_reoffending, false, C1000, summary(step::finance_summary.path)),
            )
    })
}
