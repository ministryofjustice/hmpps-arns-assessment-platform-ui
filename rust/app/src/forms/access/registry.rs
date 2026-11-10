//! Target services reachable through the access form.

pub struct TargetService {
    /// Display name for the service.
    pub name: &'static str,
    /// Path to redirect to after access setup completes.
    pub entry_path: &'static str,
}

/// Add services here to enable `/access/{service}/oasys` and `/access/{service}/crn/:crn`.
pub const TARGET_SERVICES: &[(&str, TargetService)] = &[
    ("sentence-plan", TargetService { name: "Sentence Plan", entry_path: "/sentence-plan" }),
    ("strengths-and-needs", TargetService { name: "Strengths and needs", entry_path: "/strengths-and-needs" }),
];

pub fn get_target_service(key: &str) -> Option<&'static TargetService> {
    TARGET_SERVICES.iter().find(|(k, _)| *k == key).map(|(_, s)| s)
}
