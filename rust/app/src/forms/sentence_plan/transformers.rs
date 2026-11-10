//! The sentence plan's transformers.

use chrono::{Months, NaiveDate};
use forge_core::{ForgeError, FunctionEntry, Value};

fn pluralise(count: i64, unit: &str) -> String {
    if count == 1 { format!("{count} {unit}") } else { format!("{count} {unit}s") }
}

/// A date from an ISO date or date-time string (the date part).
fn parse_iso(s: &str) -> Option<NaiveDate> {
    NaiveDate::parse_from_str(s.get(..10)?, "%Y-%m-%d").ok()
}

/// Luxon's `end.diff(start, ['years', 'months', 'days'])` for calendar dates: whole years, then
/// whole months (adding months clamps to the month's last day), then the remaining days.
pub fn calendar_diff(start: NaiveDate, end: NaiveDate) -> (i64, i64, i64) {
    if end < start {
        let (y, m, d) = calendar_diff(end, start);
        return (-y, -m, -d);
    }
    let add = |months: u32| start.checked_add_months(Months::new(months));
    let mut total_months = 0u32;
    while add(total_months + 1).is_some_and(|d| d <= end) {
        total_months += 1;
    }
    let cursor = add(total_months).unwrap_or(start);
    ((total_months / 12) as i64, (total_months % 12) as i64, (end - cursor).num_days())
}

/// `ToSentenceLength`: "(1 year, 2 months and 3 days)" between a start and end date.
pub fn to_sentence_length(start: &str, end: &str) -> String {
    let (start, end) = (start.trim(), end.trim());
    if start.is_empty() || end.is_empty() {
        return String::new();
    }
    let (Some(s), Some(e)) = (parse_iso(start), parse_iso(end)) else { return String::new() };
    let (years, months, days) = calendar_diff(s, e);
    let parts: Vec<String> = [(years, "year"), (months, "month"), (days, "day")]
        .into_iter()
        .filter(|(n, _)| *n > 0)
        .map(|(n, unit)| pluralise(n, unit))
        .collect();
    match parts.as_slice() {
        [] => String::new(),
        [a] => format!("({a})"),
        [a, b] => format!("({a} and {b})"),
        [a, b, c, ..] => format!("({a}, {b} and {c})"),
    }
}

pub fn entries() -> Vec<FunctionEntry> {
    vec![FunctionEntry::transformer("ToSentenceLength", |value, args| {
        let (Value::String(start), Some(Value::String(end))) = (value, args.first()) else {
            let which = if matches!(value, Value::String(_)) { "endDate" } else { "startDate" };
            return Err(ForgeError::evaluation(format!("SentencePlanTransformers.ToSentenceLength ({which}) expected a string")));
        };
        Ok(Value::from(to_sentence_length(start, end)))
    })]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn sentence_lengths() {
        assert_eq!(to_sentence_length("2024-01-01", "2025-03-04"), "(1 year, 2 months and 3 days)");
        assert_eq!(to_sentence_length("2024-01-31", "2024-02-29"), "(1 month)");
        assert_eq!(to_sentence_length("2024-01-01", "2024-01-02"), "(1 day)");
        assert_eq!(to_sentence_length("2024-01-01", "2026-01-01"), "(2 years)");
        assert_eq!(to_sentence_length("2024-01-01", "2024-01-01"), "");
        assert_eq!(to_sentence_length(" ", "2024-01-01"), "");
    }
}
