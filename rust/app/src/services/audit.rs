//! `AuditService` (`@ministryofjustice/hmpps-audit-client`): audit events on the HMPPS audit
//! SQS queue. Sending never fails the request; failures are logged.

use serde_json::{Value as Json, json};
use tokio::sync::OnceCell;

use crate::config::AuditConfig;

#[derive(Clone, Debug, Default)]
pub struct AuditMessage {
    pub action: String,
    pub who: String,
    pub subject_id: Option<String>,
    pub subject_type: Option<String>,
    pub correlation_id: Option<String>,
    pub details: Option<Json>,
}

pub struct AuditService {
    service_name: String,
    config: AuditConfig,
    client: OnceCell<aws_sdk_sqs::Client>,
}

impl AuditService {
    pub fn new(service_name: String, config: &AuditConfig) -> Self {
        Self { service_name, config: config.clone(), client: OnceCell::new() }
    }

    async fn client(&self) -> &aws_sdk_sqs::Client {
        self.client
            .get_or_init(|| async {
                let shared = aws_config::from_env().region(aws_config::Region::new(self.config.region.clone())).load().await;
                aws_sdk_sqs::Client::new(&shared)
            })
            .await
    }

    /// The SQS message body the audit client sends.
    pub fn message_body(&self, message: &AuditMessage) -> Json {
        let mut body = json!({
            "what": message.action,
            "when": chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
            "who": message.who,
            "service": self.service_name,
        });
        let o = body.as_object_mut().expect("object");
        if let Some(v) = &message.subject_id {
            o.insert("subjectId".into(), json!(v));
        }
        if let Some(v) = &message.subject_type {
            o.insert("subjectType".into(), json!(v));
        }
        if let Some(v) = &message.correlation_id {
            o.insert("correlationId".into(), json!(v));
        }
        if let Some(details) = &message.details {
            o.insert("details".into(), json!(details.to_string()));
        }
        body
    }

    pub async fn send(&self, message: AuditMessage) {
        let fields = json!({
            "action": message.action,
            "correlationId": message.correlation_id,
            "subjectId": message.subject_id,
            "subjectType": message.subject_type,
        });
        if !self.config.enabled {
            crate::debug!("Auditing is disabled, skipping audit message for {}", message.action);
            return;
        }
        let body = self.message_body(&message).to_string();
        let result = self.client().await.send_message().queue_url(&self.config.queue_url).message_body(body).send().await;
        match result {
            Ok(_) => crate::logger::log(crate::logger::Level::Info, "HMPPS audit event sent successfully", fields),
            Err(e) => {
                let mut fields = fields;
                fields["err"] = json!(e.to_string());
                crate::logger::log(crate::logger::Level::Error, "Error sending HMPPS audit event", fields);
            }
        }
    }
}
