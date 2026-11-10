//! `scenarios`: the scenario schema, presets and randomisation.

pub mod schema;
pub mod stubbed_crns;

use forge_core::{Value, obj};

pub use schema::{apply_randomization, field_keys, fields_by_group, generate_seed};

/// A scenario preset: fields not in `fixed_values` are randomised on load.
pub struct ScenarioPreset {
    pub id: &'static str,
    pub name: &'static str,
    pub short_description: &'static str,
    pub description: &'static str,
    pub flags: &'static [&'static str],
    pub fixed_values: &'static [(&'static str, &'static str)],
}

impl ScenarioPreset {
    pub fn fixed_values(&self) -> Value {
        Value::from_pairs(self.fixed_values.iter().map(|(k, v)| (*k, Value::from(*v))))
    }

    pub fn flags(&self) -> Value {
        Value::array(self.flags.iter().map(|f| Value::from(*f)).collect())
    }
}

const READ_WRITE: [(&str, &str); 2] = [("accessMode", "READ_WRITE"), ("planAccessMode", "READ_WRITE")];

pub const SCENARIO_PRESETS: [ScenarioPreset; 5] = [
    ScenarioPreset {
        id: "default",
        name: "Default",
        short_description: "All fields randomised",
        description: "Scenario with fully randomised subject details and practitioner details.",
        flags: &[],
        fixed_values: &READ_WRITE,
    },
    ScenarioPreset {
        id: "sp-national-rollout",
        name: "SP National Rollout",
        short_description: "National rollout scenario",
        description: "Scenario configured for Sentence Plan national rollout in a community/probation setting.",
        flags: &[],
        fixed_values: &[("location", "COMMUNITY"), ("accessMode", "READ_WRITE"), ("planAccessMode", "READ_WRITE")],
    },
    ScenarioPreset {
        id: "sp-private-beta",
        name: "SP Private Beta",
        short_description: "Private Beta scenario",
        description: "Scenario configured for Sentence Plan with private beta access.",
        flags: &["SAN_BETA"],
        fixed_values: &[("location", "COMMUNITY"), ("accessMode", "READ_WRITE"), ("planAccessMode", "READ_WRITE")],
    },
    ScenarioPreset {
        id: "pqip-pso-entrant-training",
        name: "PQiP/PSO Entrant Training",
        short_description: "National rollout scenario",
        description: "Scenario configured for PQiP/PSO entrant training.",
        flags: &[],
        fixed_values: &[
            ("givenName", "Charlie"),
            ("familyName", "Patterson"),
            ("dateOfBirth", "1995-07-19"),
            ("gender", "1"),
            ("location", "COMMUNITY"),
            ("sexuallyMotivatedOffenceHistory", "NO"),
            ("accessMode", "READ_WRITE"),
            ("planAccessMode", "READ_WRITE"),
        ],
    },
    ScenarioPreset {
        id: "pom-module-8",
        name: "POM Module 8",
        short_description: "National rollout scenario",
        description: "Scenario configured for POM Module 8 in a prison setting.",
        flags: &[],
        fixed_values: &[
            ("givenName", "Phillip"),
            ("familyName", "Jones"),
            ("dateOfBirth", "1985-10-27"),
            ("gender", "1"),
            ("pnc", "15/123457V"),
            ("location", "PRISON"),
            ("sexuallyMotivatedOffenceHistory", "NO"),
            ("accessMode", "READ_WRITE"),
            ("planAccessMode", "READ_WRITE"),
        ],
    },
];

pub fn preset_by_id(id: &str) -> Option<&'static ScenarioPreset> {
    SCENARIO_PRESETS.iter().find(|p| p.id == id)
}

/// `getRandomizeFields`: every field neither fixed nor excluded.
pub fn randomize_fields(fixed_values: &Value, excluded: &[&str]) -> Vec<&'static str> {
    let fixed = fixed_values.as_object();
    field_keys().filter(|k| !fixed.is_some_and(|o| o.contains_key(*k)) && !excluded.contains(k)).collect()
}

/// `ResolvedScenario`: a scenario with every value populated.
pub fn resolve(
    id: &Value,
    name: &Value,
    short_description: &Value,
    description: &Value,
    flags: &Value,
    fixed_values: &Value,
    excluded: &[&str],
    seed: Option<i64>,
) -> Value {
    let seed = seed.unwrap_or_else(generate_seed);
    let fields = randomize_fields(fixed_values, excluded);
    obj! {
        "id": id.clone(),
        "name": name.clone(),
        "shortDescription": short_description.clone(),
        "description": description.clone(),
        "flags": flags.clone(),
        "values": apply_randomization(fixed_values, &fields, Some(seed)),
        "randomizeFields": fields,
        "seed": seed,
    }
}

/// `resolvePreset`.
pub fn resolve_preset(preset: &ScenarioPreset, seed: Option<i64>, excluded: &[&str]) -> Value {
    resolve(
        &Value::from(preset.id),
        &Value::from(preset.name),
        &Value::from(preset.short_description),
        &Value::from(preset.description),
        &preset.flags(),
        &preset.fixed_values(),
        excluded,
        seed,
    )
}

/// A saved scenario resolved with a new seed.
pub fn resolve_saved(saved: &Value, excluded: &[&str]) -> Value {
    resolve(
        &saved.get("id"),
        &saved.get("name"),
        &saved.get("shortDescription"),
        &saved.get("description"),
        &saved.get("flags"),
        &saved.get("fixedValues"),
        excluded,
        None,
    )
}
