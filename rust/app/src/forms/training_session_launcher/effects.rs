//! Scenarios, preferences (Redis), sessions (coordinator, handover, Wiremock stubs)
//! and notifications.

use std::sync::Arc;

use forge_core::{EffectContext, ForgeResult, FunctionEntry, Value};
use serde_json::{Value as Json, json};
use sha2::{Digest, Sha256};

use super::flags::{apply_create_session_modifiers, excluded_fields, flags_of, resolve_handover_config};
use super::scenarios::schema::{field_config, randomize, rng};
use super::scenarios::stubbed_crns::is_stubbed_crn;
use super::scenarios::{SCENARIO_PRESETS, field_keys, preset_by_id, randomize_fields, resolve_preset, resolve_saved};
use crate::config::config;
use crate::data::{CoordinatorApiClient, HandoverApiClient, PreferencesStore, WiremockAdminClient};
use crate::forms::dsl::arg;
use crate::forms::dsl::http_error::internal;
use crate::forms::shared::gender::handover_gender_label;
use crate::register_effect;
use crate::utils::{DateFormat, format_date};

/// `TrainingSessionLauncherEffectsDeps`.
pub struct TrainingSessionLauncherEffectsDeps {
    pub handover_api_client: Arc<HandoverApiClient>,
    pub wiremock_admin_client: Arc<WiremockAdminClient>,
    pub coordinator_api_client: Arc<CoordinatorApiClient>,
    pub preferences_store: Arc<PreferencesStore>,
}

fn location_label(location: &Value) -> Value {
    match location.as_str() {
        Some("COMMUNITY") => Value::from("Community"),
        Some("PRISON") => Value::from("Prison"),
        _ if location.truthy() => location.clone(),
        _ => Value::from(""),
    }
}

fn or_empty(v: Value) -> Value {
    if v.truthy() { v } else { Value::from("") }
}

fn version_text(v: &Value) -> Value {
    if v.is_nullish() { Value::from("") } else { Value::from(v.to_js_string().trim().to_string()) }
}

fn format_date_of_birth(iso: &Value) -> Value {
    if !iso.truthy() {
        return Value::from("");
    }
    Value::from(format_date(&iso.to_js_string(), DateFormat::Simple))
}

/// `(name, score, threshold, harm, reoffending, strengths)` keys.
type NeedConfig = (&'static str, &'static str, &'static str, &'static str, &'static str, &'static str);

/// The scenario list's needs (finance and health have no score; they reuse the harm answer).
const SCENARIO_NEEDS: [NeedConfig; 9] = [
    ("Accommodation", "accOtherWeightedScore", "accThreshold", "accLinkedToHarm", "accLinkedToReoffending", "accStrengths"),
    ("Education, Training & Employability", "eteOtherWeightedScore", "eteThreshold", "eteLinkedToHarm", "eteLinkedToReoffending", "eteStrengths"),
    ("Finance", "financeLinkedToHarm", "financeLinkedToHarm", "financeLinkedToHarm", "financeLinkedToReoffending", "financeStrengths"),
    ("Drug Use", "drugOtherWeightedScore", "drugThreshold", "drugLinkedToHarm", "drugLinkedToReoffending", "drugStrengths"),
    ("Alcohol Use", "alcoholOtherWeightedScore", "alcoholThreshold", "alcoholLinkedToHarm", "alcoholLinkedToReoffending", "alcoholStrengths"),
    ("Health & Wellbeing", "emoLinkedToHarm", "emoLinkedToHarm", "emoLinkedToHarm", "emoLinkedToReoffending", "emoStrengths"),
    ("Personal Relationships & Community", "relOtherWeightedScore", "relThreshold", "relLinkedToHarm", "relLinkedToReoffending", "relStrengths"),
    ("Thinking, Behaviour & Attitudes", "thinkOtherWeightedScore", "thinkThreshold", "thinkLinkedToHarm", "thinkLinkedToReoffending", "thinkStrengths"),
    ("Lifestyle & Associates", "lifestyleOtherWeightedScore", "lifestyleThreshold", "lifestyleLinkedToHarm", "lifestyleLinkedToReoffending", "lifestyleStrengths"),
];

/// The sessions list's needs (scored needs only).
const SESSION_NEEDS: [NeedConfig; 7] = [
    SCENARIO_NEEDS[0],
    SCENARIO_NEEDS[1],
    SCENARIO_NEEDS[3],
    SCENARIO_NEEDS[4],
    SCENARIO_NEEDS[6],
    SCENARIO_NEEDS[7],
    SCENARIO_NEEDS[8],
];

/// JS `parseInt(String(v), 10)`; `None` for NaN.
fn parse_int(v: &Value) -> Option<i64> {
    let s = v.to_js_string();
    let s = s.trim_start();
    let (sign, rest) = match s.strip_prefix('-') {
        Some(r) => (-1, r),
        None => (1, s.strip_prefix('+').unwrap_or(s)),
    };
    let digits: String = rest.chars().take_while(char::is_ascii_digit).collect();
    digits.parse::<i64>().ok().map(|n| sign * n)
}

