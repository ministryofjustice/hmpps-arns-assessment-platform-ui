//! SAN's constants, shared across versions.

pub mod collection;
pub mod form_config;
pub mod question_content;

/// Character limits for free text answers.
pub mod character_limit {
    pub const C128: i64 = 128;
    pub const C200: i64 = 200;
    pub const C400: i64 = 400;
    pub const C1000: i64 = 1000;
    pub const C1425: i64 = 1425;
    pub const C2000: i64 = 2000;
    pub const C4000: i64 = 4000;
}

pub const LATEST_VERSION: &str = "v1.0";
