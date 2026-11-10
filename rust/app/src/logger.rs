//! Logging: one bunyan-format JSON line per entry on stdout, filtered by `LOG_LEVEL`.

use std::sync::OnceLock;

#[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Debug)]
pub enum Level {
    Debug = 20,
    Info = 30,
    Warn = 40,
    Error = 50,
}

fn threshold() -> Level {
    static LEVEL: OnceLock<Level> = OnceLock::new();
    *LEVEL.get_or_init(|| match std::env::var("LOG_LEVEL").unwrap_or_default().to_lowercase().as_str() {
        "debug" | "trace" => Level::Debug,
        "warn" => Level::Warn,
        "error" => Level::Error,
        _ => Level::Info,
    })
}

pub fn enabled(level: Level) -> bool {
    level >= threshold()
}

/// Writes one entry: the message plus any structured fields.
pub fn log(level: Level, msg: &str, fields: serde_json::Value) {
    if !enabled(level) {
        return;
    }
    let mut entry = serde_json::json!({
        "name": "hmpps-arns-assessment-platform-ui",
        "level": level as u8,
        "time": chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
        "msg": msg,
    });
    if let (Some(entry), serde_json::Value::Object(extra)) = (entry.as_object_mut(), fields) {
        for (k, v) in extra {
            entry.insert(k, v);
        }
    }
    println!("{entry}");
}

#[macro_export]
macro_rules! log_at {
    ($level:expr, $fields:expr, $($arg:tt)+) => {
        if $crate::logger::enabled($level) {
            $crate::logger::log($level, &format!($($arg)+), $fields)
        }
    };
}

#[macro_export]
macro_rules! debug {
    ({ $($fields:tt)* }, $($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Debug, serde_json::json!({ $($fields)* }), $($arg)+) };
    ($($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Debug, serde_json::Value::Null, $($arg)+) };
}

#[macro_export]
macro_rules! info {
    ({ $($fields:tt)* }, $($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Info, serde_json::json!({ $($fields)* }), $($arg)+) };
    ($($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Info, serde_json::Value::Null, $($arg)+) };
}

#[macro_export]
macro_rules! warn {
    ({ $($fields:tt)* }, $($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Warn, serde_json::json!({ $($fields)* }), $($arg)+) };
    ($($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Warn, serde_json::Value::Null, $($arg)+) };
}

#[macro_export]
macro_rules! error {
    ({ $($fields:tt)* }, $($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Error, serde_json::json!({ $($fields)* }), $($arg)+) };
    ($($arg:tt)+) => { $crate::log_at!($crate::logger::Level::Error, serde_json::Value::Null, $($arg)+) };
}
