//! The data deletion tool's transformers and conditions: JSON (de)serialisation, a JSON diff
//! rendered as HTML and `IsValidJson`.

use forge_core::{ForgeError, FunctionEntry};
use serde_json::Value as Json;

use crate::forms::dsl::*;

/// `JSON.stringify(value)`: `None` for `undefined` (and functions), as in JS.
fn js_stringify(value: &Value) -> Option<String> {
    (!value.is_undefined()).then(|| value.to_json().to_string())
}

/// `JSON.stringify(value, null, 2)`.
fn js_stringify_pretty(value: &Value) -> Option<String> {
    if value.is_undefined() {
        return None;
    }
    let mut out = Vec::new();
    let mut serializer = serde_json::Serializer::with_formatter(&mut out, serde_json::ser::PrettyFormatter::with_indent(b"  "));
    serde::Serialize::serialize(&value.to_json(), &mut serializer).ok()?;
    String::from_utf8(out).ok()
}

fn escape_html(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;")
}

/// `escapeHtml(JSON.stringify(value))`, which renders `undefined` for `undefined`.
fn render_value(value: &Value) -> String {
    js_stringify(value).map_or_else(|| "undefined".to_string(), |s| escape_html(&s))
}

enum Diff {
    Added(Value),
    Removed(Value),
    Changed(Value, Value),
    Unchanged(Value),
    Object(Vec<(String, Diff)>),
    Array(Vec<Diff>),
}

fn diff_json(left: &Value, right: &Value) -> Diff {
    if js_stringify(left) == js_stringify(right) {
        return Diff::Unchanged(left.clone());
    }
    match (left, right) {
        (Value::Array(l), Value::Array(r)) => Diff::Array(
            (0..l.len().max(r.len()))
                .map(|i| match (l.get(i), r.get(i)) {
                    (None, Some(r)) => Diff::Added(r.clone()),
                    (Some(l), None) => Diff::Removed(l.clone()),
                    (Some(l), Some(r)) => diff_json(l, r),
                    (None, None) => unreachable!(),
                })
                .collect(),
        ),
        (Value::Object(l), Value::Object(r)) => {
            // Left-side order first, then keys only the right side has.
            let mut keys: Vec<&str> = l.keys().map(|k| k.as_ref()).collect();
            keys.extend(r.keys().map(|k| k.as_ref()).filter(|k| !l.contains_key(*k)));
            Diff::Object(
                keys.into_iter()
                    .map(|k| {
                        let node = match (l.get(k), r.get(k)) {
                            (None, Some(r)) => Diff::Added(r.clone()),
                            (Some(l), None) => Diff::Removed(l.clone()),
                            (Some(l), Some(r)) => diff_json(l, r),
                            (None, None) => unreachable!(),
                        };
                        (k.to_string(), node)
                    })
                    .collect(),
            )
        }
        _ => Diff::Changed(left.clone(), right.clone()),
    }
}

fn render_diff(node: &Diff, indent: usize, key: Option<&str>) -> String {
    let pad = "&nbsp;".repeat(indent * 2);
    let key = key.filter(|k| !k.is_empty()).map(|k| format!("\"{k}\": ")).unwrap_or_default();
    match node {
        Diff::Unchanged(v) => format!("<div class=\"line unchanged\">{pad}{key}{}</div>", render_value(v)),
        Diff::Added(v) => format!("<div class=\"line added\">{pad}+ {key}{}</div>", render_value(v)),
        Diff::Removed(v) => format!("<div class=\"line removed\">{pad}- {key}{}</div>", render_value(v)),
        Diff::Changed(before, after) => format!(
            "\n<div class=\"line removed\">{pad}- {key}{}</div>\n<div class=\"line added\">{pad}+ {key}{}</div>",
            render_value(before),
            render_value(after)
        ),
        Diff::Object(children) => {
            let inner: String = children.iter().map(|(k, c)| render_diff(c, indent + 1, Some(k))).collect();
            format!(
                "\n<div class=\"line unchanged\">{pad}{key}{{</div>\n{inner}\n<div class=\"line unchanged\">{pad}}}</div>"
            )
        }
        Diff::Array(children) => {
            let inner: String = children.iter().map(|c| render_diff(c, indent + 1, None)).collect();
            format!("\n<div class=\"line unchanged\">{pad}{key}[</div>\n{inner}\n<div class=\"line unchanged\">{pad}]</div>")
        }
    }
}

/// `diffHtml`: the change from `left` to `right`, line by line.
pub fn diff_html(left: &Value, right: &Value) -> String {
    format!("<div class=\"json-diff\">{}</div>", render_diff(&diff_json(left, right), 0, None))
}

pub fn entries() -> Vec<FunctionEntry> {
    vec![
        FunctionEntry::transformer("JSONStringify", |v, _| Ok(js_stringify_pretty(v).map_or(Value::Undefined, Value::from))),
        FunctionEntry::transformer("JSONParse", |v, _| {
            serde_json::from_str::<Json>(&v.to_js_string())
                .map(|j| Value::from_json(&j))
                .map_err(|e| ForgeError::evaluation(format!("JSONParse: {e}")))
        }),
        FunctionEntry::transformer("Diff", |left, args| Ok(Value::from(diff_html(left, &arg(args, 0))))),
        FunctionEntry::condition("IsValidJson", |v, _| match v {
            Value::String(s) => Ok(serde_json::from_str::<Json>(s).is_ok()),
            _ => Err(ForgeError::evaluation("IsValidJson expects a string")),
        }),
    ]
}

#[cfg(test)]
mod tests {
    use super::*;

    fn v(j: Json) -> Value {
        Value::from_json(&j)
    }

    #[test]
    fn unchanged_values_render_one_line() {
        assert_eq!(diff_html(&v(serde_json::json!(1)), &v(serde_json::json!(1))), "<div class=\"json-diff\"><div class=\"line unchanged\">1</div></div>");
    }

    #[test]
    fn object_changes_keep_left_order_then_new_keys() {
        let html = diff_html(&v(serde_json::json!({ "b": 1, "a": "<x>" })), &v(serde_json::json!({ "b": 2, "c": true })));
        let expected = "<div class=\"json-diff\">\n<div class=\"line unchanged\">{</div>\n\
            \n<div class=\"line removed\">&nbsp;&nbsp;- \"b\": 1</div>\n<div class=\"line added\">&nbsp;&nbsp;+ \"b\": 2</div>\
            <div class=\"line removed\">&nbsp;&nbsp;- \"a\": \"&lt;x&gt;\"</div>\
            <div class=\"line added\">&nbsp;&nbsp;+ \"c\": true</div>\n<div class=\"line unchanged\">}</div></div>";
        assert_eq!(html, expected);
    }

    #[test]
    fn undefined_renders_as_undefined() {
        assert!(diff_html(&Value::Undefined, &Value::Null).contains("- undefined"));
    }
}
