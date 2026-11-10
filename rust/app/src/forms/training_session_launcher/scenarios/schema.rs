//! Every scenario field, its label, group and
//! randomiser. Randomisation is seeded, so the same seed gives the same values.

use chrono::{Datelike, Duration, Local, NaiveDate};
use forge_core::Value;
use forge_core::value::Map;
use rand::rngs::StdRng;
use rand::{Rng, SeedableRng};

use crate::forms::shared::gender::HANDOVER_GENDER_CODES;

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum Group {
    Subject,
    Practitioner,
    CriminogenicNeeds,
    CriminogenicNeedsMocks,
}

#[derive(Clone, Copy)]
pub enum Randomiser {
    Crn,
    Pnc,
    FirstName,
    LastName,
    Gender,
    DateOfBirth,
    Location,
    YesNo,
    OasysAssessmentPk,
    Null,
    PractitionerIdentifier,
    PractitionerName,
    AccessMode,
    Yes,
    Score(i64),
}

pub struct FieldConfig {
    pub key: &'static str,
    pub label: &'static str,
    pub group: Group,
    pub randomiser: Randomiser,
}

const fn f(key: &'static str, label: &'static str, group: Group, randomiser: Randomiser) -> FieldConfig {
    FieldConfig { key, label, group, randomiser }
}

use Group::*;
use Randomiser::*;

