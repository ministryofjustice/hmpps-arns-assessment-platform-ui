import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import type { DomainEvent } from '@ministryofjustice/hmpps-aap-sdk/dependencies/domain-events/DomainEvents.type'
import logger from '../../logger'

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
