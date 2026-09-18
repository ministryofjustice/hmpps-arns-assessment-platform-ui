FROM node:24-bookworm-slim

ARG PLAYWRIGHT_VERSION
RUN npx -y playwright@${PLAYWRIGHT_VERSION} install --with-deps --only-shell chromium \
    && rm -rf /var/lib/apt/lists/* /root/.npm
