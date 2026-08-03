import { goalsCompletedEvent, goalsAddedEvent } from './goalsDomainEvents'

describe('goalsDomainEvents', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-30T10:00:00.000Z'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  describe('goalsCompletedEvent', () => {
    it('should build the goals-completed domain event', () => {
      const event = goalsCompletedEvent({ planUuid: 'plan-123', crn: 'X123456' })

      expect(event).toEqual({
        eventType: 'arns.sentence.plan.goals.completed',
        version: 1,
        occurredAt: '2026-07-30T10:00:00.000Z',
        description: 'No more open goals',
        additionalInformation: { planUuid: 'plan-123' },
        personReference: { identifiers: [{ type: 'CRN', value: 'X123456' }] },
      })
    })
  })

  describe('goalsAddedEvent', () => {
    it('should build the goals-added domain event', () => {
      const event = goalsAddedEvent({ planUuid: 'plan-123', crn: 'X123456' })

      expect(event).toEqual({
        eventType: 'arns.sentence.plan.goals.added',
        version: 1,
        occurredAt: '2026-07-30T10:00:00.000Z',
        description: 'There is an open goal',
        additionalInformation: { planUuid: 'plan-123' },
        personReference: { identifiers: [{ type: 'CRN', value: 'X123456' }] },
      })
    })
  })
})
