//! The health wellbeing section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425, C2000};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::HEALTH_AND_WELLBEING;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for as cc, health_wellbeing};

fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    health_wellbeing().get(code, replacements).into()
}

/// The physical treatment question applies once physical health conditions are confirmed.
fn has_physical_health_conditions() -> Value {
    answer(question::health_wellbeing_physical_health_condition).matches(condition::equals(common_option::yes))
}

/// The mental treatment questions apply unless mental health problems are ruled out (or unknown).
fn may_have_mental_health_problems() -> Value {
    not(or(vec![
        answer(question::health_wellbeing_mental_health_condition).matches(condition::equals(common_option::no)),
        answer(question::health_wellbeing_mental_health_condition).matches(condition::equals(common_option::unknown)),
    ]))
}

fn details_summary() -> Mode {
    itemised_summary_row(row_placement(step::health_wellbeing_details.path))
}

fn details_summary_when_answered(code: &str) -> Mode {
    itemised_summary_row(row_placement(step::health_wellbeing_details.path).visible_when(answer(code).matches(condition::is_required())))
}

fn yes(reveals: Option<RevealedQuestion>) -> QOpt {
    opt(common_option::yes, cc("option.YES", [])).reveals_opt(reveals)
}

fn no() -> QOpt {
    opt(common_option::no, cc("option.NO", []))
}

fn unknown() -> QOpt {
    opt(common_option::unknown, cc("option.UNKNOWN", []))
}

fn text(code: &str) -> Value {
    cf(&format!("question.{code}.text"), [case_data::forename()])
}

fn validation_of(code: &str) -> Value {
    cf(&format!("question.{code}.validation"), [])
}

fn health_conditions() -> QuestionDef {
    let code = question::health_wellbeing_physical_health_condition;
    question(
        content(code, QuestionFormat::Radio, text(code))
            .options(vec![yes(Some(optional_details(question::health_wellbeing_physical_health_condition_yes_details))), no(), unknown()])
            .validation(validation_of(code)),
        vec![
            ("field", radio_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            ("summaryRow", itemised_summary_row(row_placement(step::health_wellbeing_status.path))),
        ],
    )
}

fn mental_health_problems() -> QuestionDef {
    let code = question::health_wellbeing_mental_health_condition;
    let o = |value: &str, label: &str, details: &str| {
        opt(value, cf(&format!("question.{code}.option.{label}"), [])).reveals(optional_details(details))
    };
    question(
        content(code, QuestionFormat::Radio, text(code))
            .options(vec![
                o(option::yes_ongoing_severe, "YES_ONGOING_SEVERE", question::health_wellbeing_mental_health_condition_yes_ongoing_severe_details),
                o(option::yes_ongoing, "YES_ONGOING", question::health_wellbeing_mental_health_condition_yes_ongoing_details),
                o(option::yes_in_the_past, "YES_IN_THE_PAST", question::health_wellbeing_mental_health_condition_yes_in_the_past_details),
                no(),
                unknown(),
            ])
            .validation(validation_of(code)),
        vec![
            ("field", radio_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            ("summaryRow", itemised_summary_row(row_placement(step::health_wellbeing_status.path))),
        ],
    )
}

fn prescribed_medication(code: &str, applies: fn() -> Value) -> QuestionDef {
    question(
        content(code, QuestionFormat::Text, text(code)),
        vec![
            ("field", character_count_field(count_placement(C2000).dependent_when(applies()).visible_when(applies()))),
            (
                "summaryRow",
                text_summary_row(row_placement(step::health_wellbeing_details.path).visible_when(answer(code).matches(condition::is_required()))),
            ),
        ],
    )
}

fn psychiatric_treatment() -> QuestionDef {
    let code = question::health_wellbeing_psychiatric_treatment;
    question(
        content(code, QuestionFormat::Radio, text(code))
            .options(vec![
                yes(None),
                opt(option::pending_treatment, cf(&format!("question.{code}.option.PENDING_TREATMENT"), [])),
                no(),
                unknown(),
            ])
            .validation(validation_of(code)),
        vec![
            (
                "field",
                radio_field(FieldPlacement::new().dependent_when(may_have_mental_health_problems()).visible_when(may_have_mental_health_problems())),
            ),
            ("summaryRow", details_summary_when_answered(code)),
        ],
    )
}

fn head_injuries() -> QuestionDef {
    let code = question::health_wellbeing_head_injury_or_illness;
    question(
        content(code, QuestionFormat::Radio, text(code))
            .hint(obj! { "html": cf(&format!("question.{code}.hint"), []) })
            .options(vec![yes(None), no(), unknown()])
            .validation(validation_of(code)),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary_when_answered(code))],
    )
}

