//! The app: the Forge instance, the page environment, the request pipeline
//! and every route, on a Topcoat router.

pub mod auth;
pub mod mpop_filters;
pub mod pipeline;
pub mod session;
pub mod views;

use std::borrow::Cow;
use std::path::PathBuf;
use std::sync::Arc;
use std::time::{Duration, Instant};

use forge_core::engine::forge::ForgeOptions;
use forge_core::engine::mount::ForgeRoute;
use forge_core::Forge;
use forge_devtools::{ForgeDevToolsOptions, set_up_forge_devtools};
use forge_runjucks::RunjucksRenderer;
use serde_json::{Value as Json, json};
use topcoat::context::Cx;
use topcoat::router::response::Response;
use topcoat::router::{Body, Method, Methods, Path, Route, RouteFuture, RouteId, Router, RouterBuilder, StatusCode, request};

use crate::config::{ApiConfig, Config};
use crate::forms;
use crate::services::Services;
use auth::AuthRoute;
use pipeline::{App, Handler, respond};
use session::SessionStore;
pub use views::AppPaths;

/// The app's Forge: GOV.UK, MOJ and Nunjucks globals plus the form packages.
pub fn build_forge(services: &Services, options: ForgeOptions) -> Forge {
    let mut forge = Forge::new(options);
    forge.register_global_components(forge_govuk_components::components()).expect("GOV.UK components");
    forge.register_global_components(forge_moj_components::components()).expect("MOJ components");
    forge.register_global_functions(forge_runjucks::nunjucks_functions()).expect("Nunjucks functions");
    let packages = [
        forms::training_session_launcher::package(Arc::new(forms::training_session_launcher::TrainingSessionLauncherEffectsDeps {
            handover_api_client: services.handover_api_client.clone(),
            wiremock_admin_client: services.wiremock_admin_client.clone(),
            coordinator_api_client: services.coordinator_api_client.clone(),
            preferences_store: services.preferences_store.clone(),
        })),
        forms::data_deletion_tool::package(Arc::new(forms::data_deletion_tool::DataDeletionToolEffectsDeps)),
        forms::platform::package(),
        forms::access::package(Arc::new(forms::access::effects::AccessEffectsDeps {
            delius_api: services.delius_api_client.clone(),
            handover_api: services.handover_api_client.clone(),
        })),
        forms::strengths_and_needs::package(Arc::new(forms::strengths_and_needs::effects::StrengthsAndNeedsEffectsDeps {
            api: services.assessment_platform_api_client.clone(),
            audit_service: services.audit_service.clone(),
            coordinator_api: services.coordinator_api_client.clone(),
        })),
        forms::sentence_plan::package(Arc::new(forms::sentence_plan::SentencePlanEffectsDeps {
            api: services.assessment_platform_api_client.clone(),
            coordinator_api: services.coordinator_api_client.clone(),
            arns_api: services.arns_api_client.clone(),
            delius_api: services.delius_api_client.clone(),
            mpop_components: services.mpop_components.clone(),
            audit_service: services.audit_service.clone(),
            feature_flag_service: services.feature_flag_service.clone(),
            domain_events_service: services.domain_events_service.clone(),
        })),
    ];
    for package in packages {
        forge.register_package(package).expect("form package");
    }
    forge
}

enum Kind {
    Forge(ForgeRoute),
    Auth(AuthRoute),
    Index,
    SessionExtend,
    PrintPreviewPdf,
    NotFound,
    Ping,
    Info,
    Health,
    Assets,
}

struct AppRoute {
    id: RouteId,
    methods: &'static [Method],
    path: Cow<'static, Path>,
    kind: Kind,
    app: Arc<App>,
}

impl Route for AppRoute {
    fn id(&self) -> RouteId {
        self.id
    }

