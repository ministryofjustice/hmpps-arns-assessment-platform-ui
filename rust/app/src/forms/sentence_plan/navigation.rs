//! The pages the sentence plan's navigation stack tracks.

use crate::forms::dsl::*;

pub const PLAN_OVERVIEW: &str = "plan-overview";

/// `NAV_KEY_PATTERNS`: each tracked page's key and the URL substring that identifies it. Order
/// matters where one pattern contains another (`/update-agree-plan` before `/agree-plan`).
pub const NAV_KEY_PATTERNS: [(&str, &str); 21] = [
    ("plan-overview", "/plan/overview"),
    ("plan-history", "/plan/plan-history"),
    ("previous-versions", "/plan/previous-versions"),
    ("view-historic", "/view-historic/"),
    ("update-agree-plan", "/update-agree-plan"),
    ("agree-plan", "/agree-plan"),
    ("select-area-of-need", "/select-area-of-need"),
    ("add-goal", "/add-goal/"),
    ("add-steps", "/add-steps"),
    ("change-goal", "/change-goal"),
    ("change-area-of-need", "/change-area-of-need"),
    ("update-goal-steps", "/update-goal-steps"),
    ("confirm-delete-goal", "/confirm-delete-goal"),
    ("confirm-achieved-goal", "/confirm-achieved-goal"),
    ("confirm-if-achieved", "/confirm-if-achieved"),
    ("confirm-remove-goal", "/confirm-remove-goal"),
    ("confirm-readd-goal", "/confirm-readd-goal"),
    ("view-inactive-goal", "/view-inactive-goal"),
    ("about", "/about-person"),
    ("supervision-package", "/supervision-package"),
    ("reorder-steps", "/reorder-steps"),
];

/// The patterns as the `trackNavigation` effect argument (an object, in declaration order).
pub fn nav_key_patterns() -> Value {
    let mut map = Map::new();
    for (key, pattern) in NAV_KEY_PATTERNS {
        map.insert(key.into(), Value::from(pattern));
    }
    Value::object(map)
}
