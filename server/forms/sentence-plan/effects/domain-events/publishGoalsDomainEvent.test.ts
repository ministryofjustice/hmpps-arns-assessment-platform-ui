import { publishGoalsCompletedEvent, publishGoalsAddedEvent } from './publishGoalsDomainEvent'
import { DerivedGoal, SentencePlanContext, SentencePlanEffectsDeps } from '../types'

jest.mock('../../../../../logger', () => ({ info: jest.fn(), error: jest.fn() }))

const makeGoal = (overrides: Partial<DerivedGoal> = {}): DerivedGoal => ({
  uuid: 'g-1',
  title: 'Test goal',
  status: 'ACHIEVED',
  statusDate: '2024-06-01T00:00:00.000Z',
  areaOfNeed: 'accommodation',
  areaOfNeedLabel: 'Accommodation',
  relatedAreasOfNeed: [],
  relatedAreasOfNeedLabels: [],
  steps: [],
  notes: [],
  collectionIndex: 0,
  isFirstInStatus: true,
  isLastInStatus: true,
  ...overrides,
})

interface MockContextOptions {
  latestAgreementStatus?: string
  goals?: DerivedGoal[]
  crn?: string | null
  planIdentifier?: { type: string; uuid?: string } | null
}

const createMockContext = (options: MockContextOptions = {}): SentencePlanContext => {
  const dataMap: Record<string, unknown> = {
    latestAgreementStatus: options.latestAgreementStatus ?? 'AGREED',
    goals: options.goals ?? [],
  }
  const crn = options.crn === undefined ? 'X123456' : options.crn
  const planIdentifier =
    options.planIdentifier === undefined ? { type: 'UUID', uuid: 'plan-uuid-1' } : options.planIdentifier

  return {
    getData: jest.fn((key: string) => dataMap[key]),
    getSession: jest.fn(() => ({
      caseDetails: crn ? { crn } : undefined,
      sessionDetails: planIdentifier ? { planIdentifier } : undefined,
    })),
  } as unknown as SentencePlanContext
}

const createMockDeps = (): SentencePlanEffectsDeps =>
  ({ domainEventsService: { publish: jest.fn() } }) as unknown as SentencePlanEffectsDeps

describe('publishGoalsDomainEvent', () => {
  let deps: SentencePlanEffectsDeps

  beforeEach(() => {
    deps = createMockDeps()
  })

  describe('publishGoalsCompletedEvent', () => {
    it('should publish the completed event when the changed goal was the last open goal on an agreed plan', async () => {
      // Arrange
      const context = createMockContext({
        latestAgreementStatus: 'AGREED',
        goals: [makeGoal({ uuid: 'changed', status: 'ACHIEVED' }), makeGoal({ uuid: 'other', status: 'REMOVED' })],
      })

      // Act
      await publishGoalsCompletedEvent(deps, context, 'changed')

      // Assert
      expect(deps.domainEventsService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'arns.sentence.plan.goals.completed',
          additionalInformation: { planUuid: 'plan-uuid-1' },
          personReference: { identifiers: [{ type: 'CRN', value: 'X123456' }] },
        }),
      )
    })

    it('should not publish when the plan is still DRAFT', async () => {
      // Arrange
      const context = createMockContext({
        latestAgreementStatus: 'DRAFT',
        goals: [makeGoal({ uuid: 'changed', status: 'ACHIEVED' })],
      })

      // Act
      await publishGoalsCompletedEvent(deps, context, 'changed')

      // Assert
      expect(deps.domainEventsService.publish).not.toHaveBeenCalled()
    })

    it('should not publish when another goal is still open', async () => {
      // Arrange
      const context = createMockContext({
        goals: [makeGoal({ uuid: 'changed', status: 'ACHIEVED' }), makeGoal({ uuid: 'other', status: 'ACTIVE' })],
      })

      // Act
      await publishGoalsCompletedEvent(deps, context, 'changed')

      // Assert
      expect(deps.domainEventsService.publish).not.toHaveBeenCalled()
    })

    it('should not publish when the crn is missing', async () => {
      // Arrange
      const context = createMockContext({
        crn: null,
        goals: [makeGoal({ uuid: 'changed', status: 'ACHIEVED' })],
      })

      // Act
      await publishGoalsCompletedEvent(deps, context, 'changed')

      // Assert
      expect(deps.domainEventsService.publish).not.toHaveBeenCalled()
    })

    it('should omit planUuid when the plan identifier is not a UUID (MPoP access)', async () => {
      // Arrange
      const context = createMockContext({
        planIdentifier: { type: 'EXTERNAL' },
        goals: [makeGoal({ uuid: 'changed', status: 'ACHIEVED' })],
      })

      // Act
      await publishGoalsCompletedEvent(deps, context, 'changed')

      // Assert
      expect(deps.domainEventsService.publish).toHaveBeenCalledWith(
        expect.not.objectContaining({ additionalInformation: expect.anything() }),
      )
    })
  })

  describe('publishGoalsAddedEvent', () => {
    it('should publish the added event when the new goal is the only open goal on an agreed plan', async () => {
      // Arrange
      const context = createMockContext({
        goals: [makeGoal({ uuid: 'new', status: 'ACTIVE' }), makeGoal({ uuid: 'other', status: 'ACHIEVED' })],
      })

      // Act
      await publishGoalsAddedEvent(deps, context, 'new')

      // Assert
      expect(deps.domainEventsService.publish).toHaveBeenCalledWith(
        expect.objectContaining({
          eventType: 'arns.sentence.plan.goals.added',
          additionalInformation: { planUuid: 'plan-uuid-1' },
          personReference: { identifiers: [{ type: 'CRN', value: 'X123456' }] },
        }),
      )
    })
  })
})