    fn methods(&self) -> Methods<'_> {
        Methods::Only(self.methods)
    }

    fn path(&self) -> &Path {
        &self.path
    }

    fn handle<'cx>(&'cx self, cx: &'cx Cx, body: Body) -> RouteFuture<'cx> {
        Box::pin(async move {
            let app = &self.app;
            Ok(match &self.kind {
                Kind::Ping => respond(StatusCode::OK, "application/json", r#"{"status":"UP"}"#),
                Kind::Info => respond(StatusCode::OK, "application/json", info(&app.services).to_string()),
                Kind::Health => {
                    let (up, body) = health(app).await;
                    let status = if up { StatusCode::OK } else { StatusCode::INTERNAL_SERVER_ERROR };
                    respond(status, "application/json", body.to_string())
                }
                Kind::Assets => app_assets(app, request::uri(cx).path()),
                Kind::Forge(route) => app.handle(cx, body, Handler::Forge(route)).await,
                Kind::Auth(route) => app.handle(cx, body, Handler::Auth(*route)).await,
                Kind::Index => app.handle(cx, body, Handler::Index).await,
                Kind::SessionExtend => app.handle(cx, body, Handler::SessionExtend).await,
                Kind::PrintPreviewPdf => app.handle(cx, body, Handler::PrintPreviewPdf).await,
                Kind::NotFound => app.handle(cx, body, Handler::NotFound).await,
            })
        })
    }
}

/// Forge `:param` template paths become Topcoat `{param}` paths.
fn to_topcoat_path(template: &str) -> String {
    let joined = template
        .split('/')
        .map(|s| s.strip_prefix(':').map_or_else(|| s.to_string(), |name| format!("{{{name}}}")))
        .collect::<Vec<_>>()
        .join("/");
    if joined.is_empty() { "/".into() } else { joined }
}

fn leak(path: String) -> Cow<'static, Path> {
    Cow::Borrowed(Path::new(Box::leak(path.into_boxed_str())))
}

const GET: &[Method] = &[Method::GET];
const GET_POST: &[Method] = &[Method::GET, Method::POST];
const POST: &[Method] = &[Method::POST];

/// The whole app as a router.
pub fn router(config: &'static Config, paths: AppPaths) -> Router {
    let services = Arc::new(Services::new(config));
    let devtools = config.forge_devtools_enabled.then(|| {
        set_up_forge_devtools(ForgeDevToolsOptions {
            no_auth: !config.production,
            redis_url: config.redis.enabled.then(|| config.redis.url()),
            ..ForgeDevToolsOptions::default()
        })
    });
    let mut forge = build_forge(&services, ForgeOptions::default());
    if let Some(d) = &devtools {
        forge.add_instrumentation_sink(Arc::new(d.clone()));
    }
    let forge = Arc::new(forge);
    let mut renderer = RunjucksRenderer::new(views::page_engine(&paths));
    renderer.default_template = "partials/form-step".into();
    let app = Arc::new(App {
        config,
        sessions: SessionStore::new(services.redis.clone(), Duration::from_secs(config.session.expiry_minutes * 60)),
        services,
        forge: forge.clone(),
        renderer: Arc::new(renderer),
        engine: Arc::new(views::page_engine(&paths)),
        locals: views::app_locals(config),
        http: reqwest::Client::builder().timeout(Duration::from_secs(10)).build().expect("HTTP client"),
        paths,
        started: Instant::now(),
    });

    let mut builder = Router::builder();
    let add = |builder: RouterBuilder, methods: &'static [Method], path: Cow<'static, Path>, kind: Kind| {
        builder.route(AppRoute { id: RouteId::new(), methods, path, kind, app: app.clone() })
    };
    for (kind, path) in [(Kind::Ping, "/ping"), (Kind::Info, "/info"), (Kind::Health, "/health"), (Kind::Assets, "/assets/{*path}")] {
        builder = add(builder, GET, Cow::Borrowed(Path::new(path)), kind);
    }
    for (route, path) in AuthRoute::ALL {
        let methods = if matches!(route, AuthRoute::SignOut | AuthRoute::AccountDetails) { GET_POST } else { GET };
        builder = add(builder, methods, Cow::Borrowed(Path::new(path)), Kind::Auth(route));
    }
    builder = add(builder, GET, Cow::Borrowed(Path::new("/")), Kind::Index);
    builder = add(builder, POST, Cow::Borrowed(Path::new("/session/extend")), Kind::SessionExtend);
    builder = add(
        builder,
        GET,
        Cow::Borrowed(Path::new(forms::sentence_plan::constants::SENTENCE_PLAN_PRINT_PREVIEW_PDF_PATH)),
        Kind::PrintPreviewPdf,
    );

    // A journey whose first step is "/" shares that step's URL: the first route wins, as in
    // the router (the topology lists a package's steps before its journeys).
    let mut mounted = std::collections::HashSet::from([
        "/".to_string(),
        forms::sentence_plan::constants::SENTENCE_PLAN_PRINT_PREVIEW_PDF_PATH.to_string(),
    ]);
    for route in forge.topology() {
        let path = to_topcoat_path(&route.template_path);
        if !mounted.insert(path.clone()) {
            continue;
        }
        let methods = if route.methods.contains(&"POST") { GET_POST } else { GET };
        builder = add(builder, methods, leak(path), Kind::Forge(route));
    }
    builder = add(builder, GET_POST, Cow::Borrowed(Path::new("/{*path}")), Kind::NotFound);
    match devtools {
        Some(d) => d.mount(builder).build(),
        None => builder.build(),
    }
}

