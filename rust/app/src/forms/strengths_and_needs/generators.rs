//! SAN's generators.

use forge_core::{FunctionEntry, Value};

use super::constants::question_content::QOpt;
use crate::forms::dsl::*;
use crate::utils::{DateFormat, encode_uri_component, form_urlencode, format_date};

/// `getTextFromListDefinition(items, value)`. Its `prepare` runs here, at definition time:
/// only each option's `value` and `text` (and `html`) travel with the call.
pub fn get_text_from_list_definition(items: &[QOpt], value: impl IntoValue) -> Ex {
    let filtered: Vec<Value> = items
        .iter()
        .filter(|x| !x.is_divider())
        .map(|x| {
            let mut result = obj! { "value": x.value.as_str(), "text": x.text.clone() };
            if x.html.truthy() {
                result.set("html", x.html.clone());
            }
            result
        })
        .collect();
    crate::generator!("getTextFromListDefinition", Value::array(filtered), value)
}

pub fn get_formatter_date_from_iso(value: impl IntoValue) -> Ex {
    crate::generator!("getFormatterDateFromIso", value)
}

pub fn get_drug_value_lower(value: impl IntoValue) -> Ex {
    crate::generator!("getDrugValueLower", value)
}

/// `createRoute(pathSegments)`.
pub fn create_route(segments: Vec<Value>) -> Ex {
    crate::generator!("createRoute", Value::array(segments))
}

/// `createRoute(pathSegments, queryParams)`.
pub fn create_route_with_query(segments: Vec<Value>, query: &[(&str, &str)]) -> Ex {
    let params: Vec<Value> = query.iter().map(|(n, v)| obj! { "name": *n, "value": *v }).collect();
    crate::generator!("createRoute", Value::array(segments), Value::array(params))
}

/// The path (and query) `createRoute` builds: segments split on `/`, empties dropped, each
/// URI-encoded; query parameters `set` in order.
pub fn create_route_value(segments: &Value, query: &Value) -> String {
    let parts: Vec<String> = segments
        .as_array()
        .map(|a| a.iter().filter(|s| !s.is_nullish()).flat_map(|s| s.to_js_string().split('/').map(str::to_string).collect::<Vec<_>>()).collect())
        .unwrap_or_default();
    let joined = parts.iter().filter(|s| !s.is_empty()).map(|s| encode_uri_component(s)).collect::<Vec<_>>().join("/");
    let path = if joined.is_empty() { "/".to_string() } else { format!("/{joined}") };
    let mut params: Vec<(String, String)> = Vec::new();
    for p in query.as_array().into_iter().flat_map(|a| a.iter()) {
        let (name, value) = (p.get("name").to_js_string(), p.get("value").to_js_string());
        match params.iter().position(|(n, _)| *n == name) {
            Some(i) => {
                params[i].1 = value;
                let mut seen = false;
                params.retain(|(n, _)| {
                    if *n != name {
                        return true;
                    }
                    let keep = !seen;
                    seen = true;
                    keep
                });
            }
            None => params.push((name, value)),
        }
    }
    if params.is_empty() {
        return path;
    }
    let search = params.iter().map(|(n, v)| format!("{}={}", form_urlencode(n), form_urlencode(v))).collect::<Vec<_>>().join("&");
    format!("{path}?{search}")
}

pub fn entries() -> Vec<FunctionEntry> {
    vec![
        FunctionEntry::generator("getTextFromListDefinition", |args| {
            let items = arg(args, 0);
            let value = arg(args, 1);
            let selected = items.as_array().and_then(|a| {
                a.iter().find(|item| item.as_object().is_some_and(|o| o.contains_key("value")) && item.get("value").strict_eq(&value)).cloned()
            });
            let Some(selected) = selected else { return Ok(Value::from("")) };
            Ok(match selected.get("text") {
                Value::Undefined | Value::Null => match selected.get("html") {
                    Value::String(h) => Value::from(super::i18n::strip_tags(&h)),
                    _ => Value::Undefined,
                },
                text => text,
            })
        }),
        FunctionEntry::generator("getFormatterDateFromIso", |args| {
            let value = arg(args, 0);
            if value.is_undefined() || value.as_str() == Some("") {
                return Ok(Value::from("Not provided"));
            }
            Ok(Value::from(format_date(&value.to_js_string(), DateFormat::Simple)))
        }),
        FunctionEntry::generator("getDrugValueLower", |args| {
            let value = arg(args, 0);
            if value.as_str() == Some("") {
                return Ok(Value::from(""));
            }
            Ok(Value::from(value.to_js_string().to_lowercase()))
        }),
        FunctionEntry::generator("createRoute", |args| Ok(Value::from(create_route_value(&arg(args, 0), &arg(args, 1))))),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;
    use forge_core::val;

    fn route(segments: Value, query: Value) -> String {
        create_route_value(&segments, &query)
    }

    #[test]
    fn create_route_matches_the_ts_generator() {
        assert_eq!(route(val!(["strengths-and-needs", "v1.0", "accommodation"]), val!([])), "/strengths-and-needs/v1.0/accommodation");
        assert_eq!(route(val!([]), val!([])), "/");
        assert_eq!(route(val!(["/strengths-and-needs/", "/v1.0/", "accommodation"]), val!([])), "/strengths-and-needs/v1.0/accommodation");
        assert_eq!(route(val!(["path", "with spaces", "section"]), val!([])), "/path/with%20spaces/section");
        assert_eq!(route(val!(["path", "with&ampersand"]), val!([])), "/path/with%26ampersand");
        assert_eq!(route(val!(["path", "question?mark"]), val!([])), "/path/question%3Fmark");
        assert_eq!(route(val!(["accommodation"]), val!([{ "name": "resume", "value": "true" }])), "/accommodation?resume=true");
        assert_eq!(route(val!(["accommodation"]), val!([{ "name": "filter", "value": "value with spaces" }])), "/accommodation?filter=value+with+spaces");
        assert_eq!(route(val!(["path", null, "section"]), Value::Undefined), "/path/section");
        assert_eq!(route(val!(["path", "/", "///", "section"]), val!([])), "/path/section");
    }
}
