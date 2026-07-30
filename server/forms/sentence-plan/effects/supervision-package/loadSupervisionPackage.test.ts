import { loadSupervisionPackage } from './loadSupervisionPackage'
import type {
  PersonScheduleResponse,
  SentencePlanContext,
  SentencePlanEffectsDeps,
  SupervisionPackageDetails,
  TierCalculation,
} from '../types'

jest.mock('../../../../../logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}))

const mockLogger = jest.requireMock('../../../../../logger')

const supervisionPackageDetails = {
  phase: {
    name: { code: 'STD', description: 'standard' },
    startDate: '2026-01-05',
    endDate: '2027-01-04',
  },
} as SupervisionPackageDetails

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

const personScheduleWithAppointment: PersonScheduleResponse = {
  personSchedule: {
    personSchedule: {
      appointments: [{ id: '10001', type: 'planned office visit', startDateTime: '2026-08-12T10:30:00Z' }],
    },
  },
  httpStatus: 200,
  error: null,
} as PersonScheduleResponse

function createMockDeps(): SentencePlanEffectsDeps {
  return {
    mpopComponents: {
      getSupervisionPackage: jest
        .fn()
        .mockResolvedValue({ supervisionPackage: supervisionPackageDetails, httpStatus: 200, error: null }),
      getTierDetails: jest.fn().mockResolvedValue({ calculation: tierCalculation, httpStatus: 200, error: null }),
      getPersonSchedule: jest.fn().mockResolvedValue(personScheduleWithAppointment),
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
    expect(deps.mpopComponents.getSupervisionPackage).toHaveBeenCalledWith(expect.anything(), 'X123456')
    expect(deps.mpopComponents.getTierDetails).toHaveBeenCalledWith(expect.anything(), 'X123456')
    expect(context.setData).toHaveBeenCalledWith('supervisionPackageDetails', supervisionPackageDetails)
    expect(context.setData).toHaveBeenCalledWith('tierCalculation', tierCalculation)
  })

  it('should leave package details unset when the person has no package yet', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getSupervisionPackage as jest.Mock).mockResolvedValue({
      supervisionPackage: null,
      httpStatus: 404,
      error: null,
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).not.toHaveBeenCalledWith('supervisionPackageDetails', expect.anything())
    expect(context.setData).toHaveBeenCalledWith('tierCalculation', tierCalculation)
  })

  it('should leave package details unset when the supervision package API fails', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getSupervisionPackage as jest.Mock).mockResolvedValue({
      supervisionPackage: null,
      httpStatus: 500,
      error: new Error('500 Internal Server Error'),
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).not.toHaveBeenCalledWith('supervisionPackageDetails', expect.anything())
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
  })

  it('should not throw when the client rejects', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getSupervisionPackage as jest.Mock).mockRejectedValue(new Error('connection refused'))

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).not.toHaveBeenCalledWith('supervisionPackageDetails', expect.anything())
  })

  it('should set the next appointment from the first upcoming schedule entry', async () => {
    // Arrange
    const context = createMockContext()

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(deps.mpopComponents.getPersonSchedule).toHaveBeenCalledWith(expect.anything(), 'X123456')
    expect(context.setData).toHaveBeenCalledWith('nextAppointment', {
      description: 'planned office visit',
      date: '2026-08-12T10:30:00Z',
      // TODO: Drop when MPoP make href optional — see effects/types.ts NextAppointment.
      href: '#',
    })
  })

  it('should not set a next appointment when the schedule is empty', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getPersonSchedule as jest.Mock).mockResolvedValue({
      personSchedule: { personSchedule: { appointments: [] } },
      httpStatus: 200,
      error: null,
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).not.toHaveBeenCalledWith('nextAppointment', expect.anything())
  })

  it('should leave the next appointment unset when the appointments API fails', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getPersonSchedule as jest.Mock).mockResolvedValue({
      personSchedule: null,
      httpStatus: 500,
      error: new Error('500 Internal Server Error'),
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(context.setData).not.toHaveBeenCalledWith('nextAppointment', expect.anything())
  })

  it('should log at info rather than error when a person has no tier, package or appointment', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getSupervisionPackage as jest.Mock).mockResolvedValue({
      supervisionPackage: null,
      httpStatus: 404,
      error: null,
    })
    ;(deps.mpopComponents.getTierDetails as jest.Mock).mockResolvedValue({
      calculation: unavailableTierCalculation,
      httpStatus: 404,
      error: null,
    })
    ;(deps.mpopComponents.getPersonSchedule as jest.Mock).mockResolvedValue({
      personSchedule: null,
      httpStatus: 404,
      error: null,
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(mockLogger.error).not.toHaveBeenCalled()
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
  })

  it('should log at error when an API genuinely fails', async () => {
    // Arrange
    const context = createMockContext()
    ;(deps.mpopComponents.getPersonSchedule as jest.Mock).mockResolvedValue({
      personSchedule: null,
      httpStatus: 500,
      error: new Error('500 Internal Server Error'),
    })

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(mockLogger.error).toHaveBeenCalledWith(
      { crn: 'X123456', httpStatus: 500 },
      'Failed to fetch next appointment from MPoP Components API',
    )
  })

  it('should not call the APIs when CRN is missing from the session', async () => {
    // Arrange
    const context = createMockContext(null)

    // Act
    await loadSupervisionPackage(deps)(context)

    // Assert
    expect(deps.mpopComponents.getSupervisionPackage).not.toHaveBeenCalled()
  })
})
