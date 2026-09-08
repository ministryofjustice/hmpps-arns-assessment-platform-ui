#!/usr/bin/env bash
awslocal sqs create-queue --queue-name audit-queue
awslocal sqs create-queue --queue-name coordinator-queue
