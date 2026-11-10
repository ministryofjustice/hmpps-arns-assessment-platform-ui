//! Assessment information for the plan (`loadAreaAssessmentInfo`, `loadAllAreasAssessmentInfo`):
//! SAN answers from the coordinator API combined with the needs (scores and risk links) from the
//! ARNS API.

use std::sync::Arc;

use forge_core::{EffectContext, ForgeResult, FunctionEntry, Value};
use serde_json::{Value as Json, json};

use super::SentencePlanEffectsDeps;
use crate::forms::sentence_plan::constants::{areas_of_need_list, sub_areas_of_need};
use crate::register_effect;

const NEEDS_KEYS: [&str; 8] = [
    "accommodation",
    "educationTrainingEmployability",
    "finance",
    "drugMisuse",
    "alcoholMisuse",
    "healthAndWellbeing",
    "personalRelationshipsAndCommunity",
    "thinkingBehaviourAndAttitudes",
];

fn empty_need_area() -> Json {
    json!({ "linkedToHarm": null, "linkedToReoffending": null, "linkedToStrengthsOrProtectiveFactors": null, "score": null })
}

fn need_area(need: &Json) -> Json {
    let or_null = |k: &str| need.get(k).filter(|v| !v.is_null()).cloned().unwrap_or(Json::Null);
    json!({
        "linkedToHarm": or_null("riskOfHarm"),
        "linkedToReoffending": or_null("riskOfReoffending"),
        "linkedToStrengthsOrProtectiveFactors": null,
        "score": or_null("score"),
    })
}

fn map_needs<'a>(needs: impl Iterator<Item = &'a Json>, section_key: fn(&str) -> Option<&'static str>) -> Json {
    let mut result = serde_json::Map::new();
    for key in NEEDS_KEYS {
        result.insert(key.into(), empty_need_area());
    }
    for need in needs {
        if let Some(key) = need.get("section").and_then(Json::as_str).and_then(section_key) {
            result.insert(key.into(), need_area(need));
        }
    }
    Json::Object(result)
}

fn mpop_section_key(section: &str) -> Option<&'static str> {
    Some(match section {
        "ACCOMMODATION" => "accommodation",
        "EMPLOYMENT_AND_EDUCATION" => "educationTrainingEmployability",
        "PERSONAL_RELATIONSHIPS_AND_COMMUNITY" => "personalRelationshipsAndCommunity",
        "LIFESTYLE_AND_ASSOCIATES" => "lifestyleAndAssociates",
        "DRUG_USE" => "drugMisuse",
        "ALCOHOL_USE" => "alcoholMisuse",
        "THINKING_ATTITUDES_AND_BEHAVIOUR" => "thinkingBehaviourAndAttitudes",
        _ => return None,
    })
}

/// SAN and legacy OASys section names (OASys's separate ATTITUDE section is left unmapped).
fn integration_section_key(section: &str) -> Option<&'static str> {
    Some(match section {
        "ACCOMMODATION" => "accommodation",
        "EMPLOYMENT_AND_EDUCATION" | "EDUCATION_TRAINING_AND_EMPLOYABILITY" => "educationTrainingEmployability",
        "PERSONAL_RELATIONSHIPS_AND_COMMUNITY" | "RELATIONSHIPS" => "personalRelationshipsAndCommunity",
        "LIFESTYLE_AND_ASSOCIATES" => "lifestyleAndAssociates",
        "DRUG_USE" | "DRUG_MISUSE" => "drugMisuse",
        "ALCOHOL_USE" | "ALCOHOL_MISUSE" => "alcoholMisuse",
        "THINKING_ATTITUDES_AND_BEHAVIOUR" | "THINKING_AND_BEHAVIOUR" => "thinkingBehaviourAndAttitudes",
        "FINANCE" => "finance",
        "HEALTH_AND_WELLBEING" | "EMOTIONAL_WELLBEING" => "healthAndWellbeing",
        _ => return None,
    })
}

/// `mapArnsNeedsToCriminogenicNeeds` (MPoP: the needs endpoint's three lists).
pub fn map_arns_needs(dto: &Json) -> Option<Json> {
    if dto.is_null() {
        return None;
    }
    let list = |k: &str| dto.get(k).and_then(Json::as_array).cloned().unwrap_or_default();
    let all: Vec<Json> = [list("identifiedNeeds"), list("notIdentifiedNeeds"), list("unansweredNeeds")].concat();
    Some(map_needs(all.iter(), mpop_section_key))
}

