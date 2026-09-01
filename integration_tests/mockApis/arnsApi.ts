import { SuperAgentRequest } from 'superagent'
import type { CriminogenicNeedsData } from '@server/interfaces/handover-api/shared'
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

// Internal area key -> ARNS SAN section name + the handover field-name prefix for that area.
const AREA_MAPPINGS = [
  ['accommodation', 'ACCOMMODATION', 'acc'],
  ['educationTrainingEmployability', 'EMPLOYMENT_AND_EDUCATION', 'ete'],
  ['personalRelationshipsAndCommunity', 'PERSONAL_RELATIONSHIPS_AND_COMMUNITY', 'rel'],
  ['lifestyleAndAssociates', 'LIFESTYLE_AND_ASSOCIATES', 'lifestyle'],
  ['drugMisuse', 'DRUG_USE', 'drug'],
  ['alcoholMisuse', 'ALCOHOL_USE', 'alcohol'],
  ['thinkingBehaviourAndAttitudes', 'THINKING_ATTITUDES_AND_BEHAVIOUR', 'think'],
  ['finance', 'FINANCE', 'finance'],
  ['healthAndWellbeing', 'HEALTH_AND_WELLBEING', 'emo'],
] as const

const toBool = (value: string | undefined): boolean | null => {
  if (value === 'YES') return true
  if (value === 'NO') return false
  return null
}

/**
 * Translate the handover-shaped criminogenic-needs test data (accLinkedToHarm: 'YES', etc.) into the
 * ARNS integration DTO's `needs` array. An area omitted from the input produces no entry, so the app
 * treats it as having no assessment data - matching the old handover behaviour.
 */
export const criminogenicNeedsToArnsDetails = (data: CriminogenicNeedsData | null): AssessmentNeedDetail[] => {
  if (!data) return []

  return AREA_MAPPINGS.flatMap(([key, section, prefix]) => {
    const area = data[key] as Record<string, string | undefined> | undefined
    if (!area) return []

    const scoreRaw = area[`${prefix}OtherWeightedScore`]
    const score = scoreRaw != null && scoreRaw !== '' && scoreRaw !== 'N/A' ? Number(scoreRaw) : undefined

    return [
      {
        section,
        riskOfHarm: toBool(area[`${prefix}LinkedToHarm`]),
        riskOfReoffending: toBool(area[`${prefix}LinkedToReoffending`]),
        ...(score != null && !Number.isNaN(score) ? { score } : {}),
      },
    ]
  })
}

export default {
  /**
   * Stub the ARNS integration endpoint GET /needs/{crn}, used for OASys users
   * (AssessmentNeedsDetailsDto). Priority 1 overrides the static default stub in
   * docker/wiremock/mappings/arns-api/needs-details.json.
   */
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

  /**
   * Stub the ARNS integration endpoint to return an error, for AC5 error-state tests.
   */
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
