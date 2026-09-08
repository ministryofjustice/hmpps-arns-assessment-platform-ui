import { ResolvedPropsOf } from '@ministryofjustice/hmpps-forge/core/components'
import { buildParams, SupervisionPackage } from './supervisionPackage'
import { SupervisionPackageDetails, TierCalculation } from '../../effects/types'

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

function createBlock(overrides: Partial<SupervisionPackage> = {}) {
  return {
    variant: 'supervisionPackage',
    crn: 'X123456',
    tierCalculation: undefined,
    supervisionPackageDetails: undefined,
    ...overrides,
  } as unknown as ResolvedPropsOf<SupervisionPackage>
}

describe('buildParams()', () => {
  it('should spread the supervision package frontend context over the tier props when data is loaded', () => {
    // Arrange
    const tierCalculation = { tierScore: 'B2', provisional: false, tag: { text: null, color: null } } as TierCalculation
    const block = createBlock({ tierCalculation, supervisionPackageDetails })

    // Act
    const params = buildParams(block)

    // Assert
    expect(params).toEqual({
      tierScore: 'B2',
      tag: { text: null, color: null },
      crn: 'X123456',
      currentPhase: supervisionPackageDetails.currentPhase,
      earlyEngagement: supervisionPackageDetails.earlyEngagement,
      currentYear: supervisionPackageDetails.currentYear,
      nextAppointment: supervisionPackageDetails.nextAppointment,
      createdAt: supervisionPackageDetails.createdAt,
      updatedAt: supervisionPackageDetails.updatedAt,
      context: supervisionPackageDetails.context,
    })
  })

  it('should pass the next appointment through as part of the package context', () => {
    // Arrange
    const block = createBlock({ supervisionPackageDetails })

    // Act
    const params = buildParams(block)

    // Assert
    expect(params.nextAppointment).toEqual(supervisionPackageDetails.nextAppointment)
  })

  it('should omit the tier score when the calculation is MISSING', () => {
    // Arrange
    const tierCalculation = {
      tierScore: 'MISSING',
      provisional: false,
      tag: { text: 'Missing', color: 'red' },
    } as TierCalculation
    const block = createBlock({ tierCalculation })

    // Act
    const params = buildParams(block)

    // Assert
    expect(params.tierScore).toBeUndefined()
    expect(params.tag).toEqual({ text: 'Missing', color: 'red' })
  })

  it('should return only the tier and crn props when no package data is loaded', () => {
    // Arrange
    const block = createBlock()

    // Act
    const params = buildParams(block)

    // Assert
    expect(params).toEqual({ tierScore: undefined, tag: undefined, crn: 'X123456' })
  })
})
