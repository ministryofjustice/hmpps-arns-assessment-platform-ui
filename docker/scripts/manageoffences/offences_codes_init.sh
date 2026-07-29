#!/bin/sh
HOST="risk-actuarial-api"
PORT="8080"
ENDPOINT="admin/update-offence-mapping"
MAX_RETRIES=15
WAIT_SECONDS=2

POST_URL="http://wiremock:${PORT}/${HOST}/${ENDPOINT}"

echo "Attempting POST request to $POST_URL..."

count=0
while [ "$count" -lt "$MAX_RETRIES" ]; do
  count=$((count + 1))

  # Execute POST request directly
  RESPONSE=$(wget -qO- --post-data="" "$POST_URL" 2>&1)
  STATUS=$?

  if [ "$STATUS" -eq 0 ]; then
    echo "POST request successful!"
    [ -n "$RESPONSE" ] && echo "Response: $RESPONSE"
    exit 0
  fi

  echo "Attempt $count/$MAX_RETRIES: Server not ready or request failed. Retrying in ${WAIT_SECONDS}s..."
  sleep "$WAIT_SECONDS"
done

echo "Timeout: POST request failed after $MAX_RETRIES attempts."
[ -n "$RESPONSE" ] && echo "Last response/error: $RESPONSE"
exit 1