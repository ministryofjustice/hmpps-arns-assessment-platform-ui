//! The supervision package and the goals domain events
//!.

use std::sync::Arc;

use forge_core::{EffectContext, FunctionEntry, Value};

use super::plan::is_post_agreement;
use super::{SentencePlanEffectsDeps, data_list};
use crate::register_effect;
use crate::services::domain_events::goals_event;

/// `hasNoOtherOpenGoals`: every goal but `changed` is achieved or removed.
fn has_no_other_open_goals(goals: &[Value], changed: &str) -> bool {
    goals.iter().all(|g| g.get("uuid").as_str() == Some(changed) || !matches!(g.get("status").as_str(), Some("ACTIVE" | "FUTURE")))
}

/// `publishOnOpenGoalBoundary`: for agreed plans, when the changed goal is the only open one
/// (it closed the last open goal, or opened the first).
async fn publish_on_open_goal_boundary(deps: &SentencePlanEffectsDeps, ctx: &EffectContext, changed: &str, event_type: &str, description: &str) {
    if !is_post_agreement(&ctx.get_data("latestAgreementStatus")) {
        return;
    }
    if !has_no_other_open_goals(&data_list(ctx, "goals"), changed) {
        return;
    }
    let session = ctx.get_session();
    let crn = session.get("caseDetails").get("crn");
    if !crn.truthy() {
        crate::error!("Cannot publish goals domain event: missing crn");
        return;
    }
    let identifier = session.get("sessionDetails").get("planIdentifier");
    let plan_uuid = (identifier.get("type").as_str() == Some("UUID")).then(|| identifier.get("uuid").to_js_string());
    deps.domain_events_service.publish(&goals_event(event_type, description, plan_uuid.as_deref(), &crn.to_js_string())).await;
}

pub async fn publish_goals_completed_event(deps: &SentencePlanEffectsDeps, ctx: &EffectContext, changed: &str) {
    publish_on_open_goal_boundary(deps, ctx, changed, "arns.sentence.plan.goals.completed", "No more open goals").await;
}

pub async fn publish_goals_added_event(deps: &SentencePlanEffectsDeps, ctx: &EffectContext, changed: &str) {
    publish_on_open_goal_boundary(deps, ctx, changed, "arns.sentence.plan.goals.added", "There is an open goal").await;
}

pub fn entries(deps: &Arc<SentencePlanEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // The supervision package and tier for the case. A tier failure never blocks the
        // package; a missing package (404) hides the tab; a failure shows an error instead.
        register_effect!("loadSupervisionPackage", deps, |ctx, args| {
            let crn = ctx.get_session().get("caseDetails").get("crn");
            if !crn.truthy() {
                crate::info!("Skipping supervision package: no CRN in session");
                return Ok(());
            }
            let crn = crn.to_js_string();
            let (package, tier) = tokio::join!(
                deps.mpop_components.get_supervision_package_frontend_context(&crn),
                deps.mpop_components.get_tier_details(&crn),
            );
            match tier.http_status {
                200 => {}
                404 => crate::info!({ "crn": crn }, "No confirmed tier for this person yet"),
                status => crate::error!({ "crn": crn, "httpStatus": status }, "Failed to fetch tier details from MPoP Components API"),
            }
            ctx.set_data("tierCalculation", Value::from_json(&tier.calculation))?;
            match package {
                Err(e) => {
                    ctx.set_data("supervisionPackageError", Value::Bool(true))?;
                    crate::error!({ "err": e.to_string(), "crn": crn }, "Failed to load supervision package");
                }
                Ok(None) => crate::info!({ "crn": crn }, "No supervision package for this person yet"),
                Ok(Some(context)) if context.get("outcome").and_then(serde_json::Value::as_str) == Some("error") => {
                    ctx.set_data("supervisionPackageError", Value::Bool(true))?;
                    crate::error!({ "crn": crn, "httpStatus": context.get("status") }, "Failed to load supervision package");
                }
                Ok(Some(context)) => ctx.set_data("supervisionPackageDetails", Value::from_json(&context))?,
            }
            Ok(())
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;
    use forge_core::obj;

    #[test]
    fn open_goal_boundary() {
        let goals = vec![obj! { "uuid": "a", "status": "ACTIVE" }, obj! { "uuid": "b", "status": "ACHIEVED" }];
        assert!(has_no_other_open_goals(&goals, "a"));
        assert!(!has_no_other_open_goals(&goals, "b"));
    }
}
