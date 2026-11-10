//! The personal relationships and community section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425, C2000};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::PERSONAL_RELATIONSHIPS_AND_COMMUNITY as SECTION;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for as cc, personal_relationships_and_community};

fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    personal_relationships_and_community().get(code, replacements).into()
}

/// The parenting responsibilities question applies once we know they have children or
/// parenting responsibilities.
fn has_parental_responsibilities() -> Value {
    answer(question::personal_relationships_community_important_people).matches(condition::array::contains(option::child_parental_responsibilities))
}

fn community_summary() -> Mode {
    itemised_summary_row(row_placement(step::personal_relationships_community.path))
}

/// The children checkboxes each reveal the same "who are they?" details under their own code.
fn children_details_revealed(code: &str, text: Value, validation_message: Value) -> RevealedQuestion {
    revealed_question(content(code, QuestionFormat::Text, text).validation(validation_message), character_count_details(C2000))
}

/// The important people checkboxes each reveal optional details under their own code.
fn important_person_details_revealed(code: &str, text: Value) -> RevealedQuestion {
    revealed_question(content(code, QuestionFormat::Text, text), character_count_details(C2000))
}

fn children_details() -> QuestionDef {
    let code = question::personal_relationships_community_children_details;
    let child = |value: &str, label: &str, details: &str| {
        let key = format!("question.{code}.option.{label}");
        opt(value, cf(&format!("{key}.text"), [])).reveals(children_details_revealed(
            details,
            cf(&format!("{key}.label"), [case_data::forename()]),
            cf(&format!("{key}.validation"), []),
        ))
    };
    question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .hint(obj! { "html": cf(&format!("question.{code}.hint"), [case_data::forename()]) })
            .options(vec![
                child(
                    option::yes_children_living_with_pop,
                    "YES_CHILDREN_LIVING_WITH_POP",
                    question::personal_relationships_community_children_details_yes_children_living_with_pop_details,
                ),
                child(
                    option::yes_children_not_living_with_pop,
                    "YES_CHILDREN_NOT_LIVING_WITH_POP",
                    question::personal_relationships_community_children_details_yes_children_not_living_with_pop_details,
                ),
                child(
                    option::yes_children_visiting,
                    "YES_CHILDREN_VISITING",
                    question::personal_relationships_community_children_details_yes_children_visiting_details,
                ),
                divider(cc("or", [])),
                opt(option::no_children, cf(&format!("question.{code}.option.NO_CHILDREN.text"), [case_data::forename_possessive()])).exclusive(),
            ])
            .validation(cc("validation.select_at_least_one_option", [])),
        vec![
            ("field", checkbox_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            ("summaryRow", itemised_summary_row(row_placement(step::personal_relationships_children_information.path))),
        ],
    )
}

fn important_people() -> QuestionDef {
    let code = question::personal_relationships_community_important_people;
    let key = |label: &str, part: &str| format!("question.{code}.option.{label}.{part}");
    let person = |value: &str, label: &str, details: &str| {
        opt(value, cf(&key(label, "text"), [])).reveals(important_person_details_revealed(details, cf(&key(label, "label"), [])))
    };
    question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                opt(option::partner_intimate_relationship, cf(&key("PARTNER_INTIMATE_RELATIONSHIP", "text"), [])).reveals(optional_details_with(
                    question::personal_relationships_community_important_people_partner_intimate_relationship_details,
                    cf(&key("PARTNER_INTIMATE_RELATIONSHIP", "hint"), []),
                    C2000,
                )),
                person(
                    option::child_parental_responsibilities,
                    "CHILD_PARENTAL_RESPONSIBILITIES",
                    question::personal_relationships_community_important_people_child_parental_responsibilities_details,
                ),
                person(option::other_children, "OTHER_CHILDREN", question::personal_relationships_community_important_people_other_children_details),
                person(option::family, "FAMILY", question::personal_relationships_community_important_people_family_details),
                person(option::friends, "FRIENDS", question::personal_relationships_community_important_people_friends_details),
                opt(common_option::other, cc("option.OTHER", [])).reveals(required_details(
                    question::personal_relationships_community_important_people_other_details,
                    cc("validation.enter_details", []),
                )),
            ])
            .validation(cc("validation.select_at_least_one_option", [])),
        vec![
            ("field", checkbox_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            ("summaryRow", itemised_summary_row(row_placement(step::personal_relationships.path))),
        ],
    )
}

/// An option revealing optional details coded `<code>_<value>_details`.
fn detailed(code: &str, value: &str, label: &str) -> QOpt {
    opt(value, cf(&format!("question.{code}.option.{label}.text"), [])).reveals(optional_details(&format!("{code}_{}_details", value.to_lowercase())))
}

