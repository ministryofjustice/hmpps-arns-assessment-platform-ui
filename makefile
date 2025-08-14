SHELL = '/bin/bash'
DEV_COMPOSE_FILES = -f docker/docker-compose.yml -f docker/docker-compose.dev.yml
PROJECT_NAME = arns-assessment-platform
SERVICE_NAME = ui
export COMPOSE_PROJECT_NAME=${PROJECT_NAME}

default: help

help: ## The help text you're reading.
	@grep --no-filename -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

up: ## Starts/restarts the service in a production container.
	docker compose ${LOCAL_COMPOSE_FILES} down ${SERVICE_NAME}
	docker compose ${LOCAL_COMPOSE_FILES} up ${SERVICE_NAME} --wait --no-recreate

down: ## Stops and removes all containers in the project.
	docker compose ${LOCAL_COMPOSE_FILES} down
	make dev-down
	make test-down

dev-up: ## Starts/restarts the service in a development container. A remote debugger can be attached on port 9229.
	@make install-node-modules
	docker compose ${DEV_COMPOSE_FILES} down ${SERVICE_NAME}
	docker compose ${DEV_COMPOSE_FILES} up ${SERVICE_NAME} --wait --no-recreate

dev-build: ## Builds a development image of the service and installs Node dependencies.
	@make install-node-modules
	docker compose ${DEV_COMPOSE_FILES} build ${SERVICE_NAME}

dev-down: ## Stops and removes all dev containers.
	docker compose ${DEV_COMPOSE_FILES} down

lint: ## Runs the linter.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ${SERVICE_NAME} npm run lint

lint-fix: ## Automatically fixes linting issues.
	docker compose ${DEV_COMPOSE_FILES} run --rm --no-deps ${SERVICE_NAME} npm run lint-fix

install-node-modules: ## Installs Node modules into the Docker volume.
	@echo "Running npm install locally..."
	@npm i
	@docker run --rm \
	  -e CYPRESS_INSTALL_BINARY=0 \
	  -v ./package.json:/package.json \
	  -v ./package-lock.json:/package-lock.json \
	  -v ~/.npm:/npm_cache \
	  -v ${PROJECT_NAME}_node_modules:/node_modules \
	  node:22-bullseye-slim \
	  /bin/bash -c 'if [ ! -f /node_modules/.last-updated ] || [ /package.json -nt /node_modules/.last-updated ]; then \
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
	docker compose ${LOCAL_COMPOSE_FILES} pull
