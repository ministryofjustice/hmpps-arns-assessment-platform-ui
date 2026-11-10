//! The offence analysis section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use super::victims_collection;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::conditions;
use crate::forms::strengths_and_needs::constants::character_limit::{C128, C200, C2000, C4000};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::transformers;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::OFFENCE_ANALYSIS as SECTION;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for as cc, offence_analysis};

pub fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    offence_analysis().get(code, replacements).into()
}

fn enter_details() -> Value {
    cc("validation.enter_details", [])
}

fn main_summary() -> Mode {
    itemised_summary_row(row_placement(step::offence_analysis.path))
}

fn impact_summary() -> Mode {
    itemised_summary_row(row_placement(step::offence_analysis_impact.path))
}

fn text_question(code: &str, hint: bool, max_length: i64, change_href: &str) -> QuestionDef {
    let mut c = content(code, QuestionFormat::Text, cf(&format!("question.{code}.text"), []));
    if hint {
        c = c.hint(cf(&format!("question.{code}.hint"), []));
    }
    question(
        c.validation(enter_details()),
        vec![("field", character_count_field(count_placement(max_length))), ("summaryRow", text_summary_row(row_placement(change_href)))],
    )
}

/// A character count under its parent option with the max length rule (and, when `required`,
/// the required rules after it).
fn details_count(max_length: i64, required: bool, required_first: bool) -> DetailsMode {
    details_mode(move |content, parent| {
        let max_rule = validation(obj! {
            "condition": when_answered(self_().matches(conditions::has_max_length(max_length))),
            "message": cc("validation.details_must_be_less_than", [Value::from(max_length)]),
        });
        let mut rules = vec![];
        if required && required_first {
            rules.extend(required_validations(enter_details()));
            rules.push(max_rule);
        } else {
            rules.push(max_rule);
            if required {
                rules.extend(required_validations(enter_details()));
            }
        }
        govuk::CHARACTER_COUNT.build(obj! {
            "code": content.code.clone(),
            "formGroup": question_form_group_of(&content.code),
            "label": content.text.clone(),
            "maxLength": max_length,
            "dependentWhen": parent.selected_when.clone(),
            "validWhen": rules,
            "parsers": [transformers::decode_html_entities()],
            "formatters": [transformers::encode_html_entities()],
        })
    })
}

fn offence_elements() -> QuestionDef {
    let code = question::offence_analysis_elements;
    let o = |value: &str| opt(value, cf(&format!("question.{code}.option.{value}"), []));
    // The weapon details are a plain (optional) text input, written by hand.
    let weapon_details = revealed_question(
        content(question::offence_weapon_details, QuestionFormat::Text, cf("question.offence_weapon_details.text", [])),
        details_mode(|content, parent| {
            govuk::TEXT_INPUT.build(obj! {
                "code": content.code.clone(),
                "formGroup": question_form_group_of(&content.code),
                "label": obj! { "text": content.text.clone() },
                "dependentWhen": parent.selected_when.clone(),
                "validWhen": [validation(obj! {
                    "condition": when_answered(self_().matches(condition::string::has_max_length(C200))),
                    "message": cf("question.offence_weapon_details.validation", [Value::from(C200)]),
                })],
            })
        }),
    );
    question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), []))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![
                o(option::arson),
                o(option::domestic_abuse),
                o(option::excessive_or_sadistic_violence),
                o(option::hatred_of_identifiable_groups),
                o(option::physical_damage_to_property),
                o(option::sexual_element),
                o(option::victim_targeted).reveals(required_details_with(
                    question::offence_analysis_elements_victim_targeted_details,
                    enter_details(),
                    Value::Undefined,
                    C2000,
                )),
                o(option::violence_or_coercion),
                o(option::weapon).reveals(weapon_details),
                divider("or"),
                opt(common_option::none, cc("option.NONE", [])).exclusive(),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", main_summary())],
    )
}

