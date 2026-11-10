//! The sentence plan v1.0 journey. Access is handled by the access form, which
//! sets up the session and redirects to the plan overview.

pub mod about;
pub mod common;
pub mod goal_management;
pub mod plan_overview;

use common::*;
use crate::config::config;
use crate::effect;
use crate::forms::dsl::*;
use crate::forms::platform::create_platform_pages;
use super::constants::{FORM_VERSION, SENTENCE_PLAN_BASE_PATH, SENTENCE_PLAN_OVERVIEW_PATH, actor_labels, areas_of_need};
use super::guards::*;
use super::navigation::nav_key_patterns;

pub fn sentence_plan_v1_journey() -> Value {
    let feedback_url = config().national_rollout_feedback_url.as_str();
    let mut steps = vec![about::about_person_step(), about::supervision_package_step()];
    steps.extend(create_platform_pages(SENTENCE_PLAN_BASE_PATH, feedback_url));
    journey(obj! {
        "code": "sentence-plan-v1",
        "title": "Sentence plan",
        "path": "/v1.0",
        "reachability": obj! { "disableReachabilityChecks": true },
        "view": obj! {
            "template": "sentence-plan/views/sentence-plan-step",
            "locals": obj! {
                "basePath": SENTENCE_PLAN_BASE_PATH,
                "hmppsHeaderServiceNameLink": SENTENCE_PLAN_OVERVIEW_PATH,
                "showAboutTab": can_access_san_content(),
                "showPlanHistoryTab": has_post_agreement_status(),
                "showSupervisionPackageTab": can_access_supervision_package(),
                "feedbackUrl": feedback_url,
            },
        },
        "data": obj! {
            "areasOfNeed": Value::from_json(areas_of_need()),
            "actorLabels": Value::from_json(actor_labels()),
            "formVersion": FORM_VERSION,
        },
        "onAccess": arr([
            effects(vec![
                effect!("loadFeatureFlags"),
                effect!("initializeSessionFromAccess"),
                effect!("loadSessionData"),
                effect!("loadPlan"),
                effect!("deriveGoalsWithStepsFromAssessment"),
                effect!("derivePlanAgreementsFromAssessment"),
                effect!("trackNavigation", nav_key_patterns()),
            ]),
            access(obj! {
                "when": and(vec![
                    data("sessionDetails.planVersion").matches(condition::is_required()),
                    request::path().not().matches(condition::string::matches_regex("view-historic")),
                ]),
                "next": arr([redirect_to(format(
                    format!("{SENTENCE_PLAN_BASE_PATH}/plan/view-historic/%1?goalStatusTab=current"),
                    [data("sessionDetails.planVersion").into()],
                ))]),
            }),
            redirect_if_merged_mpop_plan(),
            redirect_to_privacy_unless_accepted(),
            access(obj! { "when": is_supervision_package_enabled(), "effects": arr([effect!("loadSupervisionPackage")]) }),
        ]),
        "steps": Value::array(steps),
        "children": arr([plan_overview::plan_overview_journey(), goal_management::goal_management_journey()]),
    })
}
