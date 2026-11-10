//! The "user submitted" field codes for each section.

use crate::forms::dsl::*;

pub mod is_user_submitted {
    pub const TRUE: &str = "TRUE";
    pub const FALSE: &str = "FALSE";
}

pub fn is_user_submitted_code(step_code: &str) -> String {
    format!("is_user_submitted_{step_code}")
}

pub fn is_user_submitted_condition(step_code: &str) -> Value {
    or(vec![
        data(&is_user_submitted_code(step_code)).matches(condition::equals(is_user_submitted::TRUE)),
        post("action").matches(condition::equals("save")),
    ])
}
