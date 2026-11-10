//! Assessment versions: `loadPreviousVersions`, `resolveHistoricVersion`, `resolveEntryRoute`.

use std::sync::Arc;

use chrono::{DateTime, NaiveDate, NaiveDateTime, Utc};
use forge_core::{EffectContext, ForgeResult, FunctionEntry, Value};
use serde_json::{Value as Json, json};

use super::assessment::load_assessment_query;
use super::{StrengthsAndNeedsEffectsDeps, san_session, update_san_session, user_json};
use crate::forms::dsl::http_error::{internal, not_found};
use crate::forms::strengths_and_needs::v1::constants::path::CURRENT_VERSION;
use crate::register_effect;

/// `DateTime.fromISO(value, { zone: 'utc' }).toMillis()`: offset-less values read as UTC,
/// sub-millisecond digits truncated. `None` when the value isn't ISO.
pub fn iso_utc_millis(value: &str) -> Option<i64> {
    if let Ok(d) = DateTime::parse_from_rfc3339(value) {
        return Some(d.timestamp_millis());
    }
    for fmt in ["%Y-%m-%dT%H:%M:%S%.f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"] {
        if let Ok(n) = NaiveDateTime::parse_from_str(value, fmt) {
            return Some(n.and_utc().timestamp_millis());
        }
    }
    NaiveDate::parse_from_str(value, "%Y-%m-%d").ok().map(|d| d.and_hms_opt(0, 0, 0).unwrap().and_utc().timestamp_millis())
}

/// `DateTime.fromMillis(ms, { zone: 'utc' }).toISO()`.
pub fn millis_to_iso_utc(ms: i64) -> String {
    DateTime::<Utc>::from_timestamp_millis(ms)
        .map(|d| d.format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string())
        .unwrap_or_default()
}

fn millis_json(updated_at: &Json) -> Json {
    updated_at.as_str().and_then(iso_utc_millis).map_or(Json::Null, |ms| json!(ms))
}

/// `buildPreviousVersions`: versions with an assessment version, newest first, for the
/// previous versions page.
pub fn build_previous_versions(versions: &Json) -> Json {
    let mut entries: Vec<(&String, &Json)> = versions
        .as_object()
        .map(|o| o.iter().filter(|(_, e)| e.get("assessmentVersion").is_some_and(|v| !v.is_null() && v != &json!(false))).collect())
        .unwrap_or_default();
    entries.sort_by(|(a, _), (b, _)| b.cmp(a));
    Json::Array(
        entries
            .into_iter()
            .map(|(date, entry)| {
                let assessment = entry.get("assessmentVersion").cloned().unwrap_or(Json::Null);
                let plan = entry.get("planVersion").cloned().unwrap_or(Json::Null);
                let plan_millis = millis_json(plan.get("updatedAt").unwrap_or(&Json::Null));
                let mut out = serde_json::Map::new();
                let put = |out: &mut serde_json::Map<String, Json>, k: &str, v: Option<&Json>| {
                    if let Some(v) = v.filter(|v| !v.is_null()) {
                        out.insert(k.into(), v.clone());
                    }
                };
                out.insert("assessmentUpdatedDate".into(), millis_json(assessment.get("updatedAt").unwrap_or(&Json::Null)));
                put(&mut out, "assessmentVersionStatus", assessment.get("status"));
                put(&mut out, "assessmentVersionId", assessment.get("uuid"));
                out.insert("date".into(), iso_utc_millis(date).map_or(Json::Null, |ms| json!(ms)));
                put(&mut out, "description", entry.get("description"));
                out.insert("planUpdatedDate".into(), plan_millis.clone());
                if let Some(ms) = plan_millis.as_i64() {
                    out.insert("planVersionId".into(), json!(ms.to_string()));
                }
                put(&mut out, "planVersionStatus", plan.get("status"));
                Json::Object(out)
            })
            .collect(),
    )
}

/// `findVersionCreatedAt`: the SAN version created at the handover's UTC epoch millis.
pub fn find_version_created_at(versions: &[Json], created_at_millis: i64) -> Option<Json> {
    versions
        .iter()
        .find(|v| {
            v.get("entityType").and_then(Json::as_str) == Some("AAP_SAN")
                && v.get("createdAt").and_then(Json::as_str).and_then(iso_utc_millis) == Some(created_at_millis)
        })
        .cloned()
}

/// `fetchAssessmentVersions`: the session assessment's versions, cached in the session.
pub async fn fetch_assessment_versions(deps: &StrengthsAndNeedsEffectsDeps, ctx: &EffectContext) -> ForgeResult<Vec<Json>> {
    let assessment_uuid = san_session(ctx).get("assessmentUuid");
    let Some(uuid) = assessment_uuid.as_str().filter(|u| !u.is_empty()) else {
        return Err(internal("Assessment UUID is required to load previous versions"));
    };
    let versions = deps.coordinator_api.get_versions_by_entity_id(uuid).await?;
    if versions.is_null() {
        return Err(not_found("Previous versions not found"));
    }
    let unaggregated = versions.get("unaggregatedVersions").cloned().unwrap_or(json!([]));
    let countersigned = build_previous_versions(versions.get("countersignedVersions").unwrap_or(&Json::Null));
    let previous = build_previous_versions(versions.get("allVersions").unwrap_or(&Json::Null));
    update_san_session(ctx, |san| {
        san.set("countersignedVersions", Value::from_json(&countersigned));
        san.set("previousVersions", Value::from_json(&previous));
        san.set("unaggregatedVersions", Value::from_json(&unaggregated));
    });
    Ok(unaggregated.as_array().cloned().unwrap_or_default())
}

