//! The thinking behaviours and attitudes section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::THINKING_BEHAVIOURS_AND_ATTITUDES as SECTION;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for as cc, thinking_behaviours_and_attitudes};

fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    thinking_behaviours_and_attitudes().get(code, replacements).into()
}

/// The sexual harm questions are only asked (and summarised) once a risk of sexual harm to
/// others has been confirmed.
fn risk_of_sexual_harm_confirmed() -> Value {
    answer(question::thinking_behaviours_attitudes_risk_sexual_harm).matches(condition::equals(common_option::yes))
}

fn main_summary() -> Mode {
    itemised_summary_row(row_placement(step::thinking_behaviours_attitudes.path))
}

fn sexual_harm_summary() -> Mode {
    itemised_summary_row(row_placement(step::thinking_behaviours_attitudes_risk_of_sexual_harm_details.path).visible_when(risk_of_sexual_harm_confirmed()))
}

/// An option labelled `question.<code>.option.<label>`.
fn o(code: &str, value: &str, label: &str) -> QOpt {
    opt(value, cf(&format!("question.{code}.option.{label}"), []))
}

/// An option labelled `...option.<label>.text` with a `...option.<label>.hint` hint.
fn o_hinted(code: &str, value: &str, label: &str) -> QOpt {
    opt(value, cf(&format!("question.{code}.option.{label}.text"), [])).hint(cf(&format!("question.{code}.option.{label}.hint"), []))
}

/// A radio question worded `question.<code>.text` with the forename.
fn radio(code: &str, hint: bool, options: Vec<QOpt>, summary: Mode) -> QuestionDef {
    let mut c = content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]));
    if hint {
        c = c.hint(cf(&format!("question.{code}.hint"), []));
    }
    question(
        c.options(options).validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", summary)],
    )
}

fn yes_sometimes_no(code: &str) -> Vec<QOpt> {
    vec![o(code, common_option::yes, "YES"), o(code, option::sometimes, "SOMETIMES"), o(code, common_option::no, "NO")]
}

fn no_some_yes(code: &str) -> Vec<QOpt> {
    vec![o(code, common_option::no, "NO"), o(code, option::some, "SOME"), o(code, common_option::yes, "YES")]
}

fn no_sometimes_yes(code: &str) -> Vec<QOpt> {
    vec![o(code, common_option::no, "NO"), o(code, option::sometimes, "SOMETIMES"), o(code, common_option::yes, "YES")]
}

fn peer_pressure() -> QuestionDef {
    let code = question::thinking_behaviours_attitudes_peer_pressure;
    let detailed = |value: &str, label: &str| o(code, value, label).reveals(optional_details(&format!("{code}_{}_details", value.to_lowercase())));
    radio(
        code,
        false,
        vec![detailed(common_option::yes, "YES"), detailed(option::some, "SOME"), detailed(common_option::no, "NO")],
        main_summary(),
    )
}

fn changes() -> QuestionDef {
    let code = question::thinking_behaviours_attitudes_changes;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(cf(&format!("question.{code}.hint"), [case_data::forename()]))
            .options(changes_options(code))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", main_summary())],
    )
}

fn risk_sexual_harm() -> QuestionDef {
    let code = question::thinking_behaviours_attitudes_risk_sexual_harm;
    let history = || data("caseData.sexuallyMotivatedOffenceHistory");
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            // The warning shows only when case data records no sexual or sexually motivated
            // offence history; with such a history, "No" is ruled out instead.
            .hint(obj! {
                "html": when(history().matches(condition::equals(common_option::no)))
                    .then(cf(&format!("question.{code}.hint"), [case_data::forename()]))
                    .otherwise(""),
            })
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).hint(cf(&format!("question.{code}.option.YES.hint"), [])),
                opt(common_option::no, cc("option.NO", [])).disabled(history().matches(condition::equals(common_option::yes))),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            ("summaryRow", itemised_summary_row(row_placement(step::thinking_behaviours_attitudes_risk_of_sexual_harm.path))),
        ],
    )
}

