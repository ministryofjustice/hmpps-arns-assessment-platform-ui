//! `mpopNunjucksSetup` (`@ministryofjustice/hmpps-mpop-frontend-components-lib`): the filters
//! MPoP's component templates (the supervision package) use.

use std::sync::Arc;

use chrono::{DateTime, Datelike, NaiveDate, NaiveDateTime, NaiveTime, TimeZone, Timelike};
use chrono_tz::Europe::London;
use forge_runjucks::RunjucksEngine;
use runjucks_core::errors::RunjucksError;
use serde_json::{Value as Json, json};

type FilterResult = Result<Json, RunjucksError>;

fn blank(v: &Json) -> Option<&str> {
    v.as_str().filter(|s| !s.trim().is_empty())
}

/// Luxon `DateTime.fromISO(s, { zone: 'Europe/London' })`: dates, local date-times and offset
/// date-times.
fn from_iso_london(s: &str) -> Option<DateTime<chrono_tz::Tz>> {
    if let Ok(d) = DateTime::parse_from_rfc3339(s) {
        return Some(d.with_timezone(&London));
    }
    for format in ["%Y-%m-%dT%H:%M:%S%.f", "%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M"] {
        if let Ok(n) = NaiveDateTime::parse_from_str(s, format) {
            return London.from_local_datetime(&n).earliest();
        }
    }
    NaiveDate::parse_from_str(s, "%Y-%m-%d").ok().and_then(|d| London.from_local_datetime(&d.and_time(NaiveTime::MIN)).earliest())
}

/// `govukTime`: "9am", "2:30pm".
fn govuk_time(s: &str) -> Option<String> {
    let dt = from_iso_london(s)?;
    let (pm, hour) = dt.hour12();
    let suffix = if pm { "pm" } else { "am" };
    Some(if dt.minute() == 0 { format!("{hour}{suffix}") } else { format!("{hour}:{:02}{suffix}", dt.minute()) })
}

fn date_with_year(v: &Json, args: &[Json]) -> FilterResult {
    let Some(s) = blank(v) else { return Ok(Json::Null) };
    let Some(dt) = from_iso_london(s) else { return Ok(Json::Null) };
    let show_time = args.first().and_then(Json::as_bool).unwrap_or(false);
    let time = if show_time { govuk_time(s) } else { None };
    Ok(json!(format!("{} {} {}{}", dt.day(), dt.format("%B"), dt.year(), time.map(|t| format!(" at {t}")).unwrap_or_default())))
}

fn appointment_date_time(v: &Json, args: &[Json]) -> FilterResult {
    let (Some(date), Some(start)) = (blank(v), args.first().and_then(blank)) else { return Ok(Json::Null) };
    let Some(dt) = from_iso_london(date) else { return Ok(Json::Null) };
    let Some(time) = govuk_time(&format!("{date}T{start}")) else { return Ok(Json::Null) };
    Ok(json!(format!("{} {} {} at {time}", dt.format("%A"), dt.day(), dt.format("%b"))))
}

fn to_title_case(v: &Json, _: &[Json]) -> FilterResult {
    let Some(s) = v.as_str().filter(|s| !s.is_empty()) else { return Ok(json!("")) };
    let lower = s.to_lowercase();
    let mut chars = lower.chars();
    let mut out: String = chars.next().map(|c| c.to_uppercase().collect::<String>()).unwrap_or_default() + chars.as_str();
    for word in ["(NS)", "(Non", "NS)", "IRC", "RoTL"] {
        let re = regex::RegexBuilder::new(&regex::escape(word)).case_insensitive(true).build().expect("regex");
        out = re.replace_all(&out, regex::NoExpand(word)).to_string();
    }
    Ok(json!(out))
}

fn code_of<'a>(v: &'a Json, path: &[&str]) -> Option<&'a str> {
    let mut cur = v;
    for p in path {
        cur = cur.get(p)?;
    }
    cur.as_str()
}

fn is_spx(s: &Json) -> bool {
    code_of(s, &["supervisionPackage", "code"]) == Some("SPX")
}

fn is_terminated(s: &Json) -> bool {
    code_of(s, &["custody", "status", "code"]) == Some("T")
}

