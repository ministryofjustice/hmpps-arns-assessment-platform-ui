//! The alcohol use section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use crate::forms::dsl::*;
use crate::forms::shared::gender;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::ALCOHOL_USE;
use crate::forms::strengths_and_needs::v1::locales::{alcohol_use, common_content_for as cc};

fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    alcohol_use().get(code, replacements).into()
}

/// Base usage applies whenever they have drunk alcohol.
fn drank_alcohol() -> Value {
    answer(question::alcohol_use).not().matches(condition::equals(common_option::no))
}

/// The recency questions apply when they drank in the last 3 months.
fn drank_in_last_three_months() -> Value {
    answer(question::alcohol_use).matches(condition::equals(option::yes_within_last_three_months))
}

fn gender_is_male() -> Value {
    data("caseData.gender").matches(condition::equals(gender::MALE))
}

fn binge_drinking_frequency_revealed() -> RevealedQuestion {
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.alcohol_binge_drinking_frequency.option.{label}"), []));
    revealed_question(
        content(question::alcohol_binge_drinking_frequency, QuestionFormat::Radio, cf("question.alcohol_binge_drinking_frequency.text", []))
            .options(vec![
                o(option::less_than_a_month, "LESS_THAN_A_MONTH"),
                o(option::monthly, "MONTHLY"),
                o(option::weekly, "WEEKLY"),
                o(option::daily, "DAILY"),
            ])
            .validation(cf("question.alcohol_binge_drinking_frequency.validation", [])),
        // Bespoke: the frequency also requires having drunk in the last 3 months, which reaches
        // outside the parent option.
        details_mode(|content, parent| {
            govuk::RADIO_INPUT.build(obj! {
                "code": content.code.clone(),
                "formGroup": question_form_group_of(&content.code),
                "fieldset": obj! { "legend": obj! { "text": content.text.clone() } },
                "dependentWhen": and(vec![drank_in_last_three_months(), parent.selected_when.clone()]),
                "items": content.raw_options(),
                "validWhen": required_validation_of(content),
            })
        }),
    )
}

fn summary(change_href: &str) -> SummaryRowPlacement {
    row_placement(change_href)
}

fn details_summary() -> Mode {
    itemised_summary_row(summary(step::alcohol_use_details.path).visible_when(drank_alcohol()))
}

fn recent() -> FieldPlacement {
    FieldPlacement::new().dependent_when(drank_in_last_three_months()).visible_when(drank_in_last_three_months())
}

fn recent_summary() -> Mode {
    itemised_summary_row(summary(step::alcohol_use_details.path).visible_when(drank_in_last_three_months()))
}

