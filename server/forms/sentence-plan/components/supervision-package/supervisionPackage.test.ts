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

const OASYS_REVIEW_HREF = 'https://t2.oasys.service.justice.gov.uk'

function createBlock(overrides: Partial<SupervisionPackage> = {}) {
  return {
    variant: 'supervisionPackage',
    crn: 'X123456',
    tierCalculation: undefined,
    supervisionPackageDetails: undefined,
    oasysReviewHref: OASYS_REVIEW_HREF,
    openInNewTab: false,
    ...overrides,
  } as unknown as ResolvedPropsOf<SupervisionPackage>
}

describe('buildParams()', () => {
  it('should spread the supervision package frontend context over the tier props when data is loaded', () => {
    const tierCalculation = { tierScore: 'B2', provisional: false, tag: { text: null, color: null } } as TierCalculation
    const block = createBlock({ tierCalculation, supervisionPackageDetails })

    const params = buildParams(block)

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
      oasysReviewHref: OASYS_REVIEW_HREF,
      openInNewTab: false,
    })
  })

  it('should pass oasysReviewHref and openInNewTab through for the in-flight OASys review links', () => {
    const block = createBlock({ openInNewTab: true })

    const params = buildParams(block)

    expect(params.oasysReviewHref).toBe(OASYS_REVIEW_HREF)
    expect(params.openInNewTab).toBe(true)
  })

  it('should pass the next appointment through as part of the package context', () => {
    const block = createBlock({ supervisionPackageDetails })

    const params = buildParams(block)

    expect(params.nextAppointment).toEqual(supervisionPackageDetails.nextAppointment)
  })

  it('should omit the tier score when the calculation is MISSING', () => {
    const tierCalculation = {
      tierScore: 'MISSING',
      provisional: false,
      tag: { text: 'Missing', color: 'red' },
    } as TierCalculation
    const block = createBlock({ tierCalculation })

    const params = buildParams(block)

    expect(params.tierScore).toBeUndefined()
    expect(params.tag).toEqual({ text: 'Missing', color: 'red' })
  })

  it('should return only the tier, crn and OASys review props when no package data is loaded', () => {
    const block = createBlock()

    const params = buildParams(block)

    expect(params).toEqual({
      tierScore: undefined,
      tag: undefined,
      crn: 'X123456',
      oasysReviewHref: OASYS_REVIEW_HREF,
      openInNewTab: false,
    })
  })
})
