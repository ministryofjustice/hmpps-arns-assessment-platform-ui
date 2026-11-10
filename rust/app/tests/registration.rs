//! Every form package passes Forge's registration checks (JSON-serialisable definitions, known
//! components and functions, no route clashes), as the server does at startup.

use aap_ui::config::config;
use aap_ui::services::Services;
use aap_ui::web::build_forge;
use forge_core::engine::forge::ForgeOptions;

#[tokio::test]
async fn all_packages_register() {
    // SAFETY: set before anything reads the environment.
    unsafe {
        std::env::set_var("FORM_STRENGTHS_AND_NEEDS_ENABLED", "true");
        std::env::set_var("FORM_TRAINING_SESSION_LAUNCHER_ENABLED", "true");
        std::env::set_var("FORM_DATA_DELETION_TOOL_ENABLED", "true");
    }
    let services = Services::new(config());
    let forge = build_forge(&services, ForgeOptions::default());
    let paths: Vec<String> = forge.topology().into_iter().map(|r| r.template_path).collect();
    for expected in ["/access/:service/oasys", "/platform", "/training-session-launcher", "/strengths-and-needs", "/data-deletion-tool/configuration", "/sentence-plan/v1.0/plan/overview", "/sentence-plan/v1.0/goal/:uuid/add-steps"] {
        assert!(paths.iter().any(|p| p.starts_with(expected)), "{expected} not mounted: {paths:?}");
    }
}
