//! The v1 form's constants.

pub mod buttons;
pub mod common_option;
pub mod form_config;
pub mod form_version;
pub mod path;
pub mod question_content;
pub mod section;
pub mod user_submitted;

/// A step's code (for progress keys and audit) and path segment.
#[derive(Clone, Copy, Debug)]
pub struct StepDef {
    pub code: &'static str,
    pub path: &'static str,
}

impl StepDef {
    /// `/${path}`, the step's own path.
    pub fn route(&self) -> String {
        format!("/{}", self.path)
    }
}
