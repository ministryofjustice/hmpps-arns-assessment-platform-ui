import { loadHistoricPlan } from './loadHistoricPlan'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

const planUuid = 'plan-uuid-123'

const createMockDeps = (executeQuery = jest.fn()): SentencePlanEffectsDeps =>
  ({
    api: { executeQuery },
  }) as unknown as SentencePlanEffectsDeps

const createMockContext = (timestamp: string): SentencePlanContext => {
  const data: Record<string, unknown> = {
    assessmentUuid: planUuid,
  }

  return {
    getState: jest.fn(() => ({ id: 'user-1', name: 'Test User' })),
    getRequestParam: jest.fn(() => timestamp),
    getData: jest.fn((key: string) => data[key]),
    setData: jest.fn((key: string, value: unknown) => {
      data[key] = value
    }),
    getSession: jest.fn(() => ({
      sessionDetails: {
        planIdentifier: { type: 'UUID', uuid: planUuid },
      },
    })),
  } as unknown as SentencePlanContext
}

describe('loadHistoricPlan', () => {
  describe('invalid URL params', () => {
    it('returns 404 for an alphabetical timestamp', async () => {
      const executeQuery = jest.fn()
      const context = createMockContext('abc')

      await expect(loadHistoricPlan(createMockDeps(executeQuery))(context)).rejects.toMatchObject({
        status: 404,
        message: 'Historic sentence plan not found',
      })

      expect(executeQuery).not.toHaveBeenCalled()
    })

    it('returns 404 for an alphanumeric timestamp', async () => {
      const executeQuery = jest.fn()
      const context = createMockContext('abc123')

      await expect(loadHistoricPlan(createMockDeps(executeQuery))(context)).rejects.toMatchObject({
        status: 404,
        message: 'Historic sentence plan not found',
      })

      expect(executeQuery).not.toHaveBeenCalled()
    })

    it('returns 404 for an invalid numeric timestamp', async () => {
      const executeQuery = jest.fn().mockRejectedValue({
        responseStatus: 400,
        data: {
          developerMessage: 'Timestamp cannot be before the assessment created date',
        },
      })

      const context = createMockContext('123456789') // January 1970

      await expect(loadHistoricPlan(createMockDeps(executeQuery))(context)).rejects.toMatchObject({
        status: 404,
        message: 'Historic sentence plan not found',
      })

      expect(executeQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'AssessmentVersionQuery',
        }),
      )
    })

    it('returns 404 for an empty timestamp', async () => {
      const executeQuery = jest.fn()
      const context = createMockContext('')

      await expect(loadHistoricPlan(createMockDeps(executeQuery))(context)).rejects.toMatchObject({
        status: 404,
        message: 'Historic sentence plan not found',
      })

      expect(executeQuery).not.toHaveBeenCalled()
    })
  })

  it('preserves unexpected API errors', async () => {
    const apiError = {
      responseStatus: 500,
      message: 'Internal Server Error',
    }

    const executeQuery = jest.fn().mockRejectedValue(apiError)
    const context = createMockContext('1700000000000')

    await expect(loadHistoricPlan(createMockDeps(executeQuery))(context)).rejects.toBe(apiError)
  })
})
