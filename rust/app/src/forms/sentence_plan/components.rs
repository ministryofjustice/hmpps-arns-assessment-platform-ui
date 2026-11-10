//! The sentence plan's components (`components/`): goal summary cards, the assessment info
//! panel, previous versions, the MPoP supervision package, and the JSX wrappers (accessible
//! autocomplete, button-as-link, wrapping select), rendered here as the JSX runtime would.

use forge_core::authoring::Component;
use forge_core::engine::registries::ComponentEntry;
use forge_core::{Value, obj};
use forge_runjucks::nunjucks_render;

use crate::config::config;

pub const ACCESSIBLE_AUTOCOMPLETE: Component = Component::basic("accessibleAutocomplete");
pub const ASSESSMENT_INFO_DETAILS: Component = Component::basic("assessmentInfoDetails");
pub const BUTTON_AS_LINK: Component = Component::basic("buttonAsLink");
pub const GOAL_SUMMARY_CARD_DRAFT: Component = Component::basic("goalSummaryCardDraft");
pub const GOAL_SUMMARY_CARD_AGREED: Component = Component::basic("goalSummaryCardAgreed");
pub const GOAL_SUMMARY_CARD_HISTORY: Component = Component::basic("goalSummaryCardHistory");
pub const PRINT_GOAL_SUMMARY_CARD: Component = Component::basic("printGoalSummaryCard");
pub const PREVIOUS_VERSIONS: Component = Component::basic("previousVersions");
pub const SUPERVISION_PACKAGE: Component = Component::basic("supervisionPackage");
pub const WRAPPING_SELECT: Component = Component::basic("wrappingSelect");

fn list(v: &Value) -> Vec<Value> {
    v.as_array().map(|a| a.to_vec()).unwrap_or_default()
}

/// `[...strings].sort().join('; ')`, or `undefined` for none.
fn related_areas_text(v: &Value) -> Value {
    let mut areas: Vec<String> = list(v).iter().map(Value::to_js_string).collect();
    if areas.is_empty() {
        return Value::Undefined;
    }
    areas.sort();
    Value::from(areas.join("; "))
}

fn completed_count(steps: &[Value]) -> usize {
    steps.iter().filter(|s| s.get("status").as_str() == Some("COMPLETED")).count()
}

/// The goal summary cards' template params.
pub fn goal_summary_card_params(props: &Value) -> Value {
    let steps = list(&props.get("steps"));
    let notes = list(&props.get("notes"));
    let actions: Vec<Value> = list(&props.get("actions")).into_iter().filter(|a| !a.get("hidden").truthy()).collect();
    let removed_note = if props.get("goalStatus").as_str() == Some("REMOVED") {
        notes.iter().find(|n| n.get("type").as_str() == Some("REMOVED")).map_or(Value::Undefined, |n| n.get("note"))
    } else {
        Value::Undefined
    };
    obj! {
        "goalTitle": props.get("goalTitle"),
        "goalStatus": props.get("goalStatus"),
        "goalUuid": props.get("goalUuid"),
        "targetDate": props.get("targetDate"),
        "statusDate": props.get("statusDate"),
        "areaOfNeed": props.get("areaOfNeed"),
        "relatedAreasText": related_areas_text(&props.get("relatedAreasOfNeed")),
        "stepsCount": steps.len(),
        "completedCount": completed_count(&steps),
        "steps": steps,
        "notes": notes,
        "removedNote": removed_note,
        "actions": actions,
        "isReadOnly": props.get("isReadOnly"),
        "buttons": list(&props.get("buttons")),
        "errorMessage": props.get("errorMessage"),
        "index": props.get("index"),
        "classes": props.get("classes"),
        "showMoveUp": props.get("showMoveUp"),
        "showMoveDown": props.get("showMoveDown"),
        "moveUpHref": props.get("moveUpHref"),
        "moveDownHref": props.get("moveDownHref"),
    }
}

