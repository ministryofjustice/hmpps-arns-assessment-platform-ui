//! The drug use section.

use std::sync::OnceLock;

use super::constants::{option, question, step};
use super::drugs::{DRUGS_LIST, field_code_string};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::conditions;
use crate::forms::strengths_and_needs::constants::character_limit::{C1000, C1425, C200, C2000};
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::generators;
use crate::forms::strengths_and_needs::transformers;
use crate::forms::strengths_and_needs::v1::constants::common_option;
use crate::forms::strengths_and_needs::v1::constants::form_version::case_data;
use crate::forms::strengths_and_needs::v1::constants::question_content::*;
use crate::forms::strengths_and_needs::v1::constants::section::DRUG_USE as SECTION;
use crate::forms::strengths_and_needs::v1::guards::is_edit_mode;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for as cc, drug_use as drug_use_content};

pub fn cf(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    drug_use_content().get(code, replacements).into()
}

/// `drugValueToText`: the drug's name.
pub fn drug_value_to_text(value: &Value) -> Value {
    match value.as_str() {
        Some(v) => cf(&format!("option.{v}"), []),
        None => drug_use_content().expr(format("option.%1", [value.clone()]).into(), []).into(),
    }
}

pub fn any_drug_used_in_last_six() -> Value {
    data("drugsUsedInLastSix").matches(condition::is_required())
}

pub fn any_drug_used_more_than_six() -> Value {
    data("drugsUsedMoreThanSix").matches(condition::is_required())
}

fn any_injectable_selected_drugs() -> Value {
    data("injectableSelectedDrugs").matches(condition::is_required())
}

/// The drug (a collection item's lower-case value) was used in the last 6 months.
pub fn drug_used_in_last_six_months(drug_value: &Value) -> Value {
    answer(format(question::drug_last_used_value, [drug_value.clone()])).matches(condition::equals(option::last_six))
}

/// Answer-based twin of `any_drug_used_in_last_six`, for steps that run before
/// `deriveDrugCategories` has populated the derived data.
fn any_drug_used_in_last_six_months() -> Value {
    or(DRUGS_LIST
        .iter()
        .map(|drug| answer(field_code_string(question::drug_last_used, drug.value)).matches(condition::equals(option::last_six)))
        .collect())
}

/// The summary shows shorter last-used labels than the field's options.
fn last_used_summary_labels() -> Vec<QOpt> {
    vec![opt(option::last_six, cf("option.LAST_SIX", [])), opt(option::more_than_six, cf("option.MORE_THAN_SIX", []))]
}

pub fn drug_last_used() -> &'static QuestionTemplate {
    static T: OnceLock<QuestionTemplate> = OnceLock::new();
    T.get_or_init(|| {
        QuestionTemplate::new(
            |v| field_code_string(question::drug_last_used, v),
            QuestionFormat::Radio,
            |v| cf("question.drug_last_used.text", [drug_value_to_text(v)]),
        )
        .code_over(|v| format(question::drug_last_used_value, [v.clone()]).into())
        .options(vec![
            opt(option::last_six, cf("option.LAST_SIX", [])),
            opt(option::more_than_six, cf("question.drug_last_used.option.MORE_THAN_SIX", [])),
        ])
        .validation(cf("question.drug_last_used.validation", []))
        .field_mode(radio_details(Some("govuk-visually-hidden")))
        .collection_summary_row_mode(|content| {
            obj! {
                "key": obj! { "text": cf("text.lastUsed.text", []) },
                "value": obj! {
                    "text": generators::get_text_from_list_definition(&last_used_summary_labels(), answer(content.code.clone())),
                },
                "actions": change_link_actions(step::drug_use_types.path, &content.code, &cf("text.lastUsed.text", [])),
            }
        })
    })
}

