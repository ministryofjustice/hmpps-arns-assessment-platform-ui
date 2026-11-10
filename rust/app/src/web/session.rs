//! Sessions in Redis (or memory, for local development), identified by the
//! `hmpps-arns-assessment-platform-ui.session` cookie, expiring after inactivity (rolling).

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::{Duration, Instant};

use forge_core::Value;
use rand::RngCore;

use crate::data::RedisClient;

pub const SESSION_COOKIE_NAME: &str = "hmpps-arns-assessment-platform-ui.session";

/// A new unguessable session id (256 random bits).
pub fn new_session_id() -> String {
    let mut bytes = [0u8; 32];
    rand::rngs::OsRng.fill_bytes(&mut bytes);
    bytes.iter().map(|b| format!("{b:02x}")).collect()
}

enum Backend {
    Memory(Mutex<HashMap<String, (Instant, Value)>>),
    Redis(Arc<RedisClient>),
}

pub struct SessionStore {
    backend: Backend,
    ttl: Duration,
}

impl SessionStore {
    pub fn new(redis: Option<Arc<RedisClient>>, ttl: Duration) -> Self {
        let backend = match redis {
            Some(r) => Backend::Redis(r),
            None => Backend::Memory(Mutex::new(HashMap::new())),
        };
        Self { backend, ttl }
    }

    fn key(id: &str) -> String {
        format!("sess:{id}")
    }

    pub async fn load(&self, id: &str) -> Option<Value> {
        match &self.backend {
            Backend::Memory(m) => {
                let mut m = m.lock().unwrap();
                match m.get(id) {
                    Some((at, v)) if at.elapsed() < self.ttl => Some(v.clone()),
                    Some(_) => {
                        m.remove(id);
                        None
                    }
                    None => None,
                }
            }
            Backend::Redis(r) => match r.get(&Self::key(id)).await {
                Ok(Some(s)) => serde_json::from_str::<serde_json::Value>(&s).ok().map(|j| Value::from_json(&j)),
                Ok(None) => None,
                Err(e) => {
                    crate::error!({ "err": e.to_string() }, "Failed to load session");
                    None
                }
            },
        }
    }

    /// Saves the session and restarts its expiry.
    pub async fn save(&self, id: &str, session: &Value) {
        match &self.backend {
            Backend::Memory(m) => {
                m.lock().unwrap().insert(id.to_string(), (Instant::now(), session.clone()));
            }
            Backend::Redis(r) => {
                if let Err(e) = r.set_ex(&Self::key(id), &session.to_json().to_string(), self.ttl.as_secs()).await {
                    crate::error!({ "err": e.to_string() }, "Failed to save session");
                }
            }
        }
    }

    pub async fn destroy(&self, id: &str) {
        match &self.backend {
            Backend::Memory(m) => {
                m.lock().unwrap().remove(id);
            }
            Backend::Redis(r) => {
                if let Err(e) = r.del(&Self::key(id)).await {
                    crate::error!({ "err": e.to_string() }, "Failed to destroy session");
                }
            }
        }
    }

    pub fn max_age(&self) -> Duration {
        self.ttl
    }
}
