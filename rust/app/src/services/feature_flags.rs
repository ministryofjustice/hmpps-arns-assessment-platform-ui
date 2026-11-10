//! `FeatureFlagService` (Flipt) and `BooleanFeatureFlags`: the flags templates read as
//! `featureFlags.<nunjucksKey>`, evaluated per user with the fallback state when Flipt is
//! unavailable. Results are cached per user for the client's update interval.

use std::collections::HashMap;
use std::sync::Mutex;
use std::time::{Duration, Instant};

use serde_json::{Value as Json, json};

pub const FEATURE_FLAG_NAMESPACE: &str = "hmpps-arns-assessment-platform";
pub const UPDATE_INTERVAL_SECONDS: u64 = 120;

pub struct FeatureFlag {
    pub flipt_key: &'static str,
    pub nunjucks_key: &'static str,
    pub fallback_state: bool,
}

pub const BOOLEAN_FEATURE_FLAGS: &[FeatureFlag] = &[
    FeatureFlag { flipt_key: "sp-enable-smart-survey-in-private-beta", nunjucks_key: "smartSurveyInPrivateBetaEnabled", fallback_state: false },
    FeatureFlag { flipt_key: "sp-enable-smart-survey-in-national-rollout", nunjucks_key: "smartSurveyInNationalRolloutEnabled", fallback_state: false },
    FeatureFlag { flipt_key: "sp-enable-print-and-share", nunjucks_key: "printAndShareEnabled", fallback_state: false },
    FeatureFlag { flipt_key: "sp-enable-supervision-package", nunjucks_key: "supervisionPackageEnabled", fallback_state: false },
    FeatureFlag { flipt_key: "sp-downtime-notification-banner", nunjucks_key: "downtimeNotificationBanner", fallback_state: false },
];

pub fn fallback_feature_flags(flags: &[FeatureFlag]) -> Json {
    Json::Object(flags.iter().map(|f| (f.nunjucks_key.to_string(), json!(f.fallback_state))).collect())
}

pub struct FeatureFlagService {
    url: String,
    http: reqwest::Client,
    cache: Mutex<HashMap<String, (Instant, Json)>>,
}

impl FeatureFlagService {
    pub fn new(url: &str) -> Self {
        Self {
            url: url.trim_end_matches('/').to_string(),
            http: reqwest::Client::builder().timeout(Duration::from_secs(5)).build().expect("HTTP client"),
            cache: Mutex::new(HashMap::new()),
        }
    }

    /// `evaluateBooleanFlags`: `{ nunjucksKey: enabled }` for every flag.
    pub async fn evaluate_boolean_flags(&self, flags: &[FeatureFlag], user_id: Option<&str>) -> Json {
        if self.url.is_empty() {
            return fallback_feature_flags(flags);
        }
        let entity_id = user_id.filter(|u| !u.is_empty()).unwrap_or("fallbackUser").to_string();
        if let Some((at, cached)) = self.cache.lock().unwrap().get(&entity_id)
            && at.elapsed() < Duration::from_secs(UPDATE_INTERVAL_SECONDS)
        {
            return cached.clone();
        }
        let requests: Vec<Json> = flags
            .iter()
            .map(|f| json!({ "namespaceKey": FEATURE_FLAG_NAMESPACE, "flagKey": f.flipt_key, "entityId": entity_id, "context": {} }))
            .collect();
        let response = self.http.post(format!("{}/evaluate/v1/batch", self.url)).json(&json!({ "requests": requests })).send().await;
        let body: Option<Json> = match response {
            Ok(r) if r.status().is_success() => r.json().await.ok(),
            Ok(r) => {
                crate::error!("Flipt responded {} for feature flag evaluation", r.status());
                None
            }
            Err(e) => {
                crate::error!({ "err": e.to_string() }, "Unable to reach Flipt for feature flag evaluation");
                None
            }
        };
        let Some(body) = body else { return fallback_feature_flags(flags) };
        let responses = body.get("responses").and_then(Json::as_array).cloned().unwrap_or_default();
        let mut result = serde_json::Map::new();
        for (flag, response) in flags.iter().zip(responses.iter().chain(std::iter::repeat(&Json::Null))) {
            let enabled = response.get("booleanResponse").and_then(|b| b.get("enabled")).and_then(Json::as_bool);
            if enabled.is_none() {
                crate::error!("Error evaluating feature flag {}", flag.flipt_key);
            }
            result.insert(flag.nunjucks_key.to_string(), json!(enabled.unwrap_or(flag.fallback_state)));
        }
        let result = Json::Object(result);
        self.cache.lock().unwrap().insert(entity_id, (Instant::now(), result.clone()));
        result
    }
}