/// `mapArnsIntegrationNeedsToCriminogenicNeeds` (OASys: the integration endpoint's `needs`).
pub fn map_arns_integration_needs(dto: &Json) -> Option<Json> {
    if dto.is_null() {
        return None;
    }
    let needs = dto.get("needs").and_then(Json::as_array).cloned().unwrap_or_default();
    Some(map_needs(needs.iter(), integration_section_key))
}

fn to_linked(value: &Json) -> Json {
    match value.as_bool() {
        Some(true) => json!("YES"),
        Some(false) => json!("NO"),
        None => Json::Null,
    }
}

fn linked_from_san(value: &str) -> Json {
    if value == "YES" || value == "NO" { json!(value) } else { Json::Null }
}

/// `getAssessmentValue`: an answer's value, or its values joined.
fn san_value(san: &Json, key: &str) -> String {
    let Some(answer) = san.get(key).filter(|a| !a.is_null()) else { return String::new() };
    if let Some(values) = answer.get("values").and_then(Json::as_array) {
        return values.iter().map(|v| v.as_str().map_or_else(|| v.to_string(), str::to_string)).collect::<Vec<_>>().join(", ");
    }
    answer.get("value").and_then(Json::as_str).unwrap_or_default().to_string()
}

const MOTIVATION_LEVELS: [&str; 9] = [
    "MADE_CHANGES",
    "MAKING_CHANGES",
    "WANT_TO_MAKE_CHANGES",
    "NEEDS_HELP_TO_MAKE_CHANGES",
    "THINKING_ABOUT_MAKING_CHANGES",
    "DOES_NOT_WANT_TO_MAKE_CHANGES",
    "DOES_NOT_WANT_TO_ANSWER",
    "NOT_PRESENT",
    "NOT_APPLICABLE",
];

fn clamp_score(score: &Json, upper: f64) -> Option<f64> {
    score.as_f64().map(|s| if s > upper { upper } else { s })
}

fn num(v: Option<f64>) -> Json {
    v.map_or(Json::Null, |n| serde_json::to_value(n).map(|j| if n.fract() == 0.0 { json!(n as i64) } else { j }).unwrap_or(Json::Null))
}

/// `processAssessmentArea`: one area of need's assessment information.
fn process_area(area: &Json, san: &Json, needs: Option<&Json>) -> Json {
    let key = area["assessmentKey"].as_str().unwrap_or_default();
    let needs_key = area["crimNeedsKey"].as_str().unwrap_or_default();
    let upper = area["upperBound"].as_f64();
    let threshold = area["threshold"].as_f64();
    let needs_area = needs.and_then(|n| n.get(needs_key)).filter(|a| !a.is_null());
    let complete = san_value(san, &format!("{key}_section_complete")) == "YES";
    let unscored = threshold.is_none();
    let from_san = |suffix: &str| linked_from_san(&san_value(san, &format!("{key}_practitioner_analysis_{suffix}")));
    let pick = |field: &str, fallback: Option<Json>| -> Json {
        match needs_area {
            None => Json::Null,
            Some(a) => match to_linked(a.get(field).unwrap_or(&Json::Null)) {
                Json::Null => fallback.unwrap_or(Json::Null),
                v => v,
            },
        }
    };
    let harm = pick("linkedToHarm", unscored.then(|| from_san("risk_of_serious_harm")));
    let reoffending = pick("linkedToReoffending", unscored.then(|| from_san("risk_of_reoffending")));
    let strengths = pick("linkedToStrengthsOrProtectiveFactors", Some(from_san("strengths_or_protective_factors")));
    let details = |kind: &str, linked: &Json| match linked.as_str() {
        Some(l) => san_value(san, &format!("{key}_practitioner_analysis_{kind}_{}_details", l.to_lowercase())),
        None => String::new(),
    };
    let motivation = san_value(san, &format!("{key}_changes"));
    let motivation = if MOTIVATION_LEVELS.contains(&motivation.as_str()) { json!(motivation) } else { Json::Null };

    let mut sub_area = Json::Null;
    let mut sub_area_high = false;
    let sub_def = sub_areas_of_need().as_array().and_then(|s| s.iter().find(|c| c["parentAreaOfNeedCrimKey"] == needs_key));
    if let Some(def) = sub_def {
        let sub_key = def["crimNeedsKey"].as_str().unwrap_or_default();
        if let Some(sub_needs) = needs.and_then(|n| n.get(sub_key)).filter(|v| !v.is_null()) {
            let sub_upper = def["upperBound"].as_f64().unwrap_or(f64::MAX);
            if let Some(sub_score) = clamp_score(sub_needs.get("score").unwrap_or(&Json::Null), sub_upper) {
                sub_area = json!({
                    "title": def["text"],
                    "score": num(Some(sub_score)),
                    "upperBound": def["upperBound"],
                    "threshold": def["threshold"],
                });
                if let Some(t) = def["threshold"].as_f64() {
                    sub_area_high = sub_score > t;
                }
            }
        }
    }
    let score = needs_area.and_then(|a| clamp_score(a.get("score").unwrap_or(&Json::Null), upper.unwrap_or(f64::MAX)));
    let scored = threshold.is_some() && score.is_some();
    let main_high = scored && score > threshold;
    let is_high = main_high || (scored && sub_area_high);
    let is_low = scored && score <= threshold && !sub_area_high;
    let distance = match (score, threshold) {
        (Some(s), Some(t)) => {
            let main = s - t;
            match (sub_area.get("score").and_then(Json::as_f64), sub_area.get("threshold").and_then(Json::as_f64)) {
                (Some(ss), Some(st)) => Some(main.max(ss - st)),
                _ => Some(main),
            }
        }
        _ => None,
    };
    let mut out = json!({
        "title": area["text"],
        "goalRoute": area["slug"],
        "isAssessmentSectionComplete": complete,
        "linkedToHarm": harm,
        "linkedToReoffending": reoffending,
        "linkedToStrengthsOrProtectiveFactors": strengths,
        "riskOfSeriousHarmDetails": details("risk_of_serious_harm", &harm),
        "riskOfReoffendingDetails": details("risk_of_reoffending", &reoffending),
        "strengthsOrProtectiveFactorsDetails": details("strengths_or_protective_factors", &strengths),
        "motivationToMakeChanges": motivation,
        "score": num(score),
        "upperBound": area["upperBound"],
        "threshold": area["threshold"],
        "isHighScoring": is_high,
        "isLowScoring": is_low,
    });
    if !sub_area.is_null() {
        out["subArea"] = sub_area;
    }
    out["effectiveScoreToThresholdDistance"] = num(distance);
    out
}

