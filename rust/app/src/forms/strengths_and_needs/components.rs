//! SAN's own components: the delete confirmation modal.

use forge_core::authoring::Component;
use forge_core::engine::registries::ComponentEntry;
use forge_core::{Value, obj};

pub const MODAL: Component = Component::basic("modal");

pub fn components() -> Vec<ComponentEntry> {
    vec![ComponentEntry::new("modal").with_render(forge_runjucks::nunjucks_render(
        "strengths-and-needs/components/modal/modal.njk",
        |block: &Value| obj! { "id": block.get("id"), "title": block.get("title"), "buttonText": block.get("buttonText") },
    ))]
}
