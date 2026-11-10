//! SAN's own conditions.

use forge_core::{FunctionEntry, Value};

use super::html_encoder::unescape;
use crate::condition;

pub fn is_array() -> Value {
    condition!("IsArray")
}

pub fn has_max_length(max_length: i64) -> Value {
    condition!("HasMaxLength", max_length)
}

pub fn entries() -> Vec<FunctionEntry> {
    vec![
        FunctionEntry::condition("IsArray", |value, _| Ok(matches!(value, Value::Array(_)))),
        FunctionEntry::condition("HasMaxLength", |value, args| {
            let max = args.first().map(Value::to_js_number).unwrap_or(f64::NAN);
            let length = forge_core::value::utf16_len(&unescape(&value.to_js_string()));
            Ok(length as f64 <= max)
        }),
    ]
}
