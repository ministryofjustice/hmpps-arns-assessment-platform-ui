SHELL = '/bin/bash'

## Useful to keep this the same for backend/frontend
PROJECT_NAME = hmpps-arns

## Must match name of container in Docker
SERVICE_NAME = ui

APP_VERSION ?= local

## Compose files to stack on each other
DEV_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.local.yml
PROD_COMPOSE_FILES = -f docker/docker-compose.base.yml
TEST_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.test.yml
TEST_HEADLESS_COMPOSE_FILES = -f docker/docker-compose.base.yml -f docker/docker-compose.test.yml -f docker/docker-compose.test-headless.yml

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
	docker compose ${DEV_COMPOSE_FILES} up ${SERVICE_NAME} --wait

down: ## Stops and removes all containers in the project.
	docker compose down

test: ## Runs the unit test suite.
	docker compose exec ${SERVICE_NAME} npm run test

e2e: ## Run the end-to-end tests using Cypress
	echo "Running Cypress in interactive mode..."
	docker compose $(TEST_COMPOSE_FILES) up $(SERVICE_NAME) --wait
	npx cypress install
	npx cypress open --e2e -c experimentalInteractiveRunEvents=true

e2e-headless: ## Run the end-to-end tests using Cypress (headless)
	@if [ -n "$(SPLIT)" ]; then \
    echo "Running Cypress in headless mode with split testing (SPLIT=$(SPLIT), SPLIT_INDEX=$(SPLIT_INDEX))..."; \
    docker compose $(TEST_HEADLESS_COMPOSE_FILES) run --quiet-pull --rm \
      -e SPLIT=$(SPLIT) \
      -e SPLIT_INDEX=$(SPLIT_INDEX) \
      -e SPEC="/cypress/integration_tests/e2e/**/*.cy.ts" \
      cypress; \
  else \
    echo "Running Cypress in headless mode..."; \
    docker compose $(TEST_HEADLESS_COMPOSE_FILES) run --quiet-pull --rm cypress; \
  fi

lint: ## Runs the linter.
	docker compose exec ${SERVICE_NAME} npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose exec ${SERVICE_NAME} npm run lint-fix

install-node-modules: ## Installs Node modules into the Docker volume.
	@docker run --rm \
	  -e CYPRESS_INSTALL_BINARY=0 \
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
