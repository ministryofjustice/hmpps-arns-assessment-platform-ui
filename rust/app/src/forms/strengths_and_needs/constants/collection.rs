//! Collection (repeating item) constants: the victims collection and its fields.

use forge_core::{EffectContext, ForgeResult, Value};

/// A repeatable item collection: its name and the answer codes of one item.
#[derive(Clone, Debug)]
pub struct Collection {
    pub name: &'static str,
    pub fields: &'static [&'static str],
}

impl Collection {
    /// As effect arguments carry it: `{ name, fields }`.
    pub fn to_value(&self) -> Value {
        forge_core::obj! { "name": self.name, "fields": self.fields.to_vec() }
    }

    /// Reads a collection back out of an effect argument.
    pub fn from_value(v: &Value) -> (String, Vec<String>) {
        let fields = v.get("fields").as_array().map(|a| a.iter().map(Value::to_js_string).collect()).unwrap_or_default();
        (v.get("name").to_js_string(), fields)
    }
}

/// `storeCollectionUuid`: remembers a collection's UUID in `collectionUuids`.
pub fn store_collection_uuid(ctx: &EffectContext, collection_name: &str, uuid: Value) -> ForgeResult<()> {
    let mut uuids = match ctx.get_data("collectionUuids") {
        v @ Value::Object(_) => v,
        _ => Value::empty_object(),
    };
    uuids.set(collection_name, uuid);
    ctx.set_data("collectionUuids", uuids)
}
