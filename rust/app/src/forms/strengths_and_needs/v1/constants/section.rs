//! The v1 sections: codes, titles and navigation entries.

pub mod section_complete {
    pub const YES: &str = "YES";
    pub const NO: &str = "NO";
    pub const ALL: [&str; 2] = [YES, NO];
}

#[derive(Clone, Copy, Debug)]
pub struct SectionConfig {
    pub code: &'static str,
    pub path: &'static str,
    pub side_nav_href: &'static str,
    pub status_key: &'static str,
}

pub const ACCOMMODATION: SectionConfig = SectionConfig {
    code: "accommodation",
    path: "/accommodation",
    side_nav_href: "accommodation/accommodation-status",
    status_key: "accommodation_section_complete",
};
pub const EMPLOYMENT_AND_EDUCATION: SectionConfig = SectionConfig {
    code: "employment-and-education",
    path: "/employment-and-education",
    side_nav_href: "employment-and-education/employment-status",
    status_key: "employment_education_section_complete",
};
pub const FINANCE: SectionConfig =
    SectionConfig { code: "finance", path: "/finances", side_nav_href: "finances/finance", status_key: "finance_section_complete" };
pub const DRUG_USE: SectionConfig = SectionConfig {
    code: "drug-use",
    path: "/drug-use",
    side_nav_href: "drug-use/drug-use-status",
    status_key: "drug_use_section_complete",
};
pub const ALCOHOL_USE: SectionConfig = SectionConfig {
    code: "alcohol-use",
    path: "/alcohol-use",
    side_nav_href: "alcohol-use/alcohol-use-status",
    status_key: "alcohol_use_section_complete",
};
pub const HEALTH_AND_WELLBEING: SectionConfig = SectionConfig {
    code: "health-and-wellbeing",
    path: "/health-and-wellbeing",
    side_nav_href: "health-and-wellbeing/health-wellbeing-status",
    status_key: "health_wellbeing_section_complete",
};
pub const PERSONAL_RELATIONSHIPS_AND_COMMUNITY: SectionConfig = SectionConfig {
    code: "personal-relationships-and-community",
    path: "/personal-relationships-and-community",
    side_nav_href: "personal-relationships-and-community/personal-relationships-children-information",
    status_key: "personal_relationships_community_section_complete",
};
pub const THINKING_BEHAVIOURS_AND_ATTITUDES: SectionConfig = SectionConfig {
    code: "thinking-behaviours-and-attitudes",
    path: "/thinking-behaviours-and-attitudes",
    side_nav_href: "thinking-behaviours-and-attitudes/thinking-behaviours-attitudes",
    status_key: "thinking_behaviours_attitudes_section_complete",
};
pub const OFFENCE_ANALYSIS: SectionConfig = SectionConfig {
    code: "offence-analysis",
    path: "/offence-analysis",
    side_nav_href: "offence-analysis/offence-analysis",
    status_key: "offence_analysis_section_complete",
};

/// `Object.values(Section)`, in declaration order.
pub const ALL: [SectionConfig; 9] = [
    ACCOMMODATION,
    EMPLOYMENT_AND_EDUCATION,
    FINANCE,
    DRUG_USE,
    ALCOHOL_USE,
    HEALTH_AND_WELLBEING,
    PERSONAL_RELATIONSHIPS_AND_COMMUNITY,
    THINKING_BEHAVIOURS_AND_ATTITUDES,
    OFFENCE_ANALYSIS,
];

impl SectionConfig {
    /// The section as its object literal (`{ code, path, sideNavHref, statusKey }`), as effect
    /// arguments carry it.
    pub fn to_value(&self) -> forge_core::Value {
        forge_core::obj! {
            "code": self.code,
            "path": self.path,
            "sideNavHref": self.side_nav_href,
            "statusKey": self.status_key,
        }
    }
}
