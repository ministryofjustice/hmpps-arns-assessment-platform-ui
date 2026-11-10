//! `createRedisClient`: a lazily connected, auto-reconnecting Redis connection.

use redis::aio::ConnectionManager;
use tokio::sync::OnceCell;

use crate::config::RedisConfig;

/// A Redis connection made on first use. Failures are returned to the caller each time, so a
/// Redis outage degrades the features that use it rather than the app.
pub struct RedisClient {
    url: String,
    connection: OnceCell<ConnectionManager>,
}

impl RedisClient {
    pub fn new(config: &RedisConfig) -> Self {
        Self { url: config.url(), connection: OnceCell::new() }
    }

    pub async fn connection(&self) -> redis::RedisResult<ConnectionManager> {
        self.connection
            .get_or_try_init(|| async {
                let client = redis::Client::open(self.url.as_str())?;
                ConnectionManager::new(client).await
            })
            .await
            .cloned()
    }

    pub async fn get(&self, key: &str) -> redis::RedisResult<Option<String>> {
        let mut conn = self.connection().await?;
        redis::cmd("GET").arg(key).query_async(&mut conn).await
    }

    pub async fn set_ex(&self, key: &str, value: &str, seconds: u64) -> redis::RedisResult<()> {
        let mut conn = self.connection().await?;
        redis::cmd("SET").arg(key).arg(value).arg("EX").arg(seconds).query_async(&mut conn).await
    }

    pub async fn del(&self, key: &str) -> redis::RedisResult<()> {
        let mut conn = self.connection().await?;
        redis::cmd("DEL").arg(key).query_async(&mut conn).await
    }
}
