import { SuperAgentRequest } from 'superagent'
import type { CriminogenicNeedsData } from '@ministryofjustice/hmpps-aap-sdk/dependencies/handover/HandoverShared.type'
import { stubFor } from './wiremock'

export interface AssessmentNeedDetail {
  section: string
  name?: string
  needStatus?: string
  riskOfHarm?: boolean | null
  riskOfReoffending?: boolean | null
  score?: number | null
  oasysThreshold?: { standard?: number }
}

// The ARNS SAN section name for each area — the one piece not carried in areasOfNeed.
const ARNS_SECTION_BY_KEY: Record<string, string> = {
  accommodation: 'ACCOMMODATION',
  educationTrainingEmployability: 'EMPLOYMENT_AND_EDUCATION',
  personalRelationshipsAndCommunity: 'PERSONAL_RELATIONSHIPS_AND_COMMUNITY',
  lifestyleAndAssociates: 'LIFESTYLE_AND_ASSOCIATES',
  drugMisuse: 'DRUG_USE',
  alcoholMisuse: 'ALCOHOL_USE',
  thinkingBehaviourAndAttitudes: 'THINKING_ATTITUDES_AND_BEHAVIOUR',
  finance: 'FINANCE',
  healthAndWellbeing: 'HEALTH_AND_WELLBEING',
}

const CRIMINOGENIC_NEED_FIELDS = [
  { crimNeedsKey: 'accommodation', handoverPrefix: 'acc' },
  { crimNeedsKey: 'educationTrainingEmployability', handoverPrefix: 'ete' },
  { crimNeedsKey: 'finance', handoverPrefix: 'finance' },
  { crimNeedsKey: 'drugMisuse', handoverPrefix: 'drug' },
  { crimNeedsKey: 'alcoholMisuse', handoverPrefix: 'alcohol' },
  { crimNeedsKey: 'healthAndWellbeing', handoverPrefix: 'emo' },
  { crimNeedsKey: 'personalRelationshipsAndCommunity', handoverPrefix: 'rel' },
  { crimNeedsKey: 'thinkingBehaviourAndAttitudes', handoverPrefix: 'think' },
  { crimNeedsKey: 'lifestyleAndAssociates', handoverPrefix: 'lifestyle' },
] as const

const toBool = (value: string | undefined): boolean | null => {
  if (value === 'YES') return true
  if (value === 'NO') return false
  return null
}

/**
 * Translate the handover-shaped criminogenic-needs test data (accLinkedToHarm: 'YES', etc.) into the
 * ARNS integration DTO's `needs` array.
 * An area omitted from the input produces no entry, so the app treats it as having no data.
 */
export const criminogenicNeedsToArnsDetails = (data: CriminogenicNeedsData | null): AssessmentNeedDetail[] => {
  if (!data) return []

  return CRIMINOGENIC_NEED_FIELDS.flatMap(({ crimNeedsKey, handoverPrefix }) => {
    const area = data[crimNeedsKey] as Record<string, string | undefined> | undefined
    if (!area) return []

    const scoreRaw = area[`${handoverPrefix}OtherWeightedScore`]
    const score = scoreRaw != null && scoreRaw !== '' && scoreRaw !== 'N/A' ? Number(scoreRaw) : undefined

    return [
      {
        section: ARNS_SECTION_BY_KEY[crimNeedsKey],
        riskOfHarm: toBool(area[`${handoverPrefix}LinkedToHarm`]),
        riskOfReoffending: toBool(area[`${handoverPrefix}LinkedToReoffending`]),
        ...(score != null && !Number.isNaN(score) ? { score } : {}),
      },
    ]
  })
}

export default {
  stubGetCriminogenicNeedsDetails: (
    crn: string,
    needs: AssessmentNeedDetail[],
    assessmentVersion: 'SAN' | 'OASYS' = 'SAN',
  ): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: `/arns-api/needs/${crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { needs, assessmentVersion, assessedOn: '2026-01-01T00:00:00' },
      },
      priority: 1,
    }),

  stubGetCriminogenicNeedsDetailsFailure: (crn: string, status = 500): SuperAgentRequest =>
    stubFor({
      request: {
        method: 'GET',
        urlPathPattern: `/arns-api/needs/${crn}`,
      },
      response: {
        status,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: {},
      },
      priority: 1,
    }),
}
