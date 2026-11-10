//! The Runjucks environment, its filters and globals, and the app
//! locals every page sees.

use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;

use forge_core::Value;
use forge_runjucks::RunjucksEngine;
use runjucks_core::errors::RunjucksError;
use serde_json::{Value as Json, json};

use crate::config::Config;
use crate::utils::{DateFormat, format_date, initialise_name, possessive};

/// Where the app finds the files it reads at runtime.
#[derive(Clone, Debug)]
pub struct AppPaths {
    /// The app's files: `views/`, `forms/` (form templates), `dist/assets/` (built browser
    /// assets) and `node_modules/` (GOV.UK, MOJ and MPoP frontend packages).
    pub root: PathBuf,
    /// Forge's MOJ components (`templates/`).
    pub moj_components: PathBuf,
}

impl AppPaths {
    /// `APP_ROOT` (default: this crate's directory) and `FORGE_MOJ_COMPONENTS` (default: the
    /// `forge-moj-components` crate's directory).
    pub fn from_env() -> Self {
        let var = |name: &str| std::env::var_os(name).filter(|v| !v.is_empty()).map(PathBuf::from);
        Self {
            root: var("APP_ROOT").unwrap_or_else(|| PathBuf::from(env!("CARGO_MANIFEST_DIR"))),
            moj_components: var("FORGE_MOJ_COMPONENTS").unwrap_or_else(forge_moj_components::crate_dir),
        }
    }

    pub fn node_modules(&self) -> PathBuf {
        self.root.join("node_modules")
    }

    pub fn built_assets(&self) -> PathBuf {
        self.root.join("dist/assets")
    }
}

type Filter = Arc<dyn Fn(&Json, &[Json]) -> Result<Json, RunjucksError> + Send + Sync>;

fn string_filter(f: impl Fn(&str) -> Json + Send + Sync + 'static) -> Filter {
    Arc::new(move |v, _| Ok(f(v.as_str().unwrap_or_default())))
}

/// `mapNavItem`: navigation data (`path`) to the nav-list-item macro's shape (`url`).
fn map_nav_item(item: &Json) -> Json {
    json!({
        "url": item.get("path").cloned().unwrap_or(Json::Null),
        "title": item.get("title").cloned().unwrap_or(Json::Null),
        "active": item.get("active").and_then(Json::as_bool).unwrap_or(false),
        "hiddenFromNavigation": item.get("hiddenFromNavigation").and_then(Json::as_bool).unwrap_or(false),
        "children": item.get("children").and_then(Json::as_array).map(|c| c.iter().map(map_nav_item).collect::<Vec<_>>()).unwrap_or_default(),
    })
}

/// `isDeepestActive`: active, with no visible active child.
fn is_deepest_active(item: &Json) -> bool {
    if item.get("active").and_then(Json::as_bool) != Some(true) {
        return false;
    }
    match item.get("children").and_then(Json::as_array) {
        Some(children) if !children.is_empty() => !children.iter().any(|c| {
            c.get("active").and_then(Json::as_bool) == Some(true) && c.get("hiddenFromNavigation").and_then(Json::as_bool) != Some(true)
        }),
        _ => true,
    }
}

/// `toErrorSummary`: validation results to error summary items.
fn to_error_summary(errors: &Json) -> Json {
    Json::Array(
        errors
            .as_array()
            .map(|a| {
                a.iter()
                    .map(|e| {
                        let block_code = e.get("blockCode").and_then(Json::as_str);
                        let href = match e.get("details").and_then(|d| d.get("href")).and_then(Json::as_str) {
                            Some(h) => h.to_string(),
                            None => block_code.map(|c| format!("#{c}")).unwrap_or_default(),
                        };
                        json!({
                            "text": e.get("message").cloned().unwrap_or(Json::Null),
                            "href": href,
                            "attributes": { "data-ai-id": format!("error-summary-link-{}", block_code.unwrap_or("submission_error")) },
                        })
                    })
                    .collect()
            })
            .unwrap_or_default(),
    )
}

/// `JSON.stringify(obj, null, spaces)`.
fn json_stringify(value: &Json, spaces: usize) -> String {
    if spaces == 0 {
        return value.to_string();
    }
    let indent = " ".repeat(spaces);
    let formatter = serde_json::ser::PrettyFormatter::with_indent(indent.as_bytes());
    let mut out = Vec::new();
    let mut serializer = serde_json::Serializer::with_formatter(&mut out, formatter);
    serde::Serialize::serialize(value, &mut serializer).ok();
    String::from_utf8(out).unwrap_or_default()
}

