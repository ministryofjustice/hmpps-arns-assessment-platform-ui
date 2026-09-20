import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand, PurgeQueueCommand } from '@aws-sdk/client-sqs'
import { appendFileSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'

export interface AuditMessage {
  what: string
  when: string
  who: string
  subjectId: string
  subjectType: string
  correlationId: string
  service: string
  details: Record<string, unknown>
}

export interface AuditQueueClientConfig {
  queueUrl: string
  region: string
  endpoint: string
}

const CACHE_FILE = join(__dirname, '../../test_results/.audit-messages.jsonl')

// eslint-disable-next-line no-promise-executor-return
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Polls audit messages from SQS into a shared JSONL file so all Playwright workers can read them.
 */
export class AuditQueueClient {
  private static instance: AuditQueueClient | null = null

  private readonly sqs: SQSClient

  private readonly queueUrl: string

  private constructor(config: AuditQueueClientConfig) {
    this.queueUrl = config.queueUrl
    this.sqs = new SQSClient({
      region: config.region,
      endpoint: config.endpoint,
      credentials: { accessKeyId: 'test', secretAccessKey: 'test' },
    })

    mkdirSync(dirname(CACHE_FILE), { recursive: true })
    this.poll()
  }

  static getInstance(config: AuditQueueClientConfig): AuditQueueClient {
    AuditQueueClient.instance ??= new AuditQueueClient(config)
    return AuditQueueClient.instance
  }

  async purge(): Promise<void> {
    await this.sqs.send(new PurgeQueueCommand({ QueueUrl: this.queueUrl }))
    writeFileSync(CACHE_FILE, '')
  }

  async waitForAuditEvent(
    crn: string,
    eventName: string,
    options?: { timeout?: number; additionalFilter?: (msg: AuditMessage) => boolean },
  ): Promise<AuditMessage> {
    const timeout = options?.timeout ?? 15_000
    const start = Date.now()

    while (Date.now() - start < timeout) {
      const matches = this.cachedMessages().filter(
        m => m.subjectId === crn && m.what === eventName && (!options?.additionalFilter || options.additionalFilter(m)),
      )
      if (matches.length === 1) return matches[0]
      if (matches.length > 1)
        throw new Error(`Expected exactly one audit event '${eventName}' for '${crn}', but found ${matches.length}.`)
      await sleep(500) // eslint-disable-line no-await-in-loop
    }

    throw new Error(`Timed out waiting for audit event '${eventName}'`)
  }

  /** Background loop: drain SQS → append to JSONL file → repeat. */
  private async poll(): Promise<void> {
    try {
      const { Messages = [] } = await this.sqs.send(
        new ReceiveMessageCommand({ QueueUrl: this.queueUrl, MaxNumberOfMessages: 10, WaitTimeSeconds: 1 }),
      )

      if (Messages.length > 0) {
        appendFileSync(
          CACHE_FILE,
          `${Messages.map(m => m.Body)
            .filter(Boolean)
            .join('\n')}\n`,
        )
      }

      for (const m of Messages) {
        if (m.ReceiptHandle) {
          this.sqs
            .send(new DeleteMessageCommand({ QueueUrl: this.queueUrl, ReceiptHandle: m.ReceiptHandle }))
            .catch(() => {})
        }
      }
    } catch {
      // ignore polling errors
    }

    setTimeout(() => this.poll(), 200)
  }

  private cachedMessages(): AuditMessage[] {
    try {
      return readFileSync(CACHE_FILE, 'utf-8')
        .split('\n')
        .filter(Boolean)
        .map(line => this.parseMessage(line))
        .filter((m): m is AuditMessage => m !== null)
    } catch {
      return []
    }
  }

  private parseMessage(body: string): AuditMessage | null {
    try {
      const raw = JSON.parse(body)
      const details = typeof raw.details === 'string' ? JSON.parse(raw.details) : (raw.details ?? {})
      return { ...raw, details } as AuditMessage
    } catch {
      return null
    }
  }
}
