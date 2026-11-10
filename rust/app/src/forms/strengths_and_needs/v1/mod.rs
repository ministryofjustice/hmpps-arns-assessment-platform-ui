//! Strengths and Needs v1.0.

pub mod audit;
pub mod autosave;
pub mod constants;
pub mod guards;
pub mod journeys;
pub mod locales;
pub mod steps;

use crate::config::config;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::platform::{create_platform_pages, not_a_platform_page};
use crate::forms::strengths_and_needs::generators::{create_route, create_route_with_query};
use crate::forms::strengths_and_needs::transformers;
use constants::form_version::{BASE_PATH, FORM_ROOT_PATH, FORM_VERSION};
use constants::path::{base_san_route, san_route};
use constants::section::{ACCOMMODATION, ALL};
use guards::{is_edit_mode, route_guards, show_previous_versions_link, show_return_to_oasys};
use locales::common_content_for;

/// The strengths and needs v1.0 journey: every section, with the SAN template and section
/// navigation for all of them.
pub fn strengths_and_needs_v1_journey() -> Value {
    let feedback_url = config().private_beta_feedback_url.as_str();
    let section_nav_items: Vec<Value> = ALL
        .iter()
        .map(|section| {
            obj! {
                "code": section.code,
                "path": section.path,
                // Read-only mode points at the analysis step
                "sideNavHref": when(params("mode").matches(condition::equals("edit")))
                    .then(create_route_with_query(san_route(&[section.side_nav_href]), &[("resume", "true")]))
                    .otherwise(create_route(san_route(&[section.side_nav_href]))),
                "statusKey": section.status_key,
                "complete": data(section.status_key),
                "text": common_content_for(&format!("sectionTitle.{}", section.code), []),
            }
        })
        .collect();
    let mut on_access = route_guards();
    on_access.extend([
        // Writes to the assessment, so only when editing the current version
        access(obj! { "when": is_edit_mode(), "effects": [effect!("setRiskOfSexualHarm")] }),
        // The privacy screen, for editing users who haven't accepted it
        access(obj! {
            "when": and(vec![not_a_platform_page(), data("privacyAccepted").not().matches(condition::equals(true)), is_edit_mode()]),
            "next": [redirect(obj! { "goto": format!("{FORM_ROOT_PATH}/privacy") })],
        }),
        // A 5-slug path is not in a section, e.g. /strengths-and-needs/v1.0/edit/<assessmentUuid>/current
        access(obj! {
            "when": request::path().matches(condition::string::matches_regex("^/[^/]+/[^/]+/[^/]+/[^/]+/[^/]+$")),
            "next": [redirect(obj! { "goto": ACCOMMODATION.side_nav_href })],
        }),
    ]);
    let mut steps_list = create_platform_pages(BASE_PATH, feedback_url);
    steps_list.push(steps::view_all_answers::view_all_answers_step());
    steps_list.push(steps::previous_versions::previous_versions_step());
    steps_list.push(steps::create_config_step(constants::form_config::v1_form_config().clone()));
    journey(obj! {
        "code": "strengths-and-needs-v1",
        "title": common_content_for("strengths_and_needs", []),
        "path": format!("/{FORM_VERSION}/:mode/:assessmentUuid/:versionUuid"),
        "view": obj! {
            "template": "strengths-and-needs/views/san-step",
            "locals": obj! {
                "basePath": create_route(base_san_route()),
                "assessmentVersionDate": data("sessionDetails.assessmentVersion").pipe([transformers::format_full_date_time()]),
                "sectionNavItems": section_nav_items,
                "viewPreviousVersionsLink": create_route(san_route(&["previous-versions"])),
                "viewAllAnswersLink": create_route(san_route(&["view-all-answers"])),
                "showPreviousVersionsLink": show_previous_versions_link(),
                "buttons": obj! { "showReturnToOasysButton": show_return_to_oasys() },
                "feedbackUrl": feedback_url,
                // Autosave only in edit mode
                "autosave": is_edit_mode(),
                "previousVersionDate": data("previousVersionDate").pipe([transformers::format_full_date_time()]),
            },
        },
        "data": obj! { "formVersion": FORM_VERSION },
        "onAccess": on_access,
        "steps": steps_list,
        "children": [
            journeys::accommodation::journey_(),
            journeys::employment_and_education::journey_(),
            journeys::finance::journey_(),
            journeys::drug_use::journey_(),
            journeys::alcohol_use::journey_(),
            journeys::health_wellbeing::journey_(),
            journeys::personal_relationships_and_community::journey_(),
            journeys::thinking_behaviours_and_attitudes::journey_(),
            journeys::offence_analysis::journey_(),
        ],
    })
}
