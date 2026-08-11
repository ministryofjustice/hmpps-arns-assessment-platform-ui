import { resolveCriminogenicNeedsData } from './criminogenicNeeds'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { mapArnsNeedsToCriminogenicNeeds } from '../../../../utils/arnsApiMapper'
import { mapHandoverToCriminogenicNeeds } from '../../../../utils/handoverApiMapper'
import { CriminogenicNeedsData } from '../../../../interfaces/coordinator-api/entityAssessment'
import { AssessmentNeedsDto } from '../../../../interfaces/arns-api/assessmentNeeds'

jest.mock('../../../../utils/arnsApiMapper')
jest.mock('../../../../utils/handoverApiMapper')

const mockMapArns = mapArnsNeedsToCriminogenicNeeds as jest.Mock
const mockMapHandover = mapHandoverToCriminogenicNeeds as jest.Mock

const createMockDeps = (getCriminogenicNeeds = jest.fn()): SentencePlanEffectsDeps =>
  ({ arnsApi: { getCriminogenicNeeds } }) as unknown as SentencePlanEffectsDeps

const createMockContext = (
  overrides: {
    session?: Record<string, unknown>
    user?: { token?: string }
  } = {},
): SentencePlanContext =>
  ({
    getSession: jest.fn(() => overrides.session ?? {}),
    getState: jest.fn((key: string) => (key === 'user' ? overrides.user : undefined)),
  }) as unknown as SentencePlanContext

describe('criminogenicNeeds', () => {
  describe('resolveCriminogenicNeedsData()', () => {
    beforeEach(() => {
      jest.clearAllMocks()
    })

    it('should fetch from the ARNS API with the user token and map the result for MPoP users', async () => {
      const arnsDto = { identifiedNeeds: [] } as unknown as AssessmentNeedsDto
      const mapped = {} as CriminogenicNeedsData
      const getCriminogenicNeeds = jest.fn().mockResolvedValue(arnsDto)
      mockMapArns.mockReturnValue(mapped)
      const deps = createMockDeps(getCriminogenicNeeds)
      const context = createMockContext({
        session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
        user: { token: 'user-token' },
      })

      const result = await resolveCriminogenicNeedsData(deps, context, 'X123456')

      expect(getCriminogenicNeeds).toHaveBeenCalledWith('X123456', 'user-token')
      expect(mockMapArns).toHaveBeenCalledWith(arnsDto)
      expect(mockMapHandover).not.toHaveBeenCalled()
      expect(result).toBe(mapped)
    })

    it('should throw when the MPoP user has no token', async () => {
      const getCriminogenicNeeds = jest.fn()
      const deps = createMockDeps(getCriminogenicNeeds)
      const context = createMockContext({
        session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
        user: undefined,
      })

      await expect(resolveCriminogenicNeedsData(deps, context, 'X123456')).rejects.toThrow(
        'Cannot load criminogenic needs for MPoP user: missing user token',
      )
      expect(getCriminogenicNeeds).not.toHaveBeenCalled()
    })

    it('should throw when the MPoP user has no crn', async () => {
      const getCriminogenicNeeds = jest.fn()
      const deps = createMockDeps(getCriminogenicNeeds)
      const context = createMockContext({
        session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
        user: { token: 'user-token' },
      })

      await expect(resolveCriminogenicNeedsData(deps, context, undefined)).rejects.toThrow(
        'Cannot load criminogenic needs for MPoP user: missing crn',
      )
      expect(getCriminogenicNeeds).not.toHaveBeenCalled()
    })

    it('should map handover data and not call the ARNS API for OASys users', async () => {
      const handoverNeeds = { accommodation: { accOtherWeightedScore: '4' } }
      const mapped = {} as CriminogenicNeedsData
      mockMapHandover.mockReturnValue(mapped)
      const getCriminogenicNeeds = jest.fn()
      const deps = createMockDeps(getCriminogenicNeeds)
      const context = createMockContext({
        session: {
          sessionDetails: { accessType: 'OASYS' },
          handoverContext: { criminogenicNeedsData: handoverNeeds },
        },
      })

      const result = await resolveCriminogenicNeedsData(deps, context, 'X123456')

      expect(mockMapHandover).toHaveBeenCalledWith(handoverNeeds)
      expect(getCriminogenicNeeds).not.toHaveBeenCalled()
      expect(result).toBe(mapped)
    })
  })
})