fn current_relationship() -> QuestionDef {
    let code = question::personal_relationships_community_current_relationship;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .options(vec![
                detailed(code, option::happy_relationship, "HAPPY_RELATIONSHIP"),
                detailed(code, option::concerns_happy_relationship, "CONCERNS_HAPPY_RELATIONSHIP"),
                detailed(code, option::unhappy_relationship, "UNHAPPY_RELATIONSHIP"),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", community_summary())],
    )
}

fn intimate_relationship() -> QuestionDef {
    let code = question::personal_relationships_community_intimate_relationship;
    let key = |label: &str, part: &str| format!("question.{code}.option.{label}.{part}");
    let o = |value: &str, label: &str| {
        opt(value, cf(&key(label, "text"), [])).reveals(optional_details_with(
            &format!("{code}_{}_details", value.to_lowercase()),
            cf(&key(label, "detailsHint"), []),
            C2000,
        ))
    };
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![
                o(option::stable_relationships, "STABLE_RELATIONSHIPS").hint(cf(&key("STABLE_RELATIONSHIPS", "hint"), [])),
                o(option::positive_and_negative_relationships, "POSITIVE_AND_NEGATIVE_RELATIONSHIPS"),
                o(option::unstable_relationships, "UNSTABLE_RELATIONSHIPS").hint(cf(&key("UNSTABLE_RELATIONSHIPS", "hint"), [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", community_summary())],
    )
}

fn free_text(code: &str, with_validation: bool) -> QuestionDef {
    let mut c = content(code, QuestionFormat::Text, cf(&format!("question.{code}.text"), [case_data::forename()])).hint(cf(&format!("question.{code}.hint"), []));
    if with_validation {
        c = c.validation(cf(&format!("question.{code}.validation"), []));
    }
    question(
        c,
        vec![
            ("field", character_count_field(count_placement(C2000))),
            (
                "summaryRow",
                text_summary_row(row_placement(step::personal_relationships_community.path).visible_when(answer(code).matches(condition::is_required()))),
            ),
        ],
    )
}

fn parental_responsibilities() -> QuestionDef {
    let code = question::personal_relationships_community_parental_responsibilities;
    let o = |value: &str, label: &str| {
        opt(value, cf(&format!("question.{code}.option.{label}.text"), [])).reveals(optional_details(&format!("{code}_{}_details", value.to_lowercase())))
    };
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![
                o(common_option::yes, "YES"),
                o(option::sometimes, "SOMETIMES"),
                o(common_option::no, "NO"),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(has_parental_responsibilities()).visible_when(has_parental_responsibilities()))),
            (
                "summaryRow",
                itemised_summary_row(row_placement(step::personal_relationships_community.path).visible_when(has_parental_responsibilities())),
            ),
        ],
    )
}

fn family_relationship() -> QuestionDef {
    let code = question::personal_relationships_community_family_relationship;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![
                detailed(code, option::stable_relationship, "STABLE_RELATIONSHIP"),
                detailed(code, option::mixed_relationship, "MIXED_RELATIONSHIP"),
                detailed(code, option::unstable_relationship, "UNSTABLE_RELATIONSHIP")
                    .hint(cf(&format!("question.{code}.option.UNSTABLE_RELATIONSHIP.hint"), [])),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", community_summary())],
    )
}

fn childhood() -> QuestionDef {
    let code = question::personal_relationships_community_childhood;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![
                detailed(code, option::positive_childhood, "POSITIVE_CHILDHOOD"),
                detailed(code, option::mixed_childhood, "MIXED_CHILDHOOD"),
                detailed(code, option::negative_childhood, "NEGATIVE_CHILDHOOD").hint(cf(&format!("question.{code}.option.NEGATIVE_CHILDHOOD.hint"), [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", community_summary())],
    )
}

fn childhood_behaviour() -> QuestionDef {
    let code = question::personal_relationships_community_childhood_behaviour;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(yes_no(
                Some(optional_details(question::personal_relationships_community_childhood_behaviour_yes_details)),
                Some(optional_details(question::personal_relationships_community_childhood_behaviour_no_details)),
            ))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", community_summary())],
    )
}

fn changes() -> QuestionDef {
    let code = question::personal_relationships_community_changes;
    let section_title: Value = Ex::from_value(cc("sectionTitle.personal-relationships-and-community", [])).pipe([transformer::string::to_lower_case()]).into();
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(cc("validation.must_answer", [case_data::forename()]))
            .options(changes_options(code))
            .validation(cc("validation.select_changes", [section_title])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", community_summary())],
    )
}

pub fn section() -> &'static SectionDefinition {
    static SECTION_DEF: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION_DEF.get_or_init(|| {
        let analysis_summary = || itemised_summary_row(row_placement(step::personal_relationships_community_summary.path));
        let c = personal_relationships_and_community();
        SectionDefinition::new(SECTION.code)
            .question("childrenDetails", children_details())
            .question("importantPeople", important_people())
            .question("currentRelationship", current_relationship())
            .question("intimateRelationship", intimate_relationship())
            .question("challengesIntimateRelationship", free_text(question::personal_relationships_community_challenges_intimate_relationship, true))
            .question("parentalResponsibilities", parental_responsibilities())
            .question("familyRelationship", family_relationship())
            .question("childhood", childhood())
            .question("childhoodBehaviour", childhood_behaviour())
            .question("belonging", free_text(question::personal_relationships_community_belonging, false))
            .question("changes", changes())
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(
                    c,
                    question::personal_relationships_community_practitioner_analysis_strengths_or_protective_factors,
                    true,
                    C1425,
                    analysis_summary(),
                ),
            )
            .analysis(
                "riskOfSeriousHarm",
                practitioner_analysis_question(c, question::personal_relationships_community_practitioner_analysis_risk_of_serious_harm, false, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfReoffending",
                practitioner_analysis_question(c, question::personal_relationships_community_practitioner_analysis_risk_of_reoffending, false, C1000, analysis_summary()),
            )
    })
}
