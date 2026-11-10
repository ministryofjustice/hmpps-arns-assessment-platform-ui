//! Paths, case data accessors, actor labels and the areas of need (the data tables are the
//! JSON files alongside).

use std::sync::OnceLock;

use serde_json::Value as Json;

use crate::forms::dsl::*;

pub const FORM_VERSION: &str = "v1.0";
pub const SENTENCE_PLAN_BASE_PATH: &str = "/sentence-plan/v1.0";
pub const SENTENCE_PLAN_OVERVIEW_PATH: &str = "/sentence-plan/v1.0/plan/overview";
pub const SENTENCE_PLAN_PRINT_PREVIEW_PATH: &str = "/sentence-plan/v1.0/plan/print-preview";
pub const SENTENCE_PLAN_PRINT_PREVIEW_PDF_PATH: &str = "/sentence-plan/v1.0/plan/print-preview/pdf";

/// `CaseData`: the case data accessors used throughout the form.
pub mod case_data {
    use crate::forms::dsl::*;

    pub fn forename() -> Ex {
        data("caseData.name.forename")
    }

    pub fn forename_possessive() -> Ex {
        data("caseData.name.forename").pipe([transformer::string::possessive()])
    }

    pub fn surname() -> Ex {
        data("caseData.name.surname")
    }

    pub fn crn() -> Ex {
        data("caseData.crn")
    }
}

fn parse(cell: &'static OnceLock<Json>, text: &str) -> &'static Json {
    cell.get_or_init(|| serde_json::from_str(text).expect("sentence plan constants"))
}

/// `actorLabels`: actor values to labels (`person_on_probation` uses the person's name).
pub fn actor_labels() -> &'static Json {
    static CELL: OnceLock<Json> = OnceLock::new();
    parse(&CELL, include_str!("actor_labels.json"))
}

/// `areasOfNeed`: display, routing and API mapping for each area of need.
pub fn areas_of_need() -> &'static Json {
    static CELL: OnceLock<Json> = OnceLock::new();
    parse(&CELL, include_str!("areas_of_need.json"))
}

/// `subAreasOfNeed` (Lifestyle and associates, within Thinking, behaviours and attitudes).
pub fn sub_areas_of_need() -> &'static Json {
    static CELL: OnceLock<Json> = OnceLock::new();
    parse(&CELL, include_str!("sub_areas_of_need.json"))
}

pub fn areas_of_need_list() -> &'static [Json] {
    areas_of_need().as_array().map(Vec::as_slice).unwrap_or_default()
}

/// The area of need with the given slug.
pub fn area_by_slug(slug: &str) -> Option<&'static Json> {
    areas_of_need_list().iter().find(|a| a["slug"] == slug)
}

/// `areaOfNeedSlugs`.
pub fn area_of_need_slugs() -> Vec<&'static str> {
    areas_of_need_list().iter().filter_map(|a| a["slug"].as_str()).collect()
}

pub const DEFAULT_AREA_OF_NEED: &str = "accommodation";

/// `[...areasOfNeed].sort((a, b) => a.text.localeCompare(b.text))`.
pub fn sorted_areas_of_need() -> Vec<&'static Json> {
    let mut areas: Vec<&Json> = areas_of_need_list().iter().collect();
    areas.sort_by_key(|a| a["text"].as_str().unwrap_or_default().to_lowercase());
    areas
}

/// `actorLabelOptions`: the step actor select's options.
pub fn actor_label_options() -> Value {
    let mut options = vec![
        obj! { "value": "", "text": "Choose someone" },
        obj! { "value": "person_on_probation", "text": case_data::forename() },
    ];
    if let Some(labels) = actor_labels().as_object() {
        options.extend(labels.iter().map(|(value, text)| obj! { "value": value.as_str(), "text": text.as_str().unwrap_or_default() }));
    }
    Value::array(options)
}
