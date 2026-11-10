//! Content-first question authoring.
//!
//! A section declares each question's content (code, text, options, validation message) once,
//! with the display modes that project it onto each surface it appears on: an editable field on
//! its step, a read-only row on the summary. Steps then compose projections; they never restate
//! content.
//!
//! - [`question`]: a standalone question; its display modes hold the projected blocks.
//! - [`revealed_question`]: a question revealed by a parent option (attach it with
//!   [`QOpt::reveals`]); the parent's projection supplies the reveal wiring.
//! - [`QuestionTemplate`]: one question asked once per parameter value (e.g. per drug).
//! - The display modes ([`radio_field`], [`checkbox_details`], ...) take the *placement* (where
//!   the question sits) and return a function of content.
//! - [`stable_questions_of`] walks a section and lists every question it can ask.
//!
//! Gating note: `dependentWhen` is what Forge uses to skip validation and clear answers for
//! questions that don't apply; `visibleWhen` only hides. A field hidden by a condition should
//! normally carry the same expression in both.

use std::sync::Arc;

use indexmap::IndexMap;

use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators;
use crate::forms::strengths_and_needs::i18n::{get_display_text_for_items, get_display_text_for_specific_item};

#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum QuestionFormat {
    Radio,
    Checkbox,
    Text,
    Date,
    Select,
}

impl QuestionFormat {
    pub fn as_str(self) -> &'static str {
        match self {
            QuestionFormat::Radio => "RADIO",
            QuestionFormat::Checkbox => "CHECKBOX",
            QuestionFormat::Text => "TEXT",
            QuestionFormat::Date => "DATE",
            QuestionFormat::Select => "SELECT",
        }
    }
}

/// An editable projection of a question.
pub type Mode = Arc<dyn Fn(&QuestionContent) -> Value + Send + Sync>;
/// A projection of a revealed question, given where it sits.
pub type DetailsMode = Arc<dyn Fn(&QuestionContent, &ParentOption) -> Value + Send + Sync>;

/// `mode(|content| ...)`.
pub fn mode(f: impl Fn(&QuestionContent) -> Value + Send + Sync + 'static) -> Mode {
    Arc::new(f)
}

/// `details_mode(|content, parent| ...)`.
pub fn details_mode(f: impl Fn(&QuestionContent, &ParentOption) -> Value + Send + Sync + 'static) -> DetailsMode {
    Arc::new(f)
}

/// An option of an optioned question, or a divider (`{ divider }`).
#[derive(Clone, Default)]
pub struct QOpt {
    pub value: String,
    pub text: Value,
    /// HTML label: the field renders it instead of `text`; summaries keep `text`.
    pub html: Value,
    /// Wording for the summary when the label alone would lose meaning out of context.
    pub summary_text: Value,
    /// A string (escaped text) or `{ html }`.
    pub hint: Value,
    pub behaviour: Value,
    /// Prevents selecting the option without hiding it.
    pub disabled: Value,
    pub visible_when: Value,
    pub reveals: Vec<RevealedQuestion>,
    pub divider: Option<Value>,
}

/// An option.
pub fn opt(value: &str, text: impl IntoValue) -> QOpt {
    QOpt { value: value.to_string(), text: text.into_value(), ..QOpt::default() }
}

/// `{ divider }`.
pub fn divider(text: impl IntoValue) -> QOpt {
    QOpt { divider: Some(text.into_value()), ..QOpt::default() }
}

impl QOpt {
    pub fn is_divider(&self) -> bool {
        self.divider.is_some()
    }

    pub fn hint(mut self, hint: impl IntoValue) -> Self {
        self.hint = hint.into_value();
        self
    }

    pub fn html(mut self, html: impl IntoValue) -> Self {
        self.html = html.into_value();
        self
    }

    pub fn summary_text(mut self, text: impl IntoValue) -> Self {
        self.summary_text = text.into_value();
        self
    }

    pub fn exclusive(mut self) -> Self {
        self.behaviour = Value::from("exclusive");
        self
    }

