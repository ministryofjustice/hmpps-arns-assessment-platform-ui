import { AuditQueueClient } from '../../support/AuditQueueClient'

/**
 * Purge the audit queue before the audit test suite runs.
 * Clears stale messages from previous test runs.
 */
async function globalSetup() {
  const localstackUrl = process.env.LOCALSTACK_URL || 'http://localhost:4566'
  const client = AuditQueueClient.getInstance({
    queueUrl: `${localstackUrl}/000000000000/audit-queue`,
    region: 'eu-west-2',
    endpoint: localstackUrl,
  })
  await client.purge()
}

export default globalSetup
