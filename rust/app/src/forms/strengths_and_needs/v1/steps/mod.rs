//! Steps outside the sections, and the version's config step.

pub mod previous_versions;
pub mod section_summary;
pub mod view_all_answers;

use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::transformers;

/// `createConfigStep`: the form config, as JSON, for diagnostics.
pub fn create_config_step(form_config: Value) -> Value {
    step(obj! {
        "path": "/config",
        "title": "Config",
        "reachability": obj! { "entryWhen": true },
        "data": obj! { "formConfig": form_config },
        "blocks": [core_blocks::HTML.build(obj! {
            "tag": "pre",
            "content": data("formConfig").pipe([transformers::json_stringify()]),
        })],
    })
}