pub fn drug_how_often_used() -> &'static QuestionTemplate {
    static T: OnceLock<QuestionTemplate> = OnceLock::new();
    T.get_or_init(|| {
        let o = |value: &str, label: &str| opt(value, cf(&format!("question.how_often_used_last_six_months.option.{label}"), []));
        QuestionTemplate::new(
            |v| field_code_string(question::how_often_used_last_six_months, v),
            QuestionFormat::Radio,
            |_| cf("question.how_often_used_last_six_months.text", [case_data::forename()]),
        )
        .code_over(|v| format(question::how_often_used_value, [v.clone()]).into())
        .options(vec![
            o(option::daily, "DAILY"),
            o(option::weekly, "WEEKLY"),
            o(option::monthly, "MONTHLY"),
            o(option::occasionally, "OCCASIONALLY"),
        ])
        .validation(cf("question.how_often_used_last_six_months.validation", []))
        .collection_field_mode(|content| {
            govuk::RADIO_INPUT.build(obj! {
                "code": content.code.clone(),
                "formGroup": question_form_group_of(&content.code),
                "classes": "govuk-radios--inline",
                "fieldset": obj! { "legend": obj! { "text": content.text.clone() } },
                "items": content.raw_options(),
                "dependentWhen": drug_used_in_last_six_months(&content.param),
                "validWhen": required_validation_of(content),
            })
        })
        .collection_summary_row_mode(|content| {
            obj! {
                "key": obj! { "text": cf("text.howOften.text", []) },
                "value": obj! { "text": generators::get_text_from_list_definition(content.entries(), answer(content.code.clone())) },
                "visibleWhen": answer(content.code.clone()).matches(condition::is_required()),
                "actions": change_link_actions(step::drug_use_details.path, &content.code, &cf("text.howOften.text", [])),
            }
        })
    })
}

pub fn drug_how_often_used_details() -> &'static QuestionTemplate {
    static T: OnceLock<QuestionTemplate> = OnceLock::new();
    T.get_or_init(|| {
        QuestionTemplate::new(
            |v| question::how_often_used_details.replacen("%1", &v.to_lowercase(), 1),
            QuestionFormat::Text,
            |_| cc("optional_details", []),
        )
        .code_over(|v| format(question::how_often_used_details, [v.clone()]).into())
        .collection_field_mode(|content| {
            govuk::CHARACTER_COUNT.build(obj! {
                "code": content.code.clone(),
                "formGroup": question_form_group_of(&content.code),
                "label": content.text.clone(),
                "maxLength": C2000,
                "dependentWhen": drug_used_in_last_six_months(&content.param),
                "validWhen": [validation(obj! {
                    "condition": when_answered(self_().matches(conditions::has_max_length(C2000))),
                    "message": cc("validation.details_must_be_less_than", [Value::from(C2000)]),
                })],
                "parsers": [transformers::decode_html_entities()],
                "formatters": [transformers::encode_html_entities()],
            })
        })
        .collection_summary_row_mode(|content| {
            obj! {
                "key": obj! { "text": content.text.clone() },
                "value": obj! { "text": answer(content.code.clone()) },
                "visibleWhen": answer(content.code.clone()).matches(condition::is_required()),
                "actions": change_link_actions(step::drug_use_details.path, &content.code, &content.text),
            }
        })
    })
}

fn drugs_injected_months() -> &'static QuestionTemplate {
    static T: OnceLock<QuestionTemplate> = OnceLock::new();
    T.get_or_init(|| {
        QuestionTemplate::new(
            |v| field_code_string(question::drugs_injected, v),
            QuestionFormat::Checkbox,
            |_| cf("question.drugs_injected_months.text", [case_data::forename()]),
        )
        .hint(cc("select_one_or_both", []))
        .options(vec![opt(option::last_six, cf("option.IN_THE_LAST_SIX", [])), opt(option::more_than_six, cf("option.MORE_THAN_SIX", []))])
        .validation(cf("question.drugs_injected_months.validation", []))
        // Bespoke: the months question only applies while the drug was last used in the last
        // 6 months, which reaches outside the parent option.
        .field_mode(details_mode(|content, parent| {
            let last_used = drug_last_used().code_of(&parent.option_value);
            govuk::CHECKBOX_INPUT.build(obj! {
                "code": content.code.clone(),
                "formGroup": question_form_group_of(&content.code),
                "fieldset": obj! { "legend": obj! { "text": content.text.clone(), "classes": "govuk-fieldset__legend--m" } },
                "hint": content.hint.clone(),
                "items": content.raw_options(),
                "dependentWhen": and(vec![
                    answer(question::drugs_injected).matches(condition::is_required()),
                    answer(question::drugs_injected).matches(condition::array::contains(parent.option_value.as_str())),
                    answer(last_used.as_str()).matches(condition::equals(option::last_six)),
                ]),
                "visibleWhen": answer(last_used.as_str()).matches(condition::equals(option::last_six)),
                "validWhen": required_validation_of(content),
            })
        }))
    })
}