/// `findAssessmentVersion`: from the session's cached versions, refetching once (the cache may
/// predate the version).
pub async fn find_assessment_version(
    deps: &StrengthsAndNeedsEffectsDeps,
    ctx: &EffectContext,
    find: impl Fn(&[Json]) -> Option<Json>,
) -> ForgeResult<Option<Json>> {
    let cached = san_session(ctx).get("unaggregatedVersions");
    if let Some(versions) = cached.as_array() {
        let versions: Vec<Json> = versions.iter().map(Value::to_json).collect();
        if let Some(found) = find(&versions) {
            return Ok(Some(found));
        }
    }
    Ok(find(&fetch_assessment_versions(deps, ctx).await?))
}

pub fn entries(deps: &Arc<StrengthsAndNeedsEffectsDeps>) -> Vec<FunctionEntry> {
    vec![
        register_effect!("loadPreviousVersions", deps, |ctx, args| {
            fetch_assessment_versions(&deps, &ctx).await?;
            Ok(())
        }),
        // The previous version named in the URL, for `loadAssessment` to load.
        register_effect!("resolveHistoricVersion", deps, |ctx, args| {
            let assessment_uuid = ctx.get_request_param("assessmentUuid");
            let version_uuid = ctx.get_request_param("versionUuid");
            // The assessment for this access (loading the current one when the session doesn't
            // know it yet, e.g. a bookmarked previous version opened straight after access).
            if !san_session(&ctx).get("assessmentUuid").truthy() {
                let query = json!({
                    "type": "AssessmentVersionQuery",
                    "user": user_json(&ctx),
                    "assessmentIdentifier": san_session(&ctx).get("sessionDetails").get("assessmentIdentifier").to_json(),
                });
                let assessment = load_assessment_query(&deps, query).await?;
                let uuid = assessment.and_then(|a| a.get("assessmentUuid").cloned()).unwrap_or(Json::Null);
                update_san_session(&ctx, |san| san.set("assessmentUuid", Value::from_json(&uuid)));
            }
            if !assessment_uuid.strict_eq(&san_session(&ctx).get("assessmentUuid")) {
                // Another assessment: the route guards send the user to the entry step.
                return Ok(());
            }
            let wanted = version_uuid.to_js_string();
            let historic = find_assessment_version(&deps, &ctx, |versions| {
                versions
                    .iter()
                    .find(|v| {
                        v.get("entityType").and_then(Json::as_str) == Some("AAP_SAN")
                            && v.get("uuid").and_then(Json::as_str) == Some(wanted.as_str())
                    })
                    .cloned()
            })
            .await?;
            let Some(historic) = historic else {
                return Err(not_found(format!("No version {wanted} of assessment {}", assessment_uuid.to_js_string())));
            };
            let updated_at = historic.get("updatedAt").and_then(Json::as_str).and_then(iso_utc_millis);
            ctx.set_data("historicVersion", Value::from_json(&historic))?;
            ctx.set_data("previousVersionDate", updated_at.map_or(Value::Number(f64::NAN), |ms| Value::Number(ms as f64)))
        }),
        // Where access lands: the version the handover asked for (view), otherwise the current
        // version (edit with READ_WRITE access, view with READ_ONLY).
        register_effect!("resolveEntryRoute", deps, |ctx, args| {
            let details = san_session(&ctx).get("sessionDetails");
            let assessment_version = details.get("assessmentVersion");
            if !assessment_version.truthy() {
                let mode = if details.get("accessMode").as_str() == Some("READ_WRITE") { "edit" } else { "view" };
                return ctx.set_data("entryRoute", forge_core::obj! { "mode": mode, "versionUuid": CURRENT_VERSION });
            }
            let created_at = assessment_version.to_js_number() as i64;
            let version = find_assessment_version(&deps, &ctx, |versions| find_version_created_at(versions, created_at)).await?;
            let Some(version) = version else {
                return Err(not_found(format!("No assessment version created at {} ({created_at})", millis_to_iso_utc(created_at))));
            };
            ctx.set_data("entryRoute", forge_core::obj! { "mode": "view", "versionUuid": Value::from_json(&version["uuid"]) })
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn iso_millis_read_offsetless_values_as_utc() {
        assert_eq!(iso_utc_millis("2026-10-21T11:17:11.748806"), Some(1792581431748));
        assert_eq!(iso_utc_millis("2026-10-21T11:17:11.748Z"), Some(1792581431748));
        assert_eq!(millis_to_iso_utc(1792581431748), "2026-10-21T11:17:11.748Z");
    }

    #[test]
    fn finds_the_version_created_at_the_handover_timestamp() {
        let versions = vec![json!({ "uuid": "v1", "createdAt": "2026-10-21T11:17:11.748806", "entityType": "AAP_SAN" })];
        assert_eq!(find_version_created_at(&versions, 1792581431748).unwrap()["uuid"], "v1");
        assert!(find_version_created_at(&versions, 1792581431749).is_none());
    }

    #[test]
    fn previous_versions_newest_first() {
        let versions = json!({
            "2026-01-01T10:00:00": { "description": "A", "assessmentVersion": { "uuid": "a", "updatedAt": "2026-01-01T10:00:00", "status": "UNSIGNED" } },
            "2026-02-01T10:00:00": { "description": "B", "assessmentVersion": { "uuid": "b", "updatedAt": "2026-02-01T10:00:00" }, "planVersion": { "updatedAt": "2026-02-01T10:00:00" } },
            "2026-03-01T10:00:00": { "description": "C" },
        });
        let built = build_previous_versions(&versions);
        let ids: Vec<_> = built.as_array().unwrap().iter().map(|v| v["assessmentVersionId"].clone()).collect();
        assert_eq!(ids, vec![json!("b"), json!("a")]);
        assert_eq!(built[0]["planVersionId"], json!(built[0]["planUpdatedDate"].as_i64().unwrap().to_string()));
    }
}
