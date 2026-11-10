SHELL = /bin/bash

# The local workflow: frontend packages and asset build, tests, the server and the image.

IMAGE ?= hmpps-arns-assessment-platform-ui-rust
APP_VERSION ?= local
BUILD_NUMBER ?= $(shell date +%Y-%m-%d.%H%M)
GIT_REF ?= $(shell git rev-parse --short HEAD 2>/dev/null || echo unknown)
GIT_BRANCH ?= $(shell git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)

.DEFAULT_GOAL := help
.PHONY: help install assets watch run test lint snapshots build

help: ## The help text you're reading.
	@grep --no-filename -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Installs the frontend packages into app/node_modules.
	@cd app && npm ci --ignore-scripts --no-audit --no-fund

assets: ## Builds the browser assets into app/dist/assets (esbuild + dart-sass).
	@cd app && npm run build

watch: ## Rebuilds the browser assets on change.
	@cd app && npm run watch

run: assets ## Runs the server (http://localhost:3000; configured by environment variables, see README).
	@cargo run -p arns-assessment-platform-ui

test: ## Runs the test suite (journey snapshots, registration, page rendering, unit tests).
	@TZ=Europe/London cargo test --workspace

lint: ## Runs clippy (warnings are errors).
	@cargo clippy --workspace --all-targets -- -D warnings

snapshots: ## Rewrites the journey snapshots (fixtures/journeys) from the journey builders; review the diff.
	@UPDATE_FIXTURES=1 cargo test --test journey_snapshots

build: ## Builds the production image.
	@docker build --build-arg BUILD_NUMBER=$(BUILD_NUMBER) --build-arg GIT_REF=$(GIT_REF) --build-arg GIT_BRANCH=$(GIT_BRANCH) \
		-t $(IMAGE):$(APP_VERSION) .
