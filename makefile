SHELL = '/bin/bash'

## Useful to keep this the same for backend/frontend
PROJECT_NAME = hmpps-arns-assessment-platform

## Must match name of container in Docker
SERVICE_NAME = ui

APP_VERSION ?= local

## Compose files to stack on each other
DEV_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.local.yml
PROD_COMPOSE_FILES = -f docker/docker-compose.base.yml
TEST_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.test.yml

export APP_VERSION
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

build: ## Builds a production image of the UI.
	docker compose ${PROD_COMPOSE_FILES} build ui

dev-build: ## Builds a development image of the UI and installs Node dependencies.
	@make install-node-modules
	docker compose ${DEV_COMPOSE_FILES} build ui

dev-up: ## Starts/restarts a development container. A remote debugger can be attached on port 9229.
	@make install-node-modules
	docker compose down ${SERVICE_NAME}
	docker compose ${DEV_COMPOSE_FILES} up ${SERVICE_NAME} --wait --no-recreate

down: ## Stops and removes all containers in the project.
	docker compose down

test: ## Runs the unit test suite.
	docker compose exec ${SERVICE_NAME} npm run test

e2e-docker: ## Run Playwright tests in Docker container against application running in Docker
	echo "Running Playwright tests in Docker container..."
	export HMPPS_AUTH_EXTERNAL_URL=http://wiremock:8080/auth && \
	export HMPPS_ARNS_HANDOVER_EXTERNAL_URL=http://wiremock:8080 && \
	docker compose $(TEST_COMPOSE_FILES) build $(SERVICE_NAME) && \
	docker compose $(TEST_COMPOSE_FILES) down && \
	docker compose $(TEST_COMPOSE_FILES) up $(SERVICE_NAME) wiremock --wait && \
	docker compose $(TEST_COMPOSE_FILES) run --rm playwright

e2e-local: ## Run Playwright tests locally against application running in Docker
	echo "Running Playwright tests locally..."
	docker compose $(TEST_COMPOSE_FILES) build $(SERVICE_NAME)
	docker compose $(TEST_COMPOSE_FILES) down
	docker compose $(TEST_COMPOSE_FILES) up $(SERVICE_NAME) wiremock --wait
	npx playwright test

e2e-ui: ## Run Playwright UI against application running in Docker
	echo "Running Playwright tests locally..."
	export HMPPS_ARNS_HANDOVER_URL=http://wiremock:8080 && \
	export HMPPS_ARNS_HANDOVER_EXTERNAL_URL=http://localhost:9091 && \
	docker compose $(DEV_COMPOSE_FILES) up $(SERVICE_NAME) wiremock --wait
	ENVIRONMENT='e2e-ui' npx playwright test --ui

lint: ## Runs the linter.
	docker compose exec ${SERVICE_NAME} npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose exec ${SERVICE_NAME} npm run lint-fix

install-node-modules: ## Installs Node modules into the Docker volume.
	@docker run --rm \
	  -v ./package.json:/package.json \
	  -v ./package-lock.json:/package-lock.json \
	  -v ~/.npm:/npm_cache \
	  -v ${PROJECT_NAME}_node_modules:/node_modules \
	  node:22-alpine \
	  /bin/sh -c 'if [ ! -f /node_modules/.last-updated ] || [ /package.json -nt /node_modules/.last-updated ]; then \
	    echo "Running npm ci as container node_modules is outdated or missing."; \
	    npm ci --cache /npm_cache --prefer-offline; \
	    touch /node_modules/.last-updated; \
	  else \
	    echo "Container node_modules is up-to-date."; \
	  fi'

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose down
	docker images -q --filter=reference="ghcr.io/ministryofjustice/*:local" | xargs -r docker rmi
	docker volume ls -qf "dangling=true" | xargs -r docker volume rm
	rm -rf dist node_modules test_results

update: ## Downloads the latest versions of container images.
	docker compose ${DEV_COMPOSE_FILES} pull

save-logs: ## Saves docker container logs in a directory defined by OUTPUT_LOGS_DIR=
	docker system info
	mkdir -p ${OUTPUT_LOGS_DIR}
	docker logs ${PROJECT_NAME}-ui-1 > ${OUTPUT_LOGS_DIR}/ui.log
