//! The accommodation section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425, C2000};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::generators;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::ACCOMMODATION as SECTION;
use crate::forms::strengths_and_needs::v1::locales::{accommodation, common_content_for as cc};

fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    accommodation().get(code, replacements).into()
}

fn current_is(value: &str) -> Value {
    answer(question::current_accommodation).matches(condition::equals(value))
}

fn settled_accommodation() -> Value {
    current_is(option::settled)
}

fn temporary_accommodation() -> Value {
    current_is(option::temporary)
}

fn no_accommodation() -> Value {
    current_is(option::no_accommodation)
}

fn has_accommodation() -> Value {
    not(no_accommodation())
}

fn details_summary() -> SummaryRowPlacement {
    row_placement(step::accommodation_details.path)
}

fn end_date_revealed(code: &str) -> RevealedQuestion {
    revealed_question(content(code, QuestionFormat::Date, cf(&format!("question.{code}.text"), [])), optional_future_date_details())
}

fn type_of_settled_accommodation_revealed() -> RevealedQuestion {
    let code = question::type_of_settled_accommodation;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    revealed_question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                o(option::homeowner, "HOMEOWNER"),
                o(option::friends_or_family, "FRIENDS_OR_FAMILY"),
                o(option::renting_privately, "RENTING_PRIVATELY"),
                o(option::renting_other, "RENTING_OTHER"),
                o(option::residential_healthcare, "RESIDENTIAL_HEALTHCARE"),
                o(option::supported_accommodation, "SUPPORTED_ACCOMMODATION"),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        radio_details(Some("govuk-visually-hidden")),
    )
}

fn type_of_temporary_accommodation_revealed() -> RevealedQuestion {
    let code = question::type_of_temporary_accommodation;
    let key = |label: &str| format!("question.{code}.option.{label}");
    revealed_question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                opt(option::approved_premises, cf(&key("APPROVED_PREMISES"), [])).reveals(end_date_revealed(question::approved_premises_end_date)),
                opt(option::cas2, cf(&key("CAS2"), [])).reveals(end_date_revealed(question::cas2_end_date)),
                opt(option::cas3, cf(&key("CAS3"), [])).reveals(end_date_revealed(question::cas3_end_date)),
                opt(option::immigration, cf(&key("IMMIGRATION.text"), []))
                    .hint(obj! { "html": cf(&key("IMMIGRATION.hint"), []) })
                    .reveals(end_date_revealed(question::immigration_accommodation_end_date)),
                opt(option::short_term, cf(&key("SHORT_TERM.text"), []))
                    .hint(cf(&key("SHORT_TERM.hint"), []))
                    .reveals(end_date_revealed(question::short_term_accommodation_end_date)),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        radio_details(Some("govuk-visually-hidden")),
    )
}

fn type_of_no_accommodation_revealed() -> RevealedQuestion {
    let code = question::type_of_no_accommodation;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    revealed_question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                o(option::campsite, "CAMPSITE"),
                o(option::emergency_hostel, "EMERGENCY_HOSTEL"),
                o(option::homeless, "HOMELESS"),
                o(option::rough_sleeping, "ROUGH_SLEEPING"),
                o(option::shelter, "SHELTER"),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        radio_details(Some("govuk-visually-hidden")),
    )
}

const TEMPORARY_ACCOMMODATION_END_DATES: [(&str, &str); 5] = [
    (option::approved_premises, question::approved_premises_end_date),
    (option::cas2, question::cas2_end_date),
    (option::cas3, question::cas3_end_date),
    (option::immigration, question::immigration_accommodation_end_date),
    (option::short_term, question::short_term_accommodation_end_date),
];

fn current_accommodation() -> QuestionDef {
    let code = question::current_accommodation;
    let key = |label: &str| format!("question.{code}.option.{label}");
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .options(vec![
                opt(option::settled, cf(&key("SETTLED"), [])).reveals(type_of_settled_accommodation_revealed()),
                opt(option::temporary, cf(&key("TEMPORARY"), [])).reveals(type_of_temporary_accommodation_revealed()),
                opt(option::no_accommodation, cf(&key("NO_ACCOMMODATION"), [])).reveals(type_of_no_accommodation_revealed()),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().legend_classes("govuk-fieldset__legend--l"))),
            // Bespoke row: the revealed type radios show their selected label, and the temporary
            // types append a formatted "expected end date" line.
            (
                "summaryRow",
                mode(|content| {
                    let mut blocks = vec![govuk::BODY.build(obj! {
                        "text": generators::get_text_from_list_definition(content.entries(), answer(content.code.clone())),
                    })];
                    for revealed in [type_of_settled_accommodation_revealed(), type_of_temporary_accommodation_revealed(), type_of_no_accommodation_revealed()] {
                        blocks.push(govuk::BODY.build(obj! {
                            "text": generators::get_text_from_list_definition(revealed.content.entries(), answer(revealed.content.code.clone())),
                            "size": "s",
                            "visibleWhen": answer(revealed.content.code.clone()).matches(condition::is_required()),
                        }));
                    }
                    blocks.push(govuk::BODY.build(obj! {
                        "text": cf("expected_end_date", []),
                        "size": "s",
                        "visibleWhen": and(vec![
                            not(answer(question::type_of_temporary_accommodation).matches(condition::equals(common_option::unknown))),
                            temporary_accommodation(),
                        ]),
                    }));
                    for (option_value, end_date_code) in TEMPORARY_ACCOMMODATION_END_DATES {
                        blocks.push(govuk::BODY.build(obj! {
                            "text": generators::get_formatter_date_from_iso(answer(end_date_code)),
                            "size": "s",
                            "visibleWhen": answer(question::type_of_temporary_accommodation).matches(condition::equals(option_value)),
                        }));
                    }
                    obj! {
                        "key": obj! { "text": content.text.clone() },
                        "value": obj! { "blocks": blocks },
                        "actions": change_link_actions(step::accommodation_status.path, &content.code, &content.text),
                    }
                }),
            ),
        ],
    )
}

