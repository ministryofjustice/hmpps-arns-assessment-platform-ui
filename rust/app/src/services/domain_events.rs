//! `DomainEventsService`: HMPPS domain events on the SNS topic. Publishing never fails the
//! request; failures are logged. With no topic configured, nothing is published.

use serde_json::{Value as Json, json};
use tokio::sync::OnceCell;

use crate::config::SnsConfig;

pub struct DomainEventsService {
    config: SnsConfig,
    client: OnceCell<aws_sdk_sns::Client>,
}

impl DomainEventsService {
    pub fn new(config: &SnsConfig) -> Self {
        Self { config: config.clone(), client: OnceCell::new() }
    }

    async fn client(&self) -> &aws_sdk_sns::Client {
        self.client
            .get_or_init(|| async {
                let shared = aws_config::from_env().region(aws_config::Region::new(self.config.region.clone())).load().await;
                aws_sdk_sns::Client::new(&shared)
            })
            .await
    }

    /// Publishes an event (`{ eventType, version, occurredAt, ... }`), with its type as the
    /// `eventType` message attribute.
    pub async fn publish(&self, event: &Json) {
        if self.config.topic_arn.is_empty() {
            return;
        }
        let event_type = event.get("eventType").and_then(Json::as_str).unwrap_or_default().to_string();
        let attribute = aws_sdk_sns::types::MessageAttributeValue::builder().data_type("String").string_value(&event_type).build();
        let attribute = match attribute {
            Ok(a) => a,
            Err(e) => {
                crate::error!({ "err": e.to_string(), "eventType": event_type }, "Failed to publish domain event");
                return;
            }
        };
        let result = self
            .client()
            .await
            .publish()
            .topic_arn(&self.config.topic_arn)
            .message(event.to_string())
            .message_attributes("eventType", attribute)
            .send()
            .await;
        match result {
            Ok(_) => crate::info!({ "eventType": event_type }, "Domain event published"),
            Err(e) => crate::error!({ "err": e.to_string(), "eventType": event_type }, "Failed to publish domain event"),
        }
    }
}

/// `buildGoalsEvent`: a sentence plan goals event for the person (and plan, when known).
pub fn goals_event(event_type: &str, description: &str, plan_uuid: Option<&str>, crn: &str) -> Json {
    let mut event = json!({
        "eventType": event_type,
        "version": 1,
        "occurredAt": chrono::Utc::now().to_rfc3339_opts(chrono::SecondsFormat::Millis, true),
        "description": description,
    });
    if let (Some(uuid), Some(o)) = (plan_uuid, event.as_object_mut()) {
        o.insert("additionalInformation".into(), json!({ "planUuid": uuid }));
    }
    event["personReference"] = json!({ "identifiers": [{ "type": "CRN", "value": crn }] });
    event
}