fn print_goal_summary_card_params(props: &Value) -> Value {
    let steps = list(&props.get("steps"));
    obj! {
        "goalTitle": props.get("goalTitle"),
        "goalStatus": props.get("goalStatus"),
        "targetDate": props.get("targetDate"),
        "statusDate": props.get("statusDate"),
        "areaOfNeed": props.get("areaOfNeed"),
        "relatedAreasText": related_areas_text(&props.get("relatedAreasOfNeed")),
        "completedCount": completed_count(&steps),
        "steps": steps,
    }
}

fn previous_versions_params(props: &Value) -> Value {
    obj! {
        "personName": props.get("personName"),
        "versions": props.get("previousVersions"),
        "showAssessmentColumn": crate::forms::dsl::nullish_or(props.get("showAssessmentColumn"), || Value::Bool(true)),
        "sanUrl": config().san_url.as_str(),
        "tables": obj! {
            "allVersions": obj! { "tableHeading": "All versions", "tagSource": "planAgreementStatus" },
            "countersignedVersions": obj! { "tableHeading": "Countersigned versions", "tagSource": "status" },
        },
        "tags": obj! {
            "countersigned": obj! {
                "statuses": [Value::from("COUNTERSIGNED"), Value::from("DOUBLE_COUNTERSIGNED")],
                "text": "Countersigned",
                "classes": "govuk-tag--teal",
            },
            "agreed": obj! { "statuses": [Value::from("AGREED")], "text": "Plan agreed", "classes": "govuk-tag--blue" },
        },
    }
}

/// The MPoP supervision package macro reads the package fields off the top level, so the
/// frontend context is spread in.
pub fn supervision_package_params(props: &Value) -> Value {
    let tier = props.get("tierCalculation");
    let tier_score = match tier.get("tierScore") {
        v if tier.truthy() && v.as_str() != Some("MISSING") => v,
        _ => Value::Undefined,
    };
    let mut params = obj! { "tierScore": tier_score, "tag": tier.get("tag"), "crn": props.get("crn") };
    if let Some(details) = props.get("supervisionPackageDetails").as_object() {
        for (k, v) in details.iter() {
            params.set(k.clone(), v.clone());
        }
    }
    params.set("oasysReviewHref", props.get("oasysReviewHref"));
    params.set("openInNewTab", props.get("openInNewTab"));
    params
}

/// `value === null`.
fn is_null(v: &Value) -> bool {
    matches!(v, Value::Null)
}

fn linked_text(indicator: &Value, yes: &str, no: &str) -> Value {
    match indicator.as_str() {
        Some("YES") => Value::from(yes),
        Some("NO") => Value::from(no),
        _ => Value::Null,
    }
}

fn motivation_text(motivation: &Value, person: &str) -> Value {
    let text = match motivation.as_str() {
        Some("MADE_CHANGES") => format!("{person} has already made positive changes and wants to maintain them."),
        Some("MAKING_CHANGES") => format!("{person} is actively making changes."),
        Some("WANT_TO_MAKE_CHANGES") => format!("{person} wants to make changes and knows how to."),
        Some("NEEDS_HELP_TO_MAKE_CHANGES") => format!("{person} wants to make changes but needs help."),
        Some("THINKING_ABOUT_MAKING_CHANGES") => format!("{person} is thinking about making changes."),
        Some("DOES_NOT_WANT_TO_MAKE_CHANGES") => format!("{person} does not want to make changes."),
        Some("DOES_NOT_WANT_TO_ANSWER") => format!("{person} does not want to answer."),
        Some("NOT_PRESENT") => format!("{person} was not present to answer this question."),
        Some("NOT_APPLICABLE") => "This question was not applicable.".to_string(),
        _ => return Value::Null,
    };
    Value::from(text)
}