/// `transformAssessmentData`: every area of need's assessment information.
pub fn transform_assessment_data(san: &Json, needs: Option<&Json>) -> Vec<Json> {
    areas_of_need_list().iter().map(|a| process_area(a, san, needs)).collect()
}

/// `canAccessSanInfo`: a SAN private beta plan for a case with a CRN.
fn can_access_san_info(ctx: &EffectContext) -> bool {
    let san_beta = ctx.get_data("assessment").get("flags").as_array().is_some_and(|f| f.iter().any(|v| v.as_str() == Some("SAN_BETA")));
    san_beta && ctx.get_session().get("caseDetails").get("crn").truthy()
}

/// `resolveCriminogenicNeedsData`: MPoP users' needs with their own token, OASys users' needs
/// for the handover's CRN (`None` without one).
async fn criminogenic_needs(deps: &SentencePlanEffectsDeps, ctx: &EffectContext, crn: Option<&str>) -> Result<Option<Json>, String> {
    let mpop = ctx.get_session().get("sessionDetails").get("accessType").as_str() == Some("HMPPS_AUTH");
    if mpop {
        let token = ctx.get_state("user").get("token");
        if !token.truthy() {
            return Err("Cannot load criminogenic needs for MPoP user: missing user token".into());
        }
        let Some(crn) = crn else { return Err("Cannot load criminogenic needs for MPoP user: missing crn".into()) };
        let needs = deps.arns_api.get_criminogenic_needs(crn, &token.to_js_string()).await.map_err(|e| e.to_string())?;
        return Ok(map_arns_needs(&needs));
    }
    let handover_crn = ctx.get_session().get("handoverContext").get("subject").get("crn");
    if !handover_crn.truthy() {
        return Ok(None);
    }
    let needs = deps.arns_api.get_criminogenic_needs_details(&handover_crn.to_js_string()).await.map_err(|e| e.to_string())?;
    Ok(map_arns_integration_needs(&needs))
}

fn risk_tier(a: &Json) -> i32 {
    (if a["linkedToHarm"] == "YES" { 2 } else { 0 }) + (if a["linkedToReoffending"] == "YES" { 1 } else { 0 })
}

fn title_of(a: &Json) -> String {
    a["title"].as_str().unwrap_or_default().to_lowercase()
}

/// `sortByRiskAndScore`: risk tier, then distance above threshold, then title.
fn sort_by_risk_and_score(areas: &mut [Json]) {
    areas.sort_by(|a, b| {
        risk_tier(b).cmp(&risk_tier(a)).then_with(|| {
            match (a["effectiveScoreToThresholdDistance"].as_f64(), b["effectiveScoreToThresholdDistance"].as_f64()) {
                (Some(x), Some(y)) if x != y => y.total_cmp(&x),
                _ => title_of(a).cmp(&title_of(b)),
            }
        })
    });
}

