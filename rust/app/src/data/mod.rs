//! Data access: API clients and Redis-backed stores.

pub mod clients;
pub mod gotenberg;
pub mod mpop;
pub mod redis_client;
pub mod rest_client;

use std::sync::Arc;

pub use clients::*;
pub use gotenberg::GotenbergClient;
pub use mpop::MpopComponentsClient;
pub use redis_client::RedisClient;
pub use rest_client::{ApiError, ApiResult, As, AuthenticationClient, RestClient, basic_auth};

use crate::config::Config;

/// `dataAccess()`.
pub struct DataAccess {
    pub hmpps_auth_client: Arc<AuthenticationClient>,
    pub assessment_platform_api_client: Arc<AssessmentPlatformApiClient>,
    pub delius_api_client: Arc<DeliusApiClient>,
    pub handover_api_client: Arc<HandoverApiClient>,
    pub coordinator_api_client: Arc<CoordinatorApiClient>,
    pub arns_api_client: Arc<ArnsApiClient>,
    pub wiremock_admin_client: Arc<WiremockAdminClient>,
    pub preferences_store: Arc<PreferencesStore>,
    pub mpop_components: Arc<MpopComponentsClient>,
    pub gotenberg_client: Arc<GotenbergClient>,
    /// The session / token / preferences Redis, when `REDIS_ENABLED=true`.
    pub redis: Option<Arc<RedisClient>>,
}

impl DataAccess {
    pub fn new(config: &Config) -> Self {
        let redis = config.redis.enabled.then(|| Arc::new(RedisClient::new(&config.redis)));
        // The API writes the latest assessment versions to its own cache Redis.
        let cache_redis = config.redis.enabled.then(|| Arc::new(RedisClient::new(&config.cache_redis)));
        let auth = Arc::new(AuthenticationClient::new(&config.hmpps_auth, redis.clone()));
        Self {
            hmpps_auth_client: auth.clone(),
            assessment_platform_api_client: Arc::new(AssessmentPlatformApiClient::new(
                config,
                auth.clone(),
                AssessmentCacheStore::new(cache_redis),
            )),
            delius_api_client: Arc::new(DeliusApiClient::new(config, auth.clone())),
            handover_api_client: Arc::new(HandoverApiClient::new(config, auth.clone())),
            coordinator_api_client: Arc::new(CoordinatorApiClient::new(config, auth.clone())),
            arns_api_client: Arc::new(ArnsApiClient::new(config, auth.clone())),
            mpop_components: Arc::new(MpopComponentsClient::new(config, auth)),
            gotenberg_client: Arc::new(GotenbergClient::new(&config.gotenberg)),
            wiremock_admin_client: Arc::new(WiremockAdminClient::new(config)),
            preferences_store: Arc::new(PreferencesStore::new(redis.clone())),
            redis,
        }
    }
}