/// `buildParams` for the assessment info details panel.
pub fn assessment_info_details_params(props: &Value) -> Value {
    let data = props.get("assessmentData");
    let has = !data.is_nullish();
    let field = |k: &str| if has { data.get(k) } else { Value::Undefined };
    let present = |k: &str| !field(k).is_nullish();
    let is_complete = field("isAssessmentSectionComplete").strict_eq(&Value::Bool(true));
    let has_data = has
        && (field("isAssessmentSectionComplete").truthy()
            || present("linkedToHarm")
            || present("linkedToReoffending")
            || present("linkedToStrengthsOrProtectiveFactors")
            || present("motivationToMakeChanges")
            || present("score"));
    let details_if = |linked: &Value, key: &str| if linked.truthy() { field(key) } else { Value::Null };
    let rosh = field("linkedToHarm");
    let reoffending = field("linkedToReoffending");
    let strengths = field("linkedToStrengthsOrProtectiveFactors");
    let motivation_bypassed = has && !present("motivationToMakeChanges") && field("isAssessmentSectionComplete").truthy();
    let mut missing = vec![];
    if has {
        if !present("linkedToHarm") {
            missing.push("whether this area is linked to RoSH (risk of serious harm)");
        }
        if !present("linkedToReoffending") {
            missing.push("whether this area is linked to risk of reoffending");
        }
        if !present("motivationToMakeChanges") && !motivation_bypassed {
            missing.push("motivation to make changes");
        }
        if !present("linkedToStrengthsOrProtectiveFactors") {
            missing.push("strengths and protective factors");
        }
        if !present("score") && present("upperBound") {
            missing.push("the need score");
        }
    }
    let or_null = |k: &str| if present(k) { field(k) } else { Value::Null };
    let (score, upper, threshold) = (or_null("score"), or_null("upperBound"), or_null("threshold"));
    let sub_area = or_null("subArea");
    let person = props.get("personName").to_js_string();
    obj! {
        "personName": props.get("personName"),
        "areaName": props.get("areaName"),
        "isError": props.get("status").as_str() == Some("error"),
        "hasData": has_data,
        "isComplete": is_complete,
        "roshLinked": rosh.clone(),
        "roshText": linked_text(&rosh, "is", "is not"),
        "roshDetails": details_if(&rosh, "riskOfSeriousHarmDetails"),
        "reoffendingLinked": reoffending.clone(),
        "reoffendingText": linked_text(&reoffending, "is", "is not"),
        "reoffendingDetails": details_if(&reoffending, "riskOfReoffendingDetails"),
        "motivationText": motivation_text(&field("motivationToMakeChanges"), &person),
        "motivationBypassed": motivation_bypassed,
        "strengthsLinked": strengths.clone(),
        "strengthsText": linked_text(&strengths, "are", "are no"),
        "strengthsDetails": details_if(&strengths, "strengthsOrProtectiveFactorsDetails"),
        "hasScore": !is_null(&score) && !is_null(&upper) && !is_null(&threshold),
        "score": score,
        "upperBound": upper,
        "threshold": threshold,
        "hasSubArea": !is_null(&sub_area) && !is_null(&sub_area.get("score")),
        "subArea": sub_area,
        "hasMissingItems": !missing.is_empty(),
        "missingItems": Value::array(missing.into_iter().map(Value::from).collect()),
        "fullWidth": props.get("fullWidth"),
        "showAsDetails": crate::forms::dsl::nullish_or(props.get("showAsDetails").clone(), || Value::Bool(true)),
    }
}

/// The JSX runtime's escaping (`<>&"'`).
pub fn escape_jsx(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '<' => out.push_str("&lt;"),
            '>' => out.push_str("&gt;"),
            '&' => out.push_str("&amp;"),
            '"' => out.push_str("&quot;"),
            '\'' => out.push_str("&#39;"),
            c => out.push(c),
        }
    }
    out
}