fn living_with_applies() -> Value {
    or(vec![
        answer(question::type_of_temporary_accommodation).matches(condition::equals(option::immigration)),
        answer(question::type_of_temporary_accommodation).matches(condition::equals(option::short_term)),
        settled_accommodation(),
    ])
}

fn living_with() -> QuestionDef {
    let code = question::living_with;
    let key = |label: &str| format!("question.{code}.option.{label}");
    question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                opt(option::family, cf(&key("FAMILY"), [])),
                opt(option::friends, cf(&key("FRIENDS"), [])),
                opt(option::partner, cf(&key("PARTNER"), [])).reveals(optional_details_with(
                    question::living_with_partner_details,
                    cf("question.living_with_partner_details.hint", []),
                    C2000,
                )),
                opt(option::person_under_18, cf(&key("PERSON_UNDER_18"), [])),
                opt(common_option::other, cc("option.OTHER", [])).reveals(optional_details(question::living_with_other_details)),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
                divider(cc("or", [])),
                opt(option::alone, cf(&key("ALONE"), [])).exclusive(),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", checkbox_field(FieldPlacement::new().dependent_when(living_with_applies()).visible_when(living_with_applies()))),
            ("summaryRow", itemised_summary_row(details_summary().visible_when(living_with_applies()))),
        ],
    )
}

fn no_accommodation_reason() -> QuestionDef {
    let code = question::no_accommodation_reason;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(obj! { "html": cf(&format!("question.{code}.hint"), []) })
            .options(vec![
                o(option::alcohol_problems, "ALCOHOL_PROBLEMS"),
                o(option::drug_problems, "DRUG_PROBLEMS"),
                o(option::financial_difficulties, "FINANCIAL_DIFFICULTIES"),
                o(option::risk_to_others, "RISK_TO_OTHERS"),
                o(option::safety, "SAFETY"),
                o(option::prison_release, "PRISON_RELEASE"),
                opt(common_option::other, cc("option.OTHER", []))
                    .reveals(required_details(question::no_accommodation_reason_other_details, cc("validation.enter_details", []))),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", checkbox_field(FieldPlacement::new().dependent_when(no_accommodation()).visible_when(no_accommodation()))),
            ("summaryRow", itemised_summary_row(details_summary().visible_when(no_accommodation()))),
        ],
    )
}

fn past_accommodation_details() -> QuestionDef {
    let code = question::past_accommodation_details;
    question(
        content(code, QuestionFormat::Text, cf(&format!("question.{code}.text"), [case_data::forename()])),
        vec![
            ("field", character_count_field(count_placement(C2000).dependent_when(no_accommodation()).visible_when(no_accommodation()))),
            ("summaryRow", text_summary_row(details_summary().visible_when(answer(code).matches(condition::is_required())))),
        ],
    )
}

fn suitable_housing_location() -> QuestionDef {
    let concerns = question::suitable_housing_location_concerns;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{concerns}.option.{label}"), []));
    let concerns_revealed = revealed_question(
        content(concerns, QuestionFormat::Checkbox, cf(&format!("question.{concerns}.text"), []))
            .hint(cc("select_all_that_apply_optional", []))
            .options(vec![
                o(option::criminal_associates, "CRIMINAL_ASSOCIATES"),
                o(option::victimisation, "VICTIMISATION"),
                o(option::victim_proximity, "VICTIM_PROXIMITY"),
                o(option::neighbour_difficulty, "NEIGHBOUR_DIFFICULTY"),
                o(option::area_safety, "AREA_SAFETY"),
                opt(common_option::other, cc("option.OTHER", []))
                    .reveals(required_details(question::suitable_housing_location_concerns_other_details, cc("validation.enter_details", []))),
            ]),
        checkbox_details(Some("govuk-visually-hidden")),
    );
    let code = question::suitable_housing_location;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .options(yes_no(None, Some(concerns_revealed)))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(has_accommodation()).visible_when(has_accommodation()))),
            ("summaryRow", itemised_summary_row(details_summary().visible_when(has_accommodation()))),
        ],
    )
}

