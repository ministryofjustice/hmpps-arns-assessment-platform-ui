#!/usr/bin/env bash
queues=$(awslocal sqs list-queues)
echo $queues | grep "audit-queue" || exit 1