fn display_needs(values: &Value, configs: &[NeedConfig]) -> Value {
    Value::array(
        configs
            .iter()
            .filter(|(_, _, _, harm, reoffending, strengths)| {
                [harm, reoffending, strengths].iter().any(|k| !values.get(k).is_undefined())
            })
            .map(|(name, score, threshold, harm, reoffending, strengths)| {
                let score_value = values.get(score);
                let score = if score_value.is_undefined() { None } else { parse_int(&score_value) };
                forge_core::obj! {
                    "name": *name,
                    "score": score.map_or(Value::Null, |s| Value::Number(s as f64)),
                    "isHighScoring": values.get(threshold).as_str() == Some("YES"),
                    "linkedToHarm": values.get(harm),
                    "linkedToReoffending": values.get(reoffending),
                    "strengths": values.get(strengths),
                }
            })
            .collect(),
    )
}

/// `transformToDisplayScenario`.
fn display_scenario(scenario: &Value, is_custom: bool) -> Value {
    let values = scenario.get("values");
    forge_core::obj! {
        "id": scenario.get("id"),
        "name": scenario.get("name"),
        "shortDescription": scenario.get("shortDescription"),
        "description": scenario.get("description"),
        "flags": scenario.get("flags"),
        "randomizeFields": scenario.get("randomizeFields"),
        "givenName": or_empty(values.get("givenName")),
        "familyName": or_empty(values.get("familyName")),
        "dateOfBirth": format_date_of_birth(&values.get("dateOfBirth")),
        "gender": handover_gender_label(&values.get("gender")),
        "location": location_label(&values.get("location")),
        "crn": or_empty(values.get("crn")),
        "pnc": or_empty(values.get("pnc")),
        "oasysAssessmentPk": or_empty(values.get("oasysAssessmentPk")),
        "sentencePlanVersion": version_text(&values.get("sentencePlanVersion")),
        "sanAssessmentVersion": version_text(&values.get("sanAssessmentVersion")),
        "displayNeeds": display_needs(&values, &SCENARIO_NEEDS),
        "isCustom": is_custom,
        "rawScenario": scenario.clone(),
    }
}

/// `transformToDisplaySession`.
fn display_session(session: &Value) -> Value {
    let values = session.get("values");
    let mut out = session.clone();
    let pick = |own: Value, fallback: Value| if own.is_nullish() { fallback } else { own };
    let services: Vec<Value> = resolve_handover_config(&flags_of(&session.get("flags")))
        .available_services
        .iter()
        .map(|s| {
            let name = config().handover_target(s).map_or("", |t| t.display_name);
            forge_core::obj! { "value": *s, "text": name }
        })
        .collect();
    for (k, v) in [
        ("scenarioName", session.get("name")),
        ("displayNeeds", display_needs(&values, &SESSION_NEEDS)),
        ("givenName", or_empty(values.get("givenName"))),
        ("familyName", or_empty(values.get("familyName"))),
        ("dateOfBirth", format_date_of_birth(&values.get("dateOfBirth"))),
        ("gender", Value::from(handover_gender_label(&values.get("gender")))),
        ("location", location_label(&values.get("location"))),
        ("crn", or_empty(values.get("crn"))),
        ("pnc", or_empty(values.get("pnc"))),
        ("oasysAssessmentPk", or_empty(values.get("oasysAssessmentPk"))),
        ("sentencePlanVersion", version_text(&pick(session.get("sentencePlanVersion"), values.get("sentencePlanVersion")))),
        ("sanAssessmentVersion", version_text(&pick(session.get("sanAssessmentVersion"), values.get("sanAssessmentVersion")))),
        ("availableServices", Value::array(services)),
    ] {
        out.set(k, v);
    }
    out
}

fn preferences_id(ctx: &EffectContext, what: &str) -> ForgeResult<String> {
    match ctx.get_state("preferencesId") {
        Value::String(s) if !s.is_empty() => Ok(s.to_string()),
        _ => Err(internal(format!("Cannot {what}: preferencesId is missing from state"))),
    }
}

/// The `trainingLauncher` preferences (`{ savedScenarios, sessions }`).
async fn training_launcher(deps: &TrainingSessionLauncherEffectsDeps, id: &str) -> Json {
    let prefs = deps.preferences_store.get(id).await;
    let launcher = prefs.as_ref().and_then(|p| p.get("trainingLauncher")).cloned();
    launcher.filter(|l| l.is_object()).unwrap_or_else(|| json!({ "savedScenarios": [], "sessions": [] }))
}

/// Updates the `trainingLauncher` preferences, keeping the rest.
async fn update_training_launcher(deps: &TrainingSessionLauncherEffectsDeps, id: &str, f: impl FnOnce(&mut Json)) {
    deps.preferences_store
        .update(id, |current| {
            let mut current = current.filter(Json::is_object).unwrap_or_else(|| json!({}));
            let mut launcher =
                current.get("trainingLauncher").cloned().filter(Json::is_object).unwrap_or_else(|| json!({ "savedScenarios": [], "sessions": [] }));
            for key in ["savedScenarios", "sessions"] {
                if !launcher[key].is_array() {
                    launcher[key] = json!([]);
                }
            }
            f(&mut launcher);
            current["trainingLauncher"] = launcher;
            current
        })
        .await;
}

fn push_notification(ctx: &EffectContext, notification: Json) {
    ctx.update_session(|s| {
        let mut list = s.get("notifications").as_array().map(|a| a.to_vec()).unwrap_or_default();
        list.push(Value::from_json(&notification));
        s.set("notifications", Value::array(list));
    });
}

