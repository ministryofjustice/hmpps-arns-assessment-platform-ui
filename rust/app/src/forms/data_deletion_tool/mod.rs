//! The data deletion tool: loads an assessment's events and
//! timeline from a chosen environment's AAP API, lets an operator mark entries for deletion or
//! edit them, dry-runs the change and persists it.

pub mod components;
pub mod effects;
pub mod form;
pub mod transformers;

use std::sync::Arc;

use forge_core::ForgePackage;

pub use effects::DataDeletionToolEffectsDeps;
pub use form::data_deletion_tool_journey;

pub fn package(deps: Arc<DataDeletionToolEffectsDeps>) -> ForgePackage {
    let mut package = ForgePackage::new(data_deletion_tool_journey())
        .with_components(components::components())
        .with_functions(effects::entries(&deps))
        .with_functions(transformers::entries());
    package.enabled = crate::config::config().forms.data_deletion_tool_enabled;
    package
}