fn motivations() -> QuestionDef {
    let code = question::offence_analysis_motivations;
    let o = |value: &str| opt(value, cf(&format!("question.{code}.option.{value}"), []));
    question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), []))
            .hint(cf(&format!("question.{code}.hint"), []))
            .options(vec![
                o(option::addictions_or_perceived_needs),
                o(option::pressurised_by_others),
                opt(option::emotional_state, cf(&format!("question.{code}.option.EMOTIONAL_STATE"), [case_data::forename()])),
                o(option::financial_motivation),
                o(option::hatred_of_identifiable_groups),
                o(option::seeking_or_exerting_power),
                o(option::sexual_motivation),
                o(option::thrill_seeking),
                opt(common_option::other, cc("option.OTHER", []))
                    .reveals(required_details_with(question::offence_analysis_motivations_other_details, enter_details(), Value::Undefined, C128)),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", main_summary())],
    )
}

fn offence_commited_against() -> QuestionDef {
    let code = question::offence_analysis_who_was_the_victim;
    let other_details = revealed_question(
        content(question::offence_analysis_who_was_the_victim_other_details, QuestionFormat::Text, cc("required_details", [])),
        details_count(C2000, true, true),
    );
    question(
        content(code, QuestionFormat::Checkbox, cf(&format!("question.{code}.text"), []))
            .hint(cc("select_all_that_apply", []))
            .options(vec![
                opt(option::one_or_more_person, cf(&format!("question.{code}.option.ONE_OR_MORE_PERSON"), [])),
                opt(common_option::other, cc("option.OTHER", []))
                    .hint(cf(&format!("question.{code}.option.OTHER.hint"), []))
                    .reveals(other_details),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", checkbox_field(FieldPlacement::new())), ("summaryRow", main_summary())],
    )
}

fn how_many_involved() -> QuestionDef {
    let code = question::offence_analysis_how_many_involved;
    let o = |value: &str, label: &str| opt(value, cf(&format!("question.{code}.option.{label}"), []));
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                opt(common_option::none, cc("option.NONE", [])),
                o(option::one, "ONE"),
                o(option::two, "TWO"),
                o(option::three, "THREE"),
                o(option::four, "FOUR"),
                o(option::five, "FIVE"),
                o(option::six_to_ten, "SIX_TO_10"),
                o(option::eleven_to_fifteen, "ELEVEN_TO_15"),
                o(option::more_than_fifteen, "MORE_THAN_15"),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new())),
            ("summaryRow", itemised_summary_row(row_placement(step::offence_analysis_involved_parties.path))),
        ],
    )
}

fn leader() -> QuestionDef {
    let code = question::offence_analysis_leader;
    let others_involved = || answer(question::offence_analysis_how_many_involved).not().matches(condition::equals(common_option::none));
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .options(yes_no(
                Some(revealed_question(
                    content(question::offence_analysis_leader_yes_details, QuestionFormat::Text, cc("required_details", [])),
                    details_count(C4000, true, false),
                )),
                Some(revealed_question(
                    content(question::offence_analysis_leader_no_details, QuestionFormat::Text, cc("optional_details", [])),
                    details_count(C4000, false, false),
                )),
            ))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![
            ("field", radio_field(FieldPlacement::new().dependent_when(others_involved()).visible_when(others_involved()))),
            ("summaryRow", impact_summary()),
        ],
    )
}

fn yes_no_optional(code: &str, max_length: i64, forename: bool) -> QuestionDef {
    let replacements = if forename { vec![case_data::forename()] } else { vec![] };
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), replacements))
            .options(yes_no(
                Some(optional_details_with(&format!("{code}_yes_details"), Value::Undefined, max_length)),
                Some(optional_details_with(&format!("{code}_no_details"), Value::Undefined, max_length)),
            ))
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", impact_summary())],
    )
}

