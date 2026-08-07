import { EvaluatedBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { buildParams, SupervisionPackageBlock } from './supervisionPackage'
import { SupervisionPackageDetails, TierCalculation } from '../../effects/types'

const supervisionPackageDetails = {
  phase: {
    name: { code: 'STD', description: 'standard' },
    startDate: '2026-01-05',
    endDate: '2027-01-04',
  },
  earlyEngagement: { startDate: '2026-01-05', endDate: '2026-03-01', weeks: 8, completed: 8 },
  currentYear: {
    startDate: '2026-01-05',
    endDate: '2027-01-04',
    isFirstYear: true,
    appointments: { allowance: 20, scheduled: 3, completed: 11 },
  },
} as SupervisionPackageDetails

function createBlock(overrides: Partial<SupervisionPackageBlock> = {}) {
  return {
    variant: 'supervisionPackage',
    forename: 'Buster',
    tierCalculation: undefined,
    supervisionPackageDetails: undefined,
    nextAppointment: undefined,
    ...overrides,
  } as unknown as EvaluatedBlock<SupervisionPackageBlock>
}

describe('buildParams()', () => {
  it('should spread supervision package details over the tier props when data is loaded', () => {
    // Arrange
    const tierCalculation = { tierScore: 'B2', provisional: false, tag: { text: null, color: null } } as TierCalculation
    const block = createBlock({ tierCalculation, supervisionPackageDetails })

    // Act
    const params = buildParams(block)

    // Assert
    expect(params).toEqual({
      tierScore: 'B2',
      tag: { text: null, color: null },
      forename: 'Buster',
      nextAppointment: undefined,
      phase: supervisionPackageDetails.phase,
      earlyEngagement: supervisionPackageDetails.earlyEngagement,
      currentYear: supervisionPackageDetails.currentYear,
    })
  })

  it('should pass the next appointment through to the component', () => {
    // Arrange
    // TODO: Drop href when MPoP make it optional — see effects/types.ts NextAppointment.
    const nextAppointment = { description: 'planned office visit', date: '2026-08-12T10:30:00Z', href: '#' }
    const block = createBlock({ nextAppointment })

    // Act
    const params = buildParams(block)

    // Assert
    expect(params.nextAppointment).toEqual(nextAppointment)
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

  it('should return only the forename when no data is loaded', () => {
    // Arrange
    const block = createBlock()

    // Act
    const params = buildParams(block)

    // Assert
    expect(params).toEqual({ tierScore: undefined, tag: undefined, forename: 'Buster' })
  })
})