/// `/info` (`hmpps-monitoring`).
fn info(services: &Services) -> Json {
    let a = &services.application_info;
    json!({
        "git": { "branch": a.branch_name },
        "build": { "artifact": a.application_name, "version": a.build_number, "name": a.application_name },
        "productId": a.product_id,
    })
}

/// `/health`: each API's health endpoint (bar the training-only Wiremock admin), UP when all are.
async fn health(app: &App) -> (bool, Json) {
    let c = app.config;
    let apis: [(&str, &ApiConfig); 7] = [
        ("hmppsAuth", &c.hmpps_auth.api),
        ("arnsHandover", &c.arns_handover.api),
        ("tokenVerification", &c.token_verification),
        ("aapApi", &c.aap_api),
        ("deliusApi", &c.delius_api),
        ("arnsApi", &c.arns_api),
        ("coordinatorApi", &c.coordinator_api),
    ];
    let checks = apis.iter().map(|(name, api)| async move {
        let url = format!("{}{}", api.url, api.health_path);
        let result = app.http.get(&url).timeout(Duration::from_millis(api.timeout_ms.max(1))).send().await;
        let (up, details) = match result {
            Ok(r) if r.status().is_success() => (true, json!(r.status().as_u16())),
            Ok(r) => (false, json!({ "status": r.status().as_u16() })),
            Err(e) => (false, json!(e.to_string())),
        };
        (*name, up, details)
    });
    let results = futures::future::join_all(checks).await;
    let all_up = results.iter().all(|(_, up, _)| *up);
    let mut components = serde_json::Map::new();
    for (name, up, details) in results {
        components.insert(name.into(), json!({ "status": if up { "UP" } else { "DOWN" }, "details": details }));
    }
    let a = &app.services.application_info;
    (
        all_up,
        json!({
            "status": if all_up { "UP" } else { "DOWN" },
            "components": components,
            "uptime": app.started.elapsed().as_secs(),
            "build": { "buildNumber": a.build_number, "gitRef": a.git_ref },
            "version": a.build_number,
        }),
    )
}

fn content_type(path: &str) -> &'static str {
    match path.rsplit('.').next().unwrap_or_default() {
        "css" => "text/css; charset=utf-8",
        "js" | "mjs" => "text/javascript; charset=utf-8",
        "svg" => "image/svg+xml",
        "png" => "image/png",
        "jpg" | "jpeg" => "image/jpeg",
        "gif" => "image/gif",
        "ico" => "image/x-icon",
        "woff2" => "font/woff2",
        "woff" => "font/woff",
        "json" | "map" => "application/json",
        "webmanifest" => "application/manifest+json",
        _ => "application/octet-stream",
    }
}

/// Static assets: the built assets, then GOV.UK and MOJ Frontend's.
fn app_assets(app: &App, uri_path: &str) -> Response {
    let rel = pipeline::percent_decode(uri_path.trim_start_matches("/assets/"));
    if rel.split('/').any(|seg| seg == ".." || seg.is_empty()) {
        return respond(StatusCode::NOT_FOUND, "text/plain", "Not found");
    }
    let nm = app.paths.node_modules();
    let dirs: [PathBuf; 5] = [
        app.paths.built_assets(),
        nm.join("govuk-frontend/dist/govuk/assets"),
        nm.join("govuk-frontend/dist"),
        nm.join("@ministryofjustice/frontend/moj/assets"),
        nm.join("@ministryofjustice/frontend"),
    ];
    for dir in dirs {
        let file = dir.join(&rel);
        if file.is_file()
            && let Ok(bytes) = std::fs::read(&file)
        {
            let mut r = respond(StatusCode::OK, content_type(&rel), bytes);
            // `staticResourceCacheDuration: '1h'`
            r.headers_mut().insert(http::header::CACHE_CONTROL, http::HeaderValue::from_static("public, max-age=3600"));
            return r;
        }
    }
    respond(StatusCode::NOT_FOUND, "text/plain", "Not found")
}
