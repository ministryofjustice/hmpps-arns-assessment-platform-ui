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

FROM base AS development
ENV NODE_ENV=development

# Install ALL dependencies (dev + prod) for building
FROM base AS deps
COPY package*.json .npmrc .allowed-scripts.mjs ./
RUN --mount=type=cache,target=/root/.npm \
    npm run setup

# Install ONLY production dependencies (cached separately)
FROM base AS prod-deps
COPY package*.json .npmrc .allowed-scripts.mjs ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Build stage - uses full deps
FROM deps AS build
COPY . .
RUN npm run build

# Production stage - combines built assets with prod-only deps
FROM base AS production

ARG BUILD_NUMBER
ARG GIT_REF
ARG GIT_BRANCH

RUN test -n "$BUILD_NUMBER" || (echo "BUILD_NUMBER not set" && false) \
    && test -n "$GIT_REF" || (echo "GIT_REF not set" && false) \
    && test -n "$GIT_BRANCH" || (echo "GIT_BRANCH not set" && false)

ENV NODE_ENV=production \
    BUILD_NUMBER=${BUILD_NUMBER} \
    GIT_REF=${GIT_REF} \
    GIT_BRANCH=${GIT_BRANCH}

COPY --from=build --chown=appuser:appgroup /app/package.json /app/package-lock.json ./
COPY --from=build --chown=appuser:appgroup /app/dist ./dist
RUN mv ./dist/packages ./packages
COPY --from=prod-deps --chown=appuser:appgroup /app/node_modules ./node_modules

EXPOSE 3000
USER 2000

CMD [ "npm", "start" ]