fn set_state(ctx: &EffectContext, status: &str) -> ForgeResult<()> {
    for key in ["allAssessmentAreas", "highScoringAreas", "lowScoringAreas", "otherAreas", "incompleteAreas"] {
        ctx.set_data(key, Value::array(vec![]))?;
    }
    ctx.set_data("isAssessmentComplete", Value::Bool(false))?;
    ctx.set_data("assessmentLastUpdated", Value::Null)?;
    ctx.set_data("allAreasAssessmentStatus", Value::from(status))?;
    ctx.set_data("areasByGoalRoute", Value::empty_object())
}

fn values(list: Vec<Json>) -> Value {
    Value::array(list.iter().map(Value::from_json).collect())
}

/// `toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })`.
fn long_local_date(timestamp: &str) -> Option<String> {
    let d = super::dates::parse(timestamp)?.with_timezone(&chrono::Local);
    Some(d.format("%-d %B %Y").to_string())
}

async fn load_areas(deps: &SentencePlanEffectsDeps, ctx: &EffectContext, assessment_uuid: &str, crn: Option<&str>) -> Result<Option<(Vec<Json>, Json)>, String> {
    let entity = deps.coordinator_api.get_entity_assessment(assessment_uuid).await.map_err(|e| e.to_string())?;
    let san = entity.get("sanAssessmentData").cloned().unwrap_or(Json::Null);
    let Some(needs) = criminogenic_needs(deps, ctx, crn).await? else { return Ok(None) };
    Ok(Some((transform_assessment_data(&san, Some(&needs)), entity)))
}

