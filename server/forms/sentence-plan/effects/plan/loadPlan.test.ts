import { loadPlan } from './loadPlan'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { IdentifierType } from '../../../../interfaces/aap-api/identifier'

const planUuid = 'plan-uuid-123'

const crnIdentifier = {
  type: 'EXTERNAL' as const,
  identifier: 'X123456',
  identifierType: IdentifierType.CRN,
  assessmentType: 'SENTENCE_PLAN',
}

const assessment = { assessmentUuid: planUuid }

const createMockDeps = (
  overrides: { executeQuery?: jest.Mock; getVersionsByEntityId?: jest.Mock } = {},
): SentencePlanEffectsDeps =>
  ({
    api: { executeQuery: overrides.executeQuery ?? jest.fn().mockResolvedValue(assessment) },
    coordinatorApi: { getVersionsByEntityId: overrides.getVersionsByEntityId ?? jest.fn().mockResolvedValue({}) },
  }) as unknown as SentencePlanEffectsDeps

const createMockContext = (planIdentifier: unknown): SentencePlanContext => {
  const data: Record<string, unknown> = {}

  return {
    getState: jest.fn(() => ({ id: 'user-1', name: 'Test User' })),
    getSession: jest.fn(() => ({ sessionDetails: { planIdentifier } })),
    getData: jest.fn((key: string) => data[key]),
    setData: jest.fn((key: string, value: unknown) => {
      data[key] = value
    }),
  } as unknown as SentencePlanContext
}

describe('loadPlan', () => {
  describe('CRN access', () => {
    it('loads the plan when it still has a live OASys association', async () => {
      const context = createMockContext(crnIdentifier)

      await loadPlan(createMockDeps())(context)

      expect(context.getData('assessmentUuid')).toBe(planUuid)
    })

    it('does not load a plan whose OASys associations have all been soft-deleted', async () => {
      const context = createMockContext(crnIdentifier)
      const getVersionsByEntityId = jest.fn().mockRejectedValue({ responseStatus: 404 })

      await expect(loadPlan(createMockDeps({ getVersionsByEntityId }))(context)).rejects.toMatchObject({
        status: 404,
        message: 'Sentence plan not found',
      })
      expect(context.getData('assessment')).toBeUndefined()
    })

    it('fails closed with the original error when the Coordinator is unavailable', async () => {
      const context = createMockContext(crnIdentifier)
      const coordinatorError = { responseStatus: 500, message: 'Internal Server Error' }
      const getVersionsByEntityId = jest.fn().mockRejectedValue(coordinatorError)

      await expect(loadPlan(createMockDeps({ getVersionsByEntityId }))(context)).rejects.toBe(coordinatorError)
      expect(context.getData('assessment')).toBeUndefined()
    })
  })

  describe('OASys handover access', () => {
    it('loads the plan without checking OASys associations, as the handover has already resolved them', async () => {
      const context = createMockContext({ type: 'UUID' as const, uuid: planUuid })
      const getVersionsByEntityId = jest.fn()

      await loadPlan(createMockDeps({ getVersionsByEntityId }))(context)

      expect(context.getData('assessmentUuid')).toBe(planUuid)
      expect(getVersionsByEntityId).not.toHaveBeenCalled()
    })
  })
})