fn alcohol_use_question() -> QuestionDef {
    question(
        content(question::alcohol_use, QuestionFormat::Radio, cf("question.alcohol_use.text", [case_data::forename()]))
            .options(vec![
                opt(option::yes_within_last_three_months, cf("question.alcohol_use.option.YES_WITHIN_LAST_THREE_MONTHS", [])),
                opt(option::yes_not_in_last_three_months, cf("question.alcohol_use.option.YES_NOT_IN_LAST_THREE_MONTHS", [])),
                opt(common_option::no, cc("option.NO", [])),
            ])
            .validation(cf("question.alcohol_use.validation", [])),
        vec![
            ("field", radio_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            ("summaryRow", itemised_summary_row(summary(step::alcohol_use_status.path))),
        ],
    )
}

fn frequency() -> QuestionDef {
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.alcohol_frequency.option.{label}"), []));
    question(
        content(question::alcohol_frequency, QuestionFormat::Radio, cf("question.alcohol_frequency.text", [case_data::forename()]))
            .options(vec![
                o(option::once_a_month_or_less, "ONCE_A_MONTH_OR_LESS"),
                o(option::multiple_times_a_month, "MULTIPLE_TIMES_A_MONTH"),
                o(option::less_than_4_times_a_week, "LESS_THAN_4_TIMES_A_WEEK"),
                o(option::more_than_4_times_a_week, "MORE_THAN_4_TIMES_A_WEEK"),
            ])
            .validation(cf("question.alcohol_frequency.validation", [])),
        vec![("field", radio_field(recent())), ("summaryRow", recent_summary())],
    )
}

fn units() -> QuestionDef {
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.alcohol_units.option.{label}"), []));
    question(
        content(question::alcohol_units, QuestionFormat::Radio, cf("question.alcohol_units.text", [case_data::forename()]))
            .hint(obj! { "html": cf("question.alcohol_units.hint", []) })
            .options(vec![
                o(option::units_1_to_2, "UNITS_1_TO_2"),
                o(option::units_3_to_4, "UNITS_3_TO_4"),
                o(option::units_5_to_6, "UNITS_5_TO_6"),
                o(option::units_7_to_9, "UNITS_7_TO_9"),
                o(option::units_10_or_more, "UNITS_10_OR_MORE"),
            ])
            .validation(cf("question.alcohol_units.validation", [])),
        vec![("field", radio_field(recent())), ("summaryRow", recent_summary())],
    )
}

fn binge_drinking() -> QuestionDef {
    let text = when(gender_is_male())
        .then(cf("question.alcohol_binge_drinking.text_male", [case_data::forename()]))
        .otherwise(cf("question.alcohol_binge_drinking.text_other", [case_data::forename()]));
    let validation_message = when(gender_is_male())
        .then(cf("question.alcohol_binge_drinking.validation_male", []))
        .otherwise(cf("question.alcohol_binge_drinking.validation_other", []));
    question(
        content(question::alcohol_binge_drinking, QuestionFormat::Radio, text)
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).reveals(binge_drinking_frequency_revealed()),
                opt(common_option::no, cc("option.NO", [])),
            ])
            .validation(validation_message),
        vec![("field", radio_field(recent())), ("summaryRow", recent_summary())],
    )
}

