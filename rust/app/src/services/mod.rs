//! Services: audit and feature flags, plus the bundle of everything the
//! form packages and routes depend on.

pub mod audit;
pub mod domain_events;
pub mod feature_flags;

use std::sync::Arc;

pub use audit::{AuditMessage, AuditService};
pub use domain_events::DomainEventsService;
pub use feature_flags::FeatureFlagService;

use crate::config::Config;
use crate::data::*;

/// `ApplicationInfo`.
#[derive(Clone, Debug)]
pub struct ApplicationInfo {
    pub application_name: String,
    pub build_number: String,
    pub git_ref: String,
    pub git_short_hash: String,
    pub product_id: String,
    pub branch_name: String,
}

impl ApplicationInfo {
    pub fn new(config: &Config) -> Self {
        Self {
            application_name: "hmpps-arns-assessment-platform-ui".into(),
            build_number: config.build_number.clone(),
            git_ref: config.git_ref.clone(),
            git_short_hash: config.git_ref.chars().take(7).collect(),
            product_id: config.product_id.clone(),
            branch_name: config.branch_name.clone(),
        }
    }
}

/// `services()`.
pub struct Services {
    pub application_info: ApplicationInfo,
    pub assessment_platform_api_client: Arc<AssessmentPlatformApiClient>,
    pub delius_api_client: Arc<DeliusApiClient>,
    pub coordinator_api_client: Arc<CoordinatorApiClient>,
    pub arns_api_client: Arc<ArnsApiClient>,
    pub wiremock_admin_client: Arc<WiremockAdminClient>,
    pub handover_api_client: Arc<HandoverApiClient>,
    pub preferences_store: Arc<PreferencesStore>,
    pub hmpps_auth_client: Arc<AuthenticationClient>,
    pub audit_service: Arc<AuditService>,
    pub feature_flag_service: Arc<FeatureFlagService>,
    pub domain_events_service: Arc<DomainEventsService>,
    pub mpop_components: Arc<crate::data::MpopComponentsClient>,
    pub gotenberg_client: Arc<crate::data::GotenbergClient>,
    pub redis: Option<Arc<RedisClient>>,
}

impl Services {
    pub fn new(config: &Config) -> Self {
        let data = DataAccess::new(config);
        let application_info = ApplicationInfo::new(config);
        Self {
            audit_service: Arc::new(AuditService::new(application_info.application_name.clone(), &config.audit)),
            feature_flag_service: Arc::new(FeatureFlagService::new(&config.feature_flag_url)),
            domain_events_service: Arc::new(DomainEventsService::new(&config.sns)),
            mpop_components: data.mpop_components,
            gotenberg_client: data.gotenberg_client,
            application_info,
            assessment_platform_api_client: data.assessment_platform_api_client,
            delius_api_client: data.delius_api_client,
            coordinator_api_client: data.coordinator_api_client,
            arns_api_client: data.arns_api_client,
            wiremock_admin_client: data.wiremock_admin_client,
            handover_api_client: data.handover_api_client,
            preferences_store: data.preferences_store,
            hmpps_auth_client: data.hmpps_auth_client,
            redis: data.redis,
        }
    }
}