fn other_drug_name_revealed() -> RevealedQuestion {
    revealed_question(
        content(question::other_drug_name, QuestionFormat::Text, cf("question.other_drug_name.text", []))
            .hint(cf("question.other_drug_name.hint", []))
            .validation(cf("question.other_drug_name.text", [])),
        details_mode(|content, parent| {
            let mut rules = required_validations(content.validation_message.clone());
            rules.push(validation(obj! {
                "condition": when_answered(self_().matches(condition::string::has_max_length(C200))),
                "message": cf("question.other_drug_name.validation", [Value::from(C200)]),
            }));
            govuk::TEXT_INPUT.build(obj! {
                "code": content.code.clone(),
                "formGroup": question_form_group_of(&content.code),
                "label": obj! { "text": content.text.clone(), "classes": "govuk-visually-hidden" },
                "hint": content.hint.clone(),
                "dependentWhen": parent.selected_when.clone(),
                "validWhen": rules,
            })
        }),
    )
}

fn injected_drug_option(drug_value: &str, text: Value) -> QOpt {
    opt(drug_value, text)
        .visible_when(answer(question::select_misused_drugs).matches(condition::array::contains(drug_value)))
        .reveals(drugs_injected_months().instance(drug_value))
}

fn drug_use_question() -> QuestionDef {
    question(
        content(question::drug_use, QuestionFormat::Radio, cf("question.drug_use.text", [case_data::forename()]))
            .hint(cf("question.drug_use.hint", []))
            .options(vec![opt(common_option::yes, cc("option.YES", [])), opt(common_option::no, cc("option.NO", []))])
            .validation(cf("question.drug_use.validation", [])),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", summary_row(row_placement(step::drug_use_status.path)))],
    )
}

/// "Other" is a placeholder on the drug list; the real name was typed in.
fn drug_name(drug_value: &str) -> Value {
    if drug_value == option::other_drug {
        return answer(question::other_drug_name).into();
    }
    drug_value_to_text(&Value::from(drug_value))
}

/// Every drug named, with what was said about it (view all answers).
fn drug_answers(drug_value: &str) -> Value {
    let named = |label: Value, code: &str, text: Value| {
        obj! {
            "key": obj! { "text": label },
            "value": obj! { "blocks": [govuk::BODY.build(obj! { "text": text, "size": "s" })] },
            "visibleWhen": answer(code).matches(condition::is_required()),
        }
    };
    let last_used = field_code_string(question::drug_last_used, drug_value);
    let how_often = field_code_string(question::how_often_used_last_six_months, drug_value);
    let details = question::how_often_used_details.replacen("%1", &drug_value.to_lowercase(), 1);
    govuk::SUMMARY_LIST.build(obj! {
        "classes": "govuk-summary-list--no-border summary-answer-list",
        "rows": [
            named(
                cf("text.lastUsed.text", []),
                &last_used,
                generators::get_text_from_list_definition(&drug_last_used().options, answer(last_used.as_str())).into(),
            ),
            named(
                cf("text.howOften.text", []),
                &how_often,
                generators::get_text_from_list_definition(&drug_how_often_used().options, answer(how_often.as_str())).into(),
            ),
            named(cf("text.howOftenDetails.text", []), &details, answer(details.as_str()).into()),
        ],
    })
}

