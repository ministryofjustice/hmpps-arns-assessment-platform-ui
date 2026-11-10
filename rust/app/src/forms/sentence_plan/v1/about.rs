//! The About and Supervision package pages.

use super::common::*;
use crate::config::config;
use crate::forms::dsl::*;
use crate::forms::sentence_plan::components::*;
use crate::forms::sentence_plan::constants::{SENTENCE_PLAN_OVERVIEW_PATH, case_data};
use crate::forms::sentence_plan::guards::*;
use crate::{effect, transformer};

fn assessment_failed() -> Value {
    data_is("allAreasAssessmentStatus", "error")
}

fn sentences_failed() -> Value {
    data("caseData.sentences").not().matches(condition::is_required())
}

pub fn is_sentence_information_and_assessment_loading_error() -> Value {
    and(vec![assessment_failed(), sentences_failed()])
}

fn either_failed() -> Value {
    or(vec![is_sentence_information_and_assessment_loading_error(), assessment_failed()])
}

fn heading_m(text: &str, classes: Option<&str>) -> Value {
    let mut props = obj! { "visibleWhen": not(either_failed()), "text": text, "size": "m", "level": 2 };
    if let Some(c) = classes {
        props.set("classes", Value::from(c));
    }
    govuk::HEADING.build(props)
}

fn risk_link_badges() -> Ex {
    format(
        "%1%2",
        [
            when(item().path("linkedToHarm").matches(condition::equals("YES")))
                .then("<span class=\"moj-badge moj-badge--large moj-badge--purple\">RoSH (Risk of Serious Harm)</span>")
                .otherwise("")
                .into(),
            when(item().path("linkedToReoffending").matches(condition::equals("YES")))
                .then("<span class=\"moj-badge moj-badge--large moj-badge--bright-purple\">Risk of reoffending</span>")
                .otherwise("")
                .into(),
        ],
    )
}

fn area_accordion(key: &str, id: &str) -> Value {
    govuk::ACCORDION.build(obj! {
        "visibleWhen": not(or(vec![
            assessment_failed(),
            is_sentence_information_and_assessment_loading_error(),
            not(data(key).matches(condition::is_required())),
        ])),
        "id": id,
        "classes": "about-page-accordion",
        "rememberExpanded": false,
        "items": data(key).each(iterator::map(obj! {
            "heading": obj! {
                "html": format(
                    "%1 <span class=\"about-page-accordion-header-badges\">%2</span>",
                    [item().path("title").into(), risk_link_badges().into()],
                ),
            },
            "content": obj! {
                "blocks": arr([
                    ASSESSMENT_INFO_DETAILS.build(obj! {
                        "personName": case_data::forename(),
                        "areaName": item().path("title"),
                        "assessmentData": item().value(),
                        "status": data("allAreasAssessmentStatus"),
                        "showAsDetails": false,
                        "fullWidth": true,
                    }),
                    core_blocks::HTML.build(obj! {
                        "content": format(
                            "<p class=\"add-goal-link\"><a href=\"goal/new/select-area-of-need?area=%1\" data-ai-id=\"%1-accordion-create-goal-link\">Create %2 goal</a></p>",
                            [item().path("goalRoute").into(), item().path("title").pipe([transformer::string::to_lower_case()]).into()],
                        ),
                    }),
                ]),
            },
        })),
    })
}

fn no_areas_message(key: &str, section: &str) -> Value {
    core_blocks::HTML.build(obj! {
        "visibleWhen": not(or(vec![
            assessment_failed(),
            is_sentence_information_and_assessment_loading_error(),
            data(key).matches(condition::is_required()),
        ])),
        "content": when(data_is("isAssessmentComplete", true))
            .then(format!("<p class=\"govuk-body\">No {section}.</p>"))
            .otherwise(format!("<p class=\"govuk-body\">No {section} at the moment.</p>")),
    })
}

fn sentence_table() -> Value {
    govuk::TABLE.build(obj! {
        "visibleWhen": not(or(vec![is_sentence_information_and_assessment_loading_error(), sentences_failed()])),
        "classes": "sentence-information-table",
        "head": arr([
            obj! { "text": "Sentence" },
            obj! { "text": "Expected end date" },
            obj! { "text": "Unpaid work" },
            obj! { "text": "RAR (Rehabilitation activity requirement)" },
        ]),
        "rows": data("caseData.sentences").each(iterator::map(arr([
            obj! {
                "html": format(
                    "%1<br>%2",
                    [
                        item().path("description").into(),
                        item().path("startDate").pipe([transformer!("ToSentenceLength", item().path("endDate"))]).into(),
                    ],
                ),
            },
            obj! { "text": item().path("endDate").pipe([long_date()]) },
            obj! {
                "text": when(item().path("unpaidWorkHoursOrdered").matches(condition::number::greater_than(0)))
                    .then(format("%1 hours", [item().path("unpaidWorkHoursOrdered").into()]))
                    .otherwise("No"),
            },
            obj! {
                "text": when(item().path("rarRequirement").matches(condition::equals(true)))
                    .then(format("%1 days", [item().path("rarDaysOrdered").into()]))
                    .otherwise("No"),
            },
        ]))),
        "attributes": obj! { "data-qa": "sentence-table" },
    })
}

