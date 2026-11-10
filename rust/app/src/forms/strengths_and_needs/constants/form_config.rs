//! The per-version field inventory the OASys data mapping hook
//! sends, built from the sections' questions.

use forge_core::Value;
use forge_core::value::Map;

use super::question_content::{QuestionContent, SectionDefinition, collections_of, stable_questions_of};
use crate::forms::strengths_and_needs::v1::constants::section::section_complete;

fn field_options_of(content: &QuestionContent) -> Option<Value> {
    content
        .is_optioned()
        .then(|| Value::array(content.options_of().iter().map(|o| forge_core::obj! { "value": o.value.as_str() }).collect()))
}

fn field(content: &QuestionContent, section: &str, collection: Option<&str>) -> Value {
    let mut f = forge_core::obj! { "code": content.code.clone(), "type": content.format.as_str(), "section": section };
    if let Some(c) = collection {
        f.set("collection", Value::from(c));
    }
    if let Some(options) = field_options_of(content) {
        f.set("options", options);
    }
    f
}

/// `buildFormConfig(version, sections, sectionStatusKeys)`: `{ version, fields }`.
pub fn build_form_config(version: &str, sections: &[SectionDefinition], section_status_keys: &[&str]) -> Value {
    let mut fields = Map::new();
    for section in sections {
        for content in stable_questions_of(section) {
            fields.insert(content.code.to_js_string().into(), field(&content, &section.code, None));
        }
        for (name, questions) in collections_of(section) {
            for content in questions {
                fields.insert(content.code.to_js_string().into(), field(&content, &section.code, Some(&name)));
            }
        }
    }
    for key in section_status_keys {
        fields.insert(
            (*key).into(),
            forge_core::obj! {
                "code": *key,
                "type": "RADIO",
                "options": section_complete::ALL.iter().map(|v| forge_core::obj! { "value": *v }).collect::<Vec<_>>(),
            },
        );
    }
    forge_core::obj! { "version": version, "fields": Value::object(fields) }
}
