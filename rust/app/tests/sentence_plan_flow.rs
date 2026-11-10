//! The sentence plan overview end to end through Forge: the v1 journey's access effects (session
//! from the access form, loading the plan from the AAP API, deriving goals and agreements,
//! navigation), the step's own effects and the page render, against a stub API.

use std::sync::Arc;

use aap_ui::config::config;
use aap_ui::services::Services;
use aap_ui::web::views::{app_locals, page_engine};
use aap_ui::web::{AppPaths, build_forge};
use forge_core::Value;
use forge_core::engine::forge::ForgeOptions;
use forge_core::engine::runtime::context::RequestLocation;
use forge_core::framework::{HttpMethod, OutcomeKind, RecordingResponse, RequestSnapshot};
use forge_runjucks::RunjucksRenderer;
use serde_json::{Value as Json, json};
use tokio::io::{AsyncReadExt, AsyncWriteExt};

fn wrap(v: &str) -> Json {
    json!({ "type": "Single", "value": v })
}

fn assessment() -> Json {
    json!({
        "assessmentUuid": "plan-1",
        "flags": [],
        "properties": {},
        "collections": [{
            "name": "GOALS",
            "uuid": "goals-1",
            "items": [{
                "uuid": "goal-1",
                "answers": {
                    "title": wrap("I will find somewhere stable to live"),
                    "area_of_need": wrap("accommodation"),
                    "target_date": wrap("2030-01-01T00:00:00.000Z"),
                },
                "properties": { "status": wrap("ACTIVE"), "status_date": wrap("2026-01-01T00:00:00.000Z") },
                "collections": [{
                    "name": "STEPS",
                    "uuid": "steps-1",
                    "items": [{
                        "uuid": "step-1",
                        "answers": { "actor": wrap("person_on_probation"), "status": wrap("IN_PROGRESS"), "description": wrap("Contact the housing team") },
                        "properties": { "status_date": wrap("2026-01-01T00:00:00.000Z") },
                    }],
                }],
            }],
        }],
    })
}

/// A minimal HTTP stub of HMPPS Auth (system tokens) and the AAP API's query endpoint.
/// It runs on its own thread and runtime, as each test has a runtime of its own.
fn stub_api() -> String {
    let std_listener = std::net::TcpListener::bind("127.0.0.1:0").unwrap();
    std_listener.set_nonblocking(true).unwrap();
    let url = format!("http://{}", std_listener.local_addr().unwrap());
    std::thread::spawn(move || {
        let runtime = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();
        runtime.block_on(async move { serve(tokio::net::TcpListener::from_std(std_listener).unwrap()).await });
    });
    url
}

async fn serve(listener: tokio::net::TcpListener) {
    {
        loop {
            let Ok((mut socket, _)) = listener.accept().await else { return };
            tokio::spawn(async move {
                let mut buf = Vec::new();
                let mut chunk = [0u8; 8192];
                let (head, body) = loop {
                    let n = socket.read(&mut chunk).await.unwrap_or(0);
                    if n == 0 {
                        return;
                    }
                    buf.extend_from_slice(&chunk[..n]);
                    let text = String::from_utf8_lossy(&buf).to_string();
                    if let Some(i) = text.find("\r\n\r\n") {
                        let head = text[..i].to_string();
                        let length = head
                            .lines()
                            .find_map(|l| l.to_lowercase().strip_prefix("content-length:").map(|v| v.trim().parse::<usize>().unwrap_or(0)))
                            .unwrap_or(0);
                        if buf.len() >= i + 4 + length {
                            break (head, String::from_utf8_lossy(&buf[i + 4..i + 4 + length]).to_string());
                        }
                    }
                };
                let path = head.split_whitespace().nth(1).unwrap_or_default().to_string();
                let (status, response) = if path.ends_with("/oauth/token") {
                    (200, json!({ "access_token": "system-token", "expires_in": 3600 }))
                } else if path == "/query" {
                    let request: Json = serde_json::from_str(&body).unwrap_or_default();
                    let results: Vec<Json> = request["queries"]
                        .as_array()
                        .unwrap()
                        .iter()
                        .map(|q| match q["type"].as_str() {
                            Some("AssessmentVersionQuery") => json!({ "result": assessment() }),
                            Some("TimelineQuery") => json!({ "result": { "timeline": [] } }),
                            _ => json!({ "result": null }),
                        })
                        .collect();
                    (200, json!({ "queries": results }))
                } else {
                    (404, json!({ "status": 404 }))
                };
                let body = response.to_string();
                let reply = format!("HTTP/1.1 {status} OK\r\ncontent-type: application/json\r\ncontent-length: {}\r\nconnection: close\r\n\r\n{body}", body.len());
                let _ = socket.write_all(reply.as_bytes()).await;
            });
        }
    }
}

struct Harness {
    forge: forge_core::Forge,
    renderer: Arc<RunjucksRenderer>,
}

