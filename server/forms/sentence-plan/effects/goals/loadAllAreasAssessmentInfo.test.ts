import { loadAllAreasAssessmentInfo } from './loadAllAreasAssessmentInfo'
import { canAccessSanInfo } from '../helpers'
import { resolveCriminogenicNeedsData } from './criminogenicNeeds'
import { transformAssessmentData } from '../../../../utils/assessmentUtils'
import { SentencePlanContext, SentencePlanEffectsDeps } from '../types'

jest.mock('../helpers')
jest.mock('./criminogenicNeeds')
jest.mock('../../../../utils/assessmentUtils')
jest.mock('../../../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}))

const mockCanAccessSanInfo = canAccessSanInfo as jest.Mock
const mockResolveCriminogenicNeedsData = resolveCriminogenicNeedsData as jest.Mock
const mockTransformAssessmentData = transformAssessmentData as jest.Mock

const createMockDeps = (getEntityAssessment = jest.fn()): SentencePlanEffectsDeps =>
  ({
    coordinatorApi: { getEntityAssessment },
    arnsApi: { getCriminogenicNeeds: jest.fn() },
  }) as unknown as SentencePlanEffectsDeps

const createMockContext = (
  overrides: {
    data?: Record<string, unknown>
    session?: Record<string, unknown>
  } = {},
): SentencePlanContext =>
  ({
    getData: jest.fn((key: string) => overrides.data?.[key]),
    getSession: jest.fn(() => overrides.session ?? {}),
    getState: jest.fn(),
    setData: jest.fn(),
  }) as unknown as SentencePlanContext

describe('loadAllAreasAssessmentInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockTransformAssessmentData.mockReturnValue([])
    mockResolveCriminogenicNeedsData.mockResolvedValue(null)
  })

  it('should load assessment info for MPoP users even without handover criminogenic needs data', async () => {
    mockCanAccessSanInfo.mockReturnValue(true)
    const getEntityAssessment = jest.fn().mockResolvedValue({ sanAssessmentData: {}, lastUpdatedTimestampSAN: null })
    const deps = createMockDeps(getEntityAssessment)
    const context = createMockContext({
      data: { assessmentUuid: 'assessment-uuid' },
      session: { sessionDetails: { accessType: 'HMPPS_AUTH' }, caseDetails: { crn: 'X123456' } },
    })

    await loadAllAreasAssessmentInfo(deps)(context)

    expect(getEntityAssessment).toHaveBeenCalledWith('assessment-uuid')
    expect(mockResolveCriminogenicNeedsData).toHaveBeenCalledWith(deps, context, 'X123456')
    expect(context.setData).toHaveBeenCalledWith('allAreasAssessmentStatus', 'success')
  })

  it('should set the error state for OASys users when handover criminogenic needs data is missing', async () => {
    mockCanAccessSanInfo.mockReturnValue(true)
    const getEntityAssessment = jest.fn()
    const deps = createMockDeps(getEntityAssessment)
    const context = createMockContext({
      data: { assessmentUuid: 'assessment-uuid' },
      session: { sessionDetails: { accessType: 'OASYS' }, caseDetails: { crn: 'X123456' } },
    })

    await loadAllAreasAssessmentInfo(deps)(context)

    expect(getEntityAssessment).not.toHaveBeenCalled()
    expect(context.setData).toHaveBeenCalledWith('allAreasAssessmentStatus', 'error')
  })

  it('should set the error state when resolving criminogenic needs fails', async () => {
    mockCanAccessSanInfo.mockReturnValue(true)
    mockResolveCriminogenicNeedsData.mockRejectedValue(new Error('ARNS API 403'))
    const getEntityAssessment = jest.fn().mockResolvedValue({ sanAssessmentData: {}, lastUpdatedTimestampSAN: null })
    const deps = createMockDeps(getEntityAssessment)
    const context = createMockContext({
      data: { assessmentUuid: 'assessment-uuid' },
      session: { sessionDetails: { accessType: 'HMPPS_AUTH' }, caseDetails: { crn: 'X123456' } },
    })

    await loadAllAreasAssessmentInfo(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('allAreasAssessmentStatus', 'error')
  })

  it('should set the unavailable state when the user cannot access SAN info', async () => {
    mockCanAccessSanInfo.mockReturnValue(false)
    const deps = createMockDeps()
    const context = createMockContext()

    await loadAllAreasAssessmentInfo(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('allAreasAssessmentStatus', 'unavailable')
  })
})
