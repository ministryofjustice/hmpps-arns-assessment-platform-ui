import { mockClient } from 'aws-sdk-client-mock'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'
import DomainEventsService, { DomainEvent } from './domainEventsService'

jest.mock('../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

const mockLogger = jest.requireMock('../../logger')

const snsMock = mockClient(SNSClient)

const TOPIC_ARN = 'arn:aws:sns:eu-west-2:123456789012:hmpps-domain-events'

const event: DomainEvent = {
  eventType: 'arns.sentence.plan.goals.completed',
  version: 1,
  occurredAt: '2026-07-29T10:00:00.000Z',
  description: 'No more open goals',
  additionalInformation: { planUuid: 'plan-uuid-123' },
  personReference: { identifiers: [{ type: 'CRN', value: 'X123456' }] },
}

describe('DomainEventsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    snsMock.reset()
  })

  describe('publish()', () => {
    it('should send a PublishCommand with the topic, message and eventType attribute when a topic is configured', async () => {

      snsMock.on(PublishCommand).resolves({})
      const service = new DomainEventsService({ region: 'eu-west-2', topicArn: TOPIC_ARN })

      await service.publish(event)

      const calls = snsMock.commandCalls(PublishCommand)
      expect(calls).toHaveLength(1)
      expect(calls[0].args[0].input).toEqual({
        TopicArn: TOPIC_ARN,
        Message: JSON.stringify(event),
        MessageAttributes: {
          eventType: { DataType: 'String', StringValue: 'arns.sentence.plan.goals.completed' },
        },
      })
    })

    it('should not publish when no topic is configured', async () => {

      const service = new DomainEventsService({ region: 'eu-west-2', topicArn: '' })

      await service.publish(event)

      expect(snsMock.commandCalls(PublishCommand)).toHaveLength(0)
    })

    it('should not throw when publishing fails', async () => {

      snsMock.on(PublishCommand).rejects(new Error('SNS unavailable'))
      const service = new DomainEventsService({ region: 'eu-west-2', topicArn: TOPIC_ARN })

      await expect(service.publish(event)).resolves.not.toThrow()
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})
