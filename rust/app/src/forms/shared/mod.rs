//! Shared form building blocks: audit, gender, navigation stack, privacy screen and target service.

pub mod audit;
pub mod gender;
pub mod navigation;
pub mod privacy_screen;

use forge_core::{EffectContext, Value};

/// `setTargetService`: records on the session which service the user is working in, so shared
/// platform pages can adapt (e.g. the footer).
pub fn set_target_service(ctx: &EffectContext, service: &Value) {
    ctx.update_session(|s| s.set("targetService", service.clone()));
}