/// The housing-concern checkboxes ask the same concerns under different codes, depending on
/// whether the housing is suitable-with-concerns or unsuitable.
fn housing_concerns_revealed(code: &str, other_details_code: &str) -> RevealedQuestion {
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.suitable_housing_concerns.option.{label}"), []));
    revealed_question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), []))
            .hint(cc("select_all_that_apply_optional", []))
            .options(vec![
                o(option::facilities, "FACILITIES"),
                o(option::overcrowding, "OVERCROWDING"),
                o(option::exploitation, "EXPLOITATION"),
                o(option::safety, "SAFETY"),
                o(option::lives_with_victim, "LIVES_WITH_VICTIM"),
                o(option::victimisation, "VICTIMISATION"),
                opt(common_option::other, cc("option.OTHER", [])).reveals(required_details(other_details_code, cc("validation.enter_details", []))),
            ]),
        checkbox_details(Some("govuk-visually-hidden")),
    )
}

fn suitable_housing() -> QuestionDef {
    let code = question::suitable_housing;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename_possessive()]))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])),
                opt(option::yes_with_concerns, cf(&format!("question.{code}.option.YES_WITH_CONCERNS"), []))
                    .reveals(housing_concerns_revealed(question::suitable_housing_concerns, question::suitable_housing_concerns_other_details)),
                opt(common_option::no, cc("option.NO", []))
                    .reveals(housing_concerns_revealed(question::unsuitable_housing_concerns, question::unsuitable_housing_concerns_other_details)),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(has_accommodation()).visible_when(has_accommodation()))),
            ("summaryRow", itemised_summary_row(details_summary().visible_when(has_accommodation()))),
        ],
    )
}

fn future_accommodation_type_revealed() -> RevealedQuestion {
    let code = question::future_accommodation_type;
    let key = |label: &str| format!("question.{code}.option.{label}");
    let enter_details = || cc("validation.enter_details", []);
    revealed_question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                opt(option::awaiting_assessment, cf(&key("AWAITING_ASSESSMENT"), []))
                    .reveals(required_details(question::future_accommodation_type_awaiting_assessment_details, enter_details())),
                opt(option::awaiting_placement, cf(&key("AWAITING_PLACEMENT"), []))
                    .reveals(required_details(question::future_accommodation_type_awaiting_placement_details, enter_details())),
                opt(option::buying_house, cf(&key("BUYING_HOUSE"), [])),
                opt(option::living_with_friends_or_family, cf(&key("LIVING_WITH_FRIENDS_OR_FAMILY"), [])),
                opt(option::rent_privately, cf(&key("RENT_PRIVATELY"), [])),
                opt(option::rent_social, cf(&key("RENT_SOCIAL"), [])),
                opt(option::residential_healthcare, cf(&key("RESIDENTIAL_HEALTHCARE"), [])),
                opt(option::supported_accommodation, cf(&key("SUPPORTED_ACCOMMODATION"), [])),
                opt(common_option::other, cc("option.OTHER", [])).reveals(required_details_with(
                    question::future_accommodation_type_other_details,
                    enter_details(),
                    cf("question.future_accommodation_type_other_details.hint", []),
                    C2000,
                )),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        radio_details(Some("govuk-visually-hidden")),
    )
}

fn suitable_housing_planned() -> QuestionDef {
    let code = question::suitable_housing_planned;
    let applies = || or(vec![temporary_accommodation(), no_accommodation()]);
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).reveals(future_accommodation_type_revealed()),
                opt(common_option::no, cc("option.NO", [])),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(applies()).visible_when(applies()))),
            ("summaryRow", itemised_summary_row(details_summary().visible_when(answer(code).matches(condition::is_required())))),
        ],
    )
}

fn changes() -> QuestionDef {
    let code = question::accommodation_changes;
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .hint(cf(&format!("question.{code}.hint"), [case_data::forename()]))
            .options(changes_options(code))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", itemised_summary_row(details_summary()))],
    )
}

pub fn section() -> &'static SectionDefinition {
    static SECTION_DEF: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION_DEF.get_or_init(|| {
        let analysis_summary = || itemised_summary_row(row_placement(step::accommodation_summary.path));
        let c = accommodation();
        SectionDefinition::new(SECTION.code)
            .question("currentAccommodation", current_accommodation())
            .question("livingWith", living_with())
            .question("noAccommodationReason", no_accommodation_reason())
            .question("pastAccommodationDetails", past_accommodation_details())
            .question("suitableHousingLocation", suitable_housing_location())
            .question("suitableHousing", suitable_housing())
            .question("suitableHousingPlanned", suitable_housing_planned())
            .question("changes", changes())
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(c, question::accommodation_practitioner_analysis_strengths_or_protective_factors, true, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfSeriousHarm",
                practitioner_analysis_question(c, question::accommodation_practitioner_analysis_risk_of_serious_harm, false, C1425, analysis_summary()),
            )
            .analysis(
                "riskOfReoffending",
                practitioner_analysis_question(c, question::accommodation_practitioner_analysis_risk_of_reoffending, false, C1000, analysis_summary()),
            )
    })
}
