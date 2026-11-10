//! The authoring vocabulary the form modules are written in: Forge's Rust DSL plus the few
//! helpers the forms lean on (`defined`, effect calls with positional arguments).

pub use forge_core::authoring::*;
pub use forge_core::builtins::components as core_blocks;
pub use forge_core::value::Map;
pub use forge_core::{Value, obj};
pub use forge_govuk_components::blocks as govuk;
pub use forge_moj_components::blocks as moj;

/// A call to a registered effect with positional arguments:
/// `effect!("saveCurrentStepAnswers", false, true)`.
#[macro_export]
macro_rules! effect {
    ($name:expr $(, $arg:expr)* $(,)?) => {
        forge_core::authoring::effect::call($name, vec![$(forge_core::authoring::IntoValue::into_value($arg)),*])
    };
}

/// A call to a registered transformer with positional arguments.
#[macro_export]
macro_rules! transformer {
    ($name:expr $(, $arg:expr)* $(,)?) => {
        forge_core::authoring::function_call(
            "FunctionType.Transformer",
            $name,
            vec![$(forge_core::authoring::IntoValue::into_value($arg)),*],
        )
    };
}

/// A call to a registered condition with positional arguments.
#[macro_export]
macro_rules! condition {
    ($name:expr $(, $arg:expr)* $(,)?) => {
        forge_core::authoring::function_call(
            "FunctionType.Condition",
            $name,
            vec![$(forge_core::authoring::IntoValue::into_value($arg)),*],
        )
    };
}

/// A call to a registered generator with positional arguments.
#[macro_export]
macro_rules! generator {
    ($name:expr $(, $arg:expr)* $(,)?) => {
        forge_core::authoring::Ex::from_value(forge_core::authoring::function_call(
            "FunctionType.Generator",
            $name,
            vec![$(forge_core::authoring::IntoValue::into_value($arg)),*],
        ))
    };
}

/// `definedPropsOf`: drops `undefined` entries, keeping the order of the rest.
pub fn defined(props: Value) -> Value {
    match props {
        Value::Object(o) => {
            Value::object(o.iter().filter(|(_, v)| !v.is_undefined()).map(|(k, v)| (k.clone(), v.clone())).collect())
        }
        other => other,
    }
}

/// `{ ...a, ...b }`: object spread, later keys overwriting earlier ones in place.
pub fn spread(parts: impl IntoIterator<Item = Value>) -> Value {
    let mut map = Map::new();
    for part in parts {
        if let Value::Object(o) = part {
            for (k, v) in o.iter() {
                map.insert(k.clone(), v.clone());
            }
        }
    }
    Value::object(map)
}

/// An array literal of authored values.
pub fn arr(items: impl IntoIterator<Item = Value>) -> Value {
    Value::array(items.into_iter().collect())
}

/// `[...a, ...b]` for arrays of authored values.
pub fn concat_arrays(parts: impl IntoIterator<Item = Value>) -> Value {
    let mut out = Vec::new();
    for part in parts {
        match part {
            Value::Array(a) => out.extend(a.iter().cloned()),
            Value::Undefined => {}
            other => out.push(other),
        }
    }
    Value::array(out)
}

/// An `and(...)` over a list.
pub fn and_all(operands: impl IntoIterator<Item = Value>) -> Value {
    and(operands.into_iter().collect())
}

/// An `or(...)` over a list.
pub fn or_all(operands: impl IntoIterator<Item = Value>) -> Value {
    or(operands.into_iter().collect())
}

/// Registers an effect implemented by an async block, capturing `deps` (an `Arc`):
/// `register_effect!("name", deps, |ctx, args| { ... })`.
#[macro_export]
macro_rules! register_effect {
    ($name:expr, $deps:ident, |$ctx:ident, $args:ident| $body:block) => {{
        let $deps = $deps.clone();
        #[allow(unused_variables, unused_mut)]
        forge_core::FunctionEntry::effect($name, move |$ctx: forge_core::EffectContext, $args: Vec<forge_core::Value>| {
            #[allow(unused_variables)]
            let $deps = $deps.clone();
            async move { $body }
        })
    }};
    ($name:expr, |$ctx:ident, $args:ident| $body:block) => {{
        #[allow(unused_variables, unused_mut)]
        forge_core::FunctionEntry::effect($name, move |$ctx: forge_core::EffectContext, $args: Vec<forge_core::Value>| {
            async move { $body }
        })
    }};
}

/// The `i`th argument of a function call (`undefined` when not passed).
pub fn arg(args: &[Value], i: usize) -> Value {
    args.get(i).cloned().unwrap_or(Value::Undefined)
}

/// `delete object[key]`.
pub fn remove_key(target: &mut Value, key: &str) {
    if let Some(o) = target.as_object_mut() {
        o.shift_remove(key);
    }
}

/// `value ?? fallback`.
pub fn nullish_or(v: Value, fallback: impl FnOnce() -> Value) -> Value {
    if v.is_nullish() { fallback() } else { v }
}

/// HTTP errors raised by effects (`http-errors`).
pub mod http_error {
    use forge_core::ForgeError;

    pub fn bad_request(message: impl Into<String>) -> ForgeError {
        ForgeError::http(400, message)
    }

    pub fn not_found(message: impl Into<String>) -> ForgeError {
        ForgeError::http(404, message)
    }

    pub fn internal(message: impl Into<String>) -> ForgeError {
        ForgeError::http(500, message)
    }
}
