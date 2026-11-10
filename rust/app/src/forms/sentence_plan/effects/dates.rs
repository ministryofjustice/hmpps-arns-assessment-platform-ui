//! The JS `Date` behaviour the sentence plan relies on: `new Date(string)` parsing,
//! `setMonth` (which overflows into the next month rather than clamping), local-time day
//! comparisons and `toISOString`.

use chrono::{DateTime, Datelike, Local, NaiveDate, TimeZone, Utc};

/// `new Date().toISOString()`.
pub fn now_iso() -> String {
    to_iso(Utc::now())
}

/// `Date.prototype.toISOString`.
pub fn to_iso(d: DateTime<Utc>) -> String {
    d.to_rfc3339_opts(chrono::SecondsFormat::Millis, true)
}

/// `new Date(value)` for the formats the API and forms produce: RFC 3339 / ISO date-times
/// (a missing offset is local time, as in JS) and ISO dates (UTC midnight, as in JS).
pub fn parse(value: &str) -> Option<DateTime<Utc>> {
    let s = value.trim();
    if s.is_empty() {
        return None;
    }
    if let Ok(d) = DateTime::parse_from_rfc3339(s) {
        return Some(d.with_timezone(&Utc));
    }
    if let Ok(d) = NaiveDate::parse_from_str(s, "%Y-%m-%d") {
        return d.and_hms_opt(0, 0, 0).map(|n| Utc.from_utc_datetime(&n));
    }
    for format in ["%Y-%m-%dT%H:%M:%S%.f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"] {
        if let Ok(n) = chrono::NaiveDateTime::parse_from_str(s, format) {
            return Local.from_local_datetime(&n).earliest().map(|d| d.with_timezone(&Utc));
        }
    }
    None
}

/// `new Date(value).getTime()`, `None` for an invalid date.
pub fn millis(value: &str) -> Option<i64> {
    parse(value).map(|d| d.timestamp_millis())
}

/// `date.setMonth(date.getMonth() + months)` in local time: the day of month is kept, and a day
/// past the end of the target month rolls into the next one (31 January + 1 month = 2 or 3 March).
pub fn add_months_js(date: DateTime<Local>, months: i32) -> DateTime<Local> {
    let total = date.year() * 12 + date.month0() as i32 + months;
    let (year, month0) = (total.div_euclid(12), total.rem_euclid(12) as u32);
    let first = NaiveDate::from_ymd_opt(year, month0 + 1, 1).expect("valid month");
    let naive = first + chrono::Duration::days(date.day() as i64 - 1);
    let naive = naive.and_time(date.time());
    Local.from_local_datetime(&naive).earliest().unwrap_or(date)
}

/// Same calendar day in local time (`isSameDay` over `getFullYear/getMonth/getDate`).
pub fn is_same_local_day(a: DateTime<Utc>, b: DateTime<Utc>) -> bool {
    a.with_timezone(&Local).date_naive() == b.with_timezone(&Local).date_naive()
}

/// The order `new Date(b).getTime() - new Date(a).getTime()` sorts in (newest first); invalid
/// dates compare equal.
pub fn newest_first(a: &str, b: &str) -> std::cmp::Ordering {
    match (millis(a), millis(b)) {
        (Some(a), Some(b)) => b.cmp(&a),
        _ => std::cmp::Ordering::Equal,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_api_and_form_dates() {
        assert_eq!(millis("2024-01-02"), Some(1_704_153_600_000));
        assert_eq!(millis("2024-01-02T00:00:00.000Z"), Some(1_704_153_600_000));
        assert!(millis("not a date").is_none());
    }

    #[test]
    fn set_month_overflows_like_js() {
        let d = Local.with_ymd_and_hms(2025, 1, 31, 12, 0, 0).unwrap();
        let next = add_months_js(d, 1);
        assert_eq!((next.month(), next.day()), (3, 3));
        let d = Local.with_ymd_and_hms(2025, 11, 15, 12, 0, 0).unwrap();
        let next = add_months_js(d, 3);
        assert_eq!((next.year(), next.month(), next.day()), (2026, 2, 15));
    }
}
