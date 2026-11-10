//! Content lookups that resolve per request from `Accept-Language`.

use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::conditions;
use crate::forms::strengths_and_needs::constants::question_content::QOpt;
use crate::forms::strengths_and_needs::transformers;

/// `Locales`: `{ "<language>": <content object> }`.
pub struct Content {
    locales: Value,
}

impl Content {
    pub fn new(locales: Value) -> Self {
        Self { locales }
    }

    /// `contentFrom(locales)(code, ...replacements)` with a string code: the translation for
    /// each language (`null` where a language has no string at that path), chosen at request time.
    pub fn get(&self, code: &str, replacements: impl IntoIterator<Item = Value>) -> Ex {
        let path: Vec<&str> = code.split('.').collect();
        let mut translations = Map::new();
        if let Some(locales) = self.locales.as_object() {
            for (language, content) in locales.iter() {
                let value = path.iter().fold(content.clone(), |entry, segment| entry.get(segment));
                let value = if matches!(value, Value::String(_)) { value } else { Value::Null };
                translations.insert(language.clone(), value);
            }
        }
        request::headers("accept-language").pipe([transformers::content_value(Value::object(translations), replacements)])
    }

    /// `contentFrom(locales)(code, ...replacements)` with an expression code: the whole locale
    /// set travels with the call and the path is looked up at request time.
    pub fn expr(&self, code: Value, replacements: impl IntoIterator<Item = Value>) -> Ex {
        request::headers("accept-language").pipe([transformers::content_for(self.locales.clone(), code, replacements)])
    }
}

/// A locale file under `v1/locales`, as `{ "en-gb": <content> }`.
pub fn english(json: &str) -> Content {
    let english = serde_json::from_str::<serde_json::Value>(json).expect("locale JSON");
    Content::new(Value::from_pairs([("en-gb", Value::from_json(&english))]))
}

/// Strips HTML tags (`html.replace(/<[^>]*>/g, '')`).
pub fn strip_tags(html: &str) -> String {
    let mut out = String::new();
    let mut in_tag = false;
    let mut pending = String::new();
    for c in html.chars() {
        if in_tag {
            pending.push(c);
            if c == '>' {
                in_tag = false;
                pending.clear();
            }
        } else if c == '<' {
            in_tag = true;
            pending.push(c);
        } else {
            out.push(c);
        }
    }
    // An unclosed `<` doesn't start a tag.
    out + &pending
}

/// `getDisplayTextForItem`: the option label, visible while the answer is (or contains) the
/// option's value.
pub fn get_display_text_for_item(field_code: &str, item: &QOpt, size: Option<&str>) -> Value {
    let text = if item.text.is_undefined() {
        item.html.as_str().map_or(Value::Undefined, |h| Value::from(strip_tags(h)))
    } else {
        item.text.clone()
    };
    let visible_when = or(vec![
        and(vec![
            answer(field_code).matches(conditions::is_array()),
            answer(field_code).matches(condition::array::contains(item.value.as_str())),
        ]),
        and(vec![
            answer(field_code).not().matches(conditions::is_array()),
            answer(field_code).matches(condition::equals(item.value.as_str())),
        ]),
    ]);
    let mut props = obj! { "text": text, "visibleWhen": visible_when };
    if let Some(size) = size {
        props.set("size", Value::from(size));
    }
    govuk::BODY.build(props)
}

/// `getDisplayTextForItems`: one label per (non-divider) option.
pub fn get_display_text_for_items(field_code: &str, items: &[QOpt], size: Option<&str>) -> Vec<Value> {
    items.iter().filter(|i| !i.is_divider()).map(|i| get_display_text_for_item(field_code, i, size)).collect()
}

/// `getDisplayTextForSpecificItem`: the label of the option with `value`.
pub fn get_display_text_for_specific_item(field_code: &str, items: &[QOpt], value: &str, size: Option<&str>) -> Vec<Value> {
    items
        .iter()
        .filter(|i| !i.is_divider() && i.value == value)
        .map(|i| get_display_text_for_item(field_code, i, size))
        .collect()
}
