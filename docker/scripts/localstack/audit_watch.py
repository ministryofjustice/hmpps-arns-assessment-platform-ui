#!/usr/bin/env python3
"""Watch audit queue and display new events in real-time."""

import json
import subprocess
import sys
import time
from datetime import datetime

# Configuration
QUEUE_NAME = "audit-queue"
REGION = "eu-west-2"
START_TIME = int(time.time() * 1000)
SEEN = set()

# Colors
GREEN = '\033[0;32m'
YELLOW = '\033[1;33m'
BLUE = '\033[0;34m'
NC = '\033[0m'


def log(message, color=NC):
    """Print a colored log message."""
    print(f"{color}{message}{NC}", flush=True)


def run_aws(args):
    """Run awslocal SQS command and return parsed JSON response."""
    result = subprocess.run(
        ["awslocal", "sqs"] + args + ["--region", REGION, "--output", "json"],
        capture_output=True, text=True
    )
    if result.returncode == 0:
        try:
            return json.loads(result.stdout)
        except json.JSONDecodeError:
            return None
    return None


def format_event(body):
    """Parse and pretty-print audit event, expanding nested JSON in 'details' field."""
    try:
        obj = json.loads(body)
        # Parse nested JSON in details field
        if 'details' in obj and isinstance(obj['details'], str):
            try:
                obj['details'] = json.loads(obj['details'])
            except:
                pass
        return json.dumps(obj, indent=2)
    except:
        return body


def main():
    log(f"Watching audit queue: {QUEUE_NAME} ({REGION})", BLUE)

    response = run_aws(["get-queue-url", "--queue-name", QUEUE_NAME])
    if not response:
        log(f"Error: Queue '{QUEUE_NAME}' not found", YELLOW)
        sys.exit(1)

    queue_url = response['QueueUrl']
    start_time_str = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    log(f"Watching for events sent after {start_time_str}...\n", BLUE)

    try:
        while True:
            response = run_aws([
                "receive-message", "--queue-url", queue_url,
                "--max-number-of-messages", "10",
                "--wait-time-seconds", "5",
                "--visibility-timeout", "0",
                "--attribute-names", "SentTimestamp"
            ])

            if response:
                for msg in response.get('Messages', []):
                    msg_id = msg['MessageId']
                    sent_ts = int(msg['Attributes']['SentTimestamp'])

                    # Only show new messages sent after script started
                    if sent_ts > START_TIME and msg_id not in SEEN:
                        SEEN.add(msg_id)
                        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
                        log(f"[{timestamp}] New audit event:", GREEN)
                        print(format_event(msg['Body']))
                        print()

            time.sleep(0.1)

    except KeyboardInterrupt:
        log("\nStopped", YELLOW)


if __name__ == "__main__":
    main()
