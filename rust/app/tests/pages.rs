//! The app's own pages render through the page environment (layout inheritance included: the
//! layouts `super()` into GOV.UK's nested `govukFooter` block).

use aap_ui::config::config;
use aap_ui::web::views::{app_locals, page_engine};
use aap_ui::web::AppPaths;
use forge_core::Value;

fn render(template: &str, extra: serde_json::Value) -> String {
    let engine = page_engine(&AppPaths::from_env());
    let mut context = app_locals(config());
    for (k, v) in extra.as_object().unwrap() {
        context.set(k.as_str(), Value::from_json(v));
    }
    engine.render(template, &context).unwrap_or_else(|e| panic!("{template}: {e:?}"))
}

#[test]
fn index_page() {
    let html = render("pages/index.njk", serde_json::json!({ "currentTime": "now" }));
    assert!(html.contains("The time is currently now"));
    assert!(html.contains("govuk-footer"), "GOV.UK footer from super()");
}

#[test]
fn error_page() {
    let html = render("pages/error.njk", serde_json::json!({ "message": "Boom", "status": 500 }));
    assert!(html.contains("Sorry, there is a problem with the service"));
    assert!(html.contains("Status code: 500"));
}

#[test]
fn auth_error_page() {
    render("autherror.njk", serde_json::json!({}));
}

#[test]
fn platform_policy_page() {
    let html = render("platform/views/accessibility-statement.njk", serde_json::json!({ "step": { "title": "Accessibility" } }));
    assert!(html.contains("Accessibility - Assess and plan"));
}

#[test]
fn sentence_plan_step_layout() {
    let html = render(
        "sentence-plan/views/sentence-plan-step.njk",
        serde_json::json!({
            "step": { "title": "Plan", "path": "/overview" },
            "data": { "caseData": { "name": { "forename": "Sam", "surname": "Smith" }, "crn": "X123456" } },
            "headerPageHeading": "Sam's plan",
            "blocks": ["<p>block</p>"],
            "fieldValidationErrors": [],
            "domainValidationErrors": [],
        }),
    );
    assert!(html.contains("Sam&#39;s plan"), "escaped page heading");
    assert!(html.contains("<p>block</p>"));
}

#[test]
fn sentence_plan_simple_page() {
    render("sentence-plan/views/simple-page.njk", serde_json::json!({ "step": { "title": "x" }, "blocks": [] }));
}
