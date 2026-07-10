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
  targetDate: '2025-01-01T00:00:00.000Z',
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

const createAgreement = (overrides: Partial<DerivedPlanAgreement> = {}): DerivedPlanAgreement => ({
  uuid: 'agreement-uuid-1',
  status: 'AGREED',
  statusDate: '2024-06-10T12:00:00Z',
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
        date: '2024-06-15T10:00:00Z',
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
        date: '2024-07-20T14:30:00Z',
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
        date: '2024-09-01T11:00:00Z',
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
        date: '2024-10-05T16:00:00Z',
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
      expect(entries[0].date).toBe('2024-12-01T00:00:00Z')
      expect(entries[1].date).toBe('2024-06-01T00:00:00Z')
      expect(entries[2].date).toBe('2024-01-01T00:00:00Z')
    })
  })

  describe('plan agreement merging', () => {
    it('should hide create and update entries for a deleted goal', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-create',
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-01T09:00:00Z',
          customData: { goalUuid: 'g-draft-deleted', goalTitle: 'Draft goal', createdBy: 'Jane Smith' },
        }),
        createTimelineItem({
          uuid: 'tl-update',
          customType: 'GOAL_UPDATED',
          timestamp: '2024-06-02T09:00:00Z',
          customData: { goalUuid: 'g-draft-deleted', goalTitle: 'Draft goal', updatedBy: 'Jane Smith' },
        }),
        createTimelineItem({
          uuid: 'tl-delete',
          customType: 'GOAL_DELETED',
          timestamp: '2024-06-03T09:00:00Z',
          customData: { goalUuid: 'g-draft-deleted' },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toEqual([])
    })

    it('should hide create and update entries when the deleted goal UUID is in timeline data', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-create',
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-01T09:00:00Z',
          customData: { goalUuid: 'g-data-deleted', goalTitle: 'Draft goal', createdBy: 'Jane Smith' },
        }),
        createTimelineItem({
          uuid: 'tl-delete',
          customType: 'GOAL_DELETED',
          timestamp: '2024-06-03T09:00:00Z',
          data: { goalUuid: 'g-data-deleted' },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toEqual([])
    })

    it('should keep goal history entries when a goal is removed after the first agreement', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-create',
          customType: 'GOAL_CREATED',
          timestamp: '2024-06-01T09:00:00Z',
          customData: { goalUuid: 'g-agreed-removed', goalTitle: 'Agreed goal', createdBy: 'Jane Smith' },
        }),
        createTimelineItem({
          uuid: 'tl-remove',
          customType: 'GOAL_REMOVED',
          timestamp: '2024-06-15T09:00:00Z',
          customData: {
            goalUuid: 'g-agreed-removed',
            goalTitle: 'Agreed goal',
            removedBy: 'Jane Smith',
            reason: 'No longer needed',
          },
        }),
      ]
      const agreements: DerivedPlanAgreement[] = [
        createAgreement({
          uuid: 'agr-1',
          status: 'AGREED',
          statusDate: '2024-06-10T12:00:00Z',
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: agreements, goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(3)
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_removed', goalUuid: 'g-agreed-removed' }))
      expect(entries[1]).toEqual(expect.objectContaining({ type: 'agreement', uuid: 'agr-1' }))
      expect(entries[2]).toEqual(expect.objectContaining({ type: 'goal_created', goalUuid: 'g-agreed-removed' }))
    })

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
          statusDate: '2024-06-20T12:00:00Z',
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
          statusDate: '2024-07-01T08:00:00Z',
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
      const agreements: DerivedPlanAgreement[] = [createAgreement({ statusDate: '2024-07-01T00:00:00Z' })]
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

  describe('goal context enrichment', () => {
    it('should attach the current goal snapshot to a goal_achieved entry', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_ACHIEVED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: { goalUuid: 'g-1', goalTitle: 'Find housing', achievedBy: 'Jane' },
        }),
      ]
      const goals: DerivedGoal[] = [
        createGoal({
          uuid: 'g-1',
          status: 'ACHIEVED',
          targetDate: '2025-01-01',
          statusDate: '2024-08-01',
          areaOfNeedLabel: 'Accommodation',
          relatedAreasOfNeedLabels: ['Health'],
          steps: [
            {
              uuid: 's-1',
              actor: 'person_on_probation',
              actorLabel: 'Joan',
              description: 'Find a flat',
              status: 'COMPLETED',
              statusDate: '2024-07-15',
            },
          ],
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(
        expect.objectContaining({
          type: 'goal_achieved',
          goalStatus: 'ACHIEVED',
          targetDate: '2025-01-01',
          statusDate: '2024-08-01',
          areaOfNeedLabel: 'Accommodation',
          relatedAreasOfNeedLabels: ['Health'],
          steps: [{ actor: 'Joan', description: 'Find a flat', status: 'COMPLETED' }],
        }),
      )
    })

    it('should attach goal status FUTURE to a goal_created entry when goal is a future goal', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: { goalUuid: 'g-future', goalTitle: 'Future plan', createdBy: 'Jane' },
        }),
      ]
      const goals: DerivedGoal[] = [createGoal({ uuid: 'g-future', status: 'FUTURE' })]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_created', goalStatus: 'FUTURE' }))
    })

    it('should leave goal context undefined when the goal is not in the current goals list', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: { goalUuid: 'g-missing', goalTitle: 'Lost goal' },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).not.toHaveProperty('goalStatus')
      expect(entries[0]).not.toHaveProperty('targetDate')
      expect(entries[0]).not.toHaveProperty('steps')
    })
  })

  describe('snapshot embedded in customData', () => {
    it('should use the snapshot in customData rather than the current goal state', () => {
      // Arrange
      // The current goal has been renamed and re-achieved since the original creation
      // event. The card for the GOAL_CREATED event should still show the original
      // title and steps from the snapshot captured at write time.
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-01-01T00:00:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Original title',
            createdBy: 'Jane',
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-01-01T00:00:00.000Z',
              targetDate: '2025-01-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [{ actor: 'person_on_probation', description: 'Original step', status: 'NOT_STARTED' }],
            },
          },
        }),
      ]
      const currentGoalRenamed: DerivedGoal = createGoal({
        uuid: 'g-1',
        title: 'Renamed title',
        status: 'ACHIEVED',
        steps: [
          {
            uuid: 's-2',
            actor: 'person_on_probation',
            actorLabel: 'Joan',
            description: 'New step after rename',
            status: 'COMPLETED',
            statusDate: '2024-06-01',
          },
        ],
      })
      const context = createMockContext({
        planTimeline: timeline,
        planAgreements: [],
        goals: [currentGoalRenamed],
        areasOfNeed: [{ slug: 'accommodation', text: 'Accommodation' }],
        actorLabels: { person_on_probation: 'Joan' },
        caseData: { name: { forename: 'Joan' } },
      })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(
        expect.objectContaining({
          type: 'goal_created',
          goalStatus: 'ACTIVE',
          areaOfNeedLabel: 'Accommodation',
          steps: [{ actor: 'Joan', description: 'Original step', status: 'NOT_STARTED' }],
        }),
      )
    })

    it('should fall back to the current goal state when no snapshot is in customData (legacy events)', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_ACHIEVED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: { goalUuid: 'g-1', goalTitle: 'Get a job', achievedBy: 'Jane' },
        }),
      ]
      const currentGoal = createGoal({ uuid: 'g-1', status: 'ACHIEVED', areaOfNeedLabel: 'Employment' })
      const context = createMockContext({
        planTimeline: timeline,
        planAgreements: [],
        goals: [currentGoal],
      })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(
        expect.objectContaining({ type: 'goal_achieved', goalStatus: 'ACHIEVED', areaOfNeedLabel: 'Employment' }),
      )
    })

    it('should still compute isCurrentlyActive from current goals even when snapshot exists', () => {
      // Arrange
      // The goal at the time of removal was REMOVED — but it has since been
      // re-added. isCurrentlyActive should reflect *now*, not the event time.
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_REMOVED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Removed then re-added',
            goalSnapshot: {
              status: 'REMOVED',
              statusDate: '2024-08-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [],
            },
          },
        }),
      ]
      const currentGoalReadded = createGoal({ uuid: 'g-1', status: 'ACTIVE' })
      const context = createMockContext({
        planTimeline: timeline,
        planAgreements: [],
        goals: [currentGoalReadded],
      })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(
        expect.objectContaining({ type: 'goal_removed', isCurrentlyActive: true, goalStatus: 'REMOVED' }),
      )
    })

    it('should set currentGoalStatus from Data(goals), keeping it independent of the snapshot status', () => {
      // Arrange
      // The "Goal created" event captured the goal as ACTIVE, but it has since
      // been marked ACHIEVED. The card text continues to read from the snapshot
      // (`goalStatus: 'ACTIVE'`) — that's history — but `currentGoalStatus`
      // mirrors the live state so the View-goal link can route to the right page.
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Find housing',
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-08-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [],
            },
          },
        }),
      ]
      const currentGoalAchieved = createGoal({ uuid: 'g-1', status: 'ACHIEVED' })
      const context = createMockContext({
        planTimeline: timeline,
        planAgreements: [],
        goals: [currentGoalAchieved],
      })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(
        expect.objectContaining({ type: 'goal_created', goalStatus: 'ACTIVE', currentGoalStatus: 'ACHIEVED' }),
      )
    })

    it('should leave currentGoalStatus undefined when the goal no longer exists', () => {
      // Arrange — goal hard-deleted; nothing in Data(goals) for this uuid.
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_CREATED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: {
            goalUuid: 'g-gone',
            goalTitle: 'Find housing',
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-08-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [],
            },
          },
        }),
      ]
      const context = createMockContext({ planTimeline: timeline, planAgreements: [], goals: [] })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(expect.objectContaining({ type: 'goal_created', goalStatus: 'ACTIVE' }))
      expect((entries[0] as { currentGoalStatus?: string }).currentGoalStatus).toBeUndefined()
    })

    it('should merge an initial-step-add events steps into the matching GOAL_CREATED snapshot and hide the update event', () => {
      // Arrange
      // The user created a goal (empty step list) and immediately added steps
      // via the add-steps page in the same journey. The plan-history should
      // show a single "Goal created" entry whose card includes those steps.
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-create',
          customType: 'GOAL_CREATED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Apply for custody',
            createdBy: 'Jane',
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-08-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [],
            },
          },
        }),
        createTimelineItem({
          uuid: 'tl-initial-steps',
          customType: 'GOAL_UPDATED',
          timestamp: '2024-08-01T00:01:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Apply for custody',
            updatedBy: 'Jane',
            isInitialStepAdd: true,
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-08-01T00:01:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [{ actor: 'person_on_probation', description: 'Find a flat', status: 'IN_PROGRESS' }],
            },
          },
        }),
      ]
      const context = createMockContext({
        planTimeline: timeline,
        planAgreements: [],
        goals: [],
        areasOfNeed: [{ slug: 'accommodation', text: 'Accommodation' }],
        caseData: { name: { forename: 'Joan' } },
      })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(1)
      expect(entries[0]).toEqual(
        expect.objectContaining({
          type: 'goal_created',
          steps: [{ actor: 'Joan', description: 'Find a flat', status: 'IN_PROGRESS' }],
        }),
      )
    })

    it('should not affect later non-initial GOAL_UPDATED events when an initial step-add exists', () => {
      // Arrange
      // Initial creation + immediate step-add → merged. A later goal edit (not
      // flagged isInitialStepAdd) is a real history entry on its own.
      const timeline: TimelineItem[] = [
        createTimelineItem({
          uuid: 'tl-create',
          customType: 'GOAL_CREATED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Apply for custody',
            createdBy: 'Jane',
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-08-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [],
            },
          },
        }),
        createTimelineItem({
          uuid: 'tl-initial-steps',
          customType: 'GOAL_UPDATED',
          timestamp: '2024-08-01T00:01:00Z',
          customData: {
            goalUuid: 'g-1',
            isInitialStepAdd: true,
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-08-01T00:01:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [{ actor: 'person_on_probation', description: 'Find a flat', status: 'NOT_STARTED' }],
            },
          },
        }),
        createTimelineItem({
          uuid: 'tl-later-edit',
          customType: 'GOAL_UPDATED',
          timestamp: '2024-09-01T00:00:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Apply for custody',
            updatedBy: 'Jane',
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-09-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [
                { actor: 'person_on_probation', description: 'Find a flat', status: 'IN_PROGRESS' },
                { actor: 'person_on_probation', description: 'Sign tenancy', status: 'NOT_STARTED' },
              ],
            },
          },
        }),
      ]
      const context = createMockContext({
        planTimeline: timeline,
        planAgreements: [],
        goals: [],
        areasOfNeed: [{ slug: 'accommodation', text: 'Accommodation' }],
        caseData: { name: { forename: 'Joan' } },
      })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries).toHaveLength(2)
      expect(entries[0]).toEqual(
        expect.objectContaining({
          type: 'goal_updated',
          steps: [
            { actor: 'Joan', description: 'Find a flat', status: 'IN_PROGRESS' },
            { actor: 'Joan', description: 'Sign tenancy', status: 'NOT_STARTED' },
          ],
        }),
      )
      expect(entries[1]).toEqual(
        expect.objectContaining({
          type: 'goal_created',
          steps: [{ actor: 'Joan', description: 'Find a flat', status: 'NOT_STARTED' }],
        }),
      )
    })

    it('should resolve person_on_probation actor slug to the persons forename', () => {
      // Arrange
      const timeline: TimelineItem[] = [
        createTimelineItem({
          customType: 'GOAL_UPDATED',
          timestamp: '2024-08-01T00:00:00Z',
          customData: {
            goalUuid: 'g-1',
            goalTitle: 'Find housing',
            updatedBy: 'Jane',
            goalSnapshot: {
              status: 'ACTIVE',
              statusDate: '2024-08-01T00:00:00.000Z',
              areaOfNeed: 'accommodation',
              relatedAreasOfNeed: [],
              steps: [{ actor: 'person_on_probation', description: 'Look at flats', status: 'NOT_STARTED' }],
            },
          },
        }),
      ]
      const context = createMockContext({
        planTimeline: timeline,
        planAgreements: [],
        goals: [],
        caseData: { name: { forename: 'Sam' } },
      })

      // Act
      derivePlanHistoryEntries()(context)

      // Assert
      const entries = (context.setData as jest.Mock).mock.calls[0][1] as PlanHistoryEntry[]
      expect(entries[0]).toEqual(
        expect.objectContaining({
          steps: [{ actor: 'Sam', description: 'Look at flats', status: 'NOT_STARTED' }],
        }),
      )
    })
  })
})
