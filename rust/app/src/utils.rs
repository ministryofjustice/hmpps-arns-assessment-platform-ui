//! Small string and date helpers shared by the app.

use forge_core::jsdate::{DateFormatOptions, JsDate, intl_format_date};

fn proper_case(word: &str) -> String {
    let mut chars = word.chars();
    match chars.next() {
        Some(first) => first.to_uppercase().collect::<String>() + &chars.as_str().to_lowercase(),
        None => String::new(),
    }
}

fn is_blank(s: &str) -> bool {
    s.trim().is_empty()
}

/// Proper case, handling double-barrelled names (each part is converted).
fn proper_case_name(name: &str) -> String {
    if is_blank(name) { String::new() } else { name.split('-').map(proper_case).collect::<Vec<_>>().join("-") }
}

pub fn convert_to_title_case(sentence: &str) -> String {
    if is_blank(sentence) { String::new() } else { sentence.split(' ').map(proper_case_name).collect::<Vec<_>>().join(" ") }
}

/// `J. Smith` from `John Smith`.
pub fn initialise_name(full_name: Option<&str>) -> Option<String> {
    let full_name = full_name.filter(|n| !n.is_empty())?;
    let parts: Vec<&str> = full_name.split(' ').collect();
    let first = parts[0].chars().next().map(String::from).unwrap_or_else(|| "undefined".into());
    Some(format!("{first}. {}", parts[parts.len() - 1]))
}

pub fn possessive(name: &str) -> String {
    if name.is_empty() {
        return String::new();
    }
    if name.to_lowercase().ends_with('s') { format!("{name}'") } else { format!("{name}'s") }
}

#[derive(Clone, Copy)]
pub enum DateFormat {
    /// `YYYY-MM-DD`
    Iso,
    /// `1 January 1990`
    Simple,
}

/// `formatDate`: `''` for empty or unparseable dates.
pub fn format_date(date: &str, format: DateFormat) -> String {
    if date.is_empty() {
        return String::new();
    }
    let parsed = JsDate::parse(date);
    if !parsed.is_valid() {
        return String::new();
    }
    match format {
        DateFormat::Iso => parsed.to_iso_string().map(|s| s[..10].to_string()).unwrap_or_default(),
        DateFormat::Simple => intl_format_date(
            &parsed,
            &DateFormatOptions {
                locale: Some("en-GB".into()),
                day: Some("numeric".into()),
                month: Some("long".into()),
                year: Some("numeric".into()),
                ..DateFormatOptions::default()
            },
        )
        .unwrap_or_default(),
    }
}

/// `encodeURIComponent`.
pub fn encode_uri_component(s: &str) -> String {
    let mut out = String::new();
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'_' | b'.' | b'!' | b'~' | b'*' | b'\'' | b'(' | b')' => {
                out.push(b as char)
            }
            _ => out.push_str(&format!("%{b:02X}")),
        }
    }
    out
}

/// `application/x-www-form-urlencoded` serialisation (`URLSearchParams`).
pub fn form_urlencode(s: &str) -> String {
    let mut out = String::new();
    for b in s.bytes() {
        match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'*' | b'-' | b'.' | b'_' => out.push(b as char),
            b' ' => out.push('+'),
            _ => out.push_str(&format!("%{b:02X}")),
        }
    }
    out
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn names() {
        assert_eq!(convert_to_title_case("ROBERT HUGH-SMITH"), "Robert Hugh-Smith");
        assert_eq!(initialise_name(Some("John William Smith")).as_deref(), Some("J. Smith"));
        assert_eq!(possessive("James"), "James'");
        assert_eq!(possessive("Ada"), "Ada's");
    }

    #[test]
    fn dates() {
        assert_eq!(format_date("1990-01-01", DateFormat::Simple), "1 January 1990");
        assert_eq!(format_date("1990-01-01", DateFormat::Iso), "1990-01-01");
        assert_eq!(format_date("nonsense", DateFormat::Simple), "");
    }
}
