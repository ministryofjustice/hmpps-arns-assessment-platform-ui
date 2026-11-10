//! Application configuration, read from the environment once.
//!
//! A variable marked "required in production" has a development default that
//! is refused when `NODE_ENV=production`.

use std::sync::OnceLock;

#[derive(Clone, Debug)]
pub struct ApiConfig {
    pub url: String,
    pub health_path: &'static str,
    /// Response timeout, in milliseconds.
    pub timeout_ms: u64,
}

#[derive(Clone, Debug)]
pub struct HmppsAuthConfig {
    pub api: ApiConfig,
    pub external_url: String,
    pub auth_client_id: String,
    pub auth_client_secret: String,
    pub system_client_id: String,
    pub system_client_secret: String,
}

#[derive(Clone, Debug)]
pub struct HandoverConfig {
    pub api: ApiConfig,
    pub external_url: String,
    pub client_id: String,
    pub client_secret: String,
}

#[derive(Clone, Debug)]
pub struct RedisConfig {
    pub enabled: bool,
    pub host: String,
    pub port: u16,
    pub password: Option<String>,
    pub tls_enabled: bool,
}

impl RedisConfig {
    /// `redis://` (or `rediss://` with TLS) URL for this server.
    pub fn url(&self) -> String {
        let scheme = if self.tls_enabled { "rediss" } else { "redis" };
        let auth = self.password.as_deref().map(|p| format!(":{}@", percent_encode_userinfo(p))).unwrap_or_default();
        format!("{scheme}://{auth}{}:{}", self.host, self.port)
    }
}

fn percent_encode_userinfo(s: &str) -> String {
    s.bytes()
        .map(|b| match b {
            b'A'..=b'Z' | b'a'..=b'z' | b'0'..=b'9' | b'-' | b'.' | b'_' | b'~' => (b as char).to_string(),
            _ => format!("%{b:02X}"),
        })
        .collect()
}

#[derive(Clone, Debug)]
pub struct SessionConfig {
    pub secret: String,
    pub expiry_minutes: u64,
    pub warning_after_inactive_minutes: u64,
    pub countdown_minutes: u64,
}

#[derive(Clone, Debug)]
pub struct AuditConfig {
    pub enabled: bool,
    pub queue_url: String,
    pub service_name: String,
    pub region: String,
}

#[derive(Clone, Debug)]
pub struct HandoverTarget {
    pub key: &'static str,
    pub client_id: String,
    pub display_name: &'static str,
}

#[derive(Clone, Debug)]
pub struct FormsConfig {
    pub sentence_plan_enabled: bool,
    pub strengths_and_needs_enabled: bool,
    pub training_session_launcher_enabled: bool,
    pub data_deletion_tool_enabled: bool,
}

#[derive(Clone, Debug)]
pub struct GotenbergConfig {
    pub api: ApiConfig,
    /// The base URL Gotenberg's Chromium loads pages from (this app, as Gotenberg reaches it).
    pub render_url: String,
}

#[derive(Clone, Debug)]
pub struct SnsConfig {
    pub region: String,
    /// The HMPPS domain events topic; empty disables publishing.
    pub topic_arn: String,
}

/// An environment the data deletion tool can target: its HMPPS Auth and AAP API.
#[derive(Clone, Copy, Debug)]
pub struct DataDeletionEnvironment {
    pub auth_url: &'static str,
    pub api_url: &'static str,
}

/// `config.forms.dataDeletionTool.environments`, in declaration order.
pub const DATA_DELETION_ENVIRONMENTS: [(&str, DataDeletionEnvironment); 5] = [
    ("local", DataDeletionEnvironment { auth_url: "http:///hmpps-auth:9090/auth", api_url: "http://aap-api:8080" }),
    (
        "dev",
        DataDeletionEnvironment {
            auth_url: "https://sign-in-dev.hmpps.service.justice.gov.uk/auth",
            api_url: "https://arns-assessment-platform-api-dev.hmpps.service.justice.gov.uk",
        },
    ),
    (
        "test",
        DataDeletionEnvironment {
            auth_url: "https://sign-in-dev.hmpps.service.justice.gov.uk/auth",
            api_url: "https://arns-assessment-platform-api-test.hmpps.service.justice.gov.uk",
        },
    ),
    (
        "preprod",
        DataDeletionEnvironment {
            auth_url: "https://sign-in-preprod.hmpps.service.justice.gov.uk/auth",
            api_url: "https://arns-assessment-platform-api-preprod.hmpps.service.justice.gov.uk",
        },
    ),
    (
        "prod",
        DataDeletionEnvironment {
            auth_url: "https://sign-in.hmpps.service.justice.gov.uk/auth",
            api_url: "https://arns-assessment-platform-api.hmpps.service.justice.gov.uk",
        },
    ),
];

