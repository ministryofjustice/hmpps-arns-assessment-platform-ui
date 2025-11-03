#!/bin/sh
set -e

echo "Checking node_modules..."

if [ ! -d "node_modules" ] || [ ! -f "node_modules/.last-updated" ] || [ "package.json" -nt "node_modules/.last-updated" ]; then
  echo "Running npm ci as container node_modules is outdated or missing."
  npm ci --no-audit
  touch node_modules/.last-updated
else
  echo "Container node_modules is up-to-date."
fi

echo "Starting application..."
exec "$@"
