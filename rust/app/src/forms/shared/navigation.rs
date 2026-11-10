//! A per-service stack of the pages visited, so back links can return to
//! where the user came from (`trackNavigation`, `insertNavigationReferrer`).

use forge_core::{EffectContext, ForgeResult, Value};

const MAX_STACK_SIZE: usize = 10;

pub struct NavigationConfig {
    pub stack_key: &'static str,
    pub clear_key: Option<&'static str>,
    pub referrer_key: &'static str,
}

fn stack_of(ctx: &EffectContext, key: &str) -> Vec<String> {
    ctx.get_session().get(key).as_array().map(|a| a.iter().map(Value::to_js_string).collect()).unwrap_or_default()
}

fn save_stack(ctx: &EffectContext, key: &str, stack: &[String]) {
    let value = Value::array(stack.iter().map(|s| Value::from(s.as_str())).collect());
    ctx.update_session(|s| s.set(key, value));
}

fn referrer(stack: &[String], from_end: usize) -> Value {
    stack.len().checked_sub(from_end).and_then(|i| stack.get(i)).map_or(Value::Null, |s| Value::from(s.as_str()))
}

/// `trackNavigation`: the page's key from the URL patterns (`{ key: substring }`, first match
/// wins); the hub page clears the stack, a revisit trims back to it, a new page is pushed. The
/// page before this one is exposed as the referrer.
pub fn track_navigation(ctx: &EffectContext, patterns: &Value, config: &NavigationConfig) -> ForgeResult<()> {
    let url = ctx.get_request_url();
    let stack = stack_of(ctx, config.stack_key);
    let current = patterns
        .as_object()
        .and_then(|o| o.iter().find(|(_, pattern)| url.contains(pattern.to_js_string().as_str())).map(|(k, _)| k.to_string()));
    let Some(current) = current else {
        return ctx.set_data(config.referrer_key, referrer(&stack, 1));
    };
    if config.clear_key == Some(current.as_str()) {
        save_stack(ctx, config.stack_key, &[]);
        return ctx.set_data(config.referrer_key, Value::Null);
    }
    if stack.last() == Some(&current) {
        return ctx.set_data(config.referrer_key, referrer(&stack, 2));
    }
    let new_stack = match stack.iter().position(|k| *k == current) {
        Some(i) => stack[..=i].to_vec(),
        None => {
            let mut pushed = stack.clone();
            pushed.push(current);
            let excess = pushed.len().saturating_sub(MAX_STACK_SIZE);
            pushed.split_off(excess)
        }
    };
    save_stack(ctx, config.stack_key, &new_stack);
    ctx.set_data(config.referrer_key, referrer(&new_stack, 2))
}

/// `insertNavigationReferrer`: pushes `key` unless it is already on top.
pub fn insert_navigation_referrer(ctx: &EffectContext, key: &str, config: &NavigationConfig) {
    let mut stack = stack_of(ctx, config.stack_key);
    if stack.last().map(String::as_str) == Some(key) {
        return;
    }
    stack.push(key.to_string());
    let excess = stack.len().saturating_sub(MAX_STACK_SIZE);
    save_stack(ctx, config.stack_key, &stack[excess..]);
}