#[derive(Clone, Debug)]
pub struct Config {
    pub build_number: String,
    pub product_id: String,
    pub git_ref: String,
    pub branch_name: String,
    pub production: bool,
    pub https: bool,
    pub forge_devtools_enabled: bool,
    pub redis: RedisConfig,
    pub cache_redis: RedisConfig,
    pub session: SessionConfig,
    pub hmpps_auth: HmppsAuthConfig,
    pub arns_handover: HandoverConfig,
    pub token_verification: ApiConfig,
    pub token_verification_enabled: bool,
    pub aap_api: ApiConfig,
    pub delius_api: ApiConfig,
    pub arns_api: ApiConfig,
    pub coordinator_api: ApiConfig,
    pub wiremock_admin: ApiConfig,
    pub tier_api: ApiConfig,
    pub supervision_package_api: ApiConfig,
    pub gotenberg: GotenbergConfig,
    pub sns: SnsConfig,
    pub san_url: String,
    pub san_legacy_url: String,
    pub audit: AuditConfig,
    pub forms: FormsConfig,
    pub ingress_url: String,
    pub log_level: String,
    pub environment_name: String,
    pub private_beta_feedback_url: String,
    pub national_rollout_feedback_url: String,
    pub service_now_form_url: String,
    pub oasys_url: String,
    pub oasys_review_url: String,
    pub mpop_url: String,
    pub smart_survey_popup_code: String,
    pub feature_flag_url: String,
    pub app_insights_connection_string: String,
    pub handover_targets: Vec<HandoverTarget>,
    pub can_stub_arns_api: bool,
    pub arns_api_stub_prefix: &'static str,
}

struct Env {
    production: bool,
}

impl Env {
    fn raw(&self, name: &str) -> Option<String> {
        std::env::var(name).ok().filter(|v| !v.is_empty())
    }

    /// `get(name, fallback)`.
    fn get(&self, name: &str, fallback: &str) -> String {
        self.raw(name).unwrap_or_else(|| fallback.to_string())
    }

    /// `get(name, fallback, requiredInProduction)`.
    fn required(&self, name: &str, fallback: &str) -> String {
        match self.raw(name) {
            Some(v) => v,
            None if !self.production => fallback.to_string(),
            None => panic!("Missing env var {name}"),
        }
    }

    fn required_if(&self, required: bool, name: &str, fallback: &str) -> String {
        if required { self.required(name, fallback) } else { self.get(name, fallback) }
    }

    fn number(&self, name: &str, fallback: u64) -> u64 {
        self.raw(name).and_then(|v| v.parse().ok()).unwrap_or(fallback)
    }

    fn flag(&self, name: &str, fallback: &str) -> bool {
        self.get(name, fallback) == "true"
    }

    fn api(&self, prefix: &str, url_fallback: &str, timeout_fallback: u64, required: bool) -> ApiConfig {
        ApiConfig {
            url: self.required_if(required, &format!("{prefix}_URL"), url_fallback),
            health_path: "/health/ping",
            timeout_ms: self.number(&format!("{prefix}_TIMEOUT_RESPONSE"), timeout_fallback),
        }
    }
}