pub fn entries(deps: &Arc<SentencePlanEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        // The current area of need's assessment information, for the goal pages.
        register_effect!("loadAreaAssessmentInfo", deps, |ctx, args| {
            let set = |area: Value, status: &str| -> ForgeResult<()> {
                ctx.set_data("currentAreaAssessment", area)?;
                ctx.set_data("currentAreaAssessmentStatus", Value::from(status))
            };
            if !can_access_san_info(&ctx) {
                return set(Value::Null, "unavailable");
            }
            let assessment_uuid = ctx.get_data("assessmentUuid");
            let current = ctx.get_data("currentAreaOfNeed");
            let session = ctx.get_session();
            let crn = session.get("caseDetails").get("crn").as_str().map(str::to_string);
            let mpop = session.get("sessionDetails").get("accessType").as_str() == Some("HMPPS_AUTH");
            if !assessment_uuid.truthy() || !current.truthy() {
                crate::error!(
                    { "assessmentUuid": assessment_uuid.to_json(), "crn": crn, "hasAssessmentUuid": assessment_uuid.truthy(), "hasCurrentAreaOfNeed": current.truthy() },
                    "Cannot load area assessment info: missing assessmentUuid or currentAreaOfNeed"
                );
                return set(Value::Null, "error");
            }
            if !mpop && crn.is_none() {
                return set(Value::Null, "unavailable");
            }
            let slug = current.get("slug");
            match load_areas(&deps, &ctx, &assessment_uuid.to_js_string(), crn.as_deref()).await {
                Ok(Some((areas, _))) => {
                    let area = areas.iter().find(|a| slug.as_str() == a["goalRoute"].as_str()).map_or(Value::Undefined, Value::from_json);
                    set(area, "success")
                }
                Ok(None) => {
                    crate::error!(
                        { "assessmentUuid": assessment_uuid.to_json(), "crn": crn, "areaOfNeed": slug.to_json() },
                        "Cannot load area assessment info: ARNS API returned no needs data"
                    );
                    set(Value::Null, "error")
                }
                Err(e) => {
                    crate::error!(
                        { "err": e, "assessmentUuid": assessment_uuid.to_json(), "crn": crn, "areaOfNeed": slug.to_json() },
                        "Failed to load area assessment info"
                    );
                    set(Value::Null, "error")
                }
            }
        }),
        // Every area's assessment information for the About page, grouped into incomplete,
        // high-scoring, low-scoring and unscored areas.
        register_effect!("loadAllAreasAssessmentInfo", deps, |ctx, args| {
            if !can_access_san_info(&ctx) {
                return set_state(&ctx, "unavailable");
            }
            let assessment_uuid = ctx.get_data("assessmentUuid");
            let session = ctx.get_session();
            let mpop = session.get("sessionDetails").get("accessType").as_str() == Some("HMPPS_AUTH");
            let crn = session.get("caseDetails").get("crn").as_str().map(str::to_string);
            if !assessment_uuid.truthy() {
                crate::error!({ "crn": crn }, "Cannot load all areas assessment info: missing assessmentUuid");
                return set_state(&ctx, "error");
            }
            if !mpop && crn.is_none() {
                return set_state(&ctx, "unavailable");
            }
            let (areas, entity) = match load_areas(&deps, &ctx, &assessment_uuid.to_js_string(), crn.as_deref()).await {
                Ok(Some(loaded)) => loaded,
                Ok(None) => {
                    crate::error!({ "assessmentUuid": assessment_uuid.to_json(), "crn": crn }, "Cannot load all areas assessment info: ARNS API returned no needs data");
                    return set_state(&ctx, "error");
                }
                Err(e) => {
                    crate::error!({ "err": e, "assessmentUuid": assessment_uuid.to_json(), "crn": crn }, "Failed to load all areas assessment info");
                    return set_state(&ctx, "error");
                }
            };
            let (mut incomplete, mut high, mut low, mut other) = (vec![], vec![], vec![], vec![]);
            for area in &areas {
                if area["isAssessmentSectionComplete"] != true {
                    incomplete.push(area.clone());
                } else if area["threshold"].is_null() {
                    other.push(area.clone());
                } else if area["isHighScoring"] == true {
                    high.push(area.clone());
                } else if area["isLowScoring"] == true {
                    low.push(area.clone());
                } else {
                    incomplete.push(area.clone());
                }
            }
            incomplete.sort_by_key(title_of);
            sort_by_risk_and_score(&mut high);
            sort_by_risk_and_score(&mut low);
            sort_by_risk_and_score(&mut other);
            let all_complete = areas.iter().all(|a| a["isAssessmentSectionComplete"] == true);
            let all_scored = areas.iter().filter(|a| !a["threshold"].is_null()).all(|a| !a["score"].is_null());
            let by_route: serde_json::Map<String, Json> =
                areas.iter().map(|a| (a["goalRoute"].as_str().unwrap_or_default().to_string(), a.clone())).collect();
            let last_updated = entity
                .get("lastUpdatedTimestampSAN")
                .and_then(Json::as_str)
                .filter(|s| !s.is_empty())
                .and_then(long_local_date)
                .map_or(Value::Null, Value::from);
            ctx.set_data("allAssessmentAreas", values(areas.clone()))?;
            ctx.set_data("highScoringAreas", values(high))?;
            ctx.set_data("lowScoringAreas", values(low))?;
            ctx.set_data("otherAreas", values(other))?;
            ctx.set_data("incompleteAreas", values(incomplete))?;
            ctx.set_data("isAssessmentComplete", Value::Bool(all_complete && all_scored))?;
            ctx.set_data("areasByGoalRoute", Value::from_json(&Json::Object(by_route)))?;
            ctx.set_data("assessmentLastUpdated", last_updated)?;
            ctx.set_data("allAreasAssessmentStatus", Value::from("success"))
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn combines_san_answers_with_needs() {
        let san = json!({
            "accommodation_section_complete": { "value": "YES" },
            "accommodation_changes": { "value": "MAKING_CHANGES" },
            "accommodation_practitioner_analysis_risk_of_serious_harm_yes_details": { "value": "harm details" },
            "finance_section_complete": { "value": "YES" },
            "finance_practitioner_analysis_risk_of_serious_harm": { "value": "NO" },
        });
        let needs = map_arns_needs(&json!({
            "identifiedNeeds": [{ "section": "ACCOMMODATION", "riskOfHarm": true, "riskOfReoffending": false, "score": 9 }],
            "notIdentifiedNeeds": [],
            "unansweredNeeds": [],
        }))
        .unwrap();
        let areas = transform_assessment_data(&san, Some(&needs));
        let acc = &areas[0];
        assert_eq!(acc["linkedToHarm"], "YES");
        assert_eq!(acc["riskOfSeriousHarmDetails"], "harm details");
        assert_eq!(acc["score"], 6, "clamped to the upper bound");
        assert_eq!(acc["isHighScoring"], true);
        assert_eq!(acc["motivationToMakeChanges"], "MAKING_CHANGES");
        let finance = areas.iter().find(|a| a["goalRoute"] == "finances").unwrap();
        assert_eq!(finance["linkedToHarm"], "NO", "unscored areas fall back to the SAN answer");
        assert!(finance["score"].is_null());
    }
}