    pub fn disabled(mut self, when: Value) -> Self {
        self.disabled = when;
        self
    }

    pub fn visible_when(mut self, when: Value) -> Self {
        self.visible_when = when;
        self
    }

    pub fn reveals(mut self, revealed: RevealedQuestion) -> Self {
        self.reveals.push(revealed);
        self
    }

    /// Adds the revealed question when there is one (`reveals: reveals.yes`).
    pub fn reveals_opt(mut self, revealed: Option<RevealedQuestion>) -> Self {
        self.reveals.extend(revealed);
        self
    }

    /// The option as its object literal (`{ value, text, ... }`), for projections that pass
    /// options to a component as they are.
    pub fn raw(&self) -> Value {
        if let Some(d) = &self.divider {
            return obj! { "divider": d.clone() };
        }
        defined(obj! {
            "value": self.value.as_str(),
            "text": self.text.clone(),
            "html": self.html.clone(),
            "summaryText": self.summary_text.clone(),
            "hint": self.hint.clone(),
            "behaviour": self.behaviour.clone(),
            "disabled": self.disabled.clone(),
            "visibleWhen": self.visible_when.clone(),
        })
    }
}

/// `{ ...option, text: summaryText }` where a summary wording is declared.
pub fn summary_items_of(options: &[QOpt]) -> Vec<QOpt> {
    options
        .iter()
        .map(|o| if !o.is_divider() && o.summary_text.truthy() { QOpt { text: o.summary_text.clone(), ..o.clone() } } else { o.clone() })
        .collect()
}

/// Canonical content for a question: what it asks, how answers are labelled and how invalid
/// input is described.
#[derive(Clone)]
pub struct QuestionContent {
    /// A string, or an expression for template instances over a runtime collection.
    pub code: Value,
    pub id_prefix: Value,
    pub format: QuestionFormat,
    pub text: Value,
    /// A string (escaped text) or `{ html }`.
    pub hint: Value,
    pub validation_message: Value,
    /// `Some` for optioned questions (`'options' in content`), even when empty.
    pub options: Option<Vec<QOpt>>,
    /// The collection item a template instance was projected over.
    pub param: Value,
}

/// Question content.
pub fn content(code: impl IntoValue, format: QuestionFormat, text: impl IntoValue) -> QuestionContent {
    QuestionContent {
        code: code.into_value(),
        id_prefix: Value::Undefined,
        format,
        text: text.into_value(),
        hint: Value::Undefined,
        validation_message: Value::Undefined,
        options: None,
        param: Value::Undefined,
    }
}

impl QuestionContent {
    pub fn hint(mut self, hint: impl IntoValue) -> Self {
        self.hint = hint.into_value();
        self
    }

    pub fn id_prefix(mut self, id_prefix: &str) -> Self {
        self.id_prefix = Value::from(id_prefix);
        self
    }

    pub fn options(mut self, options: Vec<QOpt>) -> Self {
        self.options = Some(options);
        self
    }

    pub fn validation(mut self, message: impl IntoValue) -> Self {
        self.validation_message = message.into_value();
        self
    }

    pub fn is_optioned(&self) -> bool {
        self.options.is_some()
    }

    /// The code as a string (empty for expression codes).
    pub fn code_str(&self) -> &str {
        self.code.as_str().unwrap_or_default()
    }

    /// `content.options` (all entries, dividers included).
    pub fn entries(&self) -> &[QOpt] {
        self.options.as_deref().unwrap_or_default()
    }

    /// `optionsOf`: the options, without dividers.
    pub fn options_of(&self) -> Vec<&QOpt> {
        self.entries().iter().filter(|o| !o.is_divider()).collect()
    }

    /// The options as their object literals (`items: content.options`).
    pub fn raw_options(&self) -> Value {
        Value::array(self.entries().iter().map(QOpt::raw).collect())
    }
}

/// Where a revealed question sits: the option that reveals it, on which parent.
#[derive(Clone)]
pub struct ParentOption {
    pub parent_code: String,
    pub option_value: String,
    /// True when the option is selected (equality for a radio, membership for a checkbox).
    pub selected_when: Value,
}