fn escalation() -> QuestionDef {
    let mut q = yes_no_optional(question::offence_analysis_escalation, C2000, false);
    let mut c = q.content.clone();
    let mut options = c.options.take().unwrap_or_default();
    options.push(opt(common_option::not_applicable, cc("option.NOT_APPLICABLE", [])));
    c.options = Some(options);
    q = question(c, vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", impact_summary())]);
    q
}

fn domestic_abuse(code: &str, type_code: &str) -> QuestionDef {
    let o = |value: &str, label: &str| {
        opt(value, cf(&format!("option.{label}"), []))
            .reveals(required_details_with(&format!("{type_code}_{}_details", value.to_lowercase()), enter_details(), Value::Undefined, C2000))
    };
    let type_revealed = revealed_question(
        content(type_code, QuestionFormat::Radio, cf(&format!("question.{type_code}.text"), []))
            .options(vec![
                o(option::family_member, "FAMILY_MEMBER"),
                o(option::intimate_partner, "INTIMATE_PARTNER"),
                o(option::family_member_and_intimate_partner, "FAMILY_MEMBER_AND_INTIMATE_PARTNER"),
            ])
            .validation(cf("validation.select_an_option", [])),
        radio_details(None),
    );
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), [case_data::forename()]))
            .options(vec![opt(common_option::yes, cc("option.YES", [])).reveals(type_revealed), opt(common_option::no, cc("option.NO", []))])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", impact_summary())],
    )
}

fn risk() -> QuestionDef {
    let code = question::offence_analysis_risk;
    // Both branches are required, including "no".
    let details = |details_code: &str| revealed_question(content(details_code, QuestionFormat::Text, cc("required_details", [])), details_count(C4000, true, false));
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                opt(common_option::yes, cc("option.YES", [])).reveals(details(question::offence_analysis_risk_yes_details)),
                opt(common_option::no, cc("option.NO", [])).reveals(details(question::offence_analysis_risk_no_details)),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", impact_summary())],
    )
}

// Victims (one item per victim; a repeatable collection) ------------------------------------

fn victim_type() -> QuestionDef {
    let code = question::offence_analysis_victim_relationship;
    let o = |value: &str| opt(value, cf(&format!("question.{code}.option.{value}"), []));
    let pop = |value: &str| opt(value, cf(&format!("question.{code}.option.{value}"), [case_data::forename_possessive()]));
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                o(option::stranger),
                o(option::criminal_justice_staff),
                pop(option::pop_parent_or_step_parent),
                pop(option::pop_partner),
                pop(option::pop_ex_partner),
                pop(option::pop_child_or_step_child),
                o(option::other_family_member),
                opt(common_option::other, cc("option.OTHER", []))
                    .reveals(optional_details_with(question::offence_analysis_victim_relationship_other_details, Value::Undefined, C2000)),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new()))],
    )
}

fn victim_age() -> QuestionDef {
    let code = question::offence_analysis_victim_age;
    let o = |value: &str| opt(value, cf(&format!("question.{code}.option.{value}"), []));
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![
                o(option::age_0_to_4_years),
                o(option::age_5_to_11_years),
                o(option::age_12_to_15_years),
                o(option::age_16_to_17_years),
                o(option::age_18_to_20_years),
                o(option::age_21_to_25_years),
                o(option::age_26_to_49_years),
                o(option::age_50_to_64_years),
                o(option::age_65_and_over),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new()))],
    )
}

fn victim_sex() -> QuestionDef {
    let code = question::offence_analysis_victim_sex;
    let o = |value: &str| opt(value, cf(&format!("question.{code}.option.{value}"), []));
    question(
        content(code, QuestionFormat::Radio, cf(&format!("question.{code}.text"), []))
            .options(vec![o(option::male), o(option::female), o(option::intersex), opt(common_option::unknown, cc("option.UNKNOWN", []))])
            .validation(cf(&format!("question.{code}.validation"), [])),
        vec![("field", radio_field(FieldPlacement::new()))],
    )
}

const ETHNICITIES: [&str; 19] = [
    option::white_english_welsh_scottish_northern_irish_or_british,
    option::white_irish,
    option::white_gypsy_or_irish_traveller,
    option::white_roma,
    option::white_any_other_white_background,
    option::mixed_white_and_black_caribbean,
    option::mixed_white_and_black_african,
    option::mixed_white_and_asian,
    option::mixed_any_other_mixed_or_multiple_ethnic_background_background,
    option::asian_or_asian_british_indian,
    option::asian_or_asian_british_pakistani,
    option::asian_or_asian_british_bangladeshi,
    option::asian_or_asian_british_chinese,
    option::asian_or_asian_british_any_other_asian_background,
    option::black_or_black_british_caribbean,
    option::black_or_black_british_african,
    option::black_or_black_british_any_other_black_background,
    option::arab,
    option::any_other_ethnic_group,
];

