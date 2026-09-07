FROM node:24-alpine AS base

LABEL maintainer="HMPPS Digital Studio <info@digital.justice.gov.uk>"

RUN apk --update-cache upgrade --available \
  && apk --no-cache add tzdata \
  && rm -rf /var/cache/apk/*

ENV TZ=Europe/London
RUN ln -snf "/usr/share/zoneinfo/$TZ" /etc/localtime && echo "$TZ" > /etc/timezone

RUN addgroup --gid 2000 --system appgroup && \
    adduser --uid 2000 --system appuser --ingroup appgroup

WORKDIR /app

FROM base AS dependencies
COPY package*.json .npmrc .allowed-scripts.mjs ./
RUN --mount=type=cache,target=/root/.npm \
    npm run setup

FROM dependencies AS source
COPY . .
RUN npm --prefix packages/aap-sdk run build \
  && mkdir -p node_modules/@ministryofjustice \
  && ln -s ../../packages/aap-sdk node_modules/@ministryofjustice/hmpps-aap-sdk

FROM source AS development
ENV NODE_ENV=development
CMD [ "npm", "run", "start:dev:assembly" ]

# Published as the source-and-toolchain base for release assembly.
FROM source AS builder
ENV NODE_ENV=production

FROM base AS production-dependencies
COPY package*.json .npmrc .allowed-scripts.mjs ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM base AS runtime
ENV NODE_ENV=production

COPY --chown=appuser:appgroup package.json package-lock.json ./
COPY --from=production-dependencies --chown=appuser:appgroup /app/node_modules ./node_modules

EXPOSE 3000
USER 2000

CMD [ "npm", "start" ]

FROM builder AS assembly-builder
RUN npm run build:assembly

FROM builder AS platform-builder
RUN npm run build

FROM runtime AS release

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

RUN { test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false); } \
    && { test -n "$GIT_REF" || (echo "GIT_REF not set" && false); } \
    && { test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false); }

ENV BUILD_NUMBER=${BUILD_NUMBER} \
    GIT_REF=${GIT_REF} \
    GIT_BRANCH=${GIT_BRANCH}

FROM release AS assembly
COPY --from=assembly-builder --chown=appuser:appgroup /app/dist ./dist

FROM release AS production
COPY --from=platform-builder --chown=appuser:appgroup /app/dist ./dist