fn notification(kind: &str, title: &str, message: String, target: &str) -> Json {
    json!({ "type": kind, "title": title, "message": message, "target": target })
}

// Wiremock stubs ----------------------------------------------------------------------------

/// A UUID derived from the URL path, so a stub is replaced rather than duplicated.
pub fn deterministic_uuid(input: &str) -> String {
    let hash = hex(&Sha256::digest(input.as_bytes()));
    format!("{}-{}-4{}-8{}-{}", &hash[0..8], &hash[8..12], &hash[13..16], &hash[17..20], &hash[20..32])
}

fn hex(bytes: &[u8]) -> String {
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

fn wiremock_stub(url_path: &str, body: Json) -> Json {
    json!({
        "id": deterministic_uuid(url_path),
        "priority": 1,
        "request": { "method": "GET", "urlPath": url_path },
        "metadata": { "source": "training-launcher", "createdAt": chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true) },
        "response": { "status": 200, "headers": { "Content-Type": "application/json" }, "jsonBody": body },
    })
}

fn arns_url_paths(crn: &str) -> [String; 2] {
    let prefix = config().arns_api_stub_prefix;
    [format!("{prefix}/needs/crn/{crn}"), format!("{prefix}/needs/{crn}")]
}

/// `(section, name, isSanSection, harm, reoffending, score, threshold)`.
const NEED_AREAS: [(&str, &str, bool, &str, &str, Option<&str>, Option<&str>); 9] = [
    ("ACCOMMODATION", "Accommodation", true, "accLinkedToHarm", "accLinkedToReoffending", Some("accOtherWeightedScore"), Some("accThreshold")),
    ("EMPLOYMENT_AND_EDUCATION", "Employment and education", true, "eteLinkedToHarm", "eteLinkedToReoffending", Some("eteOtherWeightedScore"), Some("eteThreshold")),
    ("FINANCE", "Finance", false, "financeLinkedToHarm", "financeLinkedToReoffending", None, None),
    ("DRUG_USE", "Drug use", true, "drugLinkedToHarm", "drugLinkedToReoffending", Some("drugOtherWeightedScore"), Some("drugThreshold")),
    ("ALCOHOL_USE", "Alcohol use", true, "alcoholLinkedToHarm", "alcoholLinkedToReoffending", Some("alcoholOtherWeightedScore"), Some("alcoholThreshold")),
    ("HEALTH_AND_WELLBEING", "Health and wellbeing", false, "emoLinkedToHarm", "emoLinkedToReoffending", None, None),
    (
        "PERSONAL_RELATIONSHIPS_AND_COMMUNITY",
        "Personal relationships and community",
        true,
        "relLinkedToHarm",
        "relLinkedToReoffending",
        Some("relOtherWeightedScore"),
        Some("relThreshold"),
    ),
    (
        "THINKING_ATTITUDES_AND_BEHAVIOUR",
        "Thinking, behaviours and attitudes",
        true,
        "thinkLinkedToHarm",
        "thinkLinkedToReoffending",
        Some("thinkOtherWeightedScore"),
        Some("thinkThreshold"),
    ),
    (
        "LIFESTYLE_AND_ASSOCIATES",
        "Lifestyle and associates",
        true,
        "lifestyleLinkedToHarm",
        "lifestyleLinkedToReoffending",
        Some("lifestyleOtherWeightedScore"),
        Some("lifestyleThreshold"),
    ),
];

/// `ArnsNeedsStubBuilder.build`: the two ARNS needs responses for the scenario's needs.
fn arns_needs_stubs(crn: &str, values: &Value) -> Vec<Json> {
    let s = |k: Option<&str>| k.map_or(Value::Undefined, |k| values.get(k));
    let linked = |v: &Value| match v.as_str() {
        Some("YES") => json!(true),
        Some("NO") => json!(false),
        _ => Json::Null,
    };
    let mut needs = Vec::new();
    for (section, name, is_san, harm, reoffending, score, threshold) in NEED_AREAS {
        let (h, r, sc, th) = (values.get(harm), values.get(reoffending), s(score), s(threshold));
        if [&h, &r, &sc, &th].iter().all(|v| v.is_undefined() || v.as_str() == Some("")) {
            continue;
        }
        let status = match th.as_str() {
            Some("YES") => "IDENTIFIED_NEED",
            Some("NO") => "NOT_IDENTIFIED_NEED",
            _ => "UNANSWERED_NEED",
        };
        let score_num = if sc.truthy() { sc.to_js_number() } else { f64::NAN };
        let mut need = serde_json::Map::new();
        need.insert("section".into(), json!(section));
        need.insert("name".into(), json!(name));
        for (k, v) in [("riskOfHarm", linked(&h)), ("riskOfReoffending", linked(&r))] {
            if !v.is_null() {
                need.insert(k.into(), v);
            }
        }
        if score_num.is_finite() {
            need.insert("score".into(), json!(score_num as i64));
        }
        needs.push((status, Json::Object(need), is_san));
    }
    if needs.is_empty() {
        return vec![];
    }
    let assessed_on = chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true);
    let with_status = |status: &str| -> Vec<Json> { needs.iter().filter(|(s, _, san)| *san && *s == status).map(|(_, n, _)| n.clone()).collect() };
    let [assessment_path, integration_path] = arns_url_paths(crn);
    let details: Vec<Json> = needs
        .iter()
        .map(|(status, need, _)| {
            let mut n = need.clone();
            n["needStatus"] = json!(status);
            n
        })
        .collect();
    vec![
        wiremock_stub(
            &assessment_path,
            json!({
                "assessmentVersion": "SAN",
                "assessedOn": assessed_on,
                "identifiedNeeds": with_status("IDENTIFIED_NEED"),
                "notIdentifiedNeeds": with_status("NOT_IDENTIFIED_NEED"),
                "unansweredNeeds": with_status("UNANSWERED_NEED"),
            }),
        ),
        wiremock_stub(&integration_path, json!({ "assessmentVersion": "SAN", "assessedOn": assessed_on, "needs": details })),
    ]
}

