# syntax=docker/dockerfile:1.7
#
# hmpps-arns-assessment-platform-ui. The build context is this directory:
#   docker build -t hmpps-arns-assessment-platform-ui-rust .
# or use `make build`. The Forge crates are git dependencies (rusty-hmpps-forge, at the commit
# Cargo.lock pins), fetched by Cargo during the build.
#
# The runtime image holds the binary at /app/app and the files it reads under /app, located through
# APP_ROOT (views/, forms/, dist/assets/, node_modules/) and FORGE_MOJ_COMPONENTS (templates/).

ARG RUST_VERSION=1.99
ARG NODE_VERSION=24

# Stage: the Forge sources at the locked commit, for the files the app needs besides the crates:
# forge-moj-components' styles (the asset build) and templates (the runtime image).
FROM rust:${RUST_VERSION}-slim-bookworm AS forge
WORKDIR /src
COPY . ./
RUN --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/usr/local/cargo/registry \
    cargo fetch --locked && \
    rev="$(sed -n 's/.*rusty-hmpps-forge?[a-z]*=[^#]*#\([0-9a-f]\{7\}\).*/\1/p' Cargo.lock | head -n 1)" && \
    mkdir -p /forge && \
    cp -r /usr/local/cargo/git/checkouts/rusty-hmpps-forge-*/"$rev"/forge-moj-components /forge/

# Stage: the frontend packages (GOV.UK, MOJ and MPoP templates and assets) and the browser asset
# build (esbuild + dart-sass), into app/dist/assets.
FROM node:${NODE_VERSION}-slim AS frontend
WORKDIR /src/aap-ui/rust/app
COPY app/package.json app/package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --ignore-scripts --no-audit --no-fund
COPY --from=forge /forge/forge-moj-components/styles /forge/forge-moj-components/styles
ENV FORGE_MOJ_COMPONENTS_STYLES=/forge/forge-moj-components/styles
COPY app/build-assets.mjs ./
COPY app/assets assets
COPY app/forms forms
RUN npm run build && npm prune --omit=dev

# Stage: static release build of the app (musl), so the runtime image can be `scratch`. musl-tools
# provides the C toolchain ring (rustls's crypto provider) builds with.
FROM rust:${RUST_VERSION}-slim-bookworm AS build
RUN apt-get update && \
    apt-get install -y --no-install-recommends musl-tools ca-certificates && \
    rm -rf /var/lib/apt/lists/* && \
    rustup target add "$(uname -m)-unknown-linux-musl" && \
    mkdir -p /rootfs/tmp && chmod 1777 /rootfs/tmp
WORKDIR /src/aap-ui/rust
COPY . ./
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/src/aap-ui/rust/target \
    target="$(uname -m)-unknown-linux-musl" && \
    cargo build --release --locked -p arns-assessment-platform-ui --target "$target" && \
    cp "target/$target/release/arns-assessment-platform-ui" /usr/local/bin/arns-assessment-platform-ui

# Stage: production image, from scratch: the static binary, a CA bundle (TLS to the APIs and
# Redis) and the files the app reads. No shell, so the healthcheck is the binary's own
# `healthcheck` subcommand (GET /ping on $PORT).
FROM scratch AS production

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

ENV BUILD_NUMBER=${BUILD_NUMBER} \
    GIT_REF=${GIT_REF} \
    GIT_BRANCH=${GIT_BRANCH} \
    NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    APP_ROOT=/app \
    FORGE_MOJ_COMPONENTS=/app/forge-moj-components

COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY --from=build /rootfs/tmp /tmp

WORKDIR /app
COPY --from=build --chown=2000:2000 /usr/local/bin/arns-assessment-platform-ui app
COPY --chown=2000:2000 app/views views
COPY --chown=2000:2000 app/forms forms
COPY --from=frontend --chown=2000:2000 /src/aap-ui/rust/app/dist dist
COPY --from=frontend --chown=2000:2000 /src/aap-ui/rust/app/node_modules node_modules
COPY --from=forge --chown=2000:2000 /forge/forge-moj-components/templates forge-moj-components/templates

EXPOSE 3000
USER 2000:2000

HEALTHCHECK --interval=5s --timeout=5s --start-period=10s --retries=20 CMD ["/app/app", "healthcheck"]

ENTRYPOINT ["/app/app"]
