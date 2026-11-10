//! Platform policy pages: accessibility statement, cookies policy and
//! privacy policy, linked from the footer and shared by the assessment forms.

use forge_core::ForgePackage;

use crate::config::config;
use crate::forms::dsl::*;

pub const BASE_URL: &str = "/platform";
pub const ACCESSIBILITY_STEP_PATH: &str = "/accessibility";
pub const COOKIES_POLICY_STEP_PATH: &str = "/cookies-policy";
pub const PRIVACY_POLICY_STEP_PATH: &str = "/privacy-policy";

pub fn create_accessibility_statement_step(base_url: &str, feedback_url: &str) -> Value {
    step(obj! {
        "path": ACCESSIBILITY_STEP_PATH,
        "title": "Accessibility statement for Assess and plan",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "template": "platform/views/accessibility-statement",
            "locals": obj! {
                "footerBaseUrl": base_url,
                "feedbackUrl": feedback_url,
                "hideSessionTimeoutModal": true,
            },
        },
    })
}

pub fn create_cookies_policy_step(base_url: &str) -> Value {
    step(obj! {
        "path": COOKIES_POLICY_STEP_PATH,
        "title": "Cookies policy for Assess and plan",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "template": "platform/views/cookies-policy",
            "locals": obj! { "footerBaseUrl": base_url, "hideSessionTimeoutModal": true },
        },
    })
}

pub fn create_privacy_policy_step(base_url: &str) -> Value {
    step(obj! {
        "path": PRIVACY_POLICY_STEP_PATH,
        "title": "Privacy policy",
        "reachability": obj! { "entryWhen": true },
        "view": obj! {
            "template": "platform/views/privacy-policy",
            "locals": obj! { "footerBaseUrl": base_url, "hideSessionTimeoutModal": true },
        },
    })
}

/// `createPlatformPages`: the three footer pages, under the given base URL.
pub fn create_platform_pages(base_url: &str, feedback_url: &str) -> Vec<Value> {
    vec![
        create_accessibility_statement_step(base_url, feedback_url),
        create_cookies_policy_step(base_url),
        create_privacy_policy_step(base_url),
    ]
}

/// `escapeRegex` (escapes `.*+?^${}()|[]\/`).
fn escape_regex(s: &str) -> String {
    let mut out = String::new();
    for c in s.chars() {
        if ".*+?^${}()|[]\\/".contains(c) {
            out.push('\\');
        }
        out.push(c);
    }
    out
}

/// True unless the request path ends with one of the platform pages.
pub fn not_a_platform_page() -> Value {
    let endpoints = [ACCESSIBILITY_STEP_PATH, COOKIES_POLICY_STEP_PATH, PRIVACY_POLICY_STEP_PATH];
    let pattern = format!("(?:{})$", endpoints.iter().map(|e| escape_regex(e)).collect::<Vec<_>>().join("|"));
    request::path().not().matches(condition::string::matches_regex(pattern))
}

pub fn platform_policies_journey() -> Value {
    let feedback_url = &config().national_rollout_feedback_url;
    journey(obj! {
        "code": "platform-policies",
        "title": "Assess and plan",
        "path": BASE_URL,
        "reachability": obj! { "disableReachabilityChecks": true },
        "steps": create_platform_pages(BASE_URL, feedback_url),
        "view": obj! { "locals": obj! { "feedbackUrl": feedback_url.as_str() } },
    })
}

pub fn package() -> ForgePackage {
    ForgePackage::new(platform_policies_journey())
}