fn can_stub_crn(crn: &str) -> bool {
    let valid = crn.len() == 7 && crn.as_bytes()[0].is_ascii_uppercase() && crn[1..].bytes().all(|b| b.is_ascii_digit());
    if !valid {
        crate::warn!({ "crn": crn }, "Not stubbing: the CRN is not a letter followed by six digits");
        return false;
    }
    if is_stubbed_crn(crn) {
        crate::info!({ "crn": crn }, "Not stubbing a magic CRN, so it keeps its canned Wiremock responses");
        return false;
    }
    true
}

async fn remove_training_stubs(client: &WiremockAdminClient, crn: &str) {
    if !can_stub_crn(crn) || !client.can_stub_arns_api() {
        return;
    }
    let ids: Vec<String> = arns_url_paths(crn).iter().map(|p| deterministic_uuid(p)).collect();
    client.remove_stubs(&ids).await;
}

async fn register_training_stubs(client: &WiremockAdminClient, values: &Value, flags: &[String]) {
    let crn = values.get("crn").to_js_string();
    if !can_stub_crn(&crn) || !client.can_stub_arns_api() {
        return;
    }
    let wants_mocks = values.get("useMockedCriminogenicNeeds").as_str() == Some("YES") && flags.iter().any(|f| f == "SAN_BETA");
    let stubs = if wants_mocks { arns_needs_stubs(&crn, values) } else { vec![] };
    if stubs.is_empty() {
        remove_training_stubs(client, &crn).await;
        return;
    }
    client.import_stubs(stubs).await;
}

// Sessions ----------------------------------------------------------------------------------

fn coordinator_request(session: &Json) -> Json {
    let values = &session["values"];
    let request = json!({
        "oasysAssessmentPk": values["oasysAssessmentPk"],
        "planType": "INITIAL",
        "assessmentType": "SP",
        "userDetails": {
            "id": values["practitionerIdentifier"],
            "name": values["practitionerDisplayName"],
            "location": values["location"],
        },
        "subjectDetails": { "crn": values["crn"] },
        "newPeriodOfSupervision": "N",
    });
    apply_create_session_modifiers(&flags_of(&Value::from_json(&session["flags"])), request)
}

/// Creates the OASys association (an existing one is reused, with a notice) and records the
/// coordinator's identifiers on the session.
async fn create_in_coordinator(deps: &TrainingSessionLauncherEffectsDeps, ctx: &EffectContext, session: &Json, preferences_id: &str) -> ForgeResult<()> {
    let flags = flags_of(&Value::from_json(&session["flags"]));
    if flags.iter().any(|f| f == "MERGED") {
        let old_pk = ctx.get_answer("mergeOldPk");
        if !old_pk.truthy() {
            return Err(internal("Cannot merge: \"Previous OASys Assessment PK\" is required when using the Merged flag"));
        }
        let values = &session["values"];
        deps.coordinator_api_client
            .merge_oasys_association(&json!({
                "merge": [{ "oldOasysAssessmentPK": old_pk.to_json(), "newOasysAssessmentPK": values["oasysAssessmentPk"] }],
                "userDetails": { "id": values["practitionerIdentifier"], "name": values["practitionerDisplayName"] },
            }))
            .await?;
    }
    let request = coordinator_request(session);
    let response = match deps.coordinator_api_client.create_oasys_association(&request).await {
        Ok(r) => Some(r),
        Err(e) if e.status == Some(409) => {
            let pk = request["oasysAssessmentPk"].as_str().unwrap_or_default().to_string();
            crate::info!("OASys association already exists for PK {pk}, continuing without creating new association");
            push_notification(
                ctx,
                notification(
                    "information",
                    "Using existing assessment data",
                    format!("An assessment already exists for OASys PK {pk}. Your session will use the existing association."),
                    "sessions",
                ),
            );
            None
        }
        Err(e) => return Err(e.into()),
    };
    if let Some(response) = response {
        let id = session["id"].clone();
        update_training_launcher(deps, preferences_id, |launcher| {
            if let Some(sessions) = launcher["sessions"].as_array_mut() {
                for s in sessions.iter_mut().filter(|s| s["id"] == id) {
                    s["sanAssessmentId"] = response["sanAssessmentId"].clone();
                    s["sanAssessmentVersion"] = response["sanAssessmentVersion"].clone();
                    s["sentencePlanId"] = response["sentencePlanId"].clone();
                    if s["sentencePlanVersion"].is_null() {
                        s["sentencePlanVersion"] = response["sentencePlanVersion"].clone();
                    }
                }
            }
        })
        .await;
    }
    Ok(())
}

