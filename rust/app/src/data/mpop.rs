//! `MPoPComponents` (`@ministryofjustice/hmpps-mpop-frontend-components-lib`): tier details and
//! the supervision package context for the MPoP supervision package component. A 404 is "no
//! data yet", not an error.

use std::sync::Arc;

use serde_json::{Value as Json, json};

use super::rest_client::{ApiResult, As, AuthenticationClient, RestClient};
use crate::config::Config;

/// The tier tag the component shows next to the score.
fn tier_tag(kind: &str) -> Json {
    match kind {
        "missing" => json!({ "text": "Missing", "color": "red" }),
        "provisional" => json!({ "text": "Provisional", "color": "orange" }),
        "unavailable" => json!({ "text": "Unavailable", "color": "grey" }),
        _ => json!({ "text": null, "color": null }),
    }
}

fn unavailable_calculation() -> Json {
    json!({
        "tierScore": "",
        "calculationId": "",
        "calculationDate": "",
        "changeReason": "",
        "provisional": false,
        "tag": tier_tag("unavailable"),
    })
}

/// `getTierDetails`: the calculation (tagged) and the HTTP status it came with.
pub struct TierDetails {
    pub calculation: Json,
    pub http_status: u16,
}

pub struct MpopComponentsClient {
    tier_api: RestClient,
    supervision_package_api: RestClient,
}

impl MpopComponentsClient {
    pub fn new(config: &Config, auth: Arc<AuthenticationClient>) -> Self {
        Self {
            tier_api: RestClient::new("Tier API", &config.tier_api, Some(auth.clone())),
            supervision_package_api: RestClient::new("Supervision Package API", &config.supervision_package_api, Some(auth)),
        }
    }

    /// GET, with a 404 as `None`.
    async fn get_or_none(client: &RestClient, path: &str) -> ApiResult<Option<Json>> {
        match client.get(path, As::System).await {
            Ok(v) if v.is_null() => Ok(None),
            Ok(v) => Ok(Some(v)),
            Err(e) if e.status == Some(404) => Ok(None),
            Err(e) => Err(e),
        }
    }

    pub async fn get_tier_details(&self, crn: &str) -> TierDetails {
        match Self::get_or_none(&self.tier_api, &format!("/v3/crn/{crn}/tier")).await {
            Ok(None) => TierDetails { calculation: unavailable_calculation(), http_status: 404 },
            Ok(Some(mut calculation)) => {
                let score = calculation.get("tierScore").and_then(Json::as_str).unwrap_or_default().to_string();
                let provisional = calculation.get("provisional").and_then(Json::as_bool).unwrap_or(false);
                let tag = if score == "MISSING" {
                    tier_tag("missing")
                } else if !score.is_empty() && provisional {
                    tier_tag("provisional")
                } else {
                    tier_tag("none")
                };
                if let Some(o) = calculation.as_object_mut() {
                    o.insert("tag".into(), tag);
                }
                TierDetails { calculation, http_status: 200 }
            }
            Err(e) => TierDetails { calculation: unavailable_calculation(), http_status: e.status.unwrap_or(500) },
        }
    }

    /// `getSupervisionPackageFrontendContext`: the package context, `None` for a 404.
    pub async fn get_supervision_package_frontend_context(&self, crn: &str) -> ApiResult<Option<Json>> {
        let result = Self::get_or_none(&self.supervision_package_api, &format!("/frontend-context/{crn}")).await;
        if let Err(e) = &result {
            if e.status == Some(503) {
                crate::error!("Supervision Package API unavailable (503) for crn {crn}");
            } else {
                crate::error!("Supervision Package API internal error (500) for crn {crn}");
            }
        }
        result
    }
}