/// A question conditionally revealed by one of its parent's options.
#[derive(Clone)]
pub struct RevealedQuestion {
    pub content: QuestionContent,
    pub field: DetailsMode,
}

/// `revealedQuestion({ content, displayModes: { field } })`.
pub fn revealed_question(content: QuestionContent, field: DetailsMode) -> RevealedQuestion {
    RevealedQuestion { content, field }
}

/// A question with its display modes applied: `displayModes` holds the projected blocks.
#[derive(Clone)]
pub struct QuestionDef {
    pub content: QuestionContent,
    pub display_modes: IndexMap<&'static str, Value>,
}

impl QuestionDef {
    /// A projected display mode. Asking for one the question doesn't declare is an authoring bug.
    pub fn mode(&self, name: &str) -> Value {
        self.display_modes
            .get(name)
            .cloned()
            .unwrap_or_else(|| panic!("question {} has no {name} display mode", self.content.code.to_js_string()))
    }

    pub fn field(&self) -> Value {
        self.mode("field")
    }

    pub fn summary_row(&self) -> Value {
        self.mode("summaryRow")
    }
}

/// `question({ content, displayModes })`: applies each display mode to the content.
pub fn question(content: QuestionContent, modes: Vec<(&'static str, Mode)>) -> QuestionDef {
    let display_modes = modes.into_iter().map(|(name, project)| (name, project(&content))).collect();
    QuestionDef { content, display_modes }
}

/// Placement of a field within its step, orthogonal to its content.
#[derive(Clone, Default)]
pub struct FieldPlacement {
    pub dependent_when: Value,
    pub visible_when: Value,
    pub legend_classes: Option<&'static str>,
}

impl FieldPlacement {
    pub fn new() -> Self {
        Self { dependent_when: Value::Undefined, visible_when: Value::Undefined, legend_classes: None }
    }

    pub fn dependent_when(mut self, when: Value) -> Self {
        self.dependent_when = when;
        self
    }

    pub fn visible_when(mut self, when: Value) -> Self {
        self.visible_when = when;
        self
    }

    pub fn legend_classes(mut self, classes: &'static str) -> Self {
        self.legend_classes = Some(classes);
        self
    }
}

/// Placement of a summary row.
#[derive(Clone)]
pub struct SummaryRowPlacement {
    pub change_href: String,
    pub visible_when: Value,
}

/// `{ changeHref }`.
pub fn row_placement(change_href: &str) -> SummaryRowPlacement {
    SummaryRowPlacement { change_href: change_href.to_string(), visible_when: Value::Undefined }
}

impl SummaryRowPlacement {
    pub fn visible_when(mut self, when: Value) -> Self {
        self.visible_when = when;
        self
    }
}

/// The id on a question's form group.
pub fn question_id_of(code: &Value) -> Value {
    match code {
        Value::String(s) => Value::from(format!("{s}-question")),
        other => format("%1-question", [other.clone()]).into(),
    }
}

/// Form group id attribute that identifies the question.
pub fn question_form_group_of(code: &Value) -> Value {
    obj! { "attributes": obj! { "id": question_id_of(code) } }
}

pub fn revealed_blocks_of(option: &QOpt, parent_code: &str, selected_when: &Value) -> Value {
    let parent = ParentOption { parent_code: parent_code.to_string(), option_value: option.value.clone(), selected_when: selected_when.clone() };
    let blocks: Vec<Value> = option.reveals.iter().map(|r| (r.field)(&r.content, &parent)).collect();
    if blocks.is_empty() { Value::Undefined } else { Value::array(blocks) }
}

/// `optionHintOf`: `{ html }` hints as they are, anything else as `{ text }`.
pub fn option_hint_of(hint: &Value) -> Value {
    if !hint.truthy() {
        return Value::Undefined;
    }
    match hint {
        Value::Object(o) if o.contains_key("html") => hint.clone(),
        _ => obj! { "text": hint.clone() },
    }
}

/// `itemsOf`: the component items, with each option's revealed questions projected into its
/// conditional reveal block.
pub fn items_of(content: &QuestionContent, selected_when: impl Fn(&QOpt) -> Value) -> Value {
    Value::array(
        content
            .entries()
            .iter()
            .map(|entry| match &entry.divider {
                Some(d) => obj! { "divider": d.clone() },
                None => defined(obj! {
                    "value": entry.value.as_str(),
                    "text": entry.text.clone(),
                    "html": entry.html.clone(),
                    "hint": option_hint_of(&entry.hint),
                    "behaviour": entry.behaviour.clone(),
                    "disabled": entry.disabled.clone(),
                    "visibleWhen": entry.visible_when.clone(),
                    "block": revealed_blocks_of(entry, content.code_str(), &selected_when(entry)),
                }),
            })
            .collect(),
    )
}

fn is_saving() -> Value {
    post("action").matches(condition::equals("save"))
}

/// A missing required answer must not make Forge clear the answers on later pages: the first
/// rule makes this page's own save insist on the answer; the second stops the user moving past
/// the page without it, but lets saves of other pages through.
pub fn required_validations(message: Value) -> Vec<Value> {
    vec![
        validation(obj! { "condition": self_().matches(condition::is_required()), "message": message.clone(), "submissionOnly": true }),
        validation(obj! { "condition": or(vec![is_saving(), self_().matches(condition::is_required())]), "message": message }),
    ]
}

/// Checks the rule only when there's an answer (an empty optional field must not fail rules
/// like max length).
pub fn when_answered(condition: Value) -> Value {
    or(vec![self_().not().matches(condition::is_required()), condition])
}

/// The standard required-answer validation, when the content carries a validation message.
pub fn required_validation_of(content: &QuestionContent) -> Value {
    if content.validation_message.truthy() {
        Value::array(required_validations(content.validation_message.clone()))
    } else {
        Value::Undefined
    }
}

/// `radioField`: an editable radio group.
pub fn radio_field(placement: FieldPlacement) -> Mode {
    mode(move |content| {
        let code = content.code.clone();
        govuk::RADIO_INPUT.build(defined(obj! {
            "code": code.clone(),
            "idPrefix": content.id_prefix.clone(),
            "formGroup": question_form_group_of(if content.id_prefix.is_undefined() { &content.code } else { &content.id_prefix }),
            "fieldset": obj! {
                "legend": obj! {
                    "text": content.text.clone(),
                    "classes": placement.legend_classes.unwrap_or("govuk-fieldset__legend--m"),
                },
            },
            "hint": content.hint.clone(),
            "items": items_of(content, |o| answer(code.clone()).matches(condition::equals(o.value.as_str()))),
            "dependentWhen": placement.dependent_when.clone(),
            "visibleWhen": placement.visible_when.clone(),
            "validWhen": required_validation_of(content),
        }))
    })
}

/// `radioDetails`: a revealed radio group under its parent option. Pass
/// `govuk-visually-hidden` when the option label already states the question.
pub fn radio_details(legend_classes: Option<&'static str>) -> DetailsMode {
    details_mode(move |content, parent| {
        let code = content.code.clone();
        govuk::RADIO_INPUT.build(defined(obj! {
            "code": code.clone(),
            "idPrefix": content.id_prefix.clone(),
            "formGroup": question_form_group_of(if content.id_prefix.is_undefined() { &content.code } else { &content.id_prefix }),
            "fieldset": obj! {
                "legend": defined(obj! { "text": content.text.clone(), "classes": legend_classes }),
            },
            "items": items_of(content, |o| answer(code.clone()).matches(condition::equals(o.value.as_str()))),
            "dependentWhen": parent.selected_when.clone(),
            "validWhen": required_validation_of(content),
        }))
    })
}

fn checkbox_selected(code: &Value, value: &str) -> Value {
    and(vec![
        answer(code.clone()).matches(condition::is_required()),
        answer(code.clone()).matches(condition::array::contains(value)),
    ])
}

/// `checkboxField`: an editable checkbox group (selection is array membership).
pub fn checkbox_field(placement: FieldPlacement) -> Mode {
    mode(move |content| {
        let code = content.code.clone();
        govuk::CHECKBOX_INPUT.build(defined(obj! {
            "code": code.clone(),
            "multiple": true,
            "formGroup": question_form_group_of(&content.code),
            "fieldset": obj! {
                "legend": obj! {
                    "text": content.text.clone(),
                    "classes": placement.legend_classes.unwrap_or("govuk-fieldset__legend--m"),
                },
            },
            "hint": content.hint.clone(),
            "items": items_of(content, |o| checkbox_selected(&code, &o.value)),
            "dependentWhen": placement.dependent_when.clone(),
            "visibleWhen": placement.visible_when.clone(),
            "validWhen": required_validation_of(content),
        }))
    })
}

/// `checkboxDetails`: a revealed checkbox group, without a legend unless `legend_classes`.
pub fn checkbox_details(legend_classes: Option<&'static str>) -> DetailsMode {
    details_mode(move |content, parent| {
        let code = content.code.clone();
        let fieldset = match legend_classes {
            Some(classes) => obj! { "legend": obj! { "text": content.text.clone(), "classes": classes } },
            None => Value::Undefined,
        };
        govuk::CHECKBOX_INPUT.build(defined(obj! {
            "code": code.clone(),
            "multiple": true,
            "formGroup": question_form_group_of(&content.code),
            "fieldset": fieldset,
            "hint": content.hint.clone(),
            "items": items_of(content, |o| checkbox_selected(&code, &o.value)),
            "dependentWhen": parent.selected_when.clone(),
            "validWhen": required_validation_of(content),
        }))
    })
}

/// The answer as a summary reads it (dates formatted).
fn answer_text_of(content: &QuestionContent) -> Value {
    if content.format == QuestionFormat::Date {
        return generators::get_formatter_date_from_iso(answer(content.code.clone())).into();
    }
    answer(content.code.clone()).into()
}

fn is_answered(content: &QuestionContent) -> Value {
    answer(content.code.clone()).matches(condition::is_required())
}

/// True once the question (or anything it revealed) has been answered.
fn answered_within(content: &QuestionContent) -> Value {
    or(questions_within(content).iter().map(is_answered).collect())
}

/// A question's answer, and the answers to everything its options revealed.
fn answer_blocks_of(content: &QuestionContent, size: Option<&str>) -> Vec<Value> {
    if !content.is_optioned() {
        let mut props = obj! { "text": answer_text_of(content), "visibleWhen": answered_within(content) };
        if let Some(size) = size {
            props.set("size", Value::from(size));
        }
        return vec![govuk::BODY.build(props)];
    }
    let summary_items = summary_items_of(content.entries());
    content
        .options_of()
        .into_iter()
        .flat_map(|option| {
            let mut blocks = get_display_text_for_specific_item(content.code_str(), &summary_items, &option.value, size);
            for revealed in &option.reveals {
                blocks.extend(answer_blocks_of(&revealed.content, Some("s")));
            }
            blocks
        })
        .collect()
}

/// The answers beneath a question on the summary, recursively: option labels for optioned
/// reveals (then whatever those reveal), the verbatim answer otherwise.
pub fn revealed_answer_blocks_of(content: &QuestionContent) -> Vec<Value> {
    content
        .options_of()
        .into_iter()
        .flat_map(|option| {
            option.reveals.iter().flat_map(|revealed| {
                let rc = &revealed.content;
                if rc.is_optioned() {
                    let mut blocks = get_display_text_for_items(rc.code_str(), &summary_items_of(rc.entries()), Some("s"));
                    blocks.extend(revealed_answer_blocks_of(rc));
                    blocks
                } else {
                    vec![govuk::BODY.build(obj! {
                        "text": answer(rc.code.clone()),
                        "size": "s",
                        "visibleWhen": answer(rc.code.clone()).matches(condition::is_required()),
                    })]
                }
            })
            .collect::<Vec<_>>()
        })
        .collect()
}

pub fn has_any_date_part() -> Value {
    and(vec![
        self_().matches(condition::object::is_object()),
        or(vec![
            self_().matches(condition::object::property_has_value("day")),
            self_().matches(condition::object::property_has_value("month")),
            self_().matches(condition::object::property_has_value("year")),
        ]),
    ])
}

pub fn has_all_date_parts() -> Value {
    and(vec![
        self_().matches(condition::object::is_object()),
        self_().matches(condition::object::property_has_value("day")),
        self_().matches(condition::object::property_has_value("month")),
        self_().matches(condition::object::property_has_value("year")),
    ])
}

/// A collection-rendered projection of a template instance.
pub type CollectionMode = Arc<dyn Fn(&QuestionContent) -> Value + Send + Sync>;

/// `questionTemplate`: one question asked once per parameter value. `instance(value)` is the
/// concrete question for a static value, as an option's reveal; `over(expr)` and
/// `summary_row_over(expr)` project it across a runtime collection item.
#[derive(Clone)]
pub struct QuestionTemplate {
    pub code: Arc<dyn Fn(&str) -> String + Send + Sync>,
    pub format: QuestionFormat,
    /// Expression twin of `code` for templates rendered over a runtime collection.
    pub code_over: Option<Arc<dyn Fn(&Value) -> Value + Send + Sync>>,
    pub text: Arc<dyn Fn(&Value) -> Value + Send + Sync>,
    pub hint: Value,
    pub options: Vec<QOpt>,
    pub validation_message: Value,
    pub field: Option<DetailsMode>,
    pub collection_field: Option<CollectionMode>,
    pub collection_summary_row: Option<CollectionMode>,
}

impl QuestionTemplate {
    pub fn new(
        code: impl Fn(&str) -> String + Send + Sync + 'static,
        format: QuestionFormat,
        text: impl Fn(&Value) -> Value + Send + Sync + 'static,
    ) -> Self {
        Self {
            code: Arc::new(code),
            format,
            code_over: None,
            text: Arc::new(text),
            hint: Value::Undefined,
            options: vec![],
            validation_message: Value::Undefined,
            field: None,
            collection_field: None,
            collection_summary_row: None,
        }
    }

    pub fn code_over(mut self, f: impl Fn(&Value) -> Value + Send + Sync + 'static) -> Self {
        self.code_over = Some(Arc::new(f));
        self
    }

    pub fn hint(mut self, hint: impl IntoValue) -> Self {
        self.hint = hint.into_value();
        self
    }

    pub fn options(mut self, options: Vec<QOpt>) -> Self {
        self.options = options;
        self
    }

    pub fn validation(mut self, message: impl IntoValue) -> Self {
        self.validation_message = message.into_value();
        self
    }

    pub fn field_mode(mut self, field: DetailsMode) -> Self {
        self.field = Some(field);
        self
    }

    pub fn collection_field_mode(mut self, f: impl Fn(&QuestionContent) -> Value + Send + Sync + 'static) -> Self {
        self.collection_field = Some(Arc::new(f));
        self
    }

    pub fn collection_summary_row_mode(mut self, f: impl Fn(&QuestionContent) -> Value + Send + Sync + 'static) -> Self {
        self.collection_summary_row = Some(Arc::new(f));
        self
    }

    pub fn code_of(&self, instance_value: &str) -> String {
        (self.code)(instance_value)
    }

    /// Content for one instance, without needing a `field` mode.
    pub fn content_of(&self, instance_value: &str) -> QuestionContent {
        QuestionContent {
            code: Value::from(self.code_of(instance_value)),
            id_prefix: Value::Undefined,
            format: self.format,
            text: (self.text)(&Value::from(instance_value)),
            hint: self.hint.clone(),
            validation_message: self.validation_message.clone(),
            options: Some(self.options.clone()),
            param: Value::Undefined,
        }
    }

    fn projection_content_of(&self, param: &Value) -> QuestionContent {
        let code_over = self.code_over.as_ref().expect("Question template has no collection code");
        QuestionContent {
            code: code_over(param),
            id_prefix: Value::Undefined,
            format: self.format,
            text: (self.text)(param),
            hint: self.hint.clone(),
            validation_message: self.validation_message.clone(),
            options: Some(self.options.clone()),
            param: param.clone(),
        }
    }

    pub fn instance(&self, instance_value: &str) -> RevealedQuestion {
        let field = self.field.clone().unwrap_or_else(|| panic!("Question template '{}' has no field display mode", self.code_of(instance_value)));
        RevealedQuestion { content: self.content_of(instance_value), field }
    }

    pub fn over(&self, param: impl IntoValue) -> Value {
        let f = self.collection_field.as_ref().expect("Question template has no collection field projection");
        f(&self.projection_content_of(&param.into_value()))
    }

    pub fn summary_row_over(&self, param: impl IntoValue) -> Value {
        let f = self.collection_summary_row.as_ref().expect("Question template has no collection summary row projection");
        f(&self.projection_content_of(&param.into_value()))
    }
}

/// A repeatable item collection (e.g. victims): one set of codes answered once per item.
#[derive(Clone)]
pub struct CollectionDefinition {
    pub name: String,
    pub questions: Vec<QuestionContent>,
}

/// A section's questions, by name, in authored order.
#[derive(Clone)]
pub struct SectionDefinition {
    pub code: String,
    pub questions: IndexMap<&'static str, QuestionDef>,
    pub practitioner_analysis: IndexMap<&'static str, QuestionDef>,
    /// Per-instance content for templates rendered over a runtime collection (not read by view
    /// all answers; listed so `stable_questions_of` has every stable code).
    pub collection_questions: Vec<QuestionContent>,
    pub collections: Vec<CollectionDefinition>,
}

impl SectionDefinition {
    pub fn new(code: &str) -> Self {
        Self {
            code: code.to_string(),
            questions: IndexMap::new(),
            practitioner_analysis: IndexMap::new(),
            collection_questions: vec![],
            collections: vec![],
        }
    }

    pub fn question(mut self, name: &'static str, q: QuestionDef) -> Self {
        self.questions.insert(name, q);
        self
    }

    pub fn analysis(mut self, name: &'static str, q: QuestionDef) -> Self {
        self.practitioner_analysis.insert(name, q);
        self
    }

    /// `section.questions.<name>`.
    pub fn q(&self, name: &str) -> &QuestionDef {
        self.questions.get(name).unwrap_or_else(|| panic!("section {} has no question {name}", self.code))
    }

    /// `section.practitionerAnalysis.<name>`.
    pub fn pa(&self, name: &str) -> &QuestionDef {
        self.practitioner_analysis.get(name).unwrap_or_else(|| panic!("section {} has no analysis question {name}", self.code))
    }
}

/// The question and everything its options reveal, recursively.
pub fn questions_within(content: &QuestionContent) -> Vec<QuestionContent> {
    let mut out = vec![content.clone()];
    for option in content.options_of() {
        for revealed in &option.reveals {
            out.extend(questions_within(&revealed.content));
        }
    }
    out
}

/// `answerRow`: the question's text, and the answers beneath it.
pub fn answer_row(content: &QuestionContent) -> Value {
    obj! {
        "key": obj! { "html": content.text.clone() },
        "visibleWhen": answered_within(content),
        "value": obj! { "blocks": answer_blocks_of(content, None) },
    }
}

/// Every question a section can ask, in authored order: each followed by what it reveals.
pub fn stable_questions_of(section: &SectionDefinition) -> Vec<QuestionContent> {
    section
        .questions
        .values()
        .chain(section.practitioner_analysis.values())
        .map(|q| &q.content)
        .chain(&section.collection_questions)
        .flat_map(questions_within)
        .collect()
}

/// Every question asked once per item of the section's collections.
pub fn collections_of(section: &SectionDefinition) -> Vec<(String, Vec<QuestionContent>)> {
    section.collections.iter().map(|c| (c.name.clone(), c.questions.iter().flat_map(questions_within).collect())).collect()
}
