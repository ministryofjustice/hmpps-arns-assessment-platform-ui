import { resolveCriminogenicNeedsData } from './criminogenicNeeds'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'
import { mapArnsNeedsToCriminogenicNeeds } from '../../../../utils/arnsApiMapper'
import { mapArnsIntegrationNeedsToCriminogenicNeeds } from '../../../../utils/arnsIntegrationMapper'
import { CriminogenicNeedsData } from '../../../../interfaces/coordinator-api/entityAssessment'
import { AssessmentNeedsDto } from '../../../../interfaces/arns-api/assessmentNeeds'
import { AssessmentNeedsDetailsDto } from '../../../../interfaces/arns-api/assessmentNeedsDetails'

jest.mock('../../../../utils/arnsApiMapper')
jest.mock('../../../../utils/arnsIntegrationMapper')

const mockMapArns = mapArnsNeedsToCriminogenicNeeds as jest.Mock
const mockMapArnsIntegration = mapArnsIntegrationNeedsToCriminogenicNeeds as jest.Mock

const createMockDeps = (
  overrides: { getCriminogenicNeeds?: jest.Mock; getCriminogenicNeedsDetails?: jest.Mock } = {},
): SentencePlanEffectsDeps =>
  ({
    arnsApi: {
      getCriminogenicNeeds: overrides.getCriminogenicNeeds ?? jest.fn(),
      getCriminogenicNeedsDetails: overrides.getCriminogenicNeedsDetails ?? jest.fn(),
    },
  }) as unknown as SentencePlanEffectsDeps

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

    it('should fetch from the ARNS assessment endpoint with the user token and map the result for MPoP users', async () => {
      const arnsDto = { identifiedNeeds: [] } as unknown as AssessmentNeedsDto
      const mapped = {} as CriminogenicNeedsData
      const getCriminogenicNeeds = jest.fn().mockResolvedValue(arnsDto)
      mockMapArns.mockReturnValue(mapped)
      const deps = createMockDeps({ getCriminogenicNeeds })
      const context = createMockContext({
        session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
        user: { token: 'user-token' },
      })

      const result = await resolveCriminogenicNeedsData(deps, context, 'X123456')

      expect(getCriminogenicNeeds).toHaveBeenCalledWith('X123456', 'user-token')
      expect(mockMapArns).toHaveBeenCalledWith(arnsDto)
      expect(mockMapArnsIntegration).not.toHaveBeenCalled()
      expect(result).toBe(mapped)
    })

    it('should throw an error when the MPoP user has no token', async () => {
      const getCriminogenicNeeds = jest.fn()
      const deps = createMockDeps({ getCriminogenicNeeds })
      const context = createMockContext({
        session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
        user: undefined,
      })

      await expect(resolveCriminogenicNeedsData(deps, context, 'X123456')).rejects.toThrow(
        'Cannot load criminogenic needs for MPoP user: missing user token',
      )
      expect(getCriminogenicNeeds).not.toHaveBeenCalled()
    })

    it('should throw an error when the MPoP user has no crn', async () => {
      const getCriminogenicNeeds = jest.fn()
      const deps = createMockDeps({ getCriminogenicNeeds })
      const context = createMockContext({
        session: { sessionDetails: { accessType: 'HMPPS_AUTH' } },
        user: { token: 'user-token' },
      })

      await expect(resolveCriminogenicNeedsData(deps, context, undefined)).rejects.toThrow(
        'Cannot load criminogenic needs for MPoP user: missing crn',
      )
      expect(getCriminogenicNeeds).not.toHaveBeenCalled()
    })

    it('should fetch from the ARNS integration endpoint with the handover CRN and map the result for OASys users', async () => {
      const detailsDto = { needs: [] } as unknown as AssessmentNeedsDetailsDto
      const mapped = {} as CriminogenicNeedsData
      const getCriminogenicNeedsDetails = jest.fn().mockResolvedValue(detailsDto)
      mockMapArnsIntegration.mockReturnValue(mapped)
      const deps = createMockDeps({ getCriminogenicNeedsDetails })
      const context = createMockContext({
        session: {
          sessionDetails: { accessType: 'OASYS' },
          handoverContext: { subject: { crn: 'X654321' } },
        },
      })

      // A different CRN is passed in to prove the handover CRN is used
      const result = await resolveCriminogenicNeedsData(deps, context, 'route-param-crn')

      // Assert
      expect(getCriminogenicNeedsDetails).toHaveBeenCalledWith('X654321')
      expect(mockMapArnsIntegration).toHaveBeenCalledWith(detailsDto)
      expect(mockMapArns).not.toHaveBeenCalled()
      expect(result).toBe(mapped)
    })

    it('should return null without calling the API when an OASys session has no handover CRN', async () => {
      const getCriminogenicNeedsDetails = jest.fn()
      const deps = createMockDeps({ getCriminogenicNeedsDetails })
      const context = createMockContext({
        session: { sessionDetails: { accessType: 'OASYS' }, handoverContext: { subject: {} } },
      })

      const result = await resolveCriminogenicNeedsData(deps, context, 'X123456')

      expect(result).toBeNull()
      expect(getCriminogenicNeedsDetails).not.toHaveBeenCalled()
      expect(mockMapArnsIntegration).not.toHaveBeenCalled()
    })
  })
})
