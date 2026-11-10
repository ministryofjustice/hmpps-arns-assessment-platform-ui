//! The access predicates and redirect guards the steps share.

use super::constants::SENTENCE_PLAN_OVERVIEW_PATH;
use crate::forms::dsl::*;

/// `POST_AGREEMENT_PROCESS_STATUSES`: a plan with one of these has been through agreement.
pub const POST_AGREEMENT_PROCESS_STATUSES: [&str; 5] =
    ["AGREED", "DO_NOT_AGREE", "COULD_NOT_ANSWER", "UPDATED_AGREED", "UPDATED_DO_NOT_AGREE"];

/// Gotenberg's headless Chromium sends this header when it loads a page to make a PDF.
pub const GOTENBERG_RENDER_HEADER: &str = "x-gotenberg-render";
pub const GOTENBERG_RENDER_HEADER_VALUE: &str = "true";

fn strings(values: &[&str]) -> Value {
    Value::array(values.iter().map(|v| Value::from(*v)).collect())
}

pub fn is_oasys_access() -> Value {
    data("sessionDetails.accessType").matches(condition::equals("OASYS"))
}

pub fn is_read_only_access() -> Value {
    data("sessionDetails.planAccessMode").matches(condition::equals("READ_ONLY"))
}

pub fn is_print_and_share_enabled() -> Value {
    data("featureFlags.printAndShareEnabled").matches(condition::equals(true))
}

pub fn is_supervision_package_enabled() -> Value {
    data("featureFlags.supervisionPackageEnabled").matches(condition::equals(true))
}

/// The phases MPoP renders the supervision package component for.
fn is_renderable_supervision_phase() -> Value {
    data("supervisionPackageDetails.currentPhase.phase.code")
        .matches(condition::array::is_in(strings(&["INIT", "STD", "FTHRD", "IOM", "OPD", "SPNS"])))
}

fn is_awaiting_oasys_review() -> Value {
    and(vec![
        data("supervisionPackageDetails").matches(condition::is_required()),
        data("supervisionPackageDetails.currentPhase").not().matches(condition::is_required()),
    ])
}

pub fn is_supervision_package_displayable() -> Value {
    or(vec![is_renderable_supervision_phase(), is_awaiting_oasys_review()])
}

pub fn can_display_supervision_package() -> Value {
    and(vec![is_supervision_package_enabled(), is_supervision_package_displayable()])
}

pub fn has_supervision_package_error() -> Value {
    data("supervisionPackageError").matches(condition::equals(true))
}

pub fn can_access_supervision_package() -> Value {
    and(vec![is_supervision_package_enabled(), or(vec![is_supervision_package_displayable(), has_supervision_package_error()])])
}

pub fn is_pdf_render_request() -> Value {
    request::headers(GOTENBERG_RENDER_HEADER).matches(condition::equals(GOTENBERG_RENDER_HEADER_VALUE))
}

pub fn has_post_agreement_status() -> Value {
    data("latestAgreementStatus").matches(condition::array::is_in(strings(&POST_AGREEMENT_PROCESS_STATUSES)))
}

pub fn has_could_not_answer_status() -> Value {
    data("latestAgreementStatus").matches(condition::equals("COULD_NOT_ANSWER"))
}

fn redirect_when(when: Value, goto: impl IntoValue) -> Value {
    access(obj! { "when": when, "next": arr([redirect(obj! { "goto": goto })]) })
}

pub fn redirect_to_overview_if_read_only() -> Value {
    redirect_when(is_read_only_access(), SENTENCE_PLAN_OVERVIEW_PATH)
}

pub fn redirect_to_overview_unless_print_and_share_enabled() -> Value {
    redirect_when(not(is_print_and_share_enabled()), SENTENCE_PLAN_OVERVIEW_PATH)
}

pub fn redirect_to_overview_unless_supervision_package_accessible() -> Value {
    redirect_when(not(can_access_supervision_package()), SENTENCE_PLAN_OVERVIEW_PATH)
}

pub fn redirect_if_not_post_agreement(goto: &str) -> Value {
    redirect_when(not(has_post_agreement_status()), goto)
}

pub fn redirect_if_post_agreement(goto: &str) -> Value {
    redirect_when(has_post_agreement_status(), goto)
}

pub fn redirect_if_goal_not_found(goto: &str) -> Value {
    redirect_when(data("activeGoal").not().matches(condition::is_required()), goto)
}

pub fn redirect_if_goal_has_less_than_two_steps(goto: &str) -> Value {
    redirect_when(data("activeGoal.steps").pipe([transformer::array::length()]).matches(condition::number::less_than(2)), goto)
}

pub fn is_goal_active_or_future() -> Value {
    data("activeGoal.status").matches(condition::array::is_in(strings(&["ACTIVE", "FUTURE"])))
}

pub fn redirect_unless_goal_is_active_or_future(goto: &str) -> Value {
    redirect_when(not(is_goal_active_or_future()), goto)
}

pub fn all_active_goal_steps_completed() -> Value {
    and(vec![
        data("activeGoal.steps").matches(condition::is_required()),
        data("activeGoal.steps").each(iterator::every(item().path("status").matches(condition::equals("COMPLETED")))).into(),
    ])
}

pub fn redirect_unless_all_steps_completed(goto: &str) -> Value {
    redirect_when(not(all_active_goal_steps_completed()), goto)
}

pub fn redirect_unless_could_not_answer(goto: &str) -> Value {
    redirect_when(not(has_could_not_answer_status()), goto)
}

pub fn is_san_sp_assessment() -> Value {
    data("assessment.flags").matches(condition::array::contains("SAN_BETA"))
}

pub fn is_mpop_access() -> Value {
    data("sessionDetails.accessType").matches(condition::equals("HMPPS_AUTH"))
}

pub fn has_crn() -> Value {
    data("caseData.crn").matches(condition::is_required())
}

pub fn can_access_san_content() -> Value {
    and(vec![is_san_sp_assessment(), has_crn()])
}

pub fn redirect_unless_san_sp(goto: &str) -> Value {
    redirect_when(not(can_access_san_content()), goto)
}

pub fn is_merged_plan() -> Value {
    data("assessment.properties.MERGED").matches(condition::is_required())
}

fn active_goals() -> Ex {
    data("goals").each(iterator::filter(item().path("status").matches(condition::equals("ACTIVE"))))
}

pub fn has_at_least_one_active_goal() -> Value {
    data("goals").each(iterator::some(item().path("status").matches(condition::equals("ACTIVE")))).into()
}

pub fn redirect_unless_all_active_goals_have_steps(goto: &str) -> Value {
    let all_have_steps = active_goals().each(iterator::every(item().path("steps").matches(condition::is_required())));
    redirect_when(not(and(vec![has_at_least_one_active_goal(), all_have_steps.into()])), goto)
}

pub fn redirect_if_merged_mpop_plan() -> Value {
    redirect_when(and(vec![is_mpop_access(), is_merged_plan()]), "/sentence-plan/merged-plan-warning")
}

pub fn redirect_to_privacy_unless_accepted() -> Value {
    redirect_when(
        and(vec![data("privacyAccepted").not().matches(condition::equals(true)), not(is_read_only_access())]),
        "/sentence-plan/privacy",
    )
}
