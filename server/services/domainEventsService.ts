import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import logger from '../../logger'

/**
 * An HMPPS domain event, per the shared hmpps-domain-event schema.
 */
export interface DomainEvent {
  eventType: string
  version: number
  occurredAt: string
  description?: string
  additionalInformation?: Record<string, unknown>
  personReference?: {
    identifiers: Array<{ type: string; value: string }>
  }
}

export default class DomainEventsService {
  private readonly client: SNSClient

  constructor(private readonly config: { region: string; topicArn: string }) {
    this.client = new SNSClient({ region: config.region })
  }

  async publish(event: DomainEvent): Promise<void> {
    if (!this.config.topicArn) {
      return
    }

    try {
      await this.client.send(
        new PublishCommand({
          TopicArn: this.config.topicArn,
          Message: JSON.stringify(event),
          MessageAttributes: {
            eventType: {
              DataType: 'String',
              StringValue: event.eventType,
            },
          },
        }),
      )

      logger.info({ eventType: event.eventType }, 'Domain event published')
    } catch (error) {
      logger.error({ err: error, eventType: event.eventType }, 'Failed to publish domain event')
    }
  }
}
