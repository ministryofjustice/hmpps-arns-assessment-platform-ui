import { loadSupervisionPackage } from './loadSupervisionPackage'
import type { SentencePlanContext, SentencePlanEffectsDeps, SupervisionPackageDetails, TierCalculation } from '../types'

jest.mock('../../../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

const mockLogger = jest.requireMock('../../../../../logger')

const supervisionPackageDetails = {
  currentPhase: {
    supervisionPackage: { code: 'STD', description: 'Standard' },
    phase: { code: 'P1', description: 'Phase 1' },
    eventNumber: '1',
    startDate: '2026-01-05',
    endDate: '2027-01-04',
  },
  earlyEngagement: { startDate: '2026-01-05', endDate: '2026-03-01', weeks: 8, completed: 8 },
  currentYear: {
    startDate: '2026-01-05',
    endDate: '2027-01-04',
    proRataFromDate: '2026-01-05',
    isFirstYear: true,
    appointments: { allowance: 20, scheduled: 3, completed: 11 },
  },
  nextAppointment: {
    id: 1,
    date: '2026-08-12',
    startTime: '10:30',
    type: { code: 'OFF', description: 'Office visit' },
    description: 'planned office visit',
  },
  createdAt: '2026-01-05T09:00:00Z',
  updatedAt: '2026-08-01T09:00:00Z',
  context: {},
} as unknown as SupervisionPackageDetails

const tierCalculation = {
  tierScore: 'B2',
  calculationId: 'calc-1',
  calculationDate: '2026-07-01T09:30:00Z',
  changeReason: 'Reassessment',
  provisional: false,
  tag: { text: null, color: null },
} as TierCalculation

const unavailableTierCalculation = {
  tierScore: '',
  calculationId: '',
  calculationDate: '',
  changeReason: '',
  provisional: false,
  tag: { text: 'Unavailable', color: 'grey' },
} as TierCalculation

function createMockContext(crn: string | null = 'X123456') {
  return {
    getSession: jest.fn(() => ({ caseDetails: crn ? { crn } : undefined })),
    setData: jest.fn(),
  } as unknown as SentencePlanContext
}

function createMockDeps(): SentencePlanEffectsDeps {
  return {
    mpopComponents: {
      getSupervisionPackageFrontendContext: jest.fn().mockResolvedValue(supervisionPackageDetails),
      getTierDetails: jest.fn().mockResolvedValue({ calculation: tierCalculation, httpStatus: 200, error: null }),
    },
  } as unknown as SentencePlanEffectsDeps
}

describe('loadSupervisionPackage', () => {
  let deps: SentencePlanEffectsDeps

  beforeEach(() => {
    deps = createMockDeps()
    mockLogger.info.mockClear()
    mockLogger.error.mockClear()
  })

  it('should set package and tier data when both APIs succeed', async () => {
    // Arrange
    const context = createMockContext()

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(deps.mpopComponents.getSupervisionPackageFrontendContext).toHaveBeenCalledWith(expect.anything(), 'X123456')
    expect(deps.mpopComponents.getTierDetails).toHaveBeenCalledWith(expect.anything(), 'X123456')
    expect(context.setData).toHaveBeenCalledWith('supervisionPackageDetails', supervisionPackageDetails)
    expect(context.setData).toHaveBeenCalledWith('tierCalculation', tierCalculation)
    expect(context.setData).toHaveBeenCalledWith('supervisionPackageStatus', 'success')
  })

  it('should set an unavailable status and log at info when the person has no package yet', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getSupervisionPackageFrontendContext as jest.Mock).mockResolvedValue(null)

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).not.toHaveBeenCalledWith('supervisionPackageDetails', expect.anything())
    expect(context.setData).toHaveBeenCalledWith('supervisionPackageStatus', 'unavailable')
    expect(context.setData).toHaveBeenCalledWith('tierCalculation', tierCalculation)
    expect(mockLogger.info).toHaveBeenCalledWith({ crn: 'X123456' }, 'No supervision package for this person yet')
  })

  it('should still set the unavailable tier calculation when the tier API fails', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getTierDetails as jest.Mock).mockResolvedValue({
      calculation: unavailableTierCalculation,
      httpStatus: 500,
      error: new Error('500 Internal Server Error'),
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).toHaveBeenCalledWith('tierCalculation', unavailableTierCalculation)
    expect(mockLogger.error).toHaveBeenCalledWith(
      { crn: 'X123456', httpStatus: 500 },
      'Failed to fetch tier details from MPoP Components API',
    )
  })

  it('should set an error status (and not throw) when the package client rejects', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getSupervisionPackageFrontendContext as jest.Mock).mockRejectedValue(
      new Error('connection refused'),
    )

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).not.toHaveBeenCalledWith('supervisionPackageDetails', expect.anything())
    expect(context.setData).toHaveBeenCalledWith('supervisionPackageStatus', 'error')
    // Tier is settled independently, so a package failure does not lose the tier
    expect(context.setData).toHaveBeenCalledWith('tierCalculation', tierCalculation)
  })

  it('should log at info rather than error when the person has no tier or package', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getSupervisionPackageFrontendContext as jest.Mock).mockResolvedValue(null)
    ;(deps.mpopComponents.getTierDetails as jest.Mock).mockResolvedValue({
      calculation: unavailableTierCalculation,
      httpStatus: 404,
      error: null,
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledTimes(2)
  })

  it('should not call the APIs when CRN is missing from the session', async () => {
    // Arrange
    const context = createMockContext(null)

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(deps.mpopComponents.getSupervisionPackageFrontendContext).not.toHaveBeenCalled()
  })
})