pub const SCENARIO_FIELDS: &[FieldConfig] = &[
    f("crn", "CRN", Subject, Crn),
    f("pnc", "PNC", Subject, Pnc),
    f("givenName", "Given name", Subject, FirstName),
    f("familyName", "Family name", Subject, LastName),
    f("gender", "Gender", Subject, Gender),
    f("dateOfBirth", "Date of birth", Subject, DateOfBirth),
    f("location", "Location", Subject, Location),
    f("sexuallyMotivatedOffenceHistory", "Sexually motivated offence history", Subject, YesNo),
    f("oasysAssessmentPk", "OASys Assessment PK", Subject, OasysAssessmentPk),
    f("sentencePlanVersion", "Sentence Plan Version", Subject, Null),
    f("sanAssessmentVersion", "SAN Assessment Version", Subject, Null),
    f("practitionerIdentifier", "Practitioner identifier", Practitioner, PractitionerIdentifier),
    f("practitionerDisplayName", "Practitioner name", Practitioner, PractitionerName),
    f("accessMode", "Access mode (general)", Practitioner, AccessMode),
    f("planAccessMode", "Plan access mode", Practitioner, AccessMode),
    // Not in the criminogenic needs group: turning the mocks off leaves that whole group out,
    // and this setting has to be kept so the scenario remembers the mocks are off.
    f("useMockedCriminogenicNeeds", "Use mocked criminogenic needs", CriminogenicNeedsMocks, Yes),
    f("accLinkedToHarm", "Accommodation - Linked to harm", CriminogenicNeeds, YesNo),
    f("accLinkedToReoffending", "Accommodation - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("accStrengths", "Accommodation - Strengths", CriminogenicNeeds, YesNo),
    f("accOtherWeightedScore", "Accommodation - Score", CriminogenicNeeds, Score(6)),
    f("accThreshold", "Accommodation - Threshold", CriminogenicNeeds, YesNo),
    f("eteLinkedToHarm", "ETE - Linked to harm", CriminogenicNeeds, YesNo),
    f("eteLinkedToReoffending", "ETE - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("eteStrengths", "ETE - Strengths", CriminogenicNeeds, YesNo),
    f("eteOtherWeightedScore", "ETE - Score", CriminogenicNeeds, Score(4)),
    f("eteThreshold", "ETE - Threshold", CriminogenicNeeds, YesNo),
    f("financeLinkedToHarm", "Finance - Linked to harm", CriminogenicNeeds, YesNo),
    f("financeLinkedToReoffending", "Finance - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("financeStrengths", "Finance - Strengths", CriminogenicNeeds, YesNo),
    f("drugLinkedToHarm", "Drug use - Linked to harm", CriminogenicNeeds, YesNo),
    f("drugLinkedToReoffending", "Drug use - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("drugStrengths", "Drug use - Strengths", CriminogenicNeeds, YesNo),
    f("drugOtherWeightedScore", "Drug use - Score", CriminogenicNeeds, Score(8)),
    f("drugThreshold", "Drug use - Threshold", CriminogenicNeeds, YesNo),
    f("alcoholLinkedToHarm", "Alcohol use - Linked to harm", CriminogenicNeeds, YesNo),
    f("alcoholLinkedToReoffending", "Alcohol use - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("alcoholStrengths", "Alcohol use - Strengths", CriminogenicNeeds, YesNo),
    f("alcoholOtherWeightedScore", "Alcohol use - Score", CriminogenicNeeds, Score(4)),
    f("alcoholThreshold", "Alcohol use - Threshold", CriminogenicNeeds, YesNo),
    f("emoLinkedToHarm", "Health & wellbeing - Linked to harm", CriminogenicNeeds, YesNo),
    f("emoLinkedToReoffending", "Health & wellbeing - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("emoStrengths", "Health & wellbeing - Strengths", CriminogenicNeeds, YesNo),
    f("relLinkedToHarm", "Relationships - Linked to harm", CriminogenicNeeds, YesNo),
    f("relLinkedToReoffending", "Relationships - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("relStrengths", "Relationships - Strengths", CriminogenicNeeds, YesNo),
    f("relOtherWeightedScore", "Relationships - Score", CriminogenicNeeds, Score(6)),
    f("relThreshold", "Relationships - Threshold", CriminogenicNeeds, YesNo),
    f("thinkLinkedToHarm", "Thinking & behaviour - Linked to harm", CriminogenicNeeds, YesNo),
    f("thinkLinkedToReoffending", "Thinking & behaviour - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("thinkStrengths", "Thinking & behaviour - Strengths", CriminogenicNeeds, YesNo),
    f("thinkOtherWeightedScore", "Thinking & behaviour - Score", CriminogenicNeeds, Score(10)),
    f("thinkThreshold", "Thinking & behaviour - Threshold", CriminogenicNeeds, YesNo),
    f("lifestyleLinkedToHarm", "Lifestyle - Linked to harm", CriminogenicNeeds, YesNo),
    f("lifestyleLinkedToReoffending", "Lifestyle - Linked to reoffending", CriminogenicNeeds, YesNo),
    f("lifestyleStrengths", "Lifestyle - Strengths", CriminogenicNeeds, YesNo),
    f("lifestyleOtherWeightedScore", "Lifestyle - Score", CriminogenicNeeds, Score(6)),
    f("lifestyleThreshold", "Lifestyle - Threshold", CriminogenicNeeds, YesNo),
];

pub fn field_keys() -> impl Iterator<Item = &'static str> {
    SCENARIO_FIELDS.iter().map(|f| f.key)
}

pub fn field_config(key: &str) -> Option<&'static FieldConfig> {
    SCENARIO_FIELDS.iter().find(|f| f.key == key)
}

pub fn field_label(key: &str) -> Option<&'static str> {
    field_config(key).map(|f| f.label)
}

pub fn fields_by_group(group: Group) -> Vec<&'static str> {
    SCENARIO_FIELDS.iter().filter(|f| f.group == group).map(|f| f.key).collect()
}

/// A seed for reproducible randomisation (the current time).
pub fn generate_seed() -> i64 {
    chrono::Utc::now().timestamp_millis()
}

const FIRST_NAMES: &[&str] = &[
    "Aaron", "Abigail", "Adam", "Aisha", "Alex", "Alice", "Amelia", "Andrew", "Anna", "Ben", "Bethany", "Callum", "Charlotte", "Chloe",
    "Connor", "Daniel", "David", "Ella", "Emily", "Emma", "Ethan", "Freya", "George", "Grace", "Hannah", "Harry", "Isaac", "Isla",
    "Jack", "Jacob", "James", "Jessica", "Joseph", "Joshua", "Katie", "Kieran", "Laura", "Leo", "Liam", "Lily", "Lucy", "Luke",
    "Megan", "Mia", "Michael", "Mohammed", "Nathan", "Noah", "Olivia", "Oscar", "Paul", "Rachel", "Rebecca", "Ryan", "Sam",
    "Sarah", "Sophie", "Thomas", "Tom", "William", "Zara",
];

const LAST_NAMES: &[&str] = &[
    "Adams", "Ahmed", "Allen", "Bailey", "Baker", "Bell", "Brown", "Campbell", "Carter", "Clark", "Clarke", "Cooper", "Davies",
    "Davis", "Edwards", "Evans", "Green", "Griffiths", "Hall", "Harris", "Hill", "Hughes", "Jackson", "James", "Johnson",
    "Jones", "King", "Lee", "Lewis", "Martin", "Mitchell", "Moore", "Morgan", "Morris", "Murphy", "O'Brien", "Parker", "Patel",
    "Phillips", "Price", "Roberts", "Robinson", "Scott", "Shaw", "Smith", "Taylor", "Thomas", "Thompson", "Turner", "Walker",
    "Ward", "Watson", "White", "Wilson", "Wood", "Wright", "Young",
];

/// Only alphabetic characters, hyphens, spaces and apostrophes (the handover API's rule), at
/// most 50 characters.
fn sanitize_name(name: &str) -> String {
    name.chars().filter(|c| c.is_ascii_alphabetic() || c.is_whitespace() || *c == '-' || *c == '\'').take(50).collect()
}

fn letter(rng: &mut StdRng) -> char {
    (b'A' + rng.gen_range(0..=25u8)) as char
}

/// A random OASys assessment PK (7 digits).
pub fn random_oasys_assessment_pk(rng: &mut StdRng) -> String {
    rng.gen_range(1_000_000..=9_999_999).to_string()
}

fn random_date_of_birth(rng: &mut StdRng) -> String {
    let today = Local::now().date_naive();
    let ref_date = NaiveDate::from_ymd_opt(today.year() - 18, today.month(), today.day().min(28)).unwrap_or(today);
    let earliest = NaiveDate::from_ymd_opt(ref_date.year() - 70, ref_date.month(), ref_date.day()).unwrap_or(ref_date);
    let span = (ref_date - earliest).num_days().max(1);
    (earliest + Duration::days(rng.gen_range(0..span))).format("%Y-%m-%d").to_string()
}

fn pick(rng: &mut StdRng, items: &[&str]) -> Value {
    Value::from(items[rng.gen_range(0..items.len())])
}

pub fn randomize(randomiser: Randomiser, rng: &mut StdRng) -> Value {
    match randomiser {
        Crn => Value::from(format!("{}{}", letter(rng), rng.gen_range(100_000..=999_999))),
        Pnc => {
            let year = rng.gen_range(1990..=Local::now().year());
            Value::from(format!("{year}/{}{}", rng.gen_range(1_000_000..=9_999_999), letter(rng)))
        }
        FirstName => pick(rng, FIRST_NAMES),
        LastName => pick(rng, LAST_NAMES),
        Gender => pick(rng, &HANDOVER_GENDER_CODES),
        DateOfBirth => Value::from(random_date_of_birth(rng)),
        Location => pick(rng, &["COMMUNITY", "PRISON"]),
        YesNo => pick(rng, &["YES", "NO"]),
        OasysAssessmentPk => Value::from(random_oasys_assessment_pk(rng)),
        Null => Value::Null,
        PractitionerIdentifier => Value::from(format!("TRAINING{:04}", rng.gen_range(1..=9999))),
        PractitionerName => {
            let first = sanitize_name(FIRST_NAMES[rng.gen_range(0..FIRST_NAMES.len())]);
            let last = sanitize_name(LAST_NAMES[rng.gen_range(0..LAST_NAMES.len())]);
            Value::from(format!("{first} {last}").chars().take(50).collect::<String>())
        }
        AccessMode => pick(rng, &["READ_ONLY", "READ_WRITE"]),
        Yes => Value::from("YES"),
        Score(max) => {
            // Undefined about 20% of the time
            if rng.gen_range(0.0..1.0) < 0.2 { Value::Undefined } else { Value::from(rng.gen_range(0..=max).to_string()) }
        }
    }
}

/// A new random generator, seeded when a seed is given.
pub fn rng(seed: Option<i64>) -> StdRng {
    match seed {
        Some(s) => StdRng::seed_from_u64(s as u64),
        None => StdRng::from_entropy(),
    }
}

/// `applyRandomization`: the fixed values, then each field to randomise.
pub fn apply_randomization(fixed_values: &Value, randomize_fields: &[&str], seed: Option<i64>) -> Value {
    let mut rng = rng(seed);
    let mut result: Map = fixed_values.as_object().map(|o| (**o).clone()).unwrap_or_default();
    for key in randomize_fields {
        if let Some(config) = field_config(key) {
            result.insert((*key).into(), randomize(config.randomiser, &mut rng));
        }
    }
    Value::object(result)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_same_seed_gives_the_same_values() {
        let keys: Vec<&str> = field_keys().collect();
        let a = apply_randomization(&Value::empty_object(), &keys, Some(42)).to_json();
        let b = apply_randomization(&Value::empty_object(), &keys, Some(42)).to_json();
        assert_eq!(a, b);
        assert!(regex::Regex::new(r"^[A-Z]\d{6}$").unwrap().is_match(a["crn"].as_str().unwrap()));
    }
}