pub fn section() -> &'static SectionDefinition {
    static SECTION_DEF: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION_DEF.get_or_init(|| {
        use question::*;
        let analysis_summary = || itemised_summary_row(row_placement(step::thinking_behaviours_attitudes_summary.path));
        let c = thinking_behaviours_and_attitudes();
        SectionDefinition::new(SECTION.code)
            .question("consequences", radio(thinking_behaviours_attitudes_consequences, true, yes_sometimes_no(thinking_behaviours_attitudes_consequences), main_summary()))
            .question(
                "stableBehaviour",
                radio(thinking_behaviours_attitudes_stable_behaviour, true, yes_sometimes_no(thinking_behaviours_attitudes_stable_behaviour), main_summary()),
            )
            .question(
                "offendingActivities",
                radio(
                    thinking_behaviours_attitudes_offending_activities,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_offending_activities, option::no_offending_activities, "NO_OFFENDING_ACTIVITIES"),
                        o(thinking_behaviours_attitudes_offending_activities, option::sometimes_offending_activities, "SOMETIMES_OFFENDING_ACTIVITIES"),
                        o(thinking_behaviours_attitudes_offending_activities, option::yes_offending_activities, "YES_OFFENDING_ACTIVITIES"),
                    ],
                    main_summary(),
                ),
            )
            .question("peerPressure", peer_pressure())
            .question(
                "problemSolving",
                radio(
                    thinking_behaviours_attitudes_problem_solving,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_problem_solving, common_option::yes, "YES"),
                        o(thinking_behaviours_attitudes_problem_solving, option::limited_problem_solving, "LIMITED_PROBLEM_SOLVING"),
                        o(thinking_behaviours_attitudes_problem_solving, common_option::no, "NO"),
                    ],
                    main_summary(),
                ),
            )
            .question("peoplesViews", radio(thinking_behaviours_attitudes_peoples_views, false, yes_sometimes_no(thinking_behaviours_attitudes_peoples_views), main_summary()))
            .question(
                "manipulativePredatoryBehaviour",
                radio(
                    thinking_behaviours_attitudes_manipulative_predatory_behaviour,
                    false,
                    no_some_yes(thinking_behaviours_attitudes_manipulative_predatory_behaviour),
                    main_summary(),
                ),
            )
            .question(
                "temperManagement",
                radio(
                    thinking_behaviours_attitudes_temper_management,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_temper_management, common_option::yes, "YES"),
                        o(thinking_behaviours_attitudes_temper_management, option::sometimes, "SOMETIMES"),
                        o_hinted(thinking_behaviours_attitudes_temper_management, common_option::no, "NO"),
                    ],
                    main_summary(),
                ),
            )
            .question(
                "violenceControllingBehaviour",
                radio(
                    thinking_behaviours_attitudes_violence_controlling_behaviour,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_violence_controlling_behaviour, option::no_violence, "NO_VIOLENCE"),
                        o(thinking_behaviours_attitudes_violence_controlling_behaviour, option::sometimes, "SOMETIMES"),
                        o(thinking_behaviours_attitudes_violence_controlling_behaviour, option::yes_violence, "YES_VIOLENCE"),
                    ],
                    main_summary(),
                ),
            )
            .question(
                "impulsiveBehaviour",
                radio(thinking_behaviours_attitudes_impulsive_behaviour, false, no_sometimes_yes(thinking_behaviours_attitudes_impulsive_behaviour), main_summary()),
            )
            .question(
                "positiveAttitude",
                radio(
                    thinking_behaviours_attitudes_positive_attitude,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_positive_attitude, option::yes_positive, "YES_POSITIVE"),
                        o(thinking_behaviours_attitudes_positive_attitude, option::negative_attitude_no_concerns, "NEGATIVE_ATTITUDE_NO_CONCERNS"),
                        o(thinking_behaviours_attitudes_positive_attitude, option::negative_attitude_and_concerns, "NEGATIVE_ATTITUDE_AND_CONCERNS"),
                    ],
                    main_summary(),
                ),
            )
            .question(
                "hostileOrientation",
                radio(
                    thinking_behaviours_attitudes_hostile_orientation,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_hostile_orientation, common_option::no, "NO"),
                        o(thinking_behaviours_attitudes_hostile_orientation, option::some, "SOME"),
                        o(thinking_behaviours_attitudes_hostile_orientation, common_option::yes, "YES.text")
                            .html(cf(&format!("question.{thinking_behaviours_attitudes_hostile_orientation}.option.YES.html"), [])),
                    ],
                    main_summary(),
                ),
            )
            .question(
                "supervision",
                radio(
                    thinking_behaviours_attitudes_supervision,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_supervision, option::yes_supervision, "YES_SUPERVISION"),
                        o(thinking_behaviours_attitudes_supervision, option::unsure_supervision, "UNSURE_SUPERVISION"),
                        o(thinking_behaviours_attitudes_supervision, option::no_supervision, "NO_SUPERVISION"),
                    ],
                    main_summary(),
                ),
            )
            .question(
                "criminalBehaviour",
                radio(thinking_behaviours_attitudes_criminal_behaviour, false, no_sometimes_yes(thinking_behaviours_attitudes_criminal_behaviour), main_summary()),
            )
            .question("changes", changes())
            .question("riskSexualHarm", risk_sexual_harm())
            .question(
                "sexualPreoccupation",
                radio(
                    thinking_behaviours_attitudes_sexual_preoccupation,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_sexual_preoccupation, common_option::yes, "YES"),
                        o(thinking_behaviours_attitudes_sexual_preoccupation, option::sometimes, "SOMETIMES"),
                        o_hinted(thinking_behaviours_attitudes_sexual_preoccupation, common_option::no, "NO"),
                        opt(common_option::unknown, cc("option.UNKNOWN", [])),
                    ],
                    sexual_harm_summary(),
                ),
            )
            .question(
                "offenceRelatedSexualInterest",
                radio(
                    thinking_behaviours_attitudes_offence_related_sexual_interest,
                    false,
                    vec![
                        o_hinted(thinking_behaviours_attitudes_offence_related_sexual_interest, option::yes_offence_related_sexual_interest, "YES_OFFENCE_RELATED_SEXUAL_INTEREST"),
                        o(thinking_behaviours_attitudes_offence_related_sexual_interest, option::some_offence_related_sexual_interest, "SOME_OFFENCE_RELATED_SEXUAL_INTEREST"),
                        o_hinted(thinking_behaviours_attitudes_offence_related_sexual_interest, option::no_offence_related_sexual_interest, "NO_OFFENCE_RELATED_SEXUAL_INTEREST"),
                        opt(common_option::unknown, cc("option.UNKNOWN", [])),
                    ],
                    sexual_harm_summary(),
                ),
            )
            .question(
                "emotionalIntimacy",
                radio(
                    thinking_behaviours_attitudes_emotional_intimacy,
                    false,
                    vec![
                        o(thinking_behaviours_attitudes_emotional_intimacy, common_option::yes, "YES"),
                        o(thinking_behaviours_attitudes_emotional_intimacy, option::sometimes, "SOMETIMES"),
                        o(thinking_behaviours_attitudes_emotional_intimacy, common_option::no, "NO"),
                        opt(common_option::unknown, cc("option.UNKNOWN", [])),
                    ],
                    sexual_harm_summary(),
                ),
            )
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(c, thinking_behaviours_attitudes_practitioner_analysis_strengths_or_protective_factors, true, C1425, analysis_summary()),
            )
            .analysis(
                "linkedToSeriousHarm",
                practitioner_analysis_question(c, thinking_behaviours_attitudes_practitioner_analysis_risk_of_serious_harm, false, C1425, analysis_summary()),
            )
            .analysis(
                "linkedToReoffending",
                practitioner_analysis_question(c, thinking_behaviours_attitudes_practitioner_analysis_risk_of_reoffending, false, C1000, analysis_summary()),
            )
    })
}
