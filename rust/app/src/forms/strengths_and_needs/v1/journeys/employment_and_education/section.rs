//! The employment and education section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425, C2000, C400};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::i18n::get_display_text_for_items;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::EMPLOYMENT_AND_EDUCATION as SECTION;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for as cc, employment_and_education};

fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    employment_and_education().get(code, replacements).into()
}

fn is_employed_or_self_employed() -> Value {
    or(vec![
        answer(question::employment_status).matches(condition::equals(option::employed)),
        answer(question::employment_status).matches(condition::equals(option::self_employed)),
    ])
}

/// The history and experience questions apply once we know the person has been employed
/// before (or their employment status implies it).
fn has_been_employed() -> Value {
    or(vec![is_employed_or_self_employed(), answer(question::has_been_employed).matches(condition::equals(common_option::yes))])
}

fn has_been_employed_or_retired() -> Value {
    or(vec![has_been_employed(), answer(question::employment_status).matches(condition::equals(option::retired))])
}

fn is_not_retired() -> Value {
    answer(question::employment_status).not().matches(condition::equals(option::retired))
}

fn details_summary() -> Mode {
    itemised_summary_row(row_placement(step::employment_education_details.path))
}

fn type_of_employment_revealed() -> RevealedQuestion {
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.employment_type.option.{label}"), []));
    revealed_question(
        content(question::employment_type, QuestionFormat::Radio, cf("question.employment_type.text", []))
            .options(vec![
                o(option::full_time, "FULL_TIME"),
                o(option::part_time, "PART_TIME"),
                o(option::temporary_or_casual, "TEMPORARY_OR_CASUAL"),
                o(option::apprenticeship, "APPRENTICESHIP"),
            ])
            .validation(cc("select_one_option", [])),
        radio_details(Some("govuk-visually-hidden")),
    )
}

fn has_been_employed_revealed(variant: &str) -> RevealedQuestion {
    revealed_question(
        content(question::has_been_employed, QuestionFormat::Radio, cf("question.has_been_employed.text", []))
            .id_prefix(&format!("{}_{}", question::has_been_employed, variant.to_lowercase()))
            .options(vec![
                opt(common_option::yes, cf("question.has_been_employed.option.YES", [])),
                opt(common_option::no, cf("question.has_been_employed.option.NO", [])),
            ])
            .validation(cc("select_one_option", [])),
        radio_details(None),
    )
}

