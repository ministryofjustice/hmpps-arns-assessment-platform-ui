//! Gender codes and labels, as the handover service sends them.

use forge_core::Value;

pub const NOT_KNOWN: &str = "NOT_KNOWN";
pub const MALE: &str = "MALE";
pub const FEMALE: &str = "FEMALE";
pub const NOT_SPECIFIED: &str = "NOT_SPECIFIED";

/// The handover gender codes, in order.
pub const HANDOVER_GENDER_CODES: [&str; 4] = ["0", "1", "2", "9"];

/// `genderFromHandoverCode`: `String(value)` looked up, `NOT_KNOWN` otherwise.
pub fn gender_from_handover_code(value: &Value) -> &'static str {
    match value.to_js_string().as_str() {
        "0" => NOT_KNOWN,
        "1" => MALE,
        "2" => FEMALE,
        "9" => NOT_SPECIFIED,
        _ => NOT_KNOWN,
    }
}

pub fn handover_gender_label(value: &Value) -> &'static str {
    match gender_from_handover_code(value) {
        MALE => "Male",
        FEMALE => "Female",
        NOT_SPECIFIED => "Not specified",
        _ => "Not known",
    }
}

/// `handoverGenderOptions`: `{ value: code, text: label }` for each code.
pub fn handover_gender_options() -> Value {
    Value::array(
        HANDOVER_GENDER_CODES
            .iter()
            .map(|code| {
                Value::from_pairs([
                    ("value", Value::from(*code)),
                    ("text", Value::from(handover_gender_label(&Value::from(*code)))),
                ])
            })
            .collect(),
    )
}