/// The select's items, as the page renders them (an empty-value placeholder first).
fn victim_ethnicity_select_items() -> Vec<Value> {
    let code = question::offence_analysis_victim_race;
    let mut items = vec![obj! {
        "value": "",
        "text": cf(&format!("question.{code}.option_label"), []),
        "disabled": true,
        "selected": true,
    }];
    for value in ETHNICITIES {
        items.push(obj! { "text": cf(&format!("question.{code}.option.{value}"), []), "value": value });
    }
    items.push(obj! { "text": cc("option.UNKNOWN", []), "value": common_option::unknown });
    items
}

fn victim_ethnicity() -> QuestionDef {
    let code = question::offence_analysis_victim_race;
    // The options (for the form config): every item's value and text.
    let options: Vec<QOpt> = victim_ethnicity_select_items().iter().map(|i| opt(&i.get("value").to_js_string(), i.get("text"))).collect();
    question(
        content(code, QuestionFormat::Select, cf(&format!("question.{code}.text"), []))
            .validation(cf(&format!("question.{code}.validation"), []))
            .options(options),
        vec![(
            "field",
            mode(|content| {
                govuk::SELECT_INPUT.build(obj! {
                    "code": content.code.clone(),
                    "formGroup": question_form_group_of(&content.code),
                    "label": obj! { "text": content.text.clone(), "classes": "govuk-label--m" },
                    "items": victim_ethnicity_select_items(),
                    "validWhen": required_validations(content.validation_message.clone()),
                })
            }),
        )],
    )
}

/// The victim questions, used directly by the add/edit victim steps.
pub struct VictimQuestions {
    pub victim_type: QuestionDef,
    pub victim_age: QuestionDef,
    pub victim_sex: QuestionDef,
    pub victim_ethnicity: QuestionDef,
}

pub fn victim_questions() -> &'static VictimQuestions {
    static Q: OnceLock<VictimQuestions> = OnceLock::new();
    Q.get_or_init(|| VictimQuestions { victim_type: victim_type(), victim_age: victim_age(), victim_sex: victim_sex(), victim_ethnicity: victim_ethnicity() })
}

pub fn section() -> &'static SectionDefinition {
    static SECTION_DEF: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION_DEF.get_or_init(|| {
        use question::*;
        let v = victim_questions();
        let mut section = SectionDefinition::new(SECTION.code)
            .question("indexOffenceDescription", text_question(offence_analysis_description_of_offence, false, C4000, step::offence_analysis.path))
            .question("offenceElements", offence_elements())
            .question("whyOffenceHappened", text_question(offence_analysis_reason, false, C4000, step::offence_analysis.path))
            .question("motivations", motivations())
            .question("offenceCommitedAgainst", offence_commited_against())
            .question("offenceAnalysisWhoWasTheOffenceCommittedAgainst", how_many_involved())
            .question("offenceAnalysisLeader", leader())
            .question("offenceImpactOnVictims", yes_no_optional(offence_analysis_impact_on_victims, C2000, true))
            .question("offenceAnalysisAcceptResponsibility", yes_no_optional(offence_analysis_accept_responsibility, C4000, true))
            .question("offenceAnalysisEscalation", escalation())
            .question(
                "offenceAnalysisPerpetratorOfDomesticAbuse",
                domestic_abuse(offence_analysis_perpetrator_of_domestic_abuse, offence_analysis_perpetrator_of_domestic_abuse_type),
            )
            .question(
                "offenceAnalysisVictimOfDomesticAbuse",
                domestic_abuse(offence_analysis_victim_of_domestic_abuse, offence_analysis_victim_of_domestic_abuse_type),
            )
            .question("patternsOfOffending", text_question(offence_analysis_patterns_of_offending, true, C4000, step::offence_analysis_impact.path))
            .question("offenceAnalysisRisk", risk());
        // No practitioner analysis step exists for offence analysis yet.
        section.collections = vec![CollectionDefinition {
            name: victims_collection().name.to_string(),
            questions: vec![v.victim_type.content.clone(), v.victim_age.content.clone(), v.victim_sex.content.clone(), v.victim_ethnicity.content.clone()],
        }];
        section
    })
}