fn select_misused_drugs_question() -> QuestionDef {
    let drug = |value: &str| opt(value, cf(&format!("option.{value}"), [])).reveals(drug_last_used().instance(value));
    let mut options: Vec<QOpt> = DRUGS_LIST.iter().filter(|d| d.value != option::other_drug).map(|d| drug(d.value)).collect();
    options.push(opt(option::other_drug, cc("option.OTHER", [])).reveals(other_drug_name_revealed()).reveals(drug_last_used().instance(option::other_drug)));
    question(
        content(question::select_misused_drugs, QuestionFormat::Checkbox, cf("question.select_misused_drugs.text", [case_data::forename()]))
            .hint(cf("question.select_misused_drugs.hint", []))
            .options(options)
            .validation(cf("question.select_misused_drugs.validation", [])),
        vec![
            ("field", checkbox_field(FieldPlacement::new())),
            // Each drug chosen, followed by the answers given about that drug.
            (
                "answerRow",
                mode(|content| {
                    let blocks: Vec<Value> = DRUGS_LIST
                        .iter()
                        .flat_map(|drug| {
                            let chosen = answer(content.code.clone()).matches(condition::array::contains(drug.value));
                            [
                                govuk::BODY.build(obj! { "text": drug_name(drug.value), "visibleWhen": chosen.clone() }),
                                spread([drug_answers(drug.value), obj! { "visibleWhen": chosen }]),
                            ]
                        })
                        .collect();
                    obj! {
                        "key": obj! { "html": content.text.clone() },
                        "visibleWhen": answer(content.code.clone()).matches(condition::is_required()),
                        "value": obj! { "blocks": blocks },
                    }
                }),
            ),
        ],
    )
}

fn when_used_last_six(predicate: fn() -> Value, key: &str, replacements: fn() -> Vec<Value>) -> Value {
    when(predicate())
        .then(cf(&format!("{key}.usedLastSixMonths"), replacements()))
        .otherwise(cf(&format!("{key}.notUsedInLastSixMonths"), replacements()))
        .into()
}

fn forename() -> Vec<Value> {
    vec![case_data::forename()]
}

fn none() -> Vec<Value> {
    vec![]
}

fn text_summary(change_href: &str, code: &str) -> Mode {
    text_summary_row(row_placement(change_href).visible_when(answer(code).matches(condition::is_required())))
}