/// `getPrimarySentence`: the sentence the package is about, or `false`.
fn primary_sentence(sentences: &Json) -> Json {
    let Some(list) = sentences.as_array().filter(|l| !l.is_empty()) else { return Json::Bool(false) };
    if list.len() == 1 && !is_spx(&list[0]) && !is_terminated(&list[0]) {
        return list[0].clone();
    }
    if let Some(s) = list.iter().find(|s| s.get("supervisionPackage").is_some_and(|p| !p.is_null() && p != &json!(false)) && !is_terminated(s) && !is_spx(s)) {
        return s.clone();
    }
    let event_number = |s: &Json| match s.get("eventNumber") {
        Some(Json::Number(n)) => n.as_f64().unwrap_or(f64::NAN),
        Some(Json::String(t)) => t.trim().parse().unwrap_or(f64::NAN),
        _ => f64::NAN,
    };
    let mut highest: Option<&Json> = None;
    for s in list.iter().filter(|s| !is_terminated(s)) {
        // `Number(a) > Number(b)` is false for NaN, so the first non-terminated sentence stays
        // until a later one is strictly higher.
        if highest.is_none_or(|h| event_number(s) > event_number(h)) {
            highest = Some(s);
        }
    }
    highest.cloned().unwrap_or(Json::Bool(false))
}

fn get_primary_sentence(v: &Json, _: &[Json]) -> FilterResult {
    Ok(primary_sentence(v))
}

fn has_breached_sentence(v: &Json, _: &[Json]) -> FilterResult {
    Ok(json!(primary_sentence(v).get("inBreach") == Some(&Json::Bool(true))))
}

fn has_terminated_sentence(v: &Json, _: &[Json]) -> FilterResult {
    Ok(json!(v.as_array().is_some_and(|l| !l.is_empty() && l.iter().all(is_terminated))))
}

fn is_spx_only_sentence_list(v: &Json, _: &[Json]) -> FilterResult {
    Ok(json!(v.as_array().is_some_and(|l| !l.is_empty() && l.iter().all(is_spx))))
}

fn is_eligible_for_discretionary_appointments(v: &Json, args: &[Json]) -> FilterResult {
    let tier = args.first().and_then(Json::as_str).unwrap_or_default();
    let red_rated = v.get("integratedOffenderManagementRedRated").is_some_and(|r| r.as_bool().unwrap_or(!r.is_null()));
    Ok(json!(v.get("gender").and_then(Json::as_str) == Some("Female") && !red_rated && ["C", "D", "E", "F", "G"].contains(&tier)))
}

fn final_third_status(v: &Json, args: &[Json]) -> FilterResult {
    let today = chrono::Utc::now().with_timezone(&London).date_naive();
    let day = |s: &Json| s.as_str().filter(|s| !s.is_empty()).and_then(from_iso_london).map(|d| d.date_naive());
    if let Some(end) = args.first().and_then(day)
        && today >= end
    {
        return Ok(json!({ "text": "Ended", "tagClass": "govuk-tag--grey" }));
    }
    match day(v) {
        Some(third) if today >= third => Ok(json!({ "text": "In progress", "tagClass": "govuk-tag--green" })),
        _ => Ok(json!({ "text": "Not started", "tagClass": "govuk-tag--blue" })),
    }
}

fn is_in_custody(v: &Json, args: &[Json]) -> FilterResult {
    let codes: Vec<String> = match args.first().and_then(Json::as_array) {
        Some(c) => c.iter().filter_map(Json::as_str).map(str::to_string).collect(),
        None => ["D", "I", "R", "C"].map(str::to_string).to_vec(),
    };
    let found = v.as_array().and_then(|l| {
        l.iter().find(|s| code_of(s, &["custody", "status", "code"]).is_some_and(|c| codes.contains(&c.to_uppercase())))
    });
    Ok(found.and_then(|s| s.get("custody")?.get("status")?.get("description").cloned()).unwrap_or(Json::Null))
}

fn is_at_large(v: &Json, _: &[Json]) -> FilterResult {
    Ok(json!(v.as_array().is_some_and(|l| l.iter().any(|s| code_of(s, &["custody", "location", "code"]) == Some("UATLRG")))))
}