fn evidence_of_excess_drinking() -> QuestionDef {
    let key = |label: &str| format!("question.alcohol_evidence_of_excess_drinking.option.{label}");
    question(
        content(
            question::alcohol_evidence_of_excess_drinking,
            QuestionFormat::Radio,
            cf("question.alcohol_evidence_of_excess_drinking.text", [case_data::forename()]),
        )
        .options(vec![
            opt(option::no_evidence, cf(&key("NO_EVIDENCE"), [])),
            opt(option::yes_with_some_evidence, cf(&key("YES_WITH_SOME_EVIDENCE.text"), [])).hint(cf(&key("YES_WITH_SOME_EVIDENCE.hint"), [])),
            opt(option::yes_with_evidence, cf(&key("YES_WITH_EVIDENCE.text"), [])).hint(cf(&key("YES_WITH_EVIDENCE.hint"), [])),
        ])
        .validation(cf("question.alcohol_evidence_of_excess_drinking.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn past_issues() -> QuestionDef {
    question(
        content(question::alcohol_past_issues, QuestionFormat::Radio, cf("question.alcohol_past_issues.text", [case_data::forename()]))
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).reveals(required_details(
                    question::alcohol_past_issues_yes_details,
                    cf("question.alcohol_past_issues_yes_details.validation", []),
                )),
                opt(common_option::no, cc("option.NO", [])),
            ])
            .validation(cf("question.alcohol_past_issues.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn reasons_for_use() -> QuestionDef {
    let key = |label: &str| format!("question.alcohol_reasons_for_use.option.{label}");
    question(
        content(question::alcohol_reasons_for_use, QuestionFormat::Checkbox, cf("question.alcohol_reasons_for_use.text", [case_data::forename()]))
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                opt(option::cultural_or_religious, cf(&key("CULTURAL_OR_RELIGIOUS"), [])),
                opt(option::curiosity_or_experimentation, cf(&key("CURIOSITY_OR_EXPERIMENTATION"), [])),
                opt(option::enjoyment, cf(&key("ENJOYMENT"), [])),
                opt(option::managing_emotional_issues, cf(&key("MANAGING_EMOTIONAL_ISSUES"), [])),
                opt(option::special_occasions, cf(&key("SPECIAL_OCCASIONS"), [])),
                opt(option::peer_pressure, cf(&key("PEER_PRESSURE"), [])),
                opt(option::self_medication, cf(&key("SELF_MEDICATION.text"), [])).hint(cf(&key("SELF_MEDICATION.hint"), [])),
                opt(option::social, cf(&key("SOCIAL"), [])),
                opt(common_option::other, cc("option.OTHER", [])).reveals(optional_details(question::alcohol_reasons_for_use_other_details)),
            ])
            .validation(cf("question.alcohol_reasons_for_use.validation", [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn impact_of_use() -> QuestionDef {
    let key = |label: &str| format!("question.alcohol_impact_of_use.option.{label}");
    let hinted = |value: &str, label: &str| opt(value, cf(&key(&format!("{label}.text")), [])).hint(cf(&key(&format!("{label}.hint")), []));
    question(
        content(question::alcohol_impact_of_use, QuestionFormat::Checkbox, cf("question.alcohol_impact_of_use.text", [case_data::forename()]))
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                hinted(option::behavioural, "BEHAVIOURAL"),
                hinted(option::community, "COMMUNITY"),
                hinted(option::finances, "FINANCES"),
                opt(option::links_to_reoffending, cf(&key("LINKS_TO_REOFFENDING"), [])),
                hinted(option::physical_or_mental_health, "PHYSICAL_OR_MENTAL_HEALTH"),
                hinted(option::relationships, "RELATIONSHIPS"),
                opt(common_option::other, cc("option.OTHER", [])).reveals(optional_details_with(
                    question::alcohol_impact_of_use_other_details,
                    cf("question.alcohol_impact_of_use_other_details.hint", []),
                    2000,
                )),
                divider(cc("or", [])),
                opt(option::no_negative_impact, cf(&key("NO_NEGATIVE_IMPACT"), [])).exclusive(),
            ])
            .validation(cf("question.alcohol_impact_of_use.validation", [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn stopped_or_reduced() -> QuestionDef {
    question(
        content(question::alcohol_stopped_or_reduced, QuestionFormat::Radio, cf("question.alcohol_stopped_or_reduced.text", [case_data::forename()]))
            .hint(cf("question.alcohol_stopped_or_reduced.hint", []))
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).reveals(required_details(
                    question::alcohol_stopped_or_reduced_yes_details,
                    cf("question.alcohol_stopped_or_reduced_yes_details.validation", []),
                )),
                opt(common_option::no, cc("option.NO", [])),
            ])
            .validation(cf("question.alcohol_stopped_or_reduced.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn changes() -> QuestionDef {
    question(
        content(question::alcohol_use_changes, QuestionFormat::Radio, cf("question.alcohol_use_changes.text", [case_data::forename()]))
            .hint(cf("question.alcohol_use_changes.hint", [case_data::forename()]))
            .options(changes_options(question::alcohol_use_changes))
            .validation(cf("question.alcohol_use_changes.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

pub fn section() -> &'static SectionDefinition {
    static SECTION: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION.get_or_init(|| {
        let analysis_summary = || itemised_summary_row(summary(step::alcohol_use_summary.path));
        SectionDefinition::new(ALCOHOL_USE.code)
            .question("alcoholUse", alcohol_use_question())
            .question("frequency", frequency())
            .question("units", units())
            .question("bingeDrinking", binge_drinking())
            .question("evidenceOfExcessDrinking", evidence_of_excess_drinking())
            .question("pastIssues", past_issues())
            .question("reasonsForUse", reasons_for_use())
            .question("impactOfUse", impact_of_use())
            .question("stoppedOrReduced", stopped_or_reduced())
            .question("changes", changes())
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(alcohol_use(), question::alcohol_use_practitioner_analysis_strengths_or_protective_factors, true, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfSeriousHarm",
                practitioner_analysis_question(alcohol_use(), question::alcohol_use_practitioner_analysis_risk_of_serious_harm, false, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfReoffending",
                practitioner_analysis_question(alcohol_use(), question::alcohol_use_practitioner_analysis_risk_of_reoffending, false, C1000, analysis_summary()),
            )
    })
}
