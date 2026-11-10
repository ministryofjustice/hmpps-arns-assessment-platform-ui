//! SAN's audit event names.

/// Names the form in `details.form` on every SAN audit event.
pub const SAN_AUDIT_FORM: &str = "strengths-and-needs";

/// Audit events raised by the strengths and needs form.
pub mod san_audit_event {
    // Views
    pub const VIEW_QUESTION_PAGE: &str = "VIEW_QUESTION_PAGE";
    pub const VIEW_SECTION_SUMMARY: &str = "VIEW_SECTION_SUMMARY";
    pub const VIEW_PRACTITIONER_ANALYSIS: &str = "VIEW_PRACTITIONER_ANALYSIS";
    pub const VIEW_ALL_ANSWERS: &str = "VIEW_ALL_ANSWERS";
    pub const VIEW_PREVIOUS_VERSIONS: &str = "VIEW_PREVIOUS_VERSIONS";
    pub const VIEW_HISTORIC_ASSESSMENT: &str = "VIEW_HISTORIC_ASSESSMENT";

    // User actions and edits
    pub const SAVE_QUESTION_PAGE: &str = "SAVE_QUESTION_PAGE";
    pub const MARK_SECTION_COMPLETE: &str = "MARK_SECTION_COMPLETE";
    pub const EDIT_ANSWERS: &str = "EDIT_ANSWERS";
    pub const PRINT_ASSESSMENT: &str = "PRINT_ASSESSMENT";
}
