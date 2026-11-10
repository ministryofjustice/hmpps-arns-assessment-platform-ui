//! Snapshots of every form package's journey definition (`fixtures/journeys/*.json`): the JSON
//! must stay identical, key order included, because block keys decide Forge's AST node IDs (and so
//! the field ids and answers saved against them).
//!
//! When a change to a journey is intended, rewrite the snapshots and review the diff:
//!   UPDATE_FIXTURES=1 cargo test --test journey_snapshots
//!
//! Run without the app's environment variables set: the snapshots use the configuration defaults
//! (feedback URLs and so on).

use forge_core::Value;

fn fixture_path(name: &str) -> String {
    format!("{}/../fixtures/journeys/{name}.json", env!("CARGO_MANIFEST_DIR"))
}

fn fixture(name: &str) -> serde_json::Value {
    let path = fixture_path(name);
    let text = std::fs::read_to_string(&path).unwrap_or_else(|e| panic!("{path}: {e}"));
    serde_json::from_str(&text).expect("fixture JSON")
}

/// The first place two JSON values differ, as a path and the two values (truncated).
fn first_difference(path: &str, expected: &serde_json::Value, actual: &serde_json::Value) -> Option<String> {
    use serde_json::Value as J;
    let show = |v: &J| {
        let s = v.to_string();
        if s.len() > 400 { format!("{}…", &s[..400]) } else { s }
    };
    match (expected, actual) {
        (J::Object(e), J::Object(a)) => {
            let ek: Vec<_> = e.keys().collect();
            let ak: Vec<_> = a.keys().collect();
            if ek != ak {
                return Some(format!("{path}: keys differ\n  expected {ek:?}\n  actual   {ak:?}"));
            }
            e.iter().find_map(|(k, v)| first_difference(&format!("{path}.{k}"), v, &a[k]))
        }
        (J::Array(e), J::Array(a)) => {
            if e.len() != a.len() {
                return Some(format!("{path}: length {} vs {}\n  expected {}\n  actual   {}", e.len(), a.len(), show(expected), show(actual)));
            }
            e.iter().zip(a).enumerate().find_map(|(i, (e, a))| first_difference(&format!("{path}[{i}]"), e, a))
        }
        (e, a) if e == a => None,
        (e, a) => Some(format!("{path}:\n  expected {}\n  actual   {}", show(e), show(a))),
    }
}

fn assert_parity(name: &str, journey: Value) {
    let actual = journey.to_json();
    if std::env::var_os("UPDATE_FIXTURES").is_some() {
        std::fs::write(fixture_path(name), format!("{}\n", serde_json::to_string(&actual).unwrap())).expect("write snapshot");
        return;
    }
    let expected = fixture(name);
    if let Some(diff) = first_difference("journey", &expected, &actual) {
        panic!("{name} differs from its snapshot at {diff}");
    }
    assert_eq!(serde_json::to_string(&expected).unwrap(), serde_json::to_string(&actual).unwrap());
}

#[test]
fn access_journey_matches_snapshot() {
    assert_parity("access", aap_ui::forms::access::access_journey());
}

#[test]
fn data_deletion_tool_journey_matches_snapshot() {
    assert_parity("data-deletion-tool", aap_ui::forms::data_deletion_tool::data_deletion_tool_journey());
}

#[test]
fn sentence_plan_journey_matches_snapshot() {
    assert_parity("sentence-plan", aap_ui::forms::sentence_plan::sentence_plan_journey());
}

#[test]
fn platform_journey_matches_snapshot() {
    assert_parity("platform", aap_ui::forms::platform::platform_policies_journey());
}

/// A sub-journey of the strengths and needs fixture, by child indices.
fn san_child(path: &[usize]) -> serde_json::Value {
    let mut node = fixture("strengths-and-needs");
    for &i in path {
        node = node["children"][i].clone();
    }
    node
}

/// A section's journey against its part of the whole SAN snapshot (rewritten by the whole-journey
/// test).
fn assert_value_parity(name: &str, expected: serde_json::Value, actual: Value) {
    if std::env::var_os("UPDATE_FIXTURES").is_some() {
        return;
    }
    let actual = actual.to_json();
    if let Some(diff) = first_difference("journey", &expected, &actual) {
        panic!("{name} differs from its snapshot at {diff}");
    }
}

#[test]
fn san_finance_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("finance", san_child(&[0, 2]), journeys::finance::journey_());
}

#[test]
fn san_alcohol_use_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("alcohol-use", san_child(&[0, 4]), journeys::alcohol_use::journey_());
}

#[test]
fn san_health_wellbeing_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("health-wellbeing", san_child(&[0, 5]), journeys::health_wellbeing::journey_());
}

#[test]
fn san_employment_and_education_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("employment-and-education", san_child(&[0, 1]), journeys::employment_and_education::journey_());
}

#[test]
fn san_accommodation_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("accommodation", san_child(&[0, 0]), journeys::accommodation::journey_());
}

#[test]
fn san_personal_relationships_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("personal-relationships", san_child(&[0, 6]), journeys::personal_relationships_and_community::journey_());
}

#[test]
fn san_thinking_behaviours_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("thinking-behaviours", san_child(&[0, 7]), journeys::thinking_behaviours_and_attitudes::journey_());
}

#[test]
fn san_drug_use_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("drug-use", san_child(&[0, 3]), journeys::drug_use::journey_());
}

#[test]
fn san_offence_analysis_journey_matches_snapshot() {
    use aap_ui::forms::strengths_and_needs::v1::journeys;
    assert_value_parity("offence-analysis", san_child(&[0, 8]), journeys::offence_analysis::journey_());
}

#[test]
fn strengths_and_needs_journey_matches_snapshot() {
    assert_parity("strengths-and-needs", aap_ui::forms::strengths_and_needs::strengths_and_needs_root_journey());
}

#[test]
fn training_session_launcher_journey_matches_snapshot() {
    assert_parity("training-session-launcher", aap_ui::forms::training_session_launcher::training_session_launcher_journey());
}
