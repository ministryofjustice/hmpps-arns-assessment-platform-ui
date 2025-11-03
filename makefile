SHELL = '/bin/bash'

# Useful to keep this the same for backend/frontend
PROJECT_NAME = hmpps-arns-assessment-platform

APP_VERSION ?= local

# Compose files to stack on each other
BASE_COMPOSE_FILE = -f docker/docker-compose.yml
DEV_COMPOSE_FILES = $(BASE_COMPOSE_FILE) -f docker/docker-compose.dev.yml
UNIT_COMPOSE_FILES = $(BASE_COMPOSE_FILE) -f docker/docker-compose.unit.yml
INTEGRATION_COMPOSE_FILES = $(BASE_COMPOSE_FILE) -f docker/docker-compose.integration.yml
E2E_COMPOSE_FILES = $(BASE_COMPOSE_FILE) -f docker/docker-compose.e2e.yml

export APP_VERSION
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Builds a development image of the UI
	docker compose $(DEV_COMPOSE_FILES) build

dev-up: down ## Starts/restarts a development container. A remote debugger can be attached on port 9229.
	docker compose $(DEV_COMPOSE_FILES) up -d

down: ## Stops and removes all containers in the project.
	docker compose $(DEV_COMPOSE_FILES) down

test-unit: ## Runs the unit test suite.
	docker compose $(UNIT_COMPOSE_FILES) run --rm --no-deps ui

test-integration: ## Run Playwright tests in Docker container against application running in Docker
	-docker compose $(INTEGRATION_COMPOSE_FILES) --env-file docker/env/integration.env --profile integration run --build --rm playwright
	docker compose $(INTEGRATION_COMPOSE_FILES) --env-file docker/env/integration.env --profile integration down

test-integration-local: ## Run Playwright tests locally against application running in Docker
	docker compose $(INTEGRATION_COMPOSE_FILES) --env-file docker/env/integration-local.env --profile integration-local up --build -d --wait
	npx playwright test --project=integration --ui
	docker compose $(INTEGRATION_COMPOSE_FILES) --env-file docker/env/integration-local.env --profile integration-local down

test-e2e: ## Run Playwright E2E smoke tests in Docker container against real services
	docker compose $(E2E_COMPOSE_FILES) --env-file docker/env/e2e.env --profile e2e up -d --wait ui wiremock
	-docker compose $(E2E_COMPOSE_FILES) --env-file docker/env/e2e.env --profile e2e run --build --rm playwright
	docker compose $(E2E_COMPOSE_FILES) --env-file docker/env/e2e.env --profile e2e down

test-e2e-local: ## Run Playwright E2E smoke tests locally against real services
	docker compose $(E2E_COMPOSE_FILES) --env-file docker/env/e2e-local.env --profile e2e-local up --build -d --wait
	npx playwright test --project=e2e --ui
	docker compose $(E2E_COMPOSE_FILES) --env-file docker/env/e2e-local.env --profile e2e-local down

lint: ## Runs the linter.
	docker compose $(DEV_COMPOSE_FILES) exec ui npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose $(DEV_COMPOSE_FILES) exec ui npm run lint-fix

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose $(DEV_COMPOSE_FILES) down -v
	docker images -q --filter=reference="ghcr.io/ministryofjustice/*:local" | xargs -r docker rmi
	docker volume ls -qf "dangling=true" | xargs -r docker volume rm
	rm -rf dist node_modules test_results

update: ## Downloads the latest versions of container images.
	docker compose $(DEV_COMPOSE_FILES) pull api auth postgres redis localstack
	docker compose $(INTEGRATION_COMPOSE_FILES) pull wiremock playwright
	docker compose $(DEV_COMPOSE_FILES) build --pull ui

save-logs: ## Saves docker container logs (used in CI/CD) in a directory defined by OUTPUT_LOGS_DIR=
	docker system info
	mkdir -p ${OUTPUT_LOGS_DIR}
	docker logs ${PROJECT_NAME}-ui-1 > ${OUTPUT_LOGS_DIR}/ui.log

audit-watch: ## Watch the SQS audit queue live
	docker exec -it ${PROJECT_NAME}-localstack-1 /usr/local/bin/audit-watch
