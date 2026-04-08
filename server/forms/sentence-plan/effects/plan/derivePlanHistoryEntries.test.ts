import { TimelineItem } from '../../../../interfaces/aap-api/dataModel'
import { DerivedGoal, DerivedPlanAgreement, PlanHistoryEntry, SentencePlanContext } from '../types'
import { derivePlanHistoryEntries } from './derivePlanHistoryEntries'

const createMockContext = (dataStore: Record<string, unknown> = {}): SentencePlanContext => {
  const data = { ...dataStore }

  return {
    getData: jest.fn((key: string) => data[key]),
    setData: jest.fn((key: string, value: unknown) => {
      data[key] = value
    }),
  } as unknown as SentencePlanContext
}

const createTimelineItem = (overrides: Partial<TimelineItem> = {}): TimelineItem => ({
  uuid: 'timeline-uuid-1',
  event: 'CUSTOM',
  timestamp: '2024-06-15T10:00:00Z',
  data: {},
  ...overrides,
})

const createGoal = (overrides: Partial<DerivedGoal> = {}): DerivedGoal => ({
  uuid: 'goal-uuid-1',
  title: 'Test goal',
  status: 'ACTIVE',
  targetDate: new Date('2025-01-01'),
  statusDate: new Date('2024-06-01'),
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

const createAgreement = (overrides: Partial<DerivedPlanAgreement> = {}): DerivedPlanAgreement => ({
  uuid: 'agreement-uuid-1',
  status: 'AGREED',
  statusDate: new Date('2024-06-10T12:00:00Z'),
  agreementQuestion: 'Do you agree?',
  ...overrides,
})

describe('derivePlanHistoryEntries', () => {
  describe('GOAL_CREATED events', () => {
    it('should map a GOAL_CREATED timeline item to a goal_created entry', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-1',
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-15T10:00:00Z',
          customData: { goalUuid: 'g-1', goalTitle: 'Find housing', createdBy: 'Jane Smith' },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual({
        type: 'goal_created',
        uuid: 'created-tl-1-2024-06-15T10:00:00Z',
        date: new Date('2024-06-15T10:00:00Z'),
        goalUuid: 'g-1',
        goalTitle: 'Find housing',
        createdBy: 'Jane Smith',
      })
    })
  })

  describe('GOAL_ACHIEVED events', () => {
    it('should map a GOAL_ACHIEVED timeline item to a goal_achieved entry', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-2',
          customType: 'GOAL_ACHIEVED',
          timestamp: '2024-07-20T14:30:00Z',
          customData: {
            goalUuid: 'g-2',
            goalTitle: 'Get a job',
            achievedBy: 'John Doe',
            notes: 'Completed successfully',
          },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual({
        type: 'goal_achieved',
        uuid: 'achieved-g-2-2024-07-20T14:30:00Z',
        date: new Date('2024-07-20T14:30:00Z'),
        goalUuid: 'g-2',
        goalTitle: 'Get a job',
        achievedBy: 'John Doe',
        notes: 'Completed successfully',
      })
    })
  })

  describe('GOAL_REMOVED events', () => {
    it('should set isCurrentlyActive to false when goal is not in goals list', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-3',
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T09:00:00Z',
          customData: {
            goalUuid: 'g-3',
            goalTitle: 'Old goal',
            removedBy: 'Supervisor',
            reason: 'No longer relevant',
          },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual(
        expect.objectContaining({
          type: 'goal_removed',
          goalUuid: 'g-3',
          isCurrentlyActive: false,
        }),
      )
    })

    it('should set isCurrentlyActive to true when goal exists with ACTIVE status', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T09:00:00Z',
          customData: { goalUuid: 'g-readded', goalTitle: 'Re-added goal', removedBy: 'Someone', reason: 'Temp' },
        }),
      ]
      const goals: DerivedGoal[] = [createGoal({ uuid: 'g-readded', status: 'ACTIVE' })]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_removed', isCurrentlyActive: true }))
    })

    it('should set isCurrentlyActive to true when goal exists with FUTURE status', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T09:00:00Z',
          customData: { goalUuid: 'g-future', goalTitle: 'Future goal', removedBy: 'Someone', reason: 'Temp' },
        }),
      ]
      const goals: DerivedGoal[] = [createGoal({ uuid: 'g-future', status: 'FUTURE' })]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_removed', isCurrentlyActive: true }))
    })

    it('should set isCurrentlyActive to false when goal exists but has REMOVED status', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T09:00:00Z',
          customData: { goalUuid: 'g-still-removed', goalTitle: 'Still removed', removedBy: 'Someone', reason: 'N/A' },
        }),
      ]
      const goals: DerivedGoal[] = [createGoal({ uuid: 'g-still-removed', status: 'REMOVED' })]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_removed', isCurrentlyActive: false }))
    })

    it('should set isCurrentlyActive to false when goal exists but has ACHIEVED status', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T09:00:00Z',
          customData: { goalUuid: 'g-achieved', goalTitle: 'Achieved goal', removedBy: 'Someone', reason: 'Done' },
        }),
      ]
      const goals: DerivedGoal[] = [createGoal({ uuid: 'g-achieved', status: 'ACHIEVED' })]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_removed', isCurrentlyActive: false }))
    })
  })

  describe('GOAL_READDED events', () => {
    it('should map a GOAL_READDED timeline item to a goal_readded entry', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-4',
          customType: 'GOAL_READDED',
          timestamp: '2024-09-01T11:00:00Z',
          customData: {
            goalUuid: 'g-4',
            goalTitle: 'Re-added goal',
            readdedBy: 'Manager',
            reason: 'Circumstances changed',
          },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual({
        type: 'goal_readded',
        uuid: 'readded-g-4-2024-09-01T11:00:00Z',
        date: new Date('2024-09-01T11:00:00Z'),
        goalUuid: 'g-4',
        goalTitle: 'Re-added goal',
        readdedBy: 'Manager',
        reason: 'Circumstances changed',
      })
    })
  })

  describe('GOAL_UPDATED events', () => {
    it('should map a GOAL_UPDATED timeline item to a goal_updated entry', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-5',
          customType: 'GOAL_UPDATED',
          timestamp: '2024-10-05T16:00:00Z',
          customData: {
            goalUuid: 'g-5',
            goalTitle: 'Updated goal',
            updatedBy: 'Practitioner',
            notes: 'Changed target date',
          },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual({
        type: 'goal_updated',
        uuid: 'updated-g-5-2024-10-05T16:00:00Z',
        date: new Date('2024-10-05T16:00:00Z'),
        goalUuid: 'g-5',
        goalTitle: 'Updated goal',
        updatedBy: 'Practitioner',
        notes: 'Changed target date',
      })
    })
  })

  describe('date sorting', () => {
    it('should sort entries newest first', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-old',
          customType: 'GOAL_CREATED',
          timestamp: '2024-01-01T00:00:00Z',
          customData: { goalUuid: 'g-old', goalTitle: 'Oldest' },
        }),
        createTimelineItem({
          uuid: 'tl-new',
          customType: 'GOAL_CREATED',
          timestamp: '2024-12-01T00:00:00Z',
          customData: { goalUuid: 'g-new', goalTitle: 'Newest' },
        }),
        createTimelineItem({
          uuid: 'tl-mid',
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-01T00:00:00Z',
          customData: { goalUuid: 'g-mid', goalTitle: 'Middle' },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(3)
      expect(entries[0].date).toEqual(new Date('2024-12-01T00:00:00Z'))
      expect(entries[1].date).toEqual(new Date('2024-06-01T00:00:00Z'))
      expect(entries[2].date).toEqual(new Date('2024-01-01T00:00:00Z'))
    })
  })

  describe('plan agreement merging', () => {
    it('should merge plan agreement entries with timeline entries', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-1',
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-15T10:00:00Z',
          customData: { goalUuid: 'g-1', goalTitle: 'A goal' },
        }),
      ]
      const agreements: DerivedPlanAgreement[] = [
        createAgreement({
          uuid: 'agr-1',
          status: 'AGREED',
          statusDate: new Date('2024-06-20T12:00:00Z'),
          createdBy: 'Practitioner',
          notes: 'Plan agreed',
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: agreements, goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(2)
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'agreement', uuid: 'agr-1', status: 'AGREED' }))
      expect(entries[1]).toEqual(expect.objectContaining({ type: 'goal_created', goalUuid: 'g-1' }))
    })

    it('should include agreement detailsNo and detailsCouldNotAnswer fields', () => {
      // Arrange
      const agreements: DerivedPlanAgreement[] = [
        createAgreement({
          uuid: 'agr-2',
          status: 'DO_NOT_AGREE',
          statusDate: new Date('2024-07-01T08:00:00Z'),
          detailsNo: 'Disagree with step 2',
          detailsCouldNotAnswer: undefined,
        }),
      ]
      const context = createMockContext({ planTimeline: [], planAgreements: agreements, goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual(
        expect.objectContaining({
          type: 'agreement',
          status: 'DO_NOT_AGREE',
          detailsNo: 'Disagree with step 2',
          detailsCouldNotAnswer: undefined,
        }),
      )
    })

    it('should sort agreements and timeline entries together by date newest first', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-05-01T00:00:00Z',
          customData: { goalUuid: 'g-1', goalTitle: 'Early goal' },
        }),
        createTimelineItem({
          customType: 'GOAL_ACHIEVED',
          timestamp: '2024-09-01T00:00:00Z',
          customData: { goalUuid: 'g-1', goalTitle: 'Early goal' },
        }),
      ]
      const agreements: DerivedPlanAgreement[] = [createAgreement({ statusDate: new Date('2024-07-01T00:00:00Z') })]
      const context = createMockContext({ planTimeline: timeline, planAgreements: agreements, goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(3)
      expect(entries[0].type).toBe('goal_achieved')
      expect(entries[1].type).toBe('agreement')
      expect(entries[2].type).toBe('goal_created')
    })
  })

  describe('edge cases', () => {
    it('should produce an empty array when timeline and agreements are both empty', () => {
      // Arrange
      const context = createMockContext({ planTimeline: [], planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toEqual([])
    })

    it('should default to empty arrays when data keys are undefined', () => {
      // Arrange
      const context = createMockContext({})

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toEqual([])
    })

    it('should handle timeline items with missing customData by defaulting to empty object', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-01T00:00:00Z',
          customData: undefined,
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual(
        expect.objectContaining({
          type: 'goal_created',
          goalUuid: undefined,
          goalTitle: undefined,
        }),
      )
    })

    it('should skip unknown event types', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'STEP_COMPLETED',
          timestamp: '2024-06-01T00:00:00Z',
          customData: { something: 'irrelevant' },
        }),
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-02T00:00:00Z',
          customData: { goalUuid: 'g-1', goalTitle: 'Real goal' },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0].type).toBe('goal_created')
    })

    it('should skip timeline items with no customType', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({ customType: undefined, timestamp: '2024-06-01T00:00:00Z' }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toEqual([])
    })

    it('should set the result via context.setData with key planHistoryEntries', () => {
      // Arrange
      const context = createMockContext({ planTimeline: [], planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      expect(context.setData).toHaveBeenCalledWith('planHistoryEntries', expect.any(Array))
    })
  })

  describe('goal UUID lookup', () => {
    it('should match removed goal UUID against the correct goal in the goals array', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: { goalUuid: 'g-target', goalTitle: 'Target goal' },
        }),
      ]
      const goals: DerivedGoal[] = [
        createGoal({ uuid: 'g-other', status: 'ACTIVE' }),
        createGoal({ uuid: 'g-target', status: 'ACTIVE' }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_removed', isCurrentlyActive: true }))
    })

    it('should not match when no goal has the removed goalUuid', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: { goalUuid: 'g-missing', goalTitle: 'Gone' },
        }),
      ]
      const goals: DerivedGoal[] = [createGoal({ uuid: 'g-unrelated', status: 'ACTIVE' })]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_removed', isCurrentlyActive: false }))
    })
  })
})