fn current_employment_status() -> QuestionDef {
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.employment_status.option.{label}"), []));
    question(
        content(question::employment_status, QuestionFormat::Radio, cf("question.employment_status.text", [case_data::forename_possessive()]))
            .options(vec![
                o(option::employed, "EMPLOYED").reveals(type_of_employment_revealed()),
                o(option::self_employed, "SELF_EMPLOYED"),
                o(option::retired, "RETIRED"),
                o(option::currently_unavailable_for_work, "CURRENTLY_UNAVAILABLE_FOR_WORK")
                    .reveals(has_been_employed_revealed(option::currently_unavailable_for_work)),
                o(option::unemployed_looking_for_work, "UNEMPLOYED_LOOKING_FOR_WORK")
                    .reveals(has_been_employed_revealed(option::unemployed_looking_for_work)),
                o(option::unemployed_not_looking_for_work, "UNEMPLOYED_NOT_LOOKING_FOR_WORK")
                    .reveals(has_been_employed_revealed(option::unemployed_not_looking_for_work)),
            ])
            .validation(cc("select_one_option", [])),
        vec![
            ("field", radio_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            // Bespoke row: of the revealed questions only the type of employment is shown; the
            // "employed before?" answers deliberately stay off the summary.
            (
                "summaryRow",
                mode(|content| {
                    let mut blocks = get_display_text_for_items(content.code_str(), content.entries(), None);
                    blocks.extend(get_display_text_for_items(
                        question::employment_type,
                        type_of_employment_revealed().content.entries(),
                        Some("s"),
                    ));
                    obj! {
                        "key": obj! { "text": content.text.clone() },
                        "value": obj! { "blocks": blocks },
                        "actions": change_link_actions(step::employment_status.path, &content.code, &content.text),
                    }
                }),
            ),
        ],
    )
}

fn employment_sector() -> QuestionDef {
    question(
        content(question::employment_area, QuestionFormat::Text, cf("question.employment_area.text", [case_data::forename()])),
        vec![
            (
                "field",
                character_count_field(
                    count_placement(C2000).dependent_when(is_employed_or_self_employed()).visible_when(is_employed_or_self_employed()),
                ),
            ),
            (
                "summaryRow",
                text_summary_row(row_placement(step::employment_education_details.path).visible_when(and(vec![
                    is_employed_or_self_employed(),
                    answer(question::employment_area).matches(condition::string::has_min_length(1)),
                ]))),
            ),
        ],
    )
}

fn employment_history() -> QuestionDef {
    let o = |value: &str, label: &str, details: &str| {
        opt(value, cf(&format!("question.employment_history.option.{label}"), []))
            .reveals(optional_details_with(details, cf(&format!("question.{details}.hint"), []), C2000))
    };
    question(
        content(question::employment_history, QuestionFormat::Radio, cf("question.employment_history.text", [case_data::forename_possessive()]))
            .hint(cf("question.employment_history.hint", []))
            .options(vec![
                opt(option::stable, cf("question.employment_history.option.STABLE.text", []))
                    .hint(cf("question.employment_history.option.STABLE.hint", []))
                    .reveals(optional_details_with(
                        question::employment_history_stable_details,
                        cf("question.employment_history_stable_details.hint", []),
                        C2000,
                    )),
                o(option::periods_of_instability, "PERIODS_OF_INSTABILITY", question::employment_history_periods_of_instability_details),
                o(option::unstable, "UNSTABLE", question::employment_history_unstable_details),
                opt(common_option::unknown, cc("option.UNKNOWN", [])).reveals(optional_details_with(
                    question::employment_history_unknown_details,
                    cf("question.employment_history_unknown_details.hint", []),
                    C2000,
                )),
            ])
            .validation(cf("question.employment_history.validation", [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(has_been_employed_or_retired()).visible_when(has_been_employed_or_retired()))),
            (
                "summaryRow",
                itemised_summary_row(row_placement(step::employment_education_details.path).visible_when(has_been_employed_or_retired())),
            ),
        ],
    )
}

fn day_to_day_commitments() -> QuestionDef {
    let key = |label: &str| format!("question.employment_other_responsibilities.option.{label}");
    question(
        content(
            question::employment_other_responsibilities,
            QuestionFormat::Checkbox,
            cf("question.employment_other_responsibilities.text", [case_data::forename()]),
        )
        .hint(cf("question.employment_other_responsibilities.hint", []))
        .options(vec![
            opt(option::carer, cf(&key("CARER"), [])).reveals(optional_details(question::employment_other_responsibilities_carer_details)),
            opt(option::child, cf(&key("CHILD"), [])).reveals(optional_details(question::employment_other_responsibilities_child_details)),
            opt(option::studying, cf(&key("STUDYING"), [])),
            opt(option::volunteer, cf(&key("VOLUNTEER"), [])).reveals(optional_details(question::employment_other_responsibilities_volunteer_details)),
            opt(common_option::other, cc("option.OTHER", [])).reveals(optional_details(question::employment_other_responsibilities_other_details)),
            opt(common_option::unknown, cc("option.UNKNOWN", [])),
            divider(cc("or", [])),
            opt(common_option::none, cc("option.NONE", [])).exclusive(),
        ])
        .validation(cf("question.employment_other_responsibilities.validation", [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn academic_qualification() -> QuestionDef {
    let level = |value: &str, label: &str| {
        let key = format!("question.education_highest_level_completed.option.{label}");
        opt(value, cf(&format!("{key}.text"), [])).hint(cf(&format!("{key}.hint"), []))
    };
    question(
        content(
            question::education_highest_level_completed,
            QuestionFormat::Radio,
            cf("question.education_highest_level_completed.text", [case_data::forename()]),
        )
        .options(vec![
            level(option::entry_level, "ENTRY_LEVEL"),
            level(option::level_1, "LEVEL_1"),
            level(option::level_2, "LEVEL_2"),
            level(option::level_3, "LEVEL_3"),
            level(option::level_4, "LEVEL_4"),
            level(option::level_5, "LEVEL_5"),
            level(option::level_6, "LEVEL_6"),
            level(option::level_7, "LEVEL_7"),
            level(option::level_8, "LEVEL_8"),
            divider(cc("or", [])),
            opt(common_option::none_of_these, cc("option.NONE_OF_THESE", [])),
            opt(option::not_sure, cc("option.UNKNOWN", [])),
        ])
        .validation(cf("question.education_highest_level_completed.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn professional_qualification() -> QuestionDef {
    let code = question::education_professional_or_vocational_qualifications;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).reveals(required_details_with(
                    question::education_professional_or_vocational_qualifications_yes_details,
                    cf("question.education_professional_or_vocational_qualifications_yes_details.validation", []),
                    Value::Undefined,
                    C400,
                )),
                opt(common_option::no, cc("option.NO", [])),
                divider(cc("or", [])),
                opt(option::not_sure, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

fn job_skills() -> QuestionDef {
    let key = |label: &str| format!("question.education_transferable_skills.option.{label}");
    question(
        content(question::education_transferable_skills, QuestionFormat::Radio, cf("question.education_transferable_skills.text", [case_data::forename()]))
            .options(vec![
                opt(common_option::yes, cc("option.YES", []))
                    .hint(cf(&key("YES.hint"), []))
                    .reveals(optional_details(question::education_transferable_skills_yes_details)),
                opt(option::yes_some_skills, cf(&key("YES_SOME_SKILLS.text"), []))
                    .hint(cf(&key("YES_SOME_SKILLS.hint"), []))
                    .reveals(optional_details(question::education_transferable_skills_yes_some_skills_details)),
                opt(common_option::no, cc("option.NO", [])).hint(cf(&key("NO.hint"), [])),
            ])
            .validation(cf("question.education_transferable_skills.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

/// The three difficulty checkboxes each reveal the same severity question under their own code.
fn difficulty_level_revealed(code: &str) -> RevealedQuestion {
    revealed_question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                opt(option::significant_difficulties, cf("option.SIGNIFICANT_DIFFICULTIES", [])),
                opt(option::some_difficulties, cf("option.SOME_DIFFICULTIES", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        radio_details(None),
    )
}

fn difficulties_reading_writing_numeracy() -> QuestionDef {
    let key = |label: &str| format!("question.education_difficulties.option.{label}");
    question(
        content(question::education_difficulties, QuestionFormat::Checkbox, cf("question.education_difficulties.text", [case_data::forename()]))
            .hint(cf("question.education_difficulties.hint", []))
            .options(vec![
                opt(option::reading, cf(&key("READING"), [])).reveals(difficulty_level_revealed(question::education_difficulties_reading_severity)),
                opt(option::writing, cf(&key("WRITING"), [])).reveals(difficulty_level_revealed(question::education_difficulties_writing_severity)),
                opt(option::numeracy, cf(&key("NUMERACY"), [])).reveals(difficulty_level_revealed(question::education_difficulties_numeracy_severity)),
                divider(cc("or", [])),
                opt(common_option::none, cf(&key("NONE"), [])).exclusive(),
            ])
            .validation(cf("question.education_difficulties.validation", [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

/// The experience questions share a positive-to-negative scale, each rating revealing optional
/// details coded `<code>_<rating>_details`.
fn experience_options(code: &str) -> Vec<QOpt> {
    let rating = |value: &str, label: &str| {
        opt(value, cf(&format!("option.{label}"), [])).reveals(optional_details(&format!("{code}_{}_details", value.to_lowercase())))
    };
    vec![
        rating(option::positive, "POSITIVE"),
        rating(option::mostly_positive, "MOSTLY_POSITIVE"),
        rating(option::positive_and_negative, "POSITIVE_AND_NEGATIVE"),
        rating(option::mostly_negative, "MOSTLY_NEGATIVE"),
        rating(option::negative, "NEGATIVE"),
        opt(common_option::unknown, cc("option.UNKNOWN", [])),
    ]
}

fn employment_experience() -> QuestionDef {
    let code = question::employment_experience;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .options(experience_options(code))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(has_been_employed()).visible_when(has_been_employed()))),
            ("summaryRow", itemised_summary_row(row_placement(step::employment_education_details.path).visible_when(has_been_employed()))),
        ],
    )
}

fn education_experience() -> QuestionDef {
    let code = question::education_experience;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .options(experience_options(code))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(is_not_retired()).visible_when(is_not_retired()))),
            ("summaryRow", details_summary()),
        ],
    )
}

fn changes() -> QuestionDef {
    let code = question::employment_education_changes;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(cf(&format!("question.{code}.hint"), [case_data::forename()]))
            .options(changes_options(code))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", details_summary())],
    )
}

pub fn section() -> &'static SectionDefinition {
    static SECTION_DEF: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION_DEF.get_or_init(|| {
        let analysis_summary = || itemised_summary_row(row_placement(step::employment_education_summary.path));
        let c = employment_and_education();
        SectionDefinition::new(SECTION.code)
            .question("currentEmploymentStatus", current_employment_status())
            .question("employmentSector", employment_sector())
            .question("employmentHistory", employment_history())
            .question("dayToDayCommitments", day_to_day_commitments())
            .question("academicQualification", academic_qualification())
            .question("professionalQualification", professional_qualification())
            .question("jobSkills", job_skills())
            .question("difficultiesReadingWritingNumeracy", difficulties_reading_writing_numeracy())
            .question("employmentExperience", employment_experience())
            .question("educationExperience", education_experience())
            .question("changes", changes())
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(c, question::employment_education_practitioner_analysis_strengths_or_protective_factors, true, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfSeriousHarm",
                practitioner_analysis_question(c, question::employment_education_practitioner_analysis_risk_of_serious_harm, false, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfReoffending",
                practitioner_analysis_question(c, question::employment_education_practitioner_analysis_risk_of_reoffending, false, C1000, analysis_summary()),
            )
    })
}