/// The stub API is shared; the app's services are built per test, as their HTTP connection
/// pools belong to the test's runtime.
async fn harness() -> Harness {
    static API: std::sync::OnceLock<String> = std::sync::OnceLock::new();
    API.get_or_init(|| {
        let api = stub_api();
        // SAFETY: set once, before anything reads the configuration.
        unsafe {
            std::env::set_var("HMPPS_AUTH_URL", &api);
            std::env::set_var("AAP_API_URL", &api);
            std::env::set_var("FEATURE_FLAG_URL", "");
            std::env::set_var("FORM_SENTENCE_PLAN_ENABLED", "true");
        }
        api
    });
    let services = Services::new(config());
    let mut renderer = RunjucksRenderer::new(page_engine(&AppPaths::from_env()));
    renderer.default_template = "partials/form-step".into();
    Harness { forge: build_forge(&services, ForgeOptions::default()), renderer: Arc::new(renderer) }
}

/// Runs a GET of `template` (the route) at `path` and returns the page and the final session.
async fn get(template: &str, path: &str, params: Json, query: Json) -> (String, Value) {
    let h = &harness().await;
    let route = h.forge.topology().into_iter().find(|r| r.template_path == template).unwrap_or_else(|| panic!("no route {template}"));
    let mut state = app_locals(config());
    for (k, v) in [
        ("requestId", json!("req-1")),
        ("csrfToken", json!("csrf")),
        ("cspNonce", json!("nonce")),
        ("featureFlags", json!({})),
        ("user", json!({ "id": "AUSER", "name": "A User", "displayName": "A User", "authSource": "OASYS", "token": "t", "userRoles": [] })),
    ] {
        state.set(k, Value::from_json(&v));
    }
    let session = Value::from_json(&json!({
        "accessDetails": { "accessType": "OASYS", "planAccessMode": "READ_WRITE", "oasysRedirectUrl": "http://oasys" },
        "caseDetails": { "crn": "X123456", "name": { "forename": "Sam", "surname": "Smith" } },
        "handoverContext": { "sentencePlanContext": { "planId": "plan-1" } },
        "practitionerDetails": { "displayName": "Pat Practitioner" },
        "privacyAccepted": true,
    }));
    let snapshot = RequestSnapshot {
        node_id: route.node_id.as_str().into(),
        method: HttpMethod::Get,
        location: RequestLocation {
            origin: "http://localhost".into(),
            href: format!("http://localhost{path}"),
            pathname: path.into(),
            base_path: forge_core::route_path::resolve_path_params(&route.base_path, &Value::from_json(&params)),
        },
        params: Value::from_json(&params),
        query: Value::from_json(&query),
        post: Value::empty_object(),
        headers: Value::object(forge_core::value::Map::from_iter([("method".into(), Value::from("GET"))])),
        cookies: Value::empty_object(),
        state,
        session,
    };
    let outcome = h
        .forge
        .execute_with_renderer(&snapshot, Arc::new(RecordingResponse::default()), h.renderer.clone())
        .await
        .unwrap_or_else(|e| panic!("{path} failed: {e}"));
    match outcome.kind {
        OutcomeKind::Render { output: Some(html), .. } => (html.to_js_string(), outcome.session),
        other => panic!("{path}: expected a render, got {other:?}"),
    }
}

fn assert_contains(html: &str, page: &str, expected: &[&str]) {
    for e in expected {
        assert!(html.contains(e), "{page} is missing {e:?}");
    }
}

#[tokio::test]
async fn plan_overview_renders_the_plan() {
    let (html, session) =
        get("/sentence-plan/v1.0/plan/overview", "/sentence-plan/v1.0/plan/overview", json!({}), json!({ "goalStatusTab": "current" })).await;
    assert_contains(
        &html,
        "plan overview",
        &["I will find somewhere stable to live", "Contact the housing team", "Goals to work on now (1)", "Sam&#39;s plan", "goal-list__item"],
    );
    // the plan identifier and navigation stack land in the session
    assert_eq!(session.get("sessionDetails").get("planIdentifier").get("uuid").to_js_string(), "plan-1");
    assert_eq!(session.get("sentence-plan").as_array().map(|a| a.len()), Some(0));
}

#[tokio::test]
async fn add_steps_renders_the_step_editor() {
    let path = "/sentence-plan/v1.0/goal/goal-1/add-steps";
    let (html, session) = get("/sentence-plan/v1.0/goal/:uuid/add-steps", path, json!({ "uuid": "goal-1" }), json!({})).await;
    assert_contains(
        &html,
        "add steps",
        &["Add or update steps", "wrapping-select-wrapper", "button-as-link", "step_actor_0", "Contact the housing team", "Choose someone"],
    );
    let steps = session.get("stepChanges").get("goal-1").get("steps");
    assert_eq!(steps.get("0").get("id").to_js_string(), "step-1", "the saved step is in the edit session");
}

#[tokio::test]
async fn add_goal_renders_the_goal_form() {
    let path = "/sentence-plan/v1.0/goal/new/add-goal/accommodation";
    let (html, _) = get("/sentence-plan/v1.0/goal/:uuid/add-goal/:areaOfNeed", path, json!({ "uuid": "new", "areaOfNeed": "accommodation" }), json!({})).await;
    assert_contains(
        &html,
        "add goal",
        &[
            "What goal does Sam aim to achieve?",
            "accessible-autocomplete-wrapper",
            "autocomplete-data-goal_title",
            "I will maintain my current accommodation",
            "Area of need: <strong>accommodation</strong>",
            "can_start_now",
        ],
    );
}
