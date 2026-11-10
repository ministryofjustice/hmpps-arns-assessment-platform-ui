//! The v1 display modes and reveal patterns.

use super::common_option;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::conditions;
use crate::forms::strengths_and_needs::constants::character_limit;
use crate::forms::strengths_and_needs::constants::question_content::*;
use crate::forms::strengths_and_needs::generators;
use crate::forms::strengths_and_needs::i18n::get_display_text_for_items;
use crate::forms::strengths_and_needs::transformers;
use crate::forms::strengths_and_needs::v1::guards::is_edit_mode;
use crate::forms::strengths_and_needs::v1::locales::common_content_for;

fn character_count_validations_of(content: &QuestionContent, max_length: i64) -> Value {
    let mut rules = match required_validation_of(content) {
        Value::Array(a) => a.to_vec(),
        _ => vec![],
    };
    rules.push(validation(obj! {
        "condition": when_answered(self_().matches(conditions::has_max_length(max_length))),
        "message": common_content_for("validation.details_must_be_less_than", [Value::from(max_length)]),
    }));
    Value::array(rules)
}

/// Placement of a standalone character count.
#[derive(Clone)]
pub struct CharacterCountPlacement {
    pub max_length: i64,
    /// Overrides the rendered label (e.g. "Give details (optional)").
    pub label: Value,
    pub dependent_when: Value,
    pub visible_when: Value,
}

pub fn count_placement(max_length: i64) -> CharacterCountPlacement {
    CharacterCountPlacement { max_length, label: Value::Undefined, dependent_when: Value::Undefined, visible_when: Value::Undefined }
}

impl CharacterCountPlacement {
    pub fn label(mut self, label: impl IntoValue) -> Self {
        self.label = label.into_value();
        self
    }

    pub fn dependent_when(mut self, when: Value) -> Self {
        self.dependent_when = when;
        self
    }

    pub fn visible_when(mut self, when: Value) -> Self {
        self.visible_when = when;
        self
    }
}

/// `characterCountField`: a standalone character count; required when the content carries a
/// validation message.
pub fn character_count_field(placement: CharacterCountPlacement) -> Mode {
    mode(move |content| {
        let label = if placement.label.is_undefined() {
            obj! { "text": content.text.clone(), "classes": "govuk-label--m" }
        } else {
            placement.label.clone()
        };
        govuk::CHARACTER_COUNT.build(defined(obj! {
            "code": content.code.clone(),
            "formGroup": question_form_group_of(&content.code),
            "label": label,
            "hint": content.hint.clone(),
            "maxLength": placement.max_length,
            "dependentWhen": placement.dependent_when.clone(),
            "visibleWhen": placement.visible_when.clone(),
            "validWhen": character_count_validations_of(content, placement.max_length),
            "parsers": [transformers::decode_html_entities()],
            "formatters": [transformers::encode_html_entities()],
        }))
    })
}

/// `characterCountDetails`: a character count under its parent option.
pub fn character_count_details(max_length: i64) -> DetailsMode {
    details_mode(move |content, parent| {
        govuk::CHARACTER_COUNT.build(defined(obj! {
            "code": content.code.clone(),
            "formGroup": question_form_group_of(&content.code),
            "label": content.text.clone(),
            "hint": content.hint.clone(),
            "maxLength": max_length,
            "dependentWhen": parent.selected_when.clone(),
            "validWhen": character_count_validations_of(content, max_length),
            "parsers": [transformers::decode_html_entities()],
            "formatters": [transformers::encode_html_entities()],
        }))
    })
}

/// A step path anchored to one of its questions.
pub fn change_href_of(step_path: impl IntoValue, code: &Value) -> Value {
    format("%1#%2", [step_path.into_value(), question_id_of(code)]).into()
}

/// The "Change" action for a summary row, in edit mode only.
pub fn change_link_actions(step_path: &str, code: &Value, text: &Value) -> Value {
    when(is_edit_mode())
        .then(obj! {
            "items": [obj! {
                "href": change_href_of(step_path, code),
                "text": common_content_for("change", []),
                "visuallyHiddenText": text.clone(),
            }],
        })
        .otherwise(obj! {})
        .into()
}

/// A required free-text reveal: "Give details".
pub fn required_details(code: &str, validation_message: Value) -> RevealedQuestion {
    required_details_with(code, validation_message, Value::Undefined, character_limit::C2000)
}

pub fn required_details_with(code: &str, validation_message: Value, hint: Value, max_length: i64) -> RevealedQuestion {
    revealed_question(
        content(code, QuestionFormat::Text, common_content_for("required_details", [])).hint(hint).validation(validation_message),
        character_count_details(max_length),
    )
}

