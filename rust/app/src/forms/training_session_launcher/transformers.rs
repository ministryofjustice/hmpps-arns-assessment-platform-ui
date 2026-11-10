//! The launcher's transformers.

use chrono::{Datelike, Duration, Local, TimeZone};
use forge_core::{ForgeError, FunctionEntry, Value};

use crate::transformer;

pub fn relative_time() -> Value {
    transformer!("RelativeTime")
}

const MONTHS: [&str; 12] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/// "Created just now", "Created 5 mins ago", "Created 4 hours ago", "Created yesterday at
/// 13:45", "Created on 10 Jan at 09:30".
pub fn relative_time_value(created: i64, now: chrono::DateTime<Local>) -> String {
    let diff = now.timestamp_millis() - created;
    let minutes = diff.div_euclid(60_000);
    let hours = diff.div_euclid(3_600_000);
    if minutes < 1 {
        return "Created just now".into();
    }
    if minutes < 60 {
        return format!("Created {minutes} {} ago", if minutes == 1 { "min" } else { "mins" });
    }
    let Some(date) = Local.timestamp_millis_opt(created).single() else { return String::new() };
    if date.date_naive() == now.date_naive() {
        return format!("Created {hours} {} ago", if hours == 1 { "hour" } else { "hours" });
    }
    let time = date.format("%H:%M").to_string();
    if date.date_naive() == (now - Duration::days(1)).date_naive() {
        return format!("Created yesterday at {time}");
    }
    format!("Created on {} {} at {time}", date.day(), MONTHS[date.month0() as usize])
}

pub fn entries() -> Vec<FunctionEntry> {
    vec![FunctionEntry::transformer("RelativeTime", |value, _| match value {
        Value::Number(n) if !n.is_nan() => Ok(Value::from(relative_time_value(*n as i64, Local::now()))),
        _ => Err(ForgeError::type_error("TrainingSessionLauncherTransformers.RelativeTime expected a number")),
    })]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn relative_times() {
        let now = Local::now();
        let ms = now.timestamp_millis();
        assert_eq!(relative_time_value(ms - 10_000, now), "Created just now");
        assert_eq!(relative_time_value(ms - 60_000, now), "Created 1 min ago");
        assert_eq!(relative_time_value(ms - 5 * 60_000, now), "Created 5 mins ago");
    }
}
