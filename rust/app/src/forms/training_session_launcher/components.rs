//! The launcher's components: the tab panel, the criminogenic needs list and
//! the randomisable field wrapper.

use forge_core::authoring::Component;
use forge_core::engine::registries::ComponentEntry;
use forge_core::{Value, obj};

use super::scenarios::schema::field_label;

pub const TAB_PANEL: Component = Component::basic("tabPanel");
pub const CRIMINOGENIC_NEEDS_LIST: Component = Component::basic("criminogenicNeedsList");
pub const RANDOMIZABLE_FIELD: Component = Component::basic("randomizableField");

fn or_default(v: Value, fallback: &str) -> Value {
    if v.truthy() { v } else { Value::from(fallback) }
}

fn classes(base: &str, extra: &Value) -> String {
    if extra.truthy() { format!("{base} {}", extra.to_js_string()) } else { base.to_string() }
}

/// The tab panel's template params: the selected item defaults to the first.
fn tab_panel_params(block: &Value) -> Value {
    let items = block.get("items");
    let first_id = items.get("0").get("id");
    let selected = match block.get("defaultSelected") {
        v if v.truthy() => v,
        _ if first_id.truthy() => first_id,
        _ => Value::from(""),
    };
    obj! {
        "id": or_default(block.get("id"), "tab-panel"),
        "selectedId": selected,
        "classes": classes("tab-panel", &block.get("classes")),
        "sidebarTitle": or_default(block.get("sidebarTitle"), "Options"),
        "items": items,
        "sidebarFooter": block.get("sidebarFooter"),
        "queryParam": block.get("queryParam"),
    }
}

fn yes_no_text(v: &Value) -> &'static str {
    match v.as_str() {
        Some("YES") => "Yes",
        Some("NO") => "No",
        _ => "Unknown",
    }
}

fn template_need(need: &Value) -> Value {
    let score = need.get("score");
    let has_score = !score.is_nullish();
    let high = need.get("isHighScoring").truthy();
    obj! {
        "name": need.get("name"),
        "variant": if has_score { if high { "high" } else { "low" } } else { "unknown" },
        "scoreDisplay": if has_score { score.to_js_string() } else { "?".into() },
        "scoreText": if has_score { score.to_js_string() } else { "Not set".into() },
        "thresholdText": if has_score { if high { "Yes" } else { "No" } } else { "Unknown" },
        "linkedToHarmText": yes_no_text(&need.get("linkedToHarm")),
        "linkedToReoffendingText": yes_no_text(&need.get("linkedToReoffending")),
        "strengthsText": yes_no_text(&need.get("strengths")),
    }
}

fn needs_list_params(block: &Value) -> Value {
    let needs: Vec<Value> = block.get("needs").as_array().map(|a| a.iter().map(template_need).collect()).unwrap_or_default();
    obj! { "classes": classes("criminogenic-needs-list", &block.get("classes")), "needs": needs }
}

fn escape_attr(s: &str) -> String {
    s.replace('&', "&amp;").replace('"', "&quot;").replace('<', "&lt;").replace('>', "&gt;")
}

fn escape_text(s: &str) -> String {
    s.replace('&', "&amp;").replace('<', "&lt;").replace('>', "&gt;")
}

/// The randomisable field wrapper: radios and checkboxes get a "Random" option injected by the
/// client script; text inputs and selects get a "Randomise" checkbox suffix.
pub fn randomizable_field_html(block: &Value) -> String {
    let field = block.get("field");
    let field_block = field.get("block");
    let field_variant = field_block.get("variant").to_js_string();
    let field_code = match field_block.get("code") {
        v if v.is_nullish() => "field".to_string(),
        v => v.to_js_string(),
    };
    let field_key = match block.get("fieldKey") {
        v if v.is_nullish() => field_code.clone(),
        v => v.to_js_string(),
    };
    let randomize_name = format!("{field_key}_randomize");
    let is_randomized = block.get("randomize").strict_eq(&Value::Bool(true));
    let label = match block.get("randomizeLabel") {
        v if v.is_nullish() => "Random".to_string(),
        v => v.to_js_string(),
    };
    let field_label = field_label(&field_key).unwrap_or(&field_key).to_string();
    let aria_label = format!("Randomise {}", field_label.to_lowercase());
    let is_radio = matches!(field_variant.as_str(), "govukRadioInput" | "govukCheckboxes");

    let mut wrapper = format!(
        "<randomizable-field-wrapper class=\"randomizable-field\" data-field-key=\"{}\" data-field-code=\"{}\" data-field-type=\"{}\" data-randomize-label=\"{}\" data-field-label=\"{}\"",
        escape_attr(&field_key),
        escape_attr(&field_code),
        if is_radio { "radio" } else { "text" },
        escape_attr(&label),
        escape_attr(&field_label),
    );
    if is_randomized {
        wrapper.push_str(" data-randomized=\"true\"");
    }
    wrapper.push('>');
    let hidden = format!(
        "<input type=\"hidden\" name=\"{}\" value=\"{}\" class=\"randomizable-field__hidden\"/>",
        escape_attr(&randomize_name),
        if is_randomized { "true" } else { "false" }
    );
    let field_html = field.get("html").to_js_string();
    if is_radio {
        return format!("{wrapper}{field_html}{hidden}</randomizable-field-wrapper>");
    }
    let checkbox_id = format!("{field_key}-randomize-checkbox");
    format!(
        "{wrapper}<div class=\"randomizable-field__input-wrapper\">{field_html}<div class=\"randomizable-field__suffix\"><div class=\"govuk-checkboxes govuk-checkboxes--small\" data-module=\"govuk-checkboxes\"><div class=\"govuk-checkboxes__item\"><input class=\"govuk-checkboxes__input randomizable-field__checkbox\" id=\"{id}\" name=\"{name}_checkbox\" type=\"checkbox\" value=\"true\" aria-label=\"{aria}\"{checked}/><label class=\"govuk-label govuk-checkboxes__label\" for=\"{id}\">{label}</label></div></div></div></div>{hidden}</randomizable-field-wrapper>",
        id = escape_attr(&checkbox_id),
        name = escape_attr(&randomize_name),
        aria = escape_attr(&aria_label),
        checked = if is_randomized { " checked" } else { "" },
        label = escape_text(&label),
    )
}

pub fn components() -> Vec<ComponentEntry> {
    vec![
        ComponentEntry::new("tabPanel")
            .with_render(forge_runjucks::nunjucks_render("training-session-launcher/components/tab-panel/template.njk", tab_panel_params)),
        ComponentEntry::new("criminogenicNeedsList").with_render(forge_runjucks::nunjucks_render(
            "training-session-launcher/components/criminogenic-needs-list/template.njk",
            needs_list_params,
        )),
        ComponentEntry::new("randomizableField").with_render(|block, _| Ok(Value::from(randomizable_field_html(block)))),
    ]
}
