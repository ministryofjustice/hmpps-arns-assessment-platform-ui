//! The drug list.

use super::constants::option;
use forge_core::Value;

#[derive(Clone, Copy, Debug)]
pub struct Drug {
    pub value: &'static str,
    pub injectable: bool,
}

pub const DRUGS_LIST: [Drug; 15] = [
    Drug { value: option::amphetamines, injectable: true },
    Drug { value: option::benzodiazepines, injectable: true },
    Drug { value: option::cannabis, injectable: false },
    Drug { value: option::cocaine, injectable: true },
    Drug { value: option::crack, injectable: true },
    Drug { value: option::ecstasy, injectable: false },
    Drug { value: option::hallucinogenics, injectable: false },
    Drug { value: option::heroin, injectable: true },
    Drug { value: option::methadone_not_prescribed, injectable: true },
    Drug { value: option::misused_prescribed_drugs, injectable: true },
    Drug { value: option::other_opiates, injectable: true },
    Drug { value: option::solvents, injectable: false },
    Drug { value: option::steroids, injectable: true },
    Drug { value: option::spice, injectable: false },
    Drug { value: option::other_drug, injectable: true },
];

impl Drug {
    /// `{ value, injectable }`, as the drug lists in data carry it.
    pub fn to_value(&self) -> Value {
        forge_core::obj! { "value": self.value, "injectable": self.injectable }
    }
}

pub fn drug_by_value(value: &str) -> Option<&'static Drug> {
    DRUGS_LIST.iter().find(|d| d.value == value)
}

/// `fieldCodeString`: `<prefix>_<drug value in lower case>`.
pub fn field_code_string(prefix: &str, drug_value: &str) -> String {
    format!("{prefix}_{}", drug_value.to_lowercase())
}