fn new_session(name: &Value, flags: &Value, values: &Value) -> Json {
    json!({
        "id": uuid::Uuid::new_v4().to_string(),
        "name": name.to_json(),
        "createdAt": chrono::Utc::now().timestamp_millis(),
        "targetApplication": "sentence-plan",
        "flags": flags.to_json(),
        "values": values.to_json(),
    })
}

async fn save_and_create_session(deps: &TrainingSessionLauncherEffectsDeps, ctx: &EffectContext, session: Json, preferences_id: &str, source: &str) -> ForgeResult<()> {
    let to_save = session.clone();
    update_training_launcher(deps, preferences_id, |l| l["sessions"].as_array_mut().unwrap().push(to_save)).await;
    create_in_coordinator(deps, ctx, &session, preferences_id).await?;
    ctx.set_data("generatedSessionId", Value::from_json(&session["id"]))?;
    crate::info!({ "sessionId": session["id"], "sessionName": session["name"], "source": source }, "TrainingSessionCreated");
    let name = session["name"].as_str().unwrap_or_default();
    push_notification(
        ctx,
        notification("success", "Session created", format!("'{name}' session is ready. Generate a handover link to begin."), "sessions"),
    );
    Ok(())
}

/// The scenario values from the customise form: randomised where ticked, the answer otherwise.
fn collect_values(ctx: &EffectContext, randomise_now: bool) -> Value {
    let mut values = Value::empty_object();
    let mut rng = rng(None);
    for key in field_keys() {
        let randomised = ctx.get_post_data(&format!("{key}_randomize")).as_str() == Some("true");
        if randomised {
            if randomise_now && let Some(config) = field_config(key) {
                values.set(key, randomize(config.randomiser, &mut rng));
            }
        } else {
            let value = ctx.get_answer(key);
            if !value.is_undefined() {
                values.set(key, value);
            }
        }
    }
    if let Value::String(crn) = ctx.get_answer("stubbedCrn")
        && !crn.is_empty()
    {
        values.set("crn", Value::String(crn));
    }
    let mocked = ctx.get_answer("useMockedCriminogenicNeeds").as_array().is_some_and(|a| a.iter().any(|v| v.as_str() == Some("YES")));
    values.set("useMockedCriminogenicNeeds", Value::from(if mocked { "YES" } else { "NO" }));
    values
}

fn answer_or(ctx: &EffectContext, code: &str, fallback: Value) -> Value {
    match ctx.get_answer(code) {
        v if v.truthy() => v,
        _ => fallback,
    }
}

/// `populateForm`: the customise page's starting values.
fn populate_form(ctx: &EffectContext, values: &Value, randomize: &[&str], name: &Value, flags: &Value) -> ForgeResult<()> {
    ctx.set_data("scenario", values.clone())?;
    ctx.set_data("flags", flags.clone())?;
    ctx.set_data("originalScenarioName", name.clone())?;
    let crn = values.get("crn").to_js_string();
    ctx.set_data("stubbedCrn", Value::from(if is_stubbed_crn(&crn) { crn } else { String::new() }))?;
    let mocked = values.get("useMockedCriminogenicNeeds").as_str() == Some("YES");
    ctx.set_data("mockedCriminogenicNeedsSelection", Value::array(if mocked { vec![Value::from("YES")] } else { vec![] }))?;
    for key in field_keys() {
        ctx.set_data(&format!("{key}_isRandomized"), Value::Bool(randomize.contains(&key)))?;
    }
    Ok(())
}

fn strs(v: &Value) -> Vec<&'static str> {
    v.as_array().map(|a| a.iter().filter_map(|k| field_keys().find(|f| Some(*f) == k.as_str())).collect()).unwrap_or_default()
}

/// `appendParamsToLink`: `clientId` (and any flag parameters) set on the handover link.
fn append_params(link: &str, params: &[(String, String)]) -> String {
    let Ok(mut url) = reqwest::Url::parse(link) else { return link.to_string() };
    for (k, v) in params {
        let kept: Vec<(String, String)> = url.query_pairs().filter(|(n, _)| n != k).map(|(n, v)| (n.into_owned(), v.into_owned())).collect();
        let mut pairs = url.query_pairs_mut();
        pairs.clear();
        for (n, val) in kept {
            pairs.append_pair(&n, &val);
        }
        pairs.append_pair(k, v);
    }
    url.to_string()
}