fn neurodiverse_conditions() -> QuestionDef {
    let code = question::health_wellbeing_neurodiverse_conditions;
    question(
        content(code, QuestionFormat::Radio, text(code))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![yes(Some(optional_details(question::health_wellbeing_neurodiverse_conditions_yes_details))), no(), unknown()])
            .validation(validation_of(code)),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn impact_on_learning_abilities() -> QuestionDef {
    let code = question::health_wellbeing_learning_difficulties;
    question(
        content(code, QuestionFormat::Radio, text(code)).hint(cf(&format!("question.{code}.hint"), [])).options(vec![
            opt(option::yes_significant_difficulties, cf(&format!("question.{code}.option.YES_SIGNIFICANT_DIFFICULTIES"), []))
                .reveals(optional_details(question::health_wellbeing_learning_difficulties_yes_significant_difficulties_details)),
            opt(option::yes_some_difficulties, cf(&format!("question.{code}.option.YES_SOME_DIFFICULTIES"), []))
                .reveals(optional_details(question::health_wellbeing_learning_difficulties_yes_some_difficulties_details)),
            opt(common_option::no, cf(&format!("question.{code}.option.NO"), [])),
        ]),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn cope_with_day_to_day_life() -> QuestionDef {
    let code = question::health_wellbeing_coping_day_to_day_life;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    question(
        content(code, QuestionFormat::Radio, text(code))
            .options(vec![o(common_option::yes, "YES"), o(option::yes_some_difficulties, "YES_SOME_DIFFICULTIES"), o(common_option::no, "NO")])
            .validation(validation_of(code)),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn attitude_towards_self() -> QuestionDef {
    let code = question::health_wellbeing_attitude_towards_self;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .options(vec![
                o(option::positive, "POSITIVE"),
                o(option::some_negative_aspects, "SOME_NEGATIVE_ASPECTS"),
                o(option::negative, "NEGATIVE.text").hint(cf(&format!("question.{code}.option.NEGATIVE.hint"), [])),
            ])
            .validation(validation_of(code)),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn yes_no_with_required_yes(code: &str, details_code: &str) -> QuestionDef {
    question(
        content(code, QuestionFormat::Radio, text(code))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(yes_no(Some(required_details(details_code, cc("validation.enter_details", []))), None))
            .validation(validation_of(code)),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn feelings_about_future() -> QuestionDef {
    let code = question::health_wellbeing_outlook;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    question(
        content(code, QuestionFormat::Radio, text(code))
            .hint(cf(&format!("question.{code}.hint"), [case_data::forename()]))
            .options(vec![
                o(option::optimistic, "OPTIMISTIC"),
                o(option::not_sure, "NOT_SURE"),
                o(option::not_optimistic, "NOT_OPTIMISTIC"),
                divider(cc("or", [])),
                opt(common_option::does_not_want_to_answer, cf(&format!("question.{code}.option.DOES_NOT_WANT_TO_ANSWER"), [case_data::forename()])),
                opt(common_option::not_present, cc("option.NOT_PRESENT", [case_data::forename()])),
            ])
            .validation(validation_of(code)),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn helped_during_periods_of_good_health() -> QuestionDef {
    let code = question::health_wellbeing_positive_factors;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    question(
        content(code, QuestionFormat::Checkbox, text(code)).hint(obj! { "html": cf(&format!("question.{code}.hint"), []) }).options(vec![
            o(option::accommodation, "ACCOMMODATION"),
            o(option::employment, "EMPLOYMENT"),
            o(option::faith_or_religion, "FAITH_OR_RELIGION"),
            o(option::community, "COMMUNITY"),
            o(option::medication_or_treatment, "MEDICATION_OR_TREATMENT"),
            o(option::money, "MONEY"),
            o(option::relationships, "RELATIONSHIPS"),
            opt(common_option::other, cc("option.OTHER", []))
                .reveals(required_details(question::health_wellbeing_positive_factors_other_details, cc("validation.enter_details", []))),
        ]),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", details_summary_when_answered(code))],
    )
}

fn changes() -> QuestionDef {
    let code = question::health_wellbeing_changes;
    question(
        content(code, QuestionFormat::Radio, text(code))
            .hint(cf(&format!("question.{code}.hint"), [case_data::forename()]))
            .options(changes_options(code))
            .validation(validation_of(code)),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

pub fn section() -> &'static SectionDefinition {
    static SECTION: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION.get_or_init(|| {
        let analysis_summary = || itemised_summary_row(row_placement(step::health_wellbeing_summary.path));
        let c = health_wellbeing();
        SectionDefinition::new(HEALTH_AND_WELLBEING.code)
            .question("healthConditions", health_conditions())
            .question("mentalHealthProblems", mental_health_problems())
            .question(
                "prescribedPhysicalHealthMedicationsTreatments",
                prescribed_medication(question::health_wellbeing_prescribed_medication_physical_conditions, has_physical_health_conditions),
            )
            .question(
                "prescribedMentalHealthMedicationsTreatments",
                prescribed_medication(question::health_wellbeing_prescribed_medication_mental_conditions, may_have_mental_health_problems),
            )
            .question("psychiatricTreatment", psychiatric_treatment())
            .question("headInjuries", head_injuries())
            .question("neurodiverseConditions", neurodiverse_conditions())
            .question("impactOnLearningAbilities", impact_on_learning_abilities())
            .question("copeWithDayToDayLife", cope_with_day_to_day_life())
            .question("attitudeTowardsSelf", attitude_towards_self())
            .question("selfHarm", yes_no_with_required_yes(question::health_wellbeing_self_harmed, question::health_wellbeing_self_harmed_yes_details))
            .question(
                "suicidalTendencies",
                yes_no_with_required_yes(
                    question::health_wellbeing_attempted_suicide_or_suicidal_thoughts,
                    question::health_wellbeing_attempted_suicide_or_suicidal_thoughts_yes_details,
                ),
            )
            .question("feelingsAboutFuture", feelings_about_future())
            .question("helpedDuringPeriodsGoodHealthWellbeing", helped_during_periods_of_good_health())
            .question("changes", changes())
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(c, question::health_wellbeing_practitioner_analysis_strengths_or_protective_factors, true, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfSeriousHarm",
                practitioner_analysis_question(c, question::health_wellbeing_practitioner_analysis_risk_of_serious_harm, false, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfReoffending",
                practitioner_analysis_question(c, question::health_wellbeing_practitioner_analysis_risk_of_reoffending, false, C1000, analysis_summary()),
            )
    })
}
