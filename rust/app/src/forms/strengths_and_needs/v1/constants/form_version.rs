//! The v1.0 form version: base path, case data accessors and route helpers.

use crate::forms::dsl::*;

pub const FORM_VERSION: &str = "v1.0";
pub const FORM_ROOT_PATH: &str = "/strengths-and-needs";
pub const BASE_PATH: &str = "/strengths-and-needs/v1.0";
pub const SECTION_TITLE_CLASS: &str = "govuk-body-l";

/// Centralised accessors for case data, so a path change is made once.
pub mod case_data {
    use super::*;

    pub fn forename() -> Value {
        data("caseData.name.forename").into()
    }

    pub fn forename_possessive() -> Value {
        data("caseData.name.forename").pipe([transformer::string::possessive()]).into()
    }

    pub fn surname() -> Value {
        data("caseData.name.surname").into()
    }

    pub fn risk_of_sexual_harm() -> Value {
        data("caseData.r").into()
    }

    pub fn gender() -> Value {
        data("caseData.gender").into()
    }
}
