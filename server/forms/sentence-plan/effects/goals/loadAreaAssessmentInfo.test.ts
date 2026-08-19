import { loadAreaAssessmentInfo } from './loadAreaAssessmentInfo'
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

describe('loadAreaAssessmentInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockTransformAssessmentData.mockReturnValue([])
    mockResolveCriminogenicNeedsData.mockResolvedValue(null)
  })

  it('should load area assessment info for MPoP users even without handover criminogenic needs data', async () => {
    mockCanAccessSanInfo.mockReturnValue(true)
    mockTransformAssessmentData.mockReturnValue([{ goalRoute: 'accommodation' }])
    const getEntityAssessment = jest.fn().mockResolvedValue({ sanAssessmentData: {} })
    const deps = createMockDeps(getEntityAssessment)
    const context = createMockContext({
      data: { assessmentUuid: 'assessment-uuid', currentAreaOfNeed: { slug: 'accommodation' } },
      session: { sessionDetails: { accessType: 'HMPPS_AUTH' }, caseDetails: { crn: 'X123456' } },
    })

    await loadAreaAssessmentInfo(deps)(context)

    expect(getEntityAssessment).toHaveBeenCalledWith('assessment-uuid')
    expect(mockResolveCriminogenicNeedsData).toHaveBeenCalledWith(deps, context, 'X123456')
    expect(context.setData).toHaveBeenCalledWith('currentAreaAssessment', { goalRoute: 'accommodation' })
    expect(context.setData).toHaveBeenCalledWith('currentAreaAssessmentStatus', 'success')
  })

  it('should set the error state for OASys users when handover criminogenic needs data is missing', async () => {
    mockCanAccessSanInfo.mockReturnValue(true)
    const getEntityAssessment = jest.fn()
    const deps = createMockDeps(getEntityAssessment)
    const context = createMockContext({
      data: { assessmentUuid: 'assessment-uuid', currentAreaOfNeed: { slug: 'accommodation' } },
      session: { sessionDetails: { accessType: 'OASYS' }, caseDetails: { crn: 'X123456' } },
    })

    await loadAreaAssessmentInfo(deps)(context)

    expect(getEntityAssessment).not.toHaveBeenCalled()
    expect(context.setData).toHaveBeenCalledWith('currentAreaAssessmentStatus', 'error')
  })

  it('should set the error state when resolving criminogenic needs fails', async () => {
    mockCanAccessSanInfo.mockReturnValue(true)
    mockResolveCriminogenicNeedsData.mockRejectedValue(new Error('ARNS API 403'))
    const getEntityAssessment = jest.fn().mockResolvedValue({ sanAssessmentData: {} })
    const deps = createMockDeps(getEntityAssessment)
    const context = createMockContext({
      data: { assessmentUuid: 'assessment-uuid', currentAreaOfNeed: { slug: 'accommodation' } },
      session: { sessionDetails: { accessType: 'HMPPS_AUTH' }, caseDetails: { crn: 'X123456' } },
    })

    await loadAreaAssessmentInfo(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('currentAreaAssessmentStatus', 'error')
  })

  it('should set the unavailable state when the user cannot access SAN info', async () => {
    mockCanAccessSanInfo.mockReturnValue(false)
    const deps = createMockDeps()
    const context = createMockContext()

    await loadAreaAssessmentInfo(deps)(context)

    expect(context.setData).toHaveBeenCalledWith('currentAreaAssessmentStatus', 'unavailable')
  })
})
