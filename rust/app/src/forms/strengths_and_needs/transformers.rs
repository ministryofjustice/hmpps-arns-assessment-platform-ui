//! SAN's transformers: call builders and implementations.

use chrono::{Datelike, Local, TimeZone, Timelike};
use forge_core::{FunctionEntry, Value};

use super::html_encoder::{escape, unescape};
use crate::transformer;

const DEFAULT_LANGUAGE: &str = "en-gb";

pub fn content_for(locales: Value, path: Value, replacements: impl IntoIterator<Item = Value>) -> Value {
    let mut args = vec![locales, path];
    args.extend(replacements);
    forge_core::authoring::function_call("FunctionType.Transformer", "ContentFor", args)
}

pub fn content_value(translations: Value, replacements: impl IntoIterator<Item = Value>) -> Value {
    let mut args = vec![translations];
    args.extend(replacements);
    forge_core::authoring::function_call("FunctionType.Transformer", "ContentValue", args)
}

pub fn to_iso() -> Value {
    transformer!("ToISO")
}

pub fn json_stringify() -> Value {
    transformer!("JsonStringify")
}

pub fn format_full_date_time() -> Value {
    transformer!("FormatFullDateTime")
}

pub fn format_date() -> Value {
    transformer!("FormatDate")
}

pub fn format_version_status() -> Value {
    transformer!("FormatVersionStatus")
}

pub fn encode_html_entities() -> Value {
    transformer!("EncodeHtmlEntities")
}

pub fn decode_html_entities() -> Value {
    transformer!("DecodeHtmlEntities")
}

/// `language?.split(',')[0]?.toLowerCase() ?? 'en-gb'`.
fn language_from(language: &Value) -> String {
    match language {
        Value::Undefined | Value::Null => DEFAULT_LANGUAGE.into(),
        v => v.to_js_string().split(',').next().unwrap_or_default().to_lowercase(),
    }
}

/// JS `String.prototype.replace(pattern, replacement)` with a string pattern: the first
/// occurrence only, honouring the `$$`, `$&`, `` $` `` and `$'` replacement patterns.
pub fn js_replace_first(subject: &str, pattern: &str, replacement: &str) -> String {
    let Some(at) = subject.find(pattern) else { return subject.to_string() };
    let (before, after) = (&subject[..at], &subject[at + pattern.len()..]);
    let mut expanded = String::new();
    let mut chars = replacement.chars().peekable();
    while let Some(c) = chars.next() {
        if c != '$' {
            expanded.push(c);
            continue;
        }
        match chars.peek() {
            Some('$') => {
                chars.next();
                expanded.push('$');
            }
            Some('&') => {
                chars.next();
                expanded.push_str(pattern);
            }
            Some('`') => {
                chars.next();
                expanded.push_str(before);
            }
            Some('\'') => {
                chars.next();
                expanded.push_str(after);
            }
            _ => expanded.push('$'),
        }
    }
    format!("{before}{expanded}{after}")
}

/// `replaceContent`: `%1`, `%2`, ... replaced (first occurrence each), `NO_TRANSLATION` for
/// anything that isn't a string.
fn replace_content(content: &Value, replacements: &[Value]) -> Value {
    let Value::String(content) = content else { return Value::from("NO_TRANSLATION") };
    let mut result = content.to_string();
    for (index, value) in replacements.iter().enumerate() {
        result = js_replace_first(&result, &format!("%{}", index + 1), &value.to_js_string());
    }
    Value::from(result)
}

fn ordinal_suffix(day: u32) -> &'static str {
    match (day % 10, day % 100) {
        (1, r) if r != 11 => "st",
        (2, r) if r != 12 => "nd",
        (3, r) if r != 13 => "rd",
        _ => "th",
    }
}

/// `DateTime.fromMillis(value)` in the server's time zone, for positive numbers.
fn local_date_time(value: &Value) -> Option<chrono::DateTime<Local>> {
    let Value::Number(ms) = value else { return None };
    if !(*ms > 0.0) || !ms.is_finite() {
        return None;
    }
    Local.timestamp_millis_opt(*ms as i64).single()
}

/// `cccc d<suffix> LLLL yyyy h:mma` with a lower-case meridiem.
pub fn format_full_date_time_value(value: &Value) -> String {
    let Some(dt) = local_date_time(value) else { return String::new() };
    let hour12 = match dt.hour() % 12 {
        0 => 12,
        h => h,
    };
    let meridiem = if dt.hour() < 12 { "am" } else { "pm" };
    format!(
        "{} {}{} {} {} {}:{:02}{}",
        dt.format("%A"),
        dt.day(),
        ordinal_suffix(dt.day()),
        dt.format("%B"),
        dt.format("%Y"),
        hour12,
        dt.minute(),
        meridiem
    )
}

/// `d<suffix> LLLL yyyy`.
pub fn format_date_value(value: &Value) -> String {
    let Some(dt) = local_date_time(value) else { return String::new() };
    format!("{}{} {} {}", dt.day(), ordinal_suffix(dt.day()), dt.format("%B"), dt.format("%Y"))
}

