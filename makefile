SHELL = '/bin/bash'

## Useful to keep this the same for backend/frontend
PROJECT_NAME = hmpps-assess-risks-and-needs

## Must match name of container in Docker
SERVICE_NAME = hmpps-arns-assessment-platform-ui

APP_VERSION ?= local

## Compose files to stack on each other
DEV_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.dev.yml
TEST_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.test.yml
SUBDOMAIN_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.subdomains.yml
PROD_COMPOSE_FILES = -f docker/docker-compose.yml

export APP_VERSION
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

prod-build: ## Builds a production image of the UI.
	docker compose ${PROD_COMPOSE_FILES} build ${SERVICE_NAME}

prod-up: ## Starts/restarts the UI in a production container.
	docker compose ${PROD_COMPOSE_FILES} down ${SERVICE_NAME}
	docker compose ${PROD_COMPOSE_FILES} up ${SERVICE_NAME} --wait --no-recreate

dev-build: ## Builds a development image of the UI and installs Node dependencies.
	@make install-node-modules
	docker compose ${DEV_COMPOSE_FILES} build ${SERVICE_NAME}

dev-up: ## Starts/restarts a development container. A remote debugger can be attached on port 9229.
	@make install-node-modules
	docker compose down ${SERVICE_NAME}
	docker compose ${DEV_COMPOSE_FILES} up ${SERVICE_NAME} --wait --no-recreate

dev-build-subdomains: ## Builds a development image of the UI for subdomain mode.
	@make install-node-modules
	docker compose ${SUBDOMAIN_COMPOSE_FILES} build ${SERVICE_NAME}

dev-up-subdomains: ## Starts the local stack with *.hmpps.test routing on port 80.
	@make install-node-modules
	docker compose ${SUBDOMAIN_COMPOSE_FILES} down
	docker compose ${SUBDOMAIN_COMPOSE_FILES} up ${SERVICE_NAME} wiremock-proxy dnsmasq --wait --no-recreate

dns-install-macos: ## Installs the macOS resolver for *.hmpps.test.
	sudo mkdir -p /etc/resolver
	echo 'nameserver 127.0.0.1\nport 53' | sudo tee /etc/resolver/hmpps.test >/dev/null
	@echo "Installed macOS resolver for *.hmpps.test via 127.0.0.1:53"

dns-remove-macos: ## Removes the macOS resolver for *.hmpps.test.
	sudo rm -f /etc/resolver/hmpps.test
	@echo "Removed macOS resolver for *.hmpps.test"

down: ## Stops and removes all containers in the project.
	docker compose down

test: ## Runs the unit test suite.
	docker compose exec ${SERVICE_NAME} npm run test

e2e: ## Run Playwright tests locally (dev environment must be running).
	npx playwright test --reporter=list

e2e-ui: ## Run Playwright tests with UI mode (dev environment must be running).
	npx playwright test --ui

SHARD ?=
export SHARD

e2e-ci: ## Run Playwright tests in Docker container (for CI).
	@make install-node-modules
	docker compose $(TEST_COMPOSE_FILES) up $(SERVICE_NAME) --wait $(if $(filter local,$(APP_VERSION)),--build) && \
	docker compose $(TEST_COMPOSE_FILES) run --rm playwright

lint: ## Runs the linter.
	docker compose exec ${SERVICE_NAME} npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose exec ${SERVICE_NAME} npm run lint-fix

install-node-modules: ## Installs Node modules into the Docker volume.
	@docker volume create ${PROJECT_NAME}_node_modules > /dev/null 2>&1 || true
	@docker run --rm \
	  -v ./package.json:/package.json \
	  -v ./package-lock.json:/package-lock.json \
	  -v ~/.npm:/npm_cache \
	  -v ${PROJECT_NAME}_node_modules:/node_modules \
	  node:22-alpine \
	  /bin/sh -c '\
	    CURRENT_HASH=$$(cat /package.json /package-lock.json | sha256sum | cut -d" " -f1); \
	    STORED_HASH=$$(cat /node_modules/.package-hash 2>/dev/null || echo ""); \
	    if [ "$$CURRENT_HASH" != "$$STORED_HASH" ]; then \
	      echo "Package files changed, running npm ci..."; \
	      npm ci --cache /npm_cache --prefer-offline && \
	      echo "$$CURRENT_HASH" > /node_modules/.package-hash; \
	    else \
	      echo "node_modules is up-to-date."; \
	    fi'

clean: ## Stops and removes all project containers. Deletes local build/cache directories.
	docker compose down
	docker images -q --filter=reference="ghcr.io/ministryofjustice/*:local" | xargs -r docker rmi
	docker volume ls -qf "dangling=true" | xargs -r docker volume rm
	rm -rf dist node_modules test_results

update: ## Downloads the latest versions of container images.
	docker compose ${DEV_COMPOSE_FILES} pull --ignore-buildable

save-logs: ## Saves docker container logs in a directory defined by OUTPUT_LOGS_DIR=
	docker system info
	mkdir -p ${OUTPUT_LOGS_DIR}
	@for container in $$(docker ps -a --filter "label=com.docker.compose.project=${PROJECT_NAME}" --format '{{.Names}}'); do \
		log_name=$$(echo "$$container" | sed 's/^${PROJECT_NAME}-//; s/-[0-9]*$$//'); \
		echo "Saving logs for $$container -> ${OUTPUT_LOGS_DIR}/$$log_name.log"; \
		docker logs "$$container" > "${OUTPUT_LOGS_DIR}/$$log_name.log" 2>&1; \
	done
