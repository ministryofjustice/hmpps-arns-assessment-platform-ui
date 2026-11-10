//! `Outdent`: renders a nested block with its HTML outdented, so `<pre>` content inside indented
//! component markup starts at the left margin.

use forge_core::Value;
use forge_core::authoring::Component;
use forge_core::engine::registries::ComponentEntry;

pub const OUTDENT: Component = Component::basic("outdent");

/// Removes `count` leading spaces from each line that has them.
pub fn outdent_html(html: &str, count: usize) -> String {
    let prefix = " ".repeat(count);
    html.split('\n').map(|line| line.strip_prefix(prefix.as_str()).unwrap_or(line)).collect::<Vec<_>>().join("\n")
}

pub fn components() -> Vec<ComponentEntry> {
    vec![ComponentEntry::new("outdent").with_render(|block, _| {
        let count = block.get("outdentBy").as_f64().unwrap_or(0.0).max(0.0) as usize;
        Ok(Value::from(outdent_html(&block.get("block").get("html").to_js_string(), count)))
    })]
}

#[cfg(test)]
mod tests {
    #[test]
    fn outdents_lines_with_enough_indent() {
        assert_eq!(super::outdent_html("    a\n  b\n      c", 4), "a\n  b\n  c");
    }
}
