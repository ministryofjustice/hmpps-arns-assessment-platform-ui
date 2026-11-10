//! Route path segments for the v1 form.

use super::form_version::BASE_PATH;
use crate::forms::dsl::*;

pub const SENTENCE_PLAN_VIEW_HISTORIC_BASE_PATH: &str = "sentence-plan/v1.0/plan/view-historic/";

/// The `:versionUuid` route segment for the current (latest) version of the assessment.
pub const CURRENT_VERSION: &str = "current";

/// `[basePath, Params('mode'), Params('assessmentUuid'), Params('versionUuid')]`.
pub fn base_san_route() -> Vec<Value> {
    vec![Value::from(BASE_PATH), params("mode").into(), params("assessmentUuid").into(), params("versionUuid").into()]
}

/// `[...baseSanRoute, ...more]`.
pub fn san_route(more: &[&str]) -> Vec<Value> {
    let mut route = base_san_route();
    route.extend(more.iter().map(|s| Value::from(*s)));
    route
}