/// The asset manifest: `/assets/x.js` to its hashed name.
pub fn load_asset_manifest(paths: &AppPaths) -> HashMap<String, String> {
    let file = paths.built_assets().join("manifest.json");
    match std::fs::read_to_string(&file).ok().and_then(|s| serde_json::from_str::<HashMap<String, String>>(&s).ok()) {
        Some(m) => m,
        None => {
            crate::error!({ "path": file.display().to_string() }, "Could not read asset manifest file");
            HashMap::new()
        }
    }
}

/// The page environment: app views, form templates, then GOV.UK, MOJ and Forge's MOJ
/// component templates.
pub fn page_engine(paths: &AppPaths) -> RunjucksEngine {
    let nm = paths.node_modules();
    let mut engine = RunjucksEngine::new([
        paths.root.join("views"),
        paths.root.join("forms"),
        paths.moj_components.join("templates"),
        nm.join("govuk-frontend/dist"),
        nm.join("@ministryofjustice/frontend"),
        nm.join("@ministryofjustice/hmpps-mpop-frontend-components-lib/dist"),
    ]);
    let manifest = Arc::new(load_asset_manifest(paths));
    let env = engine.environment_mut();
    env.add_filter("possessive", string_filter(|s| Json::String(possessive(s))));
    env.add_filter("initialiseName", Arc::new(|v: &Json, _: &[Json]| Ok(initialise_name(v.as_str()).map_or(Json::Null, Json::String))));
    env.add_filter(
        "assetMap",
        Arc::new(move |v: &Json, _: &[Json]| {
            let url = v.as_str().unwrap_or_default();
            Ok(Json::String(manifest.get(url).cloned().unwrap_or_else(|| url.to_string())))
        }),
    );
    env.add_filter(
        "json",
        Arc::new(|v: &Json, args: &[Json]| Ok(Json::String(json_stringify(v, args.first().and_then(Json::as_u64).unwrap_or(2) as usize)))),
    );
    env.add_filter("formatSimpleDate", string_filter(|s| Json::String(format_date(s, DateFormat::Simple))));
    env.add_filter("mapNavItem", Arc::new(|v: &Json, _: &[Json]| Ok(map_nav_item(v))));
    env.add_filter("isDeepestActive", Arc::new(|v: &Json, _: &[Json]| Ok(Json::Bool(is_deepest_active(v)))));
    env.add_filter("toErrorSummary", Arc::new(|v: &Json, _: &[Json]| Ok(to_error_summary(v))));
    env.add_global_callable(
        "displayDateForToday",
        Arc::new(|_, _| Ok(Json::String(chrono::Local::now().format("%d %B %Y").to_string()))),
    );
    super::mpop_filters::register(&mut engine);
    engine
}

/// `app.locals`.
pub fn app_locals(config: &Config) -> Value {
    Value::from_json(&json!({
        "asset_path": "/assets/",
        "applicationName": "Assess and plan",
        "environmentName": config.environment_name,
        "environmentNameColour": if config.environment_name == "PRE-PRODUCTION" { "govuk-tag--green" } else { "" },
        "serviceNowFormUrl": config.service_now_form_url,
        "oasysUrl": config.oasys_url,
        "mpopUrl": config.mpop_url,
        "smartSurveyPopupCode": config.smart_survey_popup_code,
        "hmppsHeaderServiceNameLink": "/sentence-plan/v1.0/plan/overview",
        "appInsightsConnectionString": config.app_insights_connection_string,
        "sessionTimeoutConfig": {
            "warningAfterInactiveSeconds": config.session.warning_after_inactive_minutes * 60,
            "countdownSeconds": config.session.countdown_minutes * 60,
        },
    }))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deepest_active() {
        assert!(is_deepest_active(&json!({ "active": true, "children": [] })));
        assert!(!is_deepest_active(&json!({ "active": true, "children": [{ "active": true }] })));
        assert!(is_deepest_active(&json!({ "active": true, "children": [{ "active": true, "hiddenFromNavigation": true }] })));
    }

    #[test]
    fn error_summary_items() {
        let items = to_error_summary(&json!([{ "message": "Enter a name", "blockCode": "name" }, { "message": "Oops" }]));
        assert_eq!(items[0]["href"], "#name");
        assert_eq!(items[1]["attributes"]["data-ai-id"], "error-summary-link-submission_error");
    }

    #[test]
    fn stringifies_with_indent() {
        assert_eq!(json_stringify(&json!({ "a": 1 }), 2), "{\n  \"a\": 1\n}");
    }
}