fn pad_start(s: &str, len: usize) -> String {
    let n = forge_core::value::utf16_len(s);
    if n >= len { s.to_string() } else { format!("{}{s}", "0".repeat(len - n)) }
}

fn to_iso_value(value: &Value) -> Value {
    if !matches!(value, Value::Object(_)) {
        return value.clone();
    }
    let (day, month, year) = (value.get("day"), value.get("month"), value.get("year"));
    let empty = |v: &Value| v.as_str() == Some("");
    if empty(&day) && empty(&month) && empty(&year) {
        return Value::from("");
    }
    if !empty(&day) && !empty(&month) && !empty(&year) {
        return Value::from(format!(
            "{}-{}-{}",
            pad_start(&year.to_js_string(), 4),
            pad_start(&month.to_js_string(), 2),
            pad_start(&day.to_js_string(), 2)
        ));
    }
    value.clone()
}

fn version_status(value: &Value) -> Value {
    if !value.truthy() {
        return value.clone();
    }
    let mapped = match value.to_js_string().as_str() {
        "AWAITING_COUNTERSIGN" | "AWAITING_DOUBLE_COUNTERSIGN" => "Awaiting Countersign",
        "CLONED" => "Cloned",
        "COUNTERSIGNED" | "DOUBLE_COUNTERSIGNED" => "Countersigned",
        "CREATED" => "Created",
        "LOCKED" => "Locked",
        "REJECTED" => "Rejected",
        "ROLLED_BACK" => "Rolled Back",
        "SELF_SIGNED" => "Self Signed",
        "UNSIGNED" => "Edited",
        _ => return Value::Undefined,
    };
    Value::from(mapped)
}

pub fn entries() -> Vec<FunctionEntry> {
    vec![
        FunctionEntry::transformer("ContentFor", |language, args| {
            let lang = language_from(language);
            let locales = args.first().cloned().unwrap_or(Value::Undefined);
            let path = args.get(1).map(Value::to_js_string).unwrap_or_default();
            let content = match locales.get(&lang) {
                Value::Undefined | Value::Null => locales.get(DEFAULT_LANGUAGE),
                c => c,
            };
            let raw = path.split('.').fold(content, |acc, segment| if acc.is_nullish() { Value::Undefined } else { acc.get(segment) });
            Ok(replace_content(&raw, args.get(2..).unwrap_or_default()))
        }),
        FunctionEntry::transformer("ContentValue", |language, args| {
            let lang = language_from(language);
            let translations = args.first().cloned().unwrap_or(Value::Undefined);
            // A missing value in a supported locale must not fall back to English.
            let has_language = translations.as_object().is_some_and(|o| o.contains_key(lang.as_str()));
            let raw = if has_language { translations.get(&lang) } else { translations.get(DEFAULT_LANGUAGE) };
            Ok(replace_content(&raw, args.get(1..).unwrap_or_default()))
        }),
        FunctionEntry::transformer("ToISO", |value, _| Ok(to_iso_value(value))),
        FunctionEntry::transformer("JsonStringify", |value, _| {
            Ok(Value::from(serde_json::to_string_pretty(&value.to_json()).unwrap_or_default()))
        }),
        FunctionEntry::transformer("FormatFullDateTime", |value, _| Ok(Value::from(format_full_date_time_value(value)))),
        FunctionEntry::transformer("FormatDate", |value, _| Ok(Value::from(format_date_value(value)))),
        FunctionEntry::transformer("FormatVersionStatus", |value, _| Ok(version_status(value))),
        FunctionEntry::transformer("EncodeHtmlEntities", |value, _| {
            Ok(match value {
                Value::String(s) => Value::from(escape(s)),
                v => v.clone(),
            })
        }),
        FunctionEntry::transformer("DecodeHtmlEntities", |value, _| {
            Ok(match value {
                Value::String(s) => Value::from(unescape(s)),
                v => v.clone(),
            })
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn replaces_first_occurrence_with_js_patterns() {
        assert_eq!(js_replace_first("%1 and %1", "%1", "Ada"), "Ada and %1");
        assert_eq!(js_replace_first("a %1 b", "%1", "$$"), "a $ b");
        assert_eq!(replace_content(&Value::Null, &[]).as_str(), Some("NO_TRANSLATION"));
    }

    #[test]
    fn ordinal_suffixes() {
        let s: Vec<_> = [1, 2, 3, 4, 11, 12, 13, 21, 22, 23, 31].iter().map(|d| ordinal_suffix(*d)).collect();
        assert_eq!(s, ["st", "nd", "rd", "th", "th", "th", "th", "st", "nd", "rd", "st"]);
    }

    #[test]
    fn to_iso_pads_complete_dates() {
        let v = forge_core::val!({ "day": "1", "month": "2", "year": "2026" });
        assert_eq!(to_iso_value(&v).as_str(), Some("2026-02-01"));
        let empty = forge_core::val!({ "day": "", "month": "", "year": "" });
        assert_eq!(to_iso_value(&empty).as_str(), Some(""));
    }
}
