//! The common content, and the per-section content files.

use std::sync::OnceLock;

use crate::forms::dsl::*;
use crate::forms::strengths_and_needs::i18n::{Content, english};
use crate::forms::strengths_and_needs::v1::constants::section::{SectionConfig, section_complete};

macro_rules! locale {
    ($fn:ident, $file:literal) => {
        pub fn $fn() -> &'static Content {
            static CONTENT: OnceLock<Content> = OnceLock::new();
            CONTENT.get_or_init(|| english(include_str!($file)))
        }
    };
}

locale!(common, "common.json");
locale!(previous_versions, "previous_versions.json");
locale!(accommodation, "accommodation.json");
locale!(alcohol_use, "alcohol_use.json");
locale!(drug_use, "drug_use.json");
locale!(employment_and_education, "employment_and_education.json");
locale!(finance, "finance.json");
locale!(health_wellbeing, "health_wellbeing.json");
locale!(offence_analysis, "offence_analysis.json");
locale!(personal_relationships_and_community, "personal_relationships_and_community.json");
locale!(thinking_behaviours_and_attitudes, "thinking_behaviours_and_attitudes.json");

/// `commonContentFor(code, ...replacements)`.
pub fn common_content_for(code: &str, replacements: impl IntoIterator<Item = Value>) -> Value {
    common().get(code, replacements).into()
}

/// Page titles from the `sectionTitle` entry.
pub fn section_page_title(section: &SectionConfig) -> Value {
    common_content_for(&format!("sectionTitle.{}", section.code), [])
}

pub fn section_status_tag(section: &SectionConfig) -> Value {
    when(data(section.status_key).matches(condition::equals(section_complete::YES)))
        .then(obj! { "text": common_content_for("sectionComplete.YES", []), "classes": "" })
        .otherwise(obj! { "text": common_content_for("sectionComplete.NO", []), "classes": "govuk-tag--grey" })
        .into()
}

pub fn summary_page_title(section: &SectionConfig) -> Value {
    common_content_for("pageTitle.summary", [section_page_title(section)])
}

pub fn analysis_page_title(section: &SectionConfig) -> Value {
    common_content_for("pageTitle.analysis", [section_page_title(section)])
}
