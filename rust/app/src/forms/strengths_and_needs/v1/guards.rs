//! Shared access predicates (who came from OASys, read-only vs edit) and the route
//! guards that keep the URL in line with the access.

use super::constants::form_version::FORM_ROOT_PATH;
use super::constants::path::{CURRENT_VERSION, san_route};
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators::create_route;

pub fn is_oasys_access() -> Value {
    data("sessionDetails.accessType").matches(condition::equals("OASYS"))
}

/// Viewing read-only what OASys or MPoP opened (URL mode `view`), whichever version.
pub fn is_view_mode() -> Value {
    params("mode").matches(condition::equals("view"))
}

/// The window the previous versions page opens a version in (URL mode `view-historic`).
pub fn is_historic_window() -> Value {
    params("mode").matches(condition::equals("view-historic"))
}

/// "Return to OASys" only in the window OASys opened.
pub fn show_return_to_oasys() -> Value {
    and(vec![is_oasys_access(), not(is_historic_window())])
}

/// The URL names a previous version rather than `current` (always read-only).
pub fn is_historic_version() -> Value {
    and(vec![
        params("versionUuid").matches(condition::is_required()),
        not(params("versionUuid").matches(condition::equals(CURRENT_VERSION))),
    ])
}

/// "View previous versions" only on the current version.
pub fn show_previous_versions_link() -> Value {
    params("versionUuid").matches(condition::equals(CURRENT_VERSION))
}

fn has_read_write_access() -> Value {
    data("sessionDetails.accessMode").matches(condition::equals("READ_WRITE"))
}

/// READ_ONLY access, or a read-only URL (`view`, `view-historic`, or a previous version).
pub fn is_read_only_mode() -> Value {
    or(vec![
        data("sessionDetails.accessMode").matches(condition::equals("READ_ONLY")),
        is_view_mode(),
        is_historic_window(),
        is_historic_version(),
    ])
}

/// READ_WRITE access, URL mode `edit` and the current version.
pub fn is_edit_mode() -> Value {
    and(vec![has_read_write_access(), params("mode").matches(condition::equals("edit")), not(is_historic_version())])
}

/// Sends read-only users from editable steps to the section's analysis step.
pub fn redirect_to_analysis_if_read_only(section_path: &str, analysis_step_path: &str) -> Value {
    access(obj! {
        "when": and(vec![
            is_read_only_mode(),
            not(request::path().matches(condition::equals(create_route(san_route(&[section_path, analysis_step_path]))))),
        ]),
        "next": [redirect(obj! { "goto": create_route(san_route(&[section_path, analysis_step_path])) })],
    })
}

/// Sends anything that doesn't match the access to the entry step: `edit` needs READ_WRITE
/// access and the current version, and the URL must name the assessment loaded for the access.
pub fn route_guards() -> Vec<Value> {
    let to_entry_route = || redirect(obj! { "goto": format!("{FORM_ROOT_PATH}/") });
    let is_edit_url = params("mode").matches(condition::equals("edit"));
    vec![
        access(obj! {
            "when": and(vec![is_edit_url, or(vec![not(has_read_write_access()), is_historic_version()])]),
            "next": [to_entry_route()],
        }),
        access(obj! {
            "when": not(params("assessmentUuid").matches(condition::equals(data("assessmentUuid")))),
            "next": [to_entry_route()],
        }),
    ]
}
