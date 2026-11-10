# hmpps-arns-assessment-platform-ui

The Assess and plan UI: sentence plan, strengths and needs assessment, the access routes into them
and supporting tools. It's a Rust app built on
[HMPPS Forge](https://github.com/devkokov/rusty-hmpps-forge) (Forge on
[Topcoat](https://github.com/tokio-rs/topcoat), with [Runjucks](https://github.com/Nikolay-Pomytkin/runjucks)
rendering Nunjucks templates and the GOV.UK Frontend and MOJ Frontend macros).

This directory is self-contained: it builds, runs, tests and packages on its own.

## Forms

| Form package | Module | Mounted at |
|---|---|---|
| Sentence plan: plan overview, goals and steps, agreement, history, previous and historic versions, print preview and PDF, about, supervision package | `app/src/forms/sentence_plan` | `/sentence-plan` |
| Strengths and needs: nine sections, summaries, view all answers, previous versions | `app/src/forms/strengths_and_needs` | `/strengths-and-needs` |
| Access: OASys handover and CRN entry into the services | `app/src/forms/access` | `/access` |
| Training session launcher | `app/src/forms/training_session_launcher` | `/training-session-launcher` |
| Data deletion tool | `app/src/forms/data_deletion_tool` | `/data-deletion-tool` |
| Platform policy pages | `app/src/forms/platform` | `/platform` |

Around them (`app/src/web`, `app/src/data`, `app/src/services`): Redis-backed sessions, sign-in
with HMPPS Auth and the ARNS handover service (OAuth2), CRN authorisation via Delius, CSRF,
security headers, previous page tracking, the API clients (AAP, Delius, handover, coordinator,
ARNS, MPoP tier and supervision package, Gotenberg, Wiremock admin), audit events over SQS, HMPPS
domain events over SNS, Flipt feature flags, health/info/ping, static assets and the error pages.

## Layout

```
Cargo.toml, Cargo.lock    the workspace (Forge comes from git, see below)
app/src/                  the app: config, data, services, forms, web
app/views/                page templates and layouts
app/forms/                each form's templates, component templates and browser assets
app/assets/               the app's browser assets (JS, SCSS, images)
app/package.json          frontend packages and the asset build (build-assets.mjs)
app/tests/                integration tests
fixtures/journeys/        journey definition snapshots
Dockerfile, Makefile      packaging and the local workflow
```

## Running

Needs Rust and Node (for the frontend packages and the asset build).

```sh
make install     # npm ci in app/ (GOV.UK, MOJ and MPoP frontend, esbuild, sass)
make assets      # browser assets into app/dist/assets (esbuild + dart-sass)
make run         # the server on http://localhost:3000
make test        # all tests
make lint        # clippy, warnings as errors
make snapshots   # rewrite the journey snapshots after an intended change
make build       # production image
```

The Forge crates are git dependencies on
[rusty-hmpps-forge](https://github.com/devkokov/rusty-hmpps-forge) `main`, at the commit
`Cargo.lock` pins (`cargo update -p forge-core` moves to the latest). To work against a local
checkout of it, point the `runjucks_core` entry of `[patch.crates-io]` at its `vendor/runjucks_core`
and add a `[patch."https://github.com/devkokov/rusty-hmpps-forge"]` section with a `path` for each
`forge-*` crate.

The binary finds its runtime files through `APP_ROOT` (default: `app/`: `views/`, `forms/`,
`dist/assets/`, `node_modules/`) and `FORGE_MOJ_COMPONENTS` (default: Cargo's checkout of the
`forge-moj-components` crate). The image is `scratch` plus the static binary; its healthcheck is
`/app/app healthcheck`.

## Configuration

Environment variables (`app/src/config.rs`). With `NODE_ENV=production`, the ones with development
defaults marked required must be set.

| Area | Variables |
|---|---|
| Server | `PORT`, `HOST`, `INGRESS_URL`, `NODE_ENV`, `LOG_LEVEL`, `ENVIRONMENT_NAME`, `BUILD_NUMBER`, `GIT_REF`, `GIT_BRANCH`, `PRODUCT_ID` |
| Sessions | `SESSION_SECRET`, `WEB_SESSION_TIMEOUT_IN_MINUTES`, `SESSION_WARNING_AFTER_INACTIVE_MINUTES`, `SESSION_COUNTDOWN_MINUTES` |
| Redis | `REDIS_ENABLED`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_TLS_ENABLED`, `CACHE_REDIS_HOST`, `CACHE_REDIS_PORT` |
| Sign-in | `HMPPS_AUTH_URL`, `HMPPS_AUTH_EXTERNAL_URL`, `AUTH_CODE_CLIENT_ID`, `AUTH_CODE_CLIENT_SECRET`, `CLIENT_CREDS_CLIENT_ID`, `CLIENT_CREDS_CLIENT_SECRET`, `TOKEN_VERIFICATION_ENABLED`, `TOKEN_VERIFICATION_API_URL` |
| Handover | `HMPPS_ARNS_HANDOVER_URL`, `HMPPS_ARNS_HANDOVER_EXTERNAL_URL`, `HMPPS_ARNS_HANDOVER_CLIENT_ID`, `HMPPS_ARNS_HANDOVER_CLIENT_SECRET`, `SP_HANDOVER_CLIENT_ID`, `SAN_HANDOVER_CLIENT_ID`, `TIERING_ASSESSMENT_CLIENT_ID` |
| APIs | `AAP_API_URL`, `DELIUS_API_URL`, `ARNS_API_URL`, `COORDINATOR_API_URL`, `TIER_API_URL`, `SUPERVISION_PACKAGE_API_URL`, `GOTENBERG_API_URL`, `GOTENBERG_RENDER_URL`, `WIREMOCK_ADMIN_URL`, `CAN_STUB_ARNS_API` (each API also takes `<NAME>_TIMEOUT_RESPONSE`) |
| Events | `AUDIT_ENABLED`, `AUDIT_SQS_REGION`, `SNS_REGION`, `SNS_TOPIC_ARN` |
| Forms | `FORM_SENTENCE_PLAN_ENABLED`, `FORM_STRENGTHS_AND_NEEDS_ENABLED`, `FORM_TRAINING_SESSION_LAUNCHER_ENABLED`, `FORM_DATA_DELETION_TOOL_ENABLED` |
| Links and analytics | `SAN_URL`, `SAN_LEGACY_URL`, `OASYS_URL`, `OASYS_REVIEW_URL`, `MPOP_URL`, `SERVICE_NOW_FORM_URL`, `NATIONAL_ROLLOUT_FEEDBACK_URL`, `PRIVATE_BETA_FEEDBACK_URL`, `SMART_SURVEY_POPUP_CODE`, `APPLICATIONINSIGHTS_CONNECTION_STRING`, `FEATURE_FLAG_URL` |
| Tooling | `FORGE_DEVTOOLS_ENABLED` |

Without `REDIS_ENABLED=true`, sessions, the system token and the API caches are held in memory.
Without `FEATURE_FLAG_URL`, feature flags take their fallback values. Business and telemetry events
(`SENTENCE_PLAN_ACCESSED`, `CREATE_GOAL_PAGE_SUBMITTED`, ...) are written to the log.

## Tests

- `app/tests/journey_snapshots.rs`: every form package's journey definition against its snapshot
  in `fixtures/journeys/`. The JSON must stay identical, key order included, because block keys
  decide Forge's AST node IDs (and so the field ids and the answers saved against them). After an
  intended change, `make snapshots` rewrites them; review the diff.
- `app/tests/registration.rs`: all packages pass Forge's registration checks (serialisable
  definitions, known components and functions, routes), as at startup.
- `app/tests/pages.rs`: the app's own pages and layouts render through the page environment.
- `app/tests/sentence_plan_flow.rs`: the plan overview, add goal and add steps pages end to end
  through Forge, against a stub HMPPS Auth and AAP API: the access effects, loading the plan,
  deriving goals, the step editor session, the custom components and the page render.
- Unit tests next to the code (JWT claims, auth bypass matching, template filters, date handling,
  goal matching, assessment info, the JSON diff, ...).

Data tables live as JSON next to the code that reads them: the strengths and needs locale content
(`app/src/forms/strengths_and_needs/v1/locales/`) and the sentence plan's areas of need and actor
labels (`app/src/forms/sentence_plan/constants/`).

## Notes

- **`targetService` template local** is read when the request starts. The effects that set it
  (access, SAN entry) redirect before anything renders, so pages always see the current value.
- **Telemetry.** Server-side App Insights telemetry isn't sent; business events go to the log. The
  browser-side App Insights script and `telemetryId` are in place.