/// JSX attributes: `undefined`, `null` and `false` are left out, `true` is a bare name.
fn attrs(pairs: &[(String, Value)]) -> String {
    pairs
        .iter()
        .filter(|(_, v)| !v.is_nullish() && !v.strict_eq(&Value::Bool(false)))
        .map(|(k, v)| {
            if v.strict_eq(&Value::Bool(true)) {
                format!(" {}", escape_jsx(k))
            } else {
                format!(" {}=\"{}\"", escape_jsx(k), escape_jsx(&v.to_js_string()))
            }
        })
        .collect()
}

/// `String(value)` unless `undefined` (the client reads literal "true"/"false").
fn as_flag(v: Value) -> Value {
    if v.is_undefined() { v } else { Value::from(v.to_js_string()) }
}

fn json_or_undefined(v: &Value) -> Value {
    if v.is_undefined() { Value::Undefined } else { Value::from(v.to_json().to_string()) }
}

pub fn accessible_autocomplete_html(props: &Value) -> String {
    let field = props.get("field");
    let field_block = field.get("block");
    let field_code = crate::forms::dsl::nullish_or(field_block.get("code"), || Value::from("autocomplete-field")).to_js_string();
    let data_id = format!("autocomplete-data-{field_code}");
    let default_value = crate::forms::dsl::nullish_or(field_block.get("value"), || field_block.get("defaultValue"));
    let classes = props.get("classes");
    let wrapper_classes =
        if classes.truthy() { format!("accessible-autocomplete-wrapper {}", classes.to_js_string()) } else { "accessible-autocomplete-wrapper".into() };
    let source_key = props.get("dataKeyFrom");
    let wrapper = attrs(&[
        ("class".into(), Value::from(wrapper_classes)),
        ("data-autocomplete-source".into(), Value::from(data_id.as_str())),
        ("data-autocomplete-default-value".into(), as_flag(default_value)),
        ("data-autocomplete-source-key-from".into(), if source_key.truthy() { source_key } else { Value::Undefined }),
        ("data-autocomplete-min-length".into(), as_flag(props.get("minLength"))),
        ("data-autocomplete-show-no-options".into(), as_flag(props.get("showNoOptionsFound"))),
        ("data-autocomplete-autoselect".into(), as_flag(props.get("autoselect"))),
        ("data-autocomplete-confirm-on-blur".into(), as_flag(props.get("confirmOnBlur"))),
        ("data-autocomplete-display-menu".into(), as_flag(props.get("displayMenu"))),
        ("data-autocomplete-show-all-values".into(), as_flag(props.get("showAllValues"))),
        ("data-autocomplete-menu-attributes".into(), json_or_undefined(&props.get("menuAttributes"))),
    ]);
    let data = props.get("data");
    let data_json = if data.is_undefined() { String::new() } else { data.to_json().to_string() };
    format!(
        "<script{}>{data_json}</script><accessible-autocomplete-wrapper{wrapper}>{}</accessible-autocomplete-wrapper>",
        attrs(&[
            ("type".into(), Value::from("application/json")),
            ("id".into(), Value::from(data_id.as_str())),
            ("data-qa".into(), Value::from(data_id.as_str())),
        ]),
        field.get("html").to_js_string(),
    )
}

pub fn button_as_link_html(props: &Value) -> String {
    let classes = props.get("classes");
    let classes = if classes.truthy() { format!("button-as-link {}", classes.to_js_string()) } else { "button-as-link".into() };
    let mut pairs: Vec<(String, Value)> = vec![
        ("type".into(), crate::forms::dsl::nullish_or(props.get("buttonType"), || Value::from("submit"))),
        ("class".into(), Value::from(classes)),
        ("id".into(), props.get("id")),
        ("name".into(), props.get("name")),
        ("value".into(), props.get("value")),
        ("disabled".into(), Value::Bool(props.get("disabled").truthy())),
    ];
    if let Some(extra) = props.get("attributes").as_object() {
        for (k, v) in extra.iter() {
            // a spread attribute replaces an earlier one with the same name, in place
            match pairs.iter_mut().find(|(name, _)| name == k.as_ref()) {
                Some(existing) => existing.1 = v.clone(),
                None => pairs.push((k.to_string(), v.clone())),
            }
        }
    }
    let text = props.get("text");
    let text = if text.is_nullish() || matches!(text, Value::Bool(_)) { String::new() } else { escape_jsx(&text.to_js_string()) };
    format!("<button{}>{text}</button>", attrs(&pairs))
}