/// An optional free-text reveal: "Give details (optional)".
pub fn optional_details(code: &str) -> RevealedQuestion {
    optional_details_with(code, Value::Undefined, character_limit::C2000)
}

pub fn optional_details_with(code: &str, hint: Value, max_length: i64) -> RevealedQuestion {
    revealed_question(
        content(code, QuestionFormat::Text, common_content_for("optional_details", [])).hint(hint),
        character_count_details(max_length),
    )
}

/// The standard yes/no options, each optionally revealing a follow-up.
pub fn yes_no(yes: Option<RevealedQuestion>, no: Option<RevealedQuestion>) -> Vec<QOpt> {
    vec![
        opt(common_option::yes, common_content_for("option.YES", [])).reveals_opt(yes),
        opt(common_option::no, common_content_for("option.NO", [])).reveals_opt(no),
    ]
}

/// A date that may be empty, but once started must be complete, valid and in the future.
fn optional_future_date_validations() -> Vec<Value> {
    let missing = |part: &str, message: &str| {
        validation(obj! {
            "condition": not(and(vec![has_any_date_part(), self_().not().matches(condition::object::property_has_value(part))])),
            "message": common_content_for(message, []),
            "details": obj! { "field": part },
        })
    };
    vec![
        missing("day", "validation.valid_date_day"),
        missing("month", "validation.valid_date_month"),
        missing("year", "validation.valid_date_year"),
        validation(obj! { "condition": not(has_all_date_parts()), "message": common_content_for("validation.valid_date", []) }),
        validation(obj! {
            "condition": not(and(vec![
                self_().matches(condition::is_required()),
                self_().not().matches(condition::object::is_object()),
                self_().not().matches(condition::date::is_valid()),
            ])),
            "message": common_content_for("validation.valid_date", []),
        }),
        validation(obj! {
            "condition": not(and(vec![
                self_().matches(condition::is_required()),
                self_().not().matches(condition::object::is_object()),
                self_().matches(condition::date::is_valid()),
                self_().not().matches(condition::date::is_future_date()),
            ])),
            "message": common_content_for("validation.future_date", []),
        }),
    ]
}

/// `optionalFutureDateDetails`: a full date input under its parent option, stored as ISO.
pub fn optional_future_date_details() -> DetailsMode {
    details_mode(|content, parent| {
        govuk::DATE_INPUT_FULL.build(obj! {
            "code": content.code.clone(),
            "formGroup": question_form_group_of(&content.code),
            "fieldset": obj! { "legend": obj! { "text": content.text.clone() } },
            "dependentWhen": parent.selected_when.clone(),
            "formatters": [transformers::to_iso()],
            "validWhen": optional_future_date_validations(),
        })
    })
}

/// `summaryRow`: the stored answer mapped back to its option label, then the answers to any
/// revealed questions, each shown while its option is selected.
pub fn summary_row(placement: SummaryRowPlacement) -> Mode {
    mode(move |content| {
        let mut blocks = vec![govuk::BODY.build(obj! {
            "text": generators::get_text_from_list_definition(content.entries(), answer(content.code.clone())),
        })];
        for option in content.options_of() {
            for revealed in &option.reveals {
                blocks.push(govuk::BODY.build(obj! {
                    "text": answer(revealed.content.code.clone()),
                    "size": "s",
                    "visibleWhen": answer(content.code.clone()).matches(condition::equals(option.value.as_str())),
                }));
            }
        }
        defined(obj! {
            "key": obj! { "html": content.text.clone() },
            "visibleWhen": placement.visible_when.clone(),
            "value": obj! { "blocks": blocks },
            "actions": change_link_actions(&placement.change_href, &content.code, &content.text),
        })
    })
}

fn selected_or_answered(content: &QuestionContent, placement: &SummaryRowPlacement) -> Value {
    let values: Vec<Value> = content.options_of().iter().map(|o| Value::from(o.value.as_str())).collect();
    let mut operands = vec![];
    if !placement.visible_when.is_nullish() {
        operands.push(placement.visible_when.clone());
    }
    operands.push(or(vec![
        and(vec![
            answer(content.code.clone()).matches(condition::array::is_array()),
            answer(content.code.clone()).matches(condition::array::contains_any(Value::array(values))),
        ]),
        answer(content.code.clone()).matches(condition::is_required()),
    ]));
    and(operands)
}

/// `itemisedSummaryRow`: every option label as its own conditionally-visible body, then the
/// answers to the questions the options reveal.
pub fn itemised_summary_row(placement: SummaryRowPlacement) -> Mode {
    mode(move |content| {
        let mut blocks = get_display_text_for_items(content.code_str(), &summary_items_of(content.entries()), None);
        blocks.extend(revealed_answer_blocks_of(content));
        defined(obj! {
            "key": obj! { "text": content.text.clone() },
            "visibleWhen": selected_or_answered(content, &placement),
            "value": obj! { "blocks": blocks },
            "actions": change_link_actions(&placement.change_href, &content.code, &content.text),
        })
    })
}