impl Config {
    pub fn from_env() -> Self {
        let production = std::env::var("NODE_ENV").as_deref() == Ok("production");
        let env = Env { production };
        let ingress_url = env.required("INGRESS_URL", "http://localhost:3000");
        let audit_enabled = env.flag("AUDIT_ENABLED", "false");
        let auth_url = env.required("HMPPS_AUTH_URL", "http://localhost:9090/auth");
        let handover_url = env.required("HMPPS_ARNS_HANDOVER_URL", "http://localhost:7070");
        let redis_tls = env.flag("REDIS_TLS_ENABLED", "false");

        Config {
            build_number: env.required("BUILD_NUMBER", "1_0_0"),
            product_id: env.required("PRODUCT_ID", "UNASSIGNED"),
            git_ref: env.required("GIT_REF", "xxxxxxxxxxxxxxxxxxx"),
            branch_name: env.required("GIT_BRANCH", "xxxxxxxxxxxxxxxxxxx"),
            production,
            https: if env.raw("NO_HTTPS").as_deref() == Some("true") { false } else { production },
            forge_devtools_enabled: env.flag("FORGE_DEVTOOLS_ENABLED", "false"),
            redis: RedisConfig {
                enabled: env.required("REDIS_ENABLED", "false") == "true",
                host: env.required("REDIS_HOST", "localhost"),
                port: env.number("REDIS_PORT", 6379) as u16,
                password: env.raw("REDIS_AUTH_TOKEN"),
                tls_enabled: redis_tls,
            },
            cache_redis: RedisConfig {
                enabled: true,
                host: env.get("CACHE_REDIS_HOST", "localhost"),
                port: env.number("CACHE_REDIS_PORT", 6379) as u16,
                password: env.raw("CACHE_REDIS_AUTH_TOKEN"),
                tls_enabled: redis_tls,
            },
            session: SessionConfig {
                secret: env.required("SESSION_SECRET", "app-insecure-default-session"),
                expiry_minutes: env.number("WEB_SESSION_TIMEOUT_IN_MINUTES", 60),
                warning_after_inactive_minutes: env.number("SESSION_WARNING_AFTER_INACTIVE_MINUTES", 50),
                countdown_minutes: env.number("SESSION_COUNTDOWN_MINUTES", 10),
            },
            hmpps_auth: HmppsAuthConfig {
                api: ApiConfig {
                    url: auth_url.clone(),
                    health_path: "/health/ping",
                    timeout_ms: env.number("HMPPS_AUTH_TIMEOUT_RESPONSE", 10000),
                },
                external_url: env.get("HMPPS_AUTH_EXTERNAL_URL", &auth_url),
                auth_client_id: env.required("AUTH_CODE_CLIENT_ID", "clientid"),
                auth_client_secret: env.required("AUTH_CODE_CLIENT_SECRET", "clientsecret"),
                system_client_id: env.required("CLIENT_CREDS_CLIENT_ID", "clientid"),
                system_client_secret: env.required("CLIENT_CREDS_CLIENT_SECRET", "clientsecret"),
            },
            arns_handover: HandoverConfig {
                api: ApiConfig {
                    url: handover_url.clone(),
                    health_path: "/health/ping",
                    timeout_ms: env.number("HMPPS_ARNS_HANDOVER_TIMEOUT_RESPONSE", 10000),
                },
                external_url: env.get("HMPPS_ARNS_HANDOVER_EXTERNAL_URL", &handover_url),
                client_id: env.required("HMPPS_ARNS_HANDOVER_CLIENT_ID", "clientid"),
                client_secret: env.required("HMPPS_ARNS_HANDOVER_CLIENT_SECRET", "clientsecret"),
            },
            token_verification: env.api("TOKEN_VERIFICATION_API", "http://localhost:8100", 5000, true),
            token_verification_enabled: env.flag("TOKEN_VERIFICATION_ENABLED", "false"),
            aap_api: env.api("AAP_API", "http://localhost:8080", 5000, true),
            delius_api: env.api("DELIUS_API", "http://localhost:9091", 5000, true),
            arns_api: env.api("ARNS_API", "http://localhost:9091", 5000, true),
            coordinator_api: env.api("COORDINATOR_API", "http://localhost:8070", 10000, true),
            wiremock_admin: ApiConfig {
                url: env.get("WIREMOCK_ADMIN_URL", "http://localhost:9091/__admin"),
                health_path: "/health",
                timeout_ms: env.number("WIREMOCK_ADMIN_TIMEOUT_RESPONSE", 5000),
            },
            tier_api: env.api("TIER_API", "http://localhost:9091", 5000, true),
            supervision_package_api: env.api("SUPERVISION_PACKAGE_API", "http://localhost:9091", 5000, true),
            gotenberg: GotenbergConfig {
                api: ApiConfig {
                    url: env.required("GOTENBERG_API_URL", "http://localhost:3001"),
                    health_path: "/health",
                    timeout_ms: env.number("GOTENBERG_TIMEOUT_RESPONSE", 30000),
                },
                render_url: env.get("GOTENBERG_RENDER_URL", &ingress_url),
            },
            sns: SnsConfig { region: env.get("SNS_REGION", "eu-west-2"), topic_arn: env.get("SNS_TOPIC_ARN", "") },
            san_url: env.required("SAN_URL", "http://localhost:3000/strengths-and-needs/v1.0"),
            san_legacy_url: env.get("SAN_LEGACY_URL", ""),
            audit: AuditConfig {
                enabled: audit_enabled,
                queue_url: env.required_if(
                    audit_enabled,
                    "AUDIT_SQS_QUEUE_URL",
                    "http://localhost:4566/000000000000/mainQueue",
                ),
                service_name: env.required_if(audit_enabled, "AUDIT_SERVICE_NAME", "UNASSIGNED"),
                region: env.get("AUDIT_SQS_REGION", "eu-west-2"),
            },
            forms: FormsConfig {
                sentence_plan_enabled: env.flag("FORM_SENTENCE_PLAN_ENABLED", "true"),
                data_deletion_tool_enabled: env.flag("FORM_DATA_DELETION_TOOL_ENABLED", "false"),
                strengths_and_needs_enabled: env.flag("FORM_STRENGTHS_AND_NEEDS_ENABLED", "true"),
                training_session_launcher_enabled: env.flag("FORM_TRAINING_SESSION_LAUNCHER_ENABLED", "false"),
            },
            ingress_url,
            log_level: env.get("LOG_LEVEL", "info"),
            environment_name: env.get("ENVIRONMENT_NAME", ""),
            private_beta_feedback_url: env.get("PRIVATE_BETA_FEEDBACK_URL", "#"),
            national_rollout_feedback_url: env.get("NATIONAL_ROLLOUT_FEEDBACK_URL", "#"),
            service_now_form_url: env.required("SERVICE_NOW_FORM_URL", "#service-now-link"),
            oasys_url: env.required("OASYS_URL", "http://localhost:3000/training-session-launcher/sessions"),
            oasys_review_url: env.required("OASYS_REVIEW_URL", "http://localhost:3000/training-session-launcher/sessions"),
            mpop_url: env.required("MPOP_URL", "http://localhost:3000/sign-in"),
            smart_survey_popup_code: env.get("SMART_SURVEY_POPUP_CODE", ""),
            feature_flag_url: env.get("FEATURE_FLAG_URL", ""),
            app_insights_connection_string: env.get("APPLICATIONINSIGHTS_CONNECTION_STRING", ""),
            handover_targets: vec![
                HandoverTarget {
                    key: "sentence-plan",
                    client_id: env.get("SP_HANDOVER_CLIENT_ID", "sentence-plan"),
                    display_name: "Sentence Plan",
                },
                HandoverTarget {
                    key: "strengths-and-needs",
                    client_id: env.get("SAN_HANDOVER_CLIENT_ID", "strengths-and-needs-assessment"),
                    display_name: "Strengths and Needs (SAN)",
                },
                HandoverTarget {
                    key: "tiering-assessment",
                    client_id: env.get("TIERING_ASSESSMENT_CLIENT_ID", "tiering-assessment"),
                    display_name: "Tiering Assessment",
                },
            ],
            can_stub_arns_api: env.flag("CAN_STUB_ARNS_API", "false"),
            arns_api_stub_prefix: "/arns-api",
        }
    }

    pub fn handover_target(&self, key: &str) -> Option<&HandoverTarget> {
        self.handover_targets.iter().find(|t| t.key == key)
    }
}

static CONFIG: OnceLock<Config> = OnceLock::new();

/// The process-wide configuration.
pub fn config() -> &'static Config {
    CONFIG.get_or_init(Config::from_env)
}