pub fn about_person_step() -> Value {
    let loading_error = is_sentence_information_and_assessment_loading_error;
    let warning = |visible: Value, text: &str, qa: &str| {
        govuk::WARNING_TEXT.build(obj! {
            "visibleWhen": visible,
            "text": text,
            "iconFallbackText": "Warning",
            "attributes": obj! { "data-qa": qa },
        })
    };
    step(obj! {
        "path": "/about-person",
        "title": "About",
        "view": obj! {
            "locals": obj! {
                "headerPageHeading": when(loading_error())
                    .then("Sorry, there is a problem")
                    .otherwise(format("About %1", [case_data::forename().into()])),
                "buttons": obj! { "showReturnToOasysButton": is_oasys_access(), "showCreateGoalButton": not(is_read_only_access()) },
            },
        },
        "blocks": arr([
            core_blocks::HTML.build(obj! {
                "visibleWhen": loading_error(),
                "content": format(
                    format!("<p class=\"govuk-body\">Try reloading the page. You can do this by pressing F5 (on a PC), or Cmd + R (on a Mac).</p>\n    <p class=\"govuk-body\">If the page still does not load, try again later or <a href=\"{SENTENCE_PLAN_OVERVIEW_PATH}\" data-ai-id=\"go-to-plan-link\" class=\"govuk-link\">go to %1's plan</a>.</p>"),
                    [case_data::forename().into()],
                ),
            }),
            moj::ALERT.build(obj! {
                "visibleWhen": not(or(vec![assessment_failed(), loading_error(), data_is("isAssessmentComplete", true)])),
                "alertVariant": "warning",
                "title": "Some areas are incomplete",
                "showTitleAsHeading": true,
                "text": "Some areas in the assessment have not been marked as complete. You can still see the latest information.",
                "attributes": obj! { "data-qa": "incomplete-assessment-warning" },
            }),
            core_blocks::HTML.build(obj! {
                "visibleWhen": not(or(vec![loading_error(), not(data("assessmentLastUpdated").matches(condition::is_required()))])),
                "content": format(
                    "<p class=\"govuk-body govuk-!-margin-bottom-1\"> %1 assessment was last updated on %2.</p>",
                    [case_data::forename_possessive().into(), data("assessmentLastUpdated").into()],
                ),
            }),
            govuk::HEADING.build(obj! { "visibleWhen": not(loading_error()), "text": "Sentence information", "size": "m", "level": 2 }),
            sentence_table(),
            warning(
                not(or(vec![loading_error(), not(sentences_failed())])),
                "There is a problem getting the sentence information from NDelius. Try reloading the page or try again later",
                "no-sentence-info-warning",
            ),
            warning(
                not(or(vec![loading_error(), not(assessment_failed())])),
                "There is a problem getting assessment information. Try reloading the page or try again later.",
                "no-assessment-data-warning",
            ),
            core_blocks::HTML.build(obj! {
                "visibleWhen": not(or(vec![assessment_failed(), loading_error(), not(data("incompleteAreas").matches(condition::is_required()))])),
                "content": "<h2 class=\"govuk-heading-m govuk-!-margin-top-6\">Incomplete areas</h2>\n    <p class=\"govuk-body\">These areas have not been marked as complete in the assessment yet, but you can see the latest information available.</p>",
            }),
            area_accordion("incompleteAreas", "incomplete-areas-accordion"),
            heading_m("High-scoring areas from the assessment", Some("govuk-!-margin-top-6")),
            area_accordion("highScoringAreas", "high-scoring-areas-accordion"),
            no_areas_message("highScoringAreas", "high-scoring areas"),
            heading_m("Low-scoring areas from the assessment", Some("govuk-!-margin-top-6")),
            area_accordion("lowScoringAreas", "low-scoring-areas-accordion"),
            no_areas_message("lowScoringAreas", "low-scoring areas"),
            core_blocks::HTML.build(obj! {
                "visibleWhen": not(either_failed()),
                "content": "<h2 class=\"govuk-heading-m govuk-!-margin-top-6\">Areas without a need score</h2>\n    <p class=\"govuk-body\">Health and wellbeing, and finances never have a need score. When other information is available for those areas, you can see it here.</p>",
            }),
            area_accordion("otherAreas", "other-areas-accordion"),
        ]),
        "onAccess": arr([
            redirect_to_privacy_unless_accepted(),
            redirect_unless_san_sp(SENTENCE_PLAN_OVERVIEW_PATH),
            effects(vec![audit("VIEW_ABOUT_PERSON"), effect!("loadSentenceInformation"), effect!("loadAllAreasAssessmentInfo")]),
        ]),
    })
}

pub fn supervision_package_step() -> Value {
    step(obj! {
        "path": "/supervision-package",
        "title": "Supervision package",
        "view": obj! {
            "locals": obj! {
                "headerPageHeading": "Supervision package",
                "buttons": obj! { "showReturnToOasysButton": is_oasys_access(), "showCreateGoalButton": not(is_read_only_access()) },
            },
        },
        "blocks": arr([
            SUPERVISION_PACKAGE.build(obj! {
                "visibleWhen": can_display_supervision_package(),
                "crn": case_data::crn(),
                "tierCalculation": data("tierCalculation"),
                "supervisionPackageDetails": data("supervisionPackageDetails"),
                "oasysReviewHref": when(is_oasys_access()).then(data("sessionDetails.oasysRedirectUrl")).otherwise(config().oasys_review_url.as_str()),
                "openInNewTab": is_mpop_access(),
            }),
            govuk::WARNING_TEXT.build(obj! {
                "visibleWhen": has_supervision_package_error(),
                "text": "There is a problem getting the supervision package information. Reload the page or try again later.",
            }),
        ]),
        "onAccess": arr([
            redirect_to_privacy_unless_accepted(),
            redirect_to_overview_unless_supervision_package_accessible(),
            effects(vec![audit("VIEW_SUPERVISION_PACKAGE")]),
        ]),
    })
}
