//! Submissions from the
//! client-side autosave script, which persist what has been typed without validating or
//! redirecting.

use super::constants::section::{ACCOMMODATION, SectionConfig, section_complete};
use super::constants::user_submitted::is_user_submitted;
use super::guards::is_edit_mode;
use crate::effect;
use crate::forms::dsl::*;

/// The `action` value the autosave script posts.
pub const AUTOSAVE_ACTION: &str = "autosave";

pub fn autosave_submit(step_code: &str, section: &SectionConfig) -> Value {
    submit(obj! {
        "when": post("action").matches(condition::equals(AUTOSAVE_ACTION)),
        "guards": is_edit_mode(),
        "validate": false,
        "onAlways": obj! {
            "effects": [
                effect!("saveCurrentStepAnswers", false, true),
                effect!("setUserSubmitted", step_code, is_user_submitted::FALSE),
                effect!("setSectionProgress", section.to_value(), section_complete::NO),
                effect!("commitPendingCommands"),
            ],
        },
    })
}

pub fn auto_save_accommodation_submit(step_code: &str) -> Value {
    submit(obj! {
        "when": post("action").matches(condition::equals(AUTOSAVE_ACTION)),
        "guards": is_edit_mode(),
        "validate": false,
        "onAlways": obj! {
            "effects": [
                effect!("saveCurrentAccommodationStepAnswers", false, true),
                effect!("setUserSubmitted", step_code, is_user_submitted::FALSE),
                effect!("setSectionProgress", ACCOMMODATION.to_value(), section_complete::NO),
                effect!("commitPendingCommands"),
            ],
        },
    })
}

pub fn auto_save_victim_edit_submit(step_code: &str, victims_collection: Value, item_index: Value) -> Value {
    submit(obj! {
        "when": post("action").matches(condition::equals(AUTOSAVE_ACTION)),
        "guards": is_edit_mode(),
        "validate": false,
        "onAlways": obj! {
            "effects": [
                effect!("updateItemFromCollection", victims_collection, item_index, true),
                effect!("setUserSubmitted", step_code, is_user_submitted::FALSE),
                effect!("commitPendingCommands"),
            ],
        },
    })
}