fn sentence_type(v: &Json, _: &[Json]) -> FilterResult {
    let Some(sentences) = v.get("sentences").filter(|s| !s.is_null()) else { return Ok(json!(false)) };
    match code_of(v, &["liferCategory", "code"]) {
        Some("LF01") => return Ok(json!("Imprisonment for Public Protection")),
        Some("LF02") => return Ok(json!("extended determinate sentence")),
        _ => {}
    }
    if v.get("liferCategory").is_some_and(|l| !l.is_null() && l != &json!(false)) {
        return Ok(json!("life sentence"));
    }
    let primary = primary_sentence(sentences);
    let flag = |k: &str| primary.get("type").and_then(|t| t.get(k)).and_then(Json::as_bool);
    Ok(if flag("isSuspendedSentence") == Some(true) {
        json!("suspended sentence")
    } else if flag("isCustodial") == Some(true) {
        json!("custodial sentence")
    } else if flag("isCustodial") == Some(false) {
        json!("community sentence")
    } else {
        json!(false)
    })
}

fn supervision_appointments_reset(v: &Json, args: &[Json]) -> FilterResult {
    let primary = primary_sentence(args.first().unwrap_or(&Json::Null));
    let Some(end) = primary.get("endDate").and_then(blank) else { return Ok(json!(false)) };
    let (Some(year_end), Some(end)) = (v.as_str().and_then(from_iso_london), from_iso_london(end)) else { return Ok(json!(false)) };
    Ok(json!(end.date_naive() > year_end.date_naive()))
}

fn space_out_chars(v: &Json, _: &[Json]) -> FilterResult {
    let Some(s) = v.as_str().filter(|s| !s.is_empty()) else { return Ok(json!("")) };
    Ok(json!(s.chars().map(String::from).collect::<Vec<_>>().join(" ")))
}

pub fn register(engine: &mut RunjucksEngine) {
    let env = engine.environment_mut();
    env.add_filter("dateWithYear", Arc::new(date_with_year));
    env.add_filter("govukTime", Arc::new(|v: &Json, _: &[Json]| Ok(blank(v).and_then(govuk_time).map_or(Json::Null, Json::String))));
    env.add_filter("appointmentDateTime", Arc::new(appointment_date_time));
    env.add_filter("toTitleCase", Arc::new(to_title_case));
    env.add_filter("hasBreachedSentence", Arc::new(has_breached_sentence));
    env.add_filter("hasTerminatedSentence", Arc::new(has_terminated_sentence));
    env.add_filter("isEligibleForDiscretionaryAppointments", Arc::new(is_eligible_for_discretionary_appointments));
    env.add_filter("finalThirdStatus", Arc::new(final_third_status));
    env.add_filter("isInCustody", Arc::new(is_in_custody));
    env.add_filter("isAtLarge", Arc::new(is_at_large));
    env.add_filter("sentenceType", Arc::new(sentence_type));
    env.add_filter("getPrimarySentence", Arc::new(get_primary_sentence));
    env.add_filter("supervisionAppointmentsReset", Arc::new(supervision_appointments_reset));
    env.add_filter("spaceOutChars", Arc::new(space_out_chars));
    env.add_filter("isSpxOnlySentenceList", Arc::new(is_spx_only_sentence_list));
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn dates_and_times() {
        assert_eq!(date_with_year(&json!("2025-03-04"), &[]).unwrap(), json!("4 March 2025"));
        assert_eq!(date_with_year(&json!("2025-03-04T14:30:00"), &[json!(true)]).unwrap(), json!("4 March 2025 at 2:30pm"));
        assert_eq!(appointment_date_time(&json!("2025-03-04"), &[json!("09:00")]).unwrap(), json!("Tuesday 4 Mar at 9am"));
        assert_eq!(space_out_chars(&json!("A12"), &[]).unwrap(), json!("A 1 2"));
        assert_eq!(to_title_case(&json!("ADULT CUSTODY (NS)"), &[]).unwrap(), json!("Adult custody (NS)"));
    }

    #[test]
    fn primary_sentence_prefers_the_supervision_package() {
        let sentences = json!([
            { "eventNumber": "1", "supervisionPackage": null },
            { "eventNumber": "2", "supervisionPackage": { "code": "STD" }, "inBreach": true },
        ]);
        assert_eq!(primary_sentence(&sentences)["eventNumber"], "2");
        assert_eq!(has_breached_sentence(&sentences, &[]).unwrap(), json!(true));
        assert_eq!(primary_sentence(&json!([])), json!(false));
    }
}