pub fn section() -> &'static SectionDefinition {
    static SECTION_DEF: OnceLock<SectionDefinition> = OnceLock::new();
    SECTION_DEF.get_or_init(|| {
        use question::*;
        let history = step::drug_use_history.path;
        let c = drug_use_content();

        let more_than_six_months_details = question(
            content(not_used_in_last_six_months_details, QuestionFormat::Text, cf("question.not_used_in_last_six_months_details.text", [case_data::forename_possessive()]))
                .hint(cf("question.not_used_in_last_six_months_details.hint", []))
                .validation(cf("question.not_used_in_last_six_months_details.validation", [])),
            vec![
                ("field", character_count_field(count_placement(C2000).dependent_when(any_drug_used_more_than_six()))),
                ("summaryRow", text_summary(step::drug_use_details.path, not_used_in_last_six_months_details)),
            ],
        );

        let mut injected = vec![opt(common_option::none, cc("option.NONE", [])).exclusive(), divider("or")];
        for drug in [
            option::amphetamines,
            option::benzodiazepines,
            option::cocaine,
            option::crack,
            option::heroin,
            option::methadone_not_prescribed,
            option::misused_prescribed_drugs,
            option::other_opiates,
            option::steroids,
        ] {
            injected.push(injected_drug_option(drug, cf(&format!("option.{drug}"), [])));
        }
        injected.push(injected_drug_option(option::other_drug, answer(other_drug_name).into()));
        let drugs_injected_q = question(
            content(drugs_injected, QuestionFormat::Checkbox, cf("question.drugs_injected.text", [case_data::forename()]))
                .hint(cc("select_all_that_apply", []))
                .options(injected)
                .validation(cf("question.drugs_injected.validation", [case_data::forename()])),
            vec![("field", checkbox_field(FieldPlacement::new().dependent_when(any_injectable_selected_drugs())))],
        );

        let receiving_treatment = question(
            content(drugs_is_receiving_treatment, QuestionFormat::Radio, when_used_last_six(any_drug_used_in_last_six, "question.drugs_is_receiving_treatment.text", forename))
                .options(yes_no(
                    Some(required_details(drugs_is_receiving_treatment_yes_details, cf("question.drugs_is_receiving_treatment_yes_details.validation", []))),
                    Some(optional_details(drugs_is_receiving_treatment_no_details)),
                ))
                .validation(when_used_last_six(any_drug_used_in_last_six, "question.drugs_is_receiving_treatment.validation", none)),
            vec![
                ("field", radio_field(FieldPlacement::new())),
                (
                    "summaryRow",
                    summary_row(
                        row_placement(step::drug_use_details.path)
                            .visible_when(and(vec![is_edit_mode(), answer(drugs_reasons_for_use).matches(condition::is_required())])),
                    ),
                ),
            ],
        );

        let reason = |value: &str| opt(value, cf(&format!("question.drugs_reasons_for_use.option.{value}"), []));
        let reasons_for_use = question(
            content(drugs_reasons_for_use, QuestionFormat::Checkbox, when_used_last_six(any_drug_used_in_last_six_months, "question.drugs_reasons_for_use.text", forename))
                .hint(cf("question.drugs_reasons_for_use.hint", []))
                .options(vec![
                    reason(option::cultural_or_religious),
                    reason(option::curiosity_or_experimentation),
                    reason(option::enhance_performance),
                    reason(option::escapism_or_avoidance),
                    reason(option::managing_emotional_issues),
                    reason(option::peer_pressure),
                    reason(option::recreation_or_pleasure),
                    reason(option::self_medication),
                    opt(common_option::other, cc("option.OTHER", [])),
                ])
                .validation(when_used_last_six(any_drug_used_in_last_six_months, "question.drugs_reasons_for_use.validation", none)),
            vec![
                ("field", checkbox_field(FieldPlacement::new())),
                ("summaryRow", checkbox_summary_row(row_placement(history).visible_when(answer(drugs_reasons_for_use).matches(condition::is_required())))),
            ],
        );

        let reasons_for_use_details = question(
            content(
                drugs_reasons_for_use_details,
                QuestionFormat::Text,
                when_used_last_six(any_drug_used_in_last_six_months, "question.drugs_reasons_for_use_details.text", forename),
            ),
            vec![
                ("field", character_count_field(count_placement(C2000).label(cc("optional_details", [])))),
                ("summaryRow", text_summary(history, drugs_reasons_for_use_details)),
            ],
        );

        let affected = |value: &str, hinted: bool| {
            let key = format!("question.drugs_affected_their_life.option.{value}");
            let o = opt(value, cf(&format!("{key}.text"), []));
            if hinted { o.hint(cf(&format!("{key}.hint"), [])) } else { o }
        };
        let affected_their_life = question(
            content(drugs_affected_their_life, QuestionFormat::Checkbox, cf("question.drugs_affected_their_life.text", [case_data::forename_possessive()]))
                .hint(cc("select_all_that_apply", []))
                .options(vec![
                    affected(option::behaviour, true),
                    affected(option::community, true),
                    affected(option::finances, true),
                    affected(option::links_to_offending, false),
                    affected(option::health, true),
                    affected(option::relationships, true),
                    opt(common_option::other, cc("option.OTHER", [])),
                ])
                .validation(cf("question.drugs_affected_their_life.validation", [])),
            vec![
                ("field", checkbox_field(FieldPlacement::new())),
                ("summaryRow", checkbox_summary_row(row_placement(history).visible_when(answer(drugs_affected_their_life).matches(condition::is_required())))),
            ],
        );

        let affected_their_life_details = question(
            content(drugs_affected_their_life_details, QuestionFormat::Text, cf("question.drugs_affected_their_life_details.text", [case_data::forename_possessive()])),
            vec![
                ("field", character_count_field(count_placement(C2000).label(cc("optional_details", [])))),
                ("summaryRow", text_summary(history, drugs_affected_their_life_details)),
            ],
        );

        let anything_helped = question(
            content(drugs_anything_helped_stop_or_reduce_use, QuestionFormat::Text, cf("question.drugs_anything_helped_stop_or_reduce_use.text", [case_data::forename()]))
                .hint(cf("question.drugs_anything_helped_stop_or_reduce_use.hint", [])),
            vec![
                (
                    "field",
                    character_count_field(count_placement(C2000).dependent_when(any_drug_used_in_last_six_months()).visible_when(any_drug_used_in_last_six_months())),
                ),
                ("summaryRow", text_summary(history, drugs_anything_helped_stop_or_reduce_use)),
            ],
        );

        let what_could_help = question(
            content(
                drugs_what_could_help_not_use_drugs_in_future,
                QuestionFormat::Text,
                cf("question.drugs_what_could_help_not_use_drugs_in_future.text", [case_data::forename()]),
            ),
            vec![
                (
                    "field",
                    character_count_field(
                        count_placement(C2000).dependent_when(not(any_drug_used_in_last_six_months())).visible_when(not(any_drug_used_in_last_six_months())),
                    ),
                ),
                ("summaryRow", text_summary(history, drugs_what_could_help_not_use_drugs_in_future)),
            ],
        );

        let drug_use_changes_q = question(
            content(drug_use_changes, QuestionFormat::Radio, cf("question.drug_use_changes.text", [case_data::forename()]))
                .hint(cf("question.drug_use_changes.hint", [case_data::forename()]))
                .options(changes_options(drug_use_changes))
                .validation(cf("question.drug_use_changes.validation", [])),
            vec![
                ("field", radio_field(FieldPlacement::new())),
                ("summaryRow", summary_row(row_placement(history).visible_when(answer(drug_use_changes).matches(condition::is_required())))),
            ],
        );

        let used_drugs = || answer(drug_use).matches(condition::equals(common_option::yes));
        let motivation = |value: &str| opt(value, cf(&format!("question.drugs_practitioner_analysis_motivated_to_stop.option.{value}"), []));
        let motivated_to_stop = question(
            content(
                drugs_practitioner_analysis_motivated_to_stop,
                QuestionFormat::Radio,
                cf("question.drugs_practitioner_analysis_motivated_to_stop.text", [case_data::forename()]),
            )
            .options(vec![
                motivation(option::no_motivation),
                motivation(option::partial_motivation),
                motivation(option::full_motivation),
                opt(common_option::unknown, cc("option.UNKNOWN", [])),
            ])
            .validation(cf("question.drugs_practitioner_analysis_motivated_to_stop.validation", [])),
            vec![
                ("field", radio_field(FieldPlacement::new().dependent_when(used_drugs()).visible_when(used_drugs()))),
                ("summaryRow", summary_row(row_placement(step::drug_use_summary.path).visible_when(used_drugs()))),
            ],
        );

        let analysis_summary = || summary_row(row_placement(step::drug_use_summary.path));
        let mut section = SectionDefinition::new(SECTION.code)
            .question("drugUse", drug_use_question())
            .question("selectMisusedDrugs", select_misused_drugs_question())
            .question("moreThanSixMonthsDetails", more_than_six_months_details)
            .question("drugsInjected", drugs_injected_q)
            .question("receivingTreatment", receiving_treatment)
            .question("reasonsForUse", reasons_for_use)
            .question("reasonsForUseDetails", reasons_for_use_details)
            .question("affectedTheirLife", affected_their_life)
            .question("affectedTheirLifeDetails", affected_their_life_details)
            .question("anythingHelpedStopOrReduce", anything_helped)
            .question("whatCouldHelpNotUseInFuture", what_could_help)
            .question("drugUseChanges", drug_use_changes_q)
            .analysis("motivatedToStop", motivated_to_stop)
            .analysis(
                "strengthsOrProtectiveFactors",
                practitioner_analysis_question(c, drug_use_practitioner_analysis_strengths_or_protective_factors, true, C1425, analysis_summary()),
            )
            .analysis("riskOfSeriousHarm", practitioner_analysis_question(c, drug_use_practitioner_analysis_risk_of_serious_harm, false, C1425, analysis_summary()))
            .analysis("riskOfReoffending", practitioner_analysis_question(c, drug_use_practitioner_analysis_risk_of_reoffending, false, C1000, analysis_summary()));
        // `drugHowOftenUsed` / `drugHowOftenUsedDetails` are rendered per drug over a collection, so
        // walking the reveals can't find their instances: list them as stable questions here.
        section.collection_questions = DRUGS_LIST
            .iter()
            .flat_map(|drug| [drug_how_often_used().content_of(drug.value), drug_how_often_used_details().content_of(drug.value)])
            .collect();
        section
    })
}
