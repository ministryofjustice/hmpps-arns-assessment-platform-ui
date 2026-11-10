//! `GotenbergClient`: renders a page of this app to PDF with Gotenberg's headless Chromium, which
//! loads the page with the user's session cookie.

use std::time::Duration;

use super::rest_client::{ApiError, ApiResult};
use crate::config::GotenbergConfig;
use crate::forms::sentence_plan::guards::{GOTENBERG_RENDER_HEADER, GOTENBERG_RENDER_HEADER_VALUE};

const CONVERT_URL_PATH: &str = "/forms/chromium/convert/url";

pub struct GotenbergClient {
    config: GotenbergConfig,
    http: reqwest::Client,
}

/// Escapes regex metacharacters.
fn escape_regex(s: &str) -> String {
    let mut out = String::new();
    for c in s.chars() {
        if ".*+?^${}()|[]\\".contains(c) {
            out.push('\\');
        }
        out.push(c);
    }
    out
}

impl GotenbergClient {
    pub fn new(config: &GotenbergConfig) -> Self {
        Self {
            config: config.clone(),
            http: reqwest::Client::builder().timeout(Duration::from_millis(config.api.timeout_ms)).build().expect("HTTP client"),
        }
    }

    /// `renderPdfFromUrl`: the PDF of `path` (on the render URL), loaded with `session_cookie`.
    /// The cookie and render header are scoped to the render origin so Chromium never sends them
    /// to third parties.
    pub async fn render_pdf_from_url(&self, path: &str, session_cookie: &str, request_id: Option<&str>) -> ApiResult<Vec<u8>> {
        let error = |status: Option<u16>, message: String| ApiError { api: "Gotenberg API", status, message, body: None };
        let base = url_origin(&self.config.render_url);
        let render_url = format!("{base}{path}");
        let scope = format!("^{}/", escape_regex(&base));
        let headers = serde_json::json!({
            "Cookie": format!("{session_cookie};scope={scope}"),
            GOTENBERG_RENDER_HEADER: format!("{GOTENBERG_RENDER_HEADER_VALUE};scope={scope}"),
        });
        let form = reqwest::multipart::Form::new()
            .text("url", render_url)
            .text("extraHttpHeaders", headers.to_string())
            .text("skipNetworkIdleEvent", "false")
            .text("printBackground", "true");
        crate::info!("Gotenberg API POST: {CONVERT_URL_PATH}");
        let mut request = self.http.post(format!("{}{CONVERT_URL_PATH}", self.config.api.url.trim_end_matches('/'))).multipart(form);
        if let Some(id) = request_id {
            request = request.header("Gotenberg-Trace", id);
        }
        let response = request.send().await.map_err(|e| error(None, e.to_string()))?;
        let status = response.status();
        if !status.is_success() {
            return Err(error(Some(status.as_u16()), response.text().await.unwrap_or_default()));
        }
        Ok(response.bytes().await.map_err(|e| error(Some(status.as_u16()), e.to_string()))?.to_vec())
    }
}

/// `new URL(url).origin`: scheme, host and port.
fn url_origin(url: &str) -> String {
    match url.find("://") {
        Some(i) => {
            let rest = &url[i + 3..];
            let end = rest.find('/').unwrap_or(rest.len());
            format!("{}{}", &url[..i + 3], &rest[..end])
        }
        None => url.trim_end_matches('/').to_string(),
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn origin_and_scope() {
        assert_eq!(super::url_origin("http://localhost:3000/some/path"), "http://localhost:3000");
        assert_eq!(super::escape_regex("http://a.b:3000"), "http://a\\.b:3000");
    }
}
