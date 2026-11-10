//! Training Session Launcher: launches training
//! sessions into the ARNS services (scenario browser, customisation, sessions manager).

pub mod components;
pub mod effects;
pub mod flags;
pub mod form;
pub mod html;
pub mod scenarios;
pub mod transformers;

use std::sync::Arc;

use forge_core::ForgePackage;

pub use effects::TrainingSessionLauncherEffectsDeps;
pub use form::training_session_launcher_journey;

pub fn package(deps: Arc<TrainingSessionLauncherEffectsDeps>) -> ForgePackage {
    let mut package = ForgePackage::new(training_session_launcher_journey())
        .with_components(components::components())
        .with_functions(effects::entries(&deps))
        .with_functions(transformers::entries());
    package.enabled = crate::config::config().forms.training_session_launcher_enabled;
    package
}