/// `checkboxSummaryRow`: one line per selected option.
pub fn checkbox_summary_row(placement: SummaryRowPlacement) -> Mode {
    mode(move |content| {
        let blocks: Vec<Value> = content
            .options_of()
            .iter()
            .map(|option| {
                govuk::BODY.build(obj! {
                    "text": option.text.clone(),
                    "visibleWhen": and(vec![
                        answer(content.code.clone()).matches(condition::is_required()),
                        answer(content.code.clone()).matches(condition::array::contains(option.value.as_str())),
                    ]),
                })
            })
            .collect();
        defined(obj! {
            "key": obj! { "html": content.text.clone() },
            "visibleWhen": selected_or_answered(content, &placement),
            "value": obj! { "blocks": blocks },
            "actions": change_link_actions(&placement.change_href, &content.code, &content.text),
        })
    })
}

/// `textSummaryRow`: the answer, verbatim.
pub fn text_summary_row(placement: SummaryRowPlacement) -> Mode {
    mode(move |content| {
        let mut operands = vec![];
        if !placement.visible_when.is_nullish() {
            operands.push(placement.visible_when.clone());
        }
        operands.push(answer(content.code.clone()).matches(condition::is_required()));
        operands.push(answer(content.code.clone()).matches(condition::string::has_min_length(1)));
        defined(obj! {
            "key": obj! { "html": content.text.clone() },
            "visibleWhen": and(operands),
            "value": obj! { "blocks": [govuk::BODY.build(obj! { "text": answer(content.code.clone()) })] },
            "actions": change_link_actions(&placement.change_href, &content.code, &content.text),
        })
    })
}

/// The "changes" options every section asks (made changes ... not applicable), each change
/// revealing optional details coded `<code>_<option>_details`.
pub fn changes_options(code: &str) -> Vec<QOpt> {
    let change = |value: &'static str, label: &str| {
        opt(value, common_content_for(&format!("option.{label}"), []))
            .reveals(optional_details(&format!("{code}_{}_details", value.to_lowercase())))
    };
    vec![
        change(common_option::made_changes, "MADE_CHANGES"),
        change(common_option::making_changes, "MAKING_CHANGES"),
        change(common_option::want_to_make_changes, "WANT_TO_MAKE_CHANGES"),
        change(common_option::needs_help_to_make_changes, "NEEDS_HELP_TO_MAKE_CHANGES"),
        change(common_option::thinking_about_making_changes, "THINKING_ABOUT_MAKING_CHANGES"),
        change(common_option::does_not_want_to_make_changes, "DOES_NOT_WANT_TO_MAKE_CHANGES"),
        change(common_option::does_not_want_to_answer, "DOES_NOT_WANT_TO_ANSWER"),
        divider(common_content_for("or", [])),
        opt(common_option::not_present, common_content_for("option.NOT_PRESENT", [super::form_version::case_data::forename()])),
        opt(common_option::not_applicable, common_content_for("option.NOT_APPLICABLE", [])),
    ]
}

/// Yes/no with required details on yes and optional details on no, as the practitioner
/// analysis questions ask (`<code>_yes_details` / `<code>_no_details`).
pub fn yes_no_with_details(code: &str, yes_validation: Value, max_length: i64) -> Vec<QOpt> {
    yes_no(
        Some(required_details_with(&format!("{code}_yes_details"), yes_validation, Value::Undefined, max_length)),
        Some(optional_details_with(&format!("{code}_no_details"), Value::Undefined, max_length)),
    )
}

/// The practitioner analysis questions every section asks (strengths or protective factors,
/// risk of serious harm, risk of reoffending): yes/no with details, worded from the section's
/// content as `question.<code>.text` with the possessive forename.
pub fn practitioner_analysis_question(
    content_for: &crate::forms::strengths_and_needs::i18n::Content,
    code: &str,
    with_hint: bool,
    max_length: i64,
    summary_row: Mode,
) -> QuestionDef {
    let cf = |key: String| -> Value { content_for.get(&key, []).into() };
    let text: Value =
        content_for.get(&format!("question.{code}.text"), [super::form_version::case_data::forename_possessive()]).into();
    let hint = if with_hint { cf(format!("question.{code}.hint")) } else { Value::Undefined };
    question(
        content(code, QuestionFormat::Radio, text)
            .hint(hint)
            .options(yes_no_with_details(code, cf(format!("question.{code}_yes_details.validation")), max_length))
            .validation(cf(format!("question.{code}.validation"))),
        vec![("field", radio_field(FieldPlacement::new())), ("summaryRow", summary_row)],
    )
}