pub fn wrapping_select_html(props: &Value) -> String {
    format!("<wrapping-select-wrapper class=\"wrapping-select\">{}</wrapping-select-wrapper>", props.get("field").get("html").to_js_string())
}

pub fn components() -> Vec<ComponentEntry> {
    vec![
        ComponentEntry::new("accessibleAutocomplete").with_render(|block, _| Ok(Value::from(accessible_autocomplete_html(block)))),
        ComponentEntry::new("assessmentInfoDetails").with_render(nunjucks_render(
            "sentence-plan/components/assessment-info-details/assessmentInfoDetails.njk",
            assessment_info_details_params,
        )),
        ComponentEntry::new("buttonAsLink").with_render(|block, _| Ok(Value::from(button_as_link_html(block)))),
        ComponentEntry::new("goalSummaryCardDraft")
            .with_render(nunjucks_render("sentence-plan/components/goal-summary-card/draft.njk", goal_summary_card_params)),
        ComponentEntry::new("goalSummaryCardAgreed")
            .with_render(nunjucks_render("sentence-plan/components/goal-summary-card/agreed.njk", goal_summary_card_params)),
        ComponentEntry::new("goalSummaryCardHistory")
            .with_render(nunjucks_render("sentence-plan/components/goal-summary-card/history.njk", goal_summary_card_params)),
        ComponentEntry::new("printGoalSummaryCard").with_render(nunjucks_render(
            "sentence-plan/components/print-goal-summary-card/template.njk",
            print_goal_summary_card_params,
        )),
        ComponentEntry::new("previousVersions")
            .with_render(nunjucks_render("sentence-plan/components/previous-versions/table.njk", previous_versions_params)),
        ComponentEntry::new("supervisionPackage")
            .with_render(nunjucks_render("mpop/components/supervision-package/template.njk", supervision_package_params)),
        ComponentEntry::new("wrappingSelect").with_render(|block, _| Ok(Value::from(wrapping_select_html(block)))),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn button_as_link_renders_like_jsx() {
        let html = button_as_link_html(&obj! {
            "text": "Remove <x>",
            "name": "action",
            "value": "remove_0",
            "classes": "govuk-!-margin-bottom-0",
            "attributes": obj! { "data-ai-id": "remove-0" },
        });
        assert_eq!(
            html,
            "<button type=\"submit\" class=\"button-as-link govuk-!-margin-bottom-0\" name=\"action\" value=\"remove_0\" data-ai-id=\"remove-0\">Remove &lt;x&gt;</button>"
        );
    }

    #[test]
    fn related_areas_are_sorted_and_joined() {
        let v = Value::array(vec![Value::from("b"), Value::from("a")]);
        assert_eq!(related_areas_text(&v).to_js_string(), "a; b");
        assert!(related_areas_text(&Value::array(vec![])).is_undefined());
    }

    #[test]
    fn assessment_params_list_missing_items() {
        let p = assessment_info_details_params(&obj! {
            "personName": "Sam",
            "status": "success",
            "assessmentData": obj! { "upperBound": 6, "linkedToHarm": "YES", "riskOfSeriousHarmDetails": "d" },
        });
        assert_eq!(p.get("roshText").to_js_string(), "is");
        assert_eq!(p.get("missingItems").as_array().unwrap().len(), 4);
        assert!(p.get("hasData").truthy());
    }
}
