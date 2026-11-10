//! Previous assessment (and plan) versions, each opening in a new
//! window at `/strengths-and-needs/v1.0/view-historic/<assessmentUuid>/<versionUuid>`.

use crate::effect;
use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::generators::{create_route, create_route_with_query};
use crate::forms::strengths_and_needs::transformers;
use crate::forms::strengths_and_needs::v1::constants::form_version::{BASE_PATH, case_data};
use crate::forms::strengths_and_needs::v1::constants::path::SENTENCE_PLAN_VIEW_HISTORIC_BASE_PATH;
use crate::forms::strengths_and_needs::v1::constants::section::ACCOMMODATION;
use crate::forms::strengths_and_needs::v1::locales::{common_content_for, previous_versions};

fn cf(code: &str) -> Value {
    previous_versions().get(code, []).into()
}

fn leading_paragraph() -> Value {
    govuk::BODY.build(obj! { "text": format(cf("lead_paragraph"), [case_data::forename_possessive()]) })
}

fn formatted_date() -> Value {
    item().path("date").pipe([transformers::format_date()]).into()
}

fn date_cell() -> Value {
    obj! {
        "classes": "govuk-!-width-one-quarter",
        "blocks": [
            govuk::BODY.build(obj! { "text": formatted_date(), "classes": "govuk-!-margin-bottom-1" }),
            govuk::BODY.build(obj! { "text": item().path("description"), "classes": "govuk-!-margin-bottom-0" }),
        ],
    }
}

const VIEW_LINK: &str = "<a class=\"button-as-link\" href=\"%1\" target=\"_blank\">%2<span class=\"govuk-visually-hidden\"> %3 %4</span></a>";

fn version_cell(id_key: &str, href: Value, hidden_label: &str) -> Value {
    obj! {
        "classes": "govuk-!-width-one-quarter",
        "blocks": [
            when(item().path(id_key).matches(condition::is_required()))
                .then(govuk::BODY.build(obj! {
                    "text": format(VIEW_LINK, [href, cf("previous_versions_table_action_view"), cf(hidden_label), formatted_date()]),
                }))
                .otherwise(govuk::BODY.build(obj! { "text": cf("no_version") })),
        ],
    }
}

fn table_rows() -> Vec<Value> {
    let assessment_href: Value = create_route(vec![
        Value::from(BASE_PATH),
        // Opens in a new window, which isn't the OASys one
        Value::from("view-historic"),
        data("assessmentUuid").into(),
        item().path("assessmentVersionId").into(),
        Value::from(ACCOMMODATION.side_nav_href),
    ])
    .into();
    let plan_href: Value = create_route_with_query(
        vec![Value::from(SENTENCE_PLAN_VIEW_HISTORIC_BASE_PATH), item().path("planVersionId").into()],
        &[("goalStatusTab", "current")],
    )
    .into();
    vec![
        date_cell(),
        version_cell("assessmentVersionId", assessment_href, "previous_versions_table_action_view_assessment_visually_hidden"),
        version_cell("planVersionId", plan_href, "previous_versions_table_action_view_plan_visually_hidden"),
    ]
}

fn create_version_table(caption: Value, session_key: &str) -> Value {
    let table_data = || session(&format!("san.{session_key}"));
    let has_rows = || {
        and(vec![
            table_data().matches(condition::array::is_array()),
            table_data().pipe([transformer::array::length()]).matches(condition::number::greater_than(0)),
        ])
    };
    core_blocks::FRAGMENT.build(obj! {
        "blocks": [
            govuk::TABLE.build(obj! {
                "caption": caption.clone(),
                "captionClasses": "govuk-table__caption--m govuk-!-margin-top-3",
                "classes": "previous-versions-table",
                "head": [
                    obj! { "text": cf("previous_versions_table_head_date") },
                    obj! { "text": cf("previous_versions_table_head_assessment") },
                    obj! { "text": cf("previous_versions_table_head_plan") },
                ],
                "attributes": obj! { "data-qa": "previous-versions-table" },
                "rows": table_data().each(iterator::map(table_rows())),
                "visibleWhen": has_rows(),
            }),
            core_blocks::FRAGMENT.build(obj! {
                "blocks": [
                    govuk::HEADING.build(obj! { "size": "m", "text": caption }),
                    govuk::BODY.build(obj! { "text": cf("no_versions") }),
                ],
                "visibleWhen": not(has_rows()),
            }),
        ],
    })
}

fn back_to_top_link() -> Value {
    govuk::BODY.build(obj! {
        "text": format("<a class=\"govuk-link govuk-body govuk-!-margin-bottom-6\" href=\"#main-content\">%1</a>", [cf("back_to_the_top_link")]),
    })
}

pub fn previous_versions_step() -> Value {
    step(obj! {
        "path": "/previous-versions",
        "title": common_content_for("pageTitle.previous_versions", []),
        "reachability": obj! { "entryWhen": true },
        "onAccess": [access(obj! { "effects": [effect!("loadPreviousVersions"), effect!("setDynamicBacklink", BASE_PATH)] })],
        "view": obj! {
            "locals": obj! {
                "hideNavigation": true,
                "hideNavigationLinks": true,
                "hidePreviousVersionNotification": true,
                "sectionTitle": common_content_for("pageTitle.previous_versions", []),
                "backlink": data("dynamicBacklink"),
            },
        },
        "blocks": [
            leading_paragraph(),
            create_version_table(cf("countersigned_versions_table_caption"), "countersignedVersions"),
            create_version_table(cf("previous_versions_table_caption"), "previousVersions"),
            back_to_top_link(),
        ],
    })
}