pub fn entries(deps: &Arc<TrainingSessionLauncherEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        register_effect!("loadScenarios", deps, |ctx, args| {
            let id = preferences_id(&ctx, "load scenarios")?;
            let mut all: Vec<Value> = SCENARIO_PRESETS
                .iter()
                .map(|p| display_scenario(&resolve_preset(p, None, &excluded_fields(&flags_of(&p.flags()), &p.fixed_values())), false))
                .collect();
            let launcher = training_launcher(&deps, &id).await;
            for saved in launcher["savedScenarios"].as_array().cloned().unwrap_or_default() {
                let saved = Value::from_json(&saved);
                let excluded = excluded_fields(&flags_of(&saved.get("flags")), &saved.get("fixedValues"));
                all.push(display_scenario(&resolve_saved(&saved, &excluded), true));
            }
            ctx.set_data("scenarios", Value::array(all))
        }),
        register_effect!("loadPreferences", deps, |ctx, args| {
            let id = preferences_id(&ctx, "load preferences")?;
            let launcher = training_launcher(&deps, &id).await;
            ctx.set_data("preferencesId", Value::from(id.as_str()))?;
            let saved: Vec<Value> = launcher["savedScenarios"]
                .as_array()
                .cloned()
                .unwrap_or_default()
                .iter()
                .map(|s| {
                    let s = Value::from_json(s);
                    let excluded = excluded_fields(&flags_of(&s.get("flags")), &s.get("fixedValues"));
                    display_scenario(&resolve_saved(&s, &excluded), true)
                })
                .collect();
            ctx.set_data("savedScenarios", Value::array(saved))?;
            let mut sessions: Vec<Value> =
                launcher["sessions"].as_array().cloned().unwrap_or_default().iter().map(|s| display_session(&Value::from_json(s))).collect();
            sessions.reverse();
            ctx.set_data("sessions", Value::array(sessions))
        }),
        register_effect!("saveScenario", deps, |ctx, args| {
            let id = preferences_id(&ctx, "save scenario")?;
            let scenario = arg(&args, 0).to_json();
            update_training_launcher(&deps, &id, |l| {
                let list = l["savedScenarios"].as_array_mut().unwrap();
                match list.iter().position(|s| s["id"] == scenario["id"]) {
                    Some(i) => list[i] = scenario,
                    None => list.push(scenario),
                }
            })
            .await;
            Ok(())
        }),
        register_effect!("deleteScenario", deps, |ctx, args| {
            let id = preferences_id(&ctx, "delete scenario")?;
            let scenario_id = ctx.get_post_data("scenarioId");
            if !scenario_id.truthy() {
                return Err(internal("Missing scenarioId in POST data"));
            }
            let scenario_id = scenario_id.to_json();
            update_training_launcher(&deps, &id, |l| l["savedScenarios"].as_array_mut().unwrap().retain(|s| s["id"] != scenario_id)).await;
            push_notification(&ctx, notification("success", "Scenario deleted", "The custom scenario has been deleted.".into(), "browse"));
            Ok(())
        }),
        register_effect!("saveSession", deps, |ctx, args| {
            let id = preferences_id(&ctx, "save session")?;
            let session = arg(&args, 0).to_json();
            update_training_launcher(&deps, &id, |l| {
                let list = l["sessions"].as_array_mut().unwrap();
                match list.iter().position(|s| s["id"] == session["id"]) {
                    Some(i) => list[i] = session,
                    None => list.push(session),
                }
            })
            .await;
            Ok(())
        }),
        register_effect!("deleteSession", deps, |ctx, args| {
            let id = preferences_id(&ctx, "delete session")?;
            let session_id = ctx.get_post_data("trainingSessionId");
            if !session_id.truthy() {
                return Err(internal("Cannot delete session: trainingSessionId is missing from POST data"));
            }
            let session_id = session_id.to_json();
            let sessions = training_launcher(&deps, &id).await["sessions"].as_array().cloned().unwrap_or_default();
            let deleted_crn = sessions.iter().find(|s| s["id"] == session_id).map(|s| s["values"]["crn"].clone());
            let still_used = sessions.iter().any(|s| s["id"] != session_id && Some(&s["values"]["crn"]) == deleted_crn.as_ref());
            update_training_launcher(&deps, &id, |l| l["sessions"].as_array_mut().unwrap().retain(|s| s["id"] != session_id)).await;
            if let Some(crn) = deleted_crn.as_ref().and_then(Json::as_str).filter(|c| !c.is_empty())
                && !still_used
            {
                remove_training_stubs(&deps.wiremock_admin_client, crn).await;
            }
            Ok(())
        }),
        register_effect!("deleteAllSessions", deps, |ctx, args| {
            let id = preferences_id(&ctx, "delete sessions")?;
            let mut crns: Vec<String> = vec![];
            for s in training_launcher(&deps, &id).await["sessions"].as_array().cloned().unwrap_or_default() {
                let crn = s["values"]["crn"].as_str().unwrap_or_default().to_string();
                if !crns.contains(&crn) {
                    crns.push(crn);
                }
            }
            update_training_launcher(&deps, &id, |l| l["sessions"] = json!([])).await;
            for crn in crns {
                remove_training_stubs(&deps.wiremock_admin_client, &crn).await;
            }
            Ok(())
        }),
        register_effect!("createSessionFromPreset", deps, |ctx, args| {
            let id = preferences_id(&ctx, "create session")?;
            let scenario_id = ctx.get_post_data("scenarioId");
            let seed = ctx.get_post_data("seed");
            let seed = if seed.truthy() { parse_int(&seed) } else { None };
            if !scenario_id.truthy() {
                return Err(internal("Cannot create session: scenarioId is missing from POST data"));
            }
            let Some(seed) = seed.filter(|s| *s != 0) else {
                return Err(internal("Cannot create session: seed is missing from POST data"));
            };
            let scenario_id = scenario_id.to_js_string();
            if let Some(preset) = preset_by_id(&scenario_id) {
                let resolved = resolve_preset(preset, Some(seed), &excluded_fields(&flags_of(&preset.flags()), &preset.fixed_values()));
                let session = new_session(&resolved.get("name"), &resolved.get("flags"), &resolved.get("values"));
                return save_and_create_session(&deps, &ctx, session, &id, "preset").await;
            }
            let launcher = training_launcher(&deps, &id).await;
            let saved = launcher["savedScenarios"].as_array().and_then(|a| a.iter().find(|s| s["id"] == json!(scenario_id)).cloned());
            if let Some(saved) = saved {
                let saved = Value::from_json(&saved);
                let excluded = excluded_fields(&flags_of(&saved.get("flags")), &saved.get("fixedValues"));
                let fields = randomize_fields(&saved.get("fixedValues"), &excluded);
                let values = super::scenarios::apply_randomization(&saved.get("fixedValues"), &fields, Some(seed));
                let session = new_session(&saved.get("name"), &saved.get("flags"), &values);
                return save_and_create_session(&deps, &ctx, session, &id, "preset").await;
            }
            Err(internal(format!("Cannot create session: scenario with ID '{scenario_id}' not found")))
        }),
        register_effect!("createSessionFromCustomize", deps, |ctx, args| {
            let id = preferences_id(&ctx, "create session")?;
            let name = answer_or(&ctx, "scenarioName", Value::from("Untitled Session"));
            let flags = match ctx.get_answer("flags") {
                v if v.is_nullish() => Value::array(vec![]),
                v => v,
            };
            let values = collect_values(&ctx, true);
            save_and_create_session(&deps, &ctx, new_session(&name, &flags, &values), &id, "customize").await
        }),
        register_effect!("generateHandoverLink", deps, |ctx, args| {
            let id = preferences_id(&ctx, "generate handover link")?;
            let session_id = ctx.get_post_data("trainingSessionId");
            let target = match ctx.get_post_data("targetApplication") {
                v if v.truthy() => v.to_js_string(),
                _ => "sentence-plan".to_string(),
            };
            if !session_id.truthy() {
                return Err(internal("Cannot generate handover link: trainingSessionId is missing from POST data"));
            }
            let launcher = training_launcher(&deps, &id).await;
            let Some(session) = launcher["sessions"].as_array().and_then(|a| a.iter().find(|s| s["id"] == session_id.to_json()).cloned()) else {
                return Err(internal(format!("Cannot generate handover link: session with ID '{}' not found", session_id.to_js_string())));
            };
            let flags = flags_of(&Value::from_json(&session["flags"]));
            let handover = resolve_handover_config(&flags);
            let values = &session["values"];
            let mut subject = json!({
                "crn": values["crn"],
                "givenName": values["givenName"],
                "familyName": values["familyName"],
                "gender": values["gender"],
                "dateOfBirth": values["dateOfBirth"],
                "location": values["location"],
                "sexuallyMotivatedOffenceHistory": values["sexuallyMotivatedOffenceHistory"],
            });
            if values["pnc"].as_str().is_some_and(|p| !p.is_empty()) {
                subject["pnc"] = values["pnc"].clone();
            }
            let mut request = json!({
                "user": {
                    "identifier": values["practitionerIdentifier"],
                    "displayName": values["practitionerDisplayName"],
                    "accessMode": values["accessMode"],
                    "planAccessMode": values["planAccessMode"],
                    "returnUrl": format!("{}/training-session-launcher/sessions", config().ingress_url),
                },
                "subjectDetails": subject,
                "oasysAssessmentPk": values["oasysAssessmentPk"],
            });
            let truthy = |v: &Json| !(v.is_null() || v == &json!("") || v == &json!(0) || v == &json!(false));
            if target == "strengths-and-needs" && truthy(&values["sanAssessmentVersion"]) {
                request["assessmentVersion"] = values["sanAssessmentVersion"].clone();
            }
            if target == "sentence-plan" && truthy(&values["sentencePlanVersion"]) && !handover.strip_sentence_plan_version {
                request["sentencePlanVersion"] = values["sentencePlanVersion"].clone();
            }
            if target == "tiering-assessment" && truthy(&session["tieringAssessmentVersion"]) {
                request["tieringAssessmentVersion"] = session["tieringAssessmentVersion"].clone();
            }
            register_training_stubs(&deps.wiremock_admin_client, &Value::from_json(values), &flags).await;
            let response = deps.handover_api_client.create_handover_link(&request).await?;
            if target == "strengths-and-needs" && flags.iter().any(|f| f == "SAN_BETA") && truthy(&session["sanAssessmentId"]) {
                let session_id = response["handoverSessionId"].as_str().unwrap_or_default();
                let mut update = json!({
                    "principal": request["user"],
                    "subject": request["subjectDetails"],
                    "assessmentContext": {
                        "oasysAssessmentPk": values["oasysAssessmentPk"],
                        "assessmentId": session["sanAssessmentId"],
                        "assessmentVersion": session["sanAssessmentVersion"],
                    },
                });
                if let Some(o) = update.as_object_mut() {
                    o.retain(|_, v| !v.is_null());
                }
                deps.handover_api_client.update_context(session_id, &update).await?;
            }
            let client_id = config().handover_target(&target).map(|t| t.client_id.clone()).unwrap_or_default();
            let mut params = vec![("clientId".to_string(), client_id)];
            params.extend(handover.url_params.iter().cloned());
            let link = append_params(response["handoverLink"].as_str().unwrap_or_default(), &params);
            ctx.set_data("handoverLink", Value::from(link))
        }),
        register_effect!("loadScenarioForCustomise", deps, |ctx, args| {
            let param = ctx.get_query_param("scenario");
            let scenario_id = match &param {
                Value::Array(a) => a.first().cloned().unwrap_or(Value::Undefined),
                v => v.clone(),
            };
            if !scenario_id.truthy() {
                return Ok(());
            }
            let scenario_id = scenario_id.to_js_string();
            if let Some(preset) = preset_by_id(&scenario_id) {
                let resolved = resolve_preset(preset, None, &excluded_fields(&flags_of(&preset.flags()), &Value::empty_object()));
                return populate_form(&ctx, &resolved.get("values"), &strs(&resolved.get("randomizeFields")), &Value::from(preset.name), &preset.flags());
            }
            if let Ok(id) = preferences_id(&ctx, "customise") {
                let launcher = training_launcher(&deps, &id).await;
                if let Some(saved) = launcher["savedScenarios"].as_array().and_then(|a| a.iter().find(|s| s["id"] == json!(scenario_id)).cloned()) {
                    let saved = Value::from_json(&saved);
                    let excluded = excluded_fields(&flags_of(&saved.get("flags")), &saved.get("fixedValues"));
                    let resolved = resolve_saved(&saved, &excluded);
                    return populate_form(&ctx, &resolved.get("values"), &strs(&resolved.get("randomizeFields")), &saved.get("name"), &saved.get("flags"));
                }
            }
            let preset = &SCENARIO_PRESETS[0];
            let resolved = resolve_preset(preset, None, &excluded_fields(&flags_of(&preset.flags()), &Value::empty_object()));
            populate_form(&ctx, &resolved.get("values"), &strs(&resolved.get("randomizeFields")), &Value::from(preset.name), &preset.flags())
        }),
        register_effect!("saveCustomPreset", deps, |ctx, args| {
            let id = preferences_id(&ctx, "save custom preset")?;
            let name = answer_or(&ctx, "scenarioName", Value::from("Untitled Scenario"));
            let based_on = match ctx.get_post_data("scenarioId") {
                v if v.truthy() => v.to_js_string(),
                _ => "custom".to_string(),
            };
            let flags = match ctx.get_answer("flags") {
                v if v.is_nullish() => Value::array(vec![]),
                v => v,
            };
            let now = chrono::Utc::now().timestamp_millis();
            let saved = json!({
                "id": uuid::Uuid::new_v4().to_string(),
                "name": name.to_json(),
                "shortDescription": "Custom scenario",
                "description": format!("Custom scenario based on {based_on}"),
                "createdAt": now,
                "updatedAt": now,
                "basedOnPresetId": based_on,
                "flags": flags.to_json(),
                "fixedValues": collect_values(&ctx, false).to_json(),
            });
            update_training_launcher(&deps, &id, |l| l["savedScenarios"].as_array_mut().unwrap().push(saved)).await;
            push_notification(
                &ctx,
                notification("success", "Scenario saved", format!("'{}' has been saved to your scenarios.", name.to_js_string()), "browse"),
            );
            Ok(())
        }),
        // A notification for a target page; with no title, the message is promoted to it.
        register_effect!("addNotification", |ctx, args| {
            let mut n = arg(&args, 0).to_json();
            if n.get("title").is_none_or(|t| t.is_null() || t == &json!("")) {
                n["title"] = n["message"].clone();
                if let Some(o) = n.as_object_mut() {
                    o.remove("message");
                }
            }
            push_notification(&ctx, n);
            Ok(())
        }),
        // The notifications for this page, removed from the session.
        register_effect!("loadNotifications", |ctx, args| {
            let target = arg(&args, 0);
            let all = ctx.get_session().get("notifications").as_array().map(|a| a.to_vec()).unwrap_or_default();
            let (matching, rest): (Vec<Value>, Vec<Value>) = all.into_iter().partition(|n| n.get("target").strict_eq(&target));
            ctx.update_session(|s| s.set("notifications", Value::array(rest)));
            ctx.set_data("notifications", Value::array(matching))
        }),
        register_effect!("setTargetService", |ctx, args| {
            crate::forms::shared::set_target_service(&ctx, &arg(&args, 0));
            Ok(())
        }),
        register_effect!("storeCsrf", |ctx, args| {
            let token = ctx.get_state("csrfToken");
            if !token.truthy() {
                return Err(internal("Missing CSRF token in request state"));
            }
            ctx.set_data("csrfToken", token)
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deterministic_uuids_look_like_v4() {
        let id = deterministic_uuid("/arns-api/needs/A123456");
        assert_eq!(id, deterministic_uuid("/arns-api/needs/A123456"));
        assert_eq!(id.len(), 36);
        assert_eq!(&id[14..15], "4");
        assert_eq!(&id[19..20], "8");
    }

    #[test]
    fn needs_stubs_only_for_answered_needs() {
        let values = forge_core::val!({ "accLinkedToHarm": "YES", "accThreshold": "YES", "accOtherWeightedScore": "4" });
        let stubs = arns_needs_stubs("A123456", &values);
        assert_eq!(stubs.len(), 2);
        assert_eq!(stubs[0]["response"]["jsonBody"]["identifiedNeeds"][0]["score"], 4);
        assert!(arns_needs_stubs("A123456", &Value::empty_object()).is_empty());
    }
}
