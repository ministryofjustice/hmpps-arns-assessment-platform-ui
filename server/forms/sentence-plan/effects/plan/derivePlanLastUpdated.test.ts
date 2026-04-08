import { TimelineItem } from '../../../../interfaces/aap-api/dataModel'
import { AgreementStatus, HistoricPlanData, SentencePlanContext } from '../types'
import {
  derivePlanLastUpdated,
  derivePlanLastUpdatedData,
  derivePlanLastUpdatedForHistoric,
} from './derivePlanLastUpdated'

const createMockContext = (
  dataStore: Record<string, unknown> = {},
  requestParams: Record<string, string> = {},
): SentencePlanContext => {
  const data = { ...dataStore }

  return {
    getData: jest.fn((key: string) => data[key]),
    setData: jest.fn((key: string, value: unknown) => {
      data[key] = value
    }),
    getRequestParam: jest.fn((key: string) => requestParams[key]),
  } as unknown as SentencePlanContext
}

const createTimelineItem = (overrides: Partial<TimelineItem> = {}): TimelineItem => ({
  uuid: 'timeline-uuid-1',
  event: 'CUSTOM',
  timestamp: '2024-06-15T10:00:00Z',
  data: {},
  ...overrides,
})

describe('derivePlanLastUpdated', () => {
  describe('derivePlanLastUpdatedData()', () => {
    it('should return false when agreement status is DRAFT', () => {
      // Arrange
      const timeline = [createTimelineItem()]

      // Act
      const result = derivePlanLastUpdatedData(timeline, new Date('2024-06-01'), 'DRAFT')

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(false)
    })

    it('should return false when there is no agreement date', () => {
      // Arrange
      const timeline = [createTimelineItem()]

      // Act
      const result = derivePlanLastUpdatedData(timeline, undefined, 'AGREED')

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(false)
    })

    it('should return false when there are no timeline events', () => {
      // Act
      const result = derivePlanLastUpdatedData([], new Date('2024-06-10T12:00:00Z'), 'AGREED')

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(false)
    })

    it('should return false when timeline is undefined', () => {
      // Act
      const result = derivePlanLastUpdatedData(undefined, new Date('2024-06-10T12:00:00Z'), 'AGREED')

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(false)
    })

    it('should return false when most recent event is before the agreement date', () => {
      // Arrange
      const agreementDate = new Date('2024-06-15T12:00:00Z')
      const timeline = [
        createTimelineItem({ timestamp: '2024-06-10T10:00:00Z' }),
        createTimelineItem({ timestamp: '2024-06-12T10:00:00Z' }),
      ]

      // Act
      const result = derivePlanLastUpdatedData(timeline, agreementDate, 'AGREED')

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(false)
    })

    it('should return true when most recent event is after the agreement date', () => {
      // Arrange
      const agreementDate = new Date('2024-06-15T12:00:00Z')
      const timeline = [
        createTimelineItem({
          timestamp: '2024-06-16T09:00:00Z',
          customData: { updatedBy: 'Moses Hill' },
        }),
      ]

      // Act
      const result = derivePlanLastUpdatedData(timeline, agreementDate, 'AGREED')

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(true)
      expect(result.lastUpdatedDate).toEqual(new Date('2024-06-16T09:00:00Z'))
      expect(result.lastUpdatedByName).toBe('Moses Hill')
    })

    it('should use the most recent event when multiple exist', () => {
      // Arrange
      const agreementDate = new Date('2024-06-15T12:00:00Z')
      const timeline = [
        createTimelineItem({
          timestamp: '2024-06-16T09:00:00Z',
          customData: { createdBy: 'Jane Smith' },
        }),
        createTimelineItem({
          timestamp: '2024-06-17T14:00:00Z',
          customData: { updatedBy: 'Moses Hill' },
        }),
        createTimelineItem({
          timestamp: '2024-06-15T12:00:05Z',
          customData: { createdBy: 'Early User' },
        }),
      ]

      // Act
      const result = derivePlanLastUpdatedData(timeline, agreementDate, 'AGREED')

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(true)
      expect(result.lastUpdatedDate).toEqual(new Date('2024-06-17T14:00:00Z'))
      expect(result.lastUpdatedByName).toBe('Moses Hill')
    })

    it('should fall back to Unknown when no name is available', () => {
      // Arrange
      const agreementDate = new Date('2024-06-15T12:00:00Z')
      const timeline = [
        createTimelineItem({
          timestamp: '2024-06-16T09:00:00Z',
          customData: {},
        }),
      ]

      // Act
      const result = derivePlanLastUpdatedData(timeline, agreementDate, 'AGREED')

      // Assert
      expect(result.lastUpdatedByName).toBe('Unknown')
    })

    it.each<AgreementStatus>(['AGREED', 'UPDATED_AGREED', 'DO_NOT_AGREE', 'UPDATED_DO_NOT_AGREE', 'COULD_NOT_ANSWER'])(
      'should detect updates for %s status',
      status => {
        // Arrange
        const agreementDate = new Date('2024-06-15T12:00:00Z')
        const timeline = [
          createTimelineItem({
            timestamp: '2024-06-20T10:00:00Z',
            customData: { updatedBy: 'Someone' },
          }),
        ]

        // Act
        const result = derivePlanLastUpdatedData(timeline, agreementDate, status)

        // Assert
        expect(result.isUpdatedAfterAgreement).toBe(true)
      },
    )

    it('should filter events to before beforeDate when provided', () => {
      // Arrange
      const agreementDate = new Date('2024-06-15T12:00:00Z')
      const beforeDate = new Date('2024-06-18T00:00:00Z')
      const timeline = [
        createTimelineItem({
          timestamp: '2024-06-17T10:00:00Z',
          customData: { updatedBy: 'Early User' },
        }),
        createTimelineItem({
          timestamp: '2024-06-20T10:00:00Z',
          customData: { updatedBy: 'Late User' },
        }),
      ]

      // Act
      const result = derivePlanLastUpdatedData(timeline, agreementDate, 'AGREED', beforeDate)

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(true)
      expect(result.lastUpdatedByName).toBe('Early User')
      expect(result.lastUpdatedDate).toEqual(new Date('2024-06-17T10:00:00Z'))
    })

    it('should return false when all events are after beforeDate', () => {
      // Arrange
      const agreementDate = new Date('2024-06-15T12:00:00Z')
      const beforeDate = new Date('2024-06-16T00:00:00Z')
      const timeline = [
        createTimelineItem({
          timestamp: '2024-06-20T10:00:00Z',
          customData: { updatedBy: 'Late User' },
        }),
      ]

      // Act
      const result = derivePlanLastUpdatedData(timeline, agreementDate, 'AGREED', beforeDate)

      // Assert
      expect(result.isUpdatedAfterAgreement).toBe(false)
    })
  })

  describe('derivePlanLastUpdated() effect', () => {
    it('should set context data from derived result', () => {
      // Arrange
      const context = createMockContext({
        planTimeline: [
          createTimelineItem({
            timestamp: '2024-06-20T10:00:00Z',
            customData: { updatedBy: 'Moses Hill' },
          }),
        ],
        latestAgreementDate: new Date('2024-06-15T12:00:00Z'),
        latestAgreementStatus: 'AGREED',
      })

      // Act
      derivePlanLastUpdated()(context)

      // Assert
      expect(context.setData).toHaveBeenCalledWith('isUpdatedAfterAgreement', true)
      expect(context.setData).toHaveBeenCalledWith('lastUpdatedDate', new Date('2024-06-20T10:00:00Z'))
      expect(context.setData).toHaveBeenCalledWith('lastUpdatedByName', 'Moses Hill')
    })

    it('should set false when plan was not updated after agreement', () => {
      // Arrange
      const context = createMockContext({
        planTimeline: [],
        latestAgreementDate: new Date('2024-06-15T12:00:00Z'),
        latestAgreementStatus: 'AGREED',
      })

      // Act
      derivePlanLastUpdated()(context)

      // Assert
      expect(context.setData).toHaveBeenCalledWith('isUpdatedAfterAgreement', false)
      expect(context.setData).toHaveBeenCalledWith('lastUpdatedDate', undefined)
      expect(context.setData).toHaveBeenCalledWith('lastUpdatedByName', undefined)
    })
  })

  describe('derivePlanLastUpdatedForHistoric() effect', () => {
    const historicBase: HistoricPlanData = {
      assessment: {} as HistoricPlanData['assessment'],
      goals: [],
      latestAgreementStatus: 'AGREED',
      latestAgreementDate: new Date('2024-06-15T12:00:00Z'),
    }

    it('should merge last-updated data into historic object', () => {
      // Arrange
      const pointInTime = new Date('2024-06-25T00:00:00Z')
      const context = createMockContext(
        {
          historic: { ...historicBase },
          planTimeline: [
            createTimelineItem({
              timestamp: '2024-06-20T10:00:00Z',
              customData: { updatedBy: 'Moses Hill' },
            }),
          ],
        },
        { timestamp: String(pointInTime.getTime()) },
      )

      // Act
      derivePlanLastUpdatedForHistoric()(context)

      // Assert
      expect(context.setData).toHaveBeenCalledWith(
        'historic',
        expect.objectContaining({
          isUpdatedAfterAgreement: true,
          lastUpdatedDate: new Date('2024-06-20T10:00:00Z'),
          lastUpdatedByName: 'Moses Hill',
        }),
      )
    })

    it('should filter events to before the point-in-time', () => {
      // Arrange
      const pointInTime = new Date('2024-06-18T00:00:00Z')
      const context = createMockContext(
        {
          historic: { ...historicBase },
          planTimeline: [
            createTimelineItem({
              timestamp: '2024-06-17T10:00:00Z',
              customData: { updatedBy: 'Early User' },
            }),
            createTimelineItem({
              timestamp: '2024-06-20T10:00:00Z',
              customData: { updatedBy: 'Late User' },
            }),
          ],
        },
        { timestamp: String(pointInTime.getTime()) },
      )

      // Act
      derivePlanLastUpdatedForHistoric()(context)

      // Assert
      expect(context.setData).toHaveBeenCalledWith(
        'historic',
        expect.objectContaining({
          isUpdatedAfterAgreement: true,
          lastUpdatedByName: 'Early User',
        }),
      )
    })

    it('should not set data when historic is not loaded', () => {
      // Arrange
      const context = createMockContext({
        planTimeline: [],
      })

      // Act
      derivePlanLastUpdatedForHistoric()(context)

      // Assert
      expect(context.setData).not.toHaveBeenCalled()
    })
  })
})
