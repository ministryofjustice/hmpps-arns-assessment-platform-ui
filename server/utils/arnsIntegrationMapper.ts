import { AssessmentNeedDetailDto, AssessmentNeedsDetailsDto } from '../interfaces/arns-api/assessmentNeedsDetails'
import { CriminogenicNeedsData, CriminogenicNeedArea } from '../interfaces/coordinator-api/entityAssessment'

/**
 * The integration endpoint names sections differently depending on whether the underlying
 * assessment is SAN or legacy OASYS, so both name sets are mapped:
 * - SAN:   EMPLOYMENT_AND_EDUCATION, PERSONAL_RELATIONSHIPS_AND_COMMUNITY, DRUG_USE, ALCOHOL_USE,
 *          THINKING_ATTITUDES_AND_BEHAVIOUR, HEALTH_AND_WELLBEING
 * - OASYS: EDUCATION_TRAINING_AND_EMPLOYABILITY, RELATIONSHIPS, DRUG_MISUSE, ALCOHOL_MISUSE,
 *          THINKING_AND_BEHAVIOUR (plus a separate ATTITUDE), EMOTIONAL_WELLBEING
 *
 * OASYS splits thinking into THINKING_AND_BEHAVIOUR and ATTITUDE, but the plan has a single
 * combined "thinking, behaviours and attitudes" area. We take THINKING_AND_BEHAVIOUR (OASYS
 * section R11) to match what the handover data has always supplied, and deliberately leave
 * ATTITUDE (R12) unmapped.
 */
const SECTION_TO_NEEDS_KEY: Record<string, keyof CriminogenicNeedsData> = {
  ACCOMMODATION: 'accommodation',
  EMPLOYMENT_AND_EDUCATION: 'educationTrainingEmployability',
  EDUCATION_TRAINING_AND_EMPLOYABILITY: 'educationTrainingEmployability',
  PERSONAL_RELATIONSHIPS_AND_COMMUNITY: 'personalRelationshipsAndCommunity',
  RELATIONSHIPS: 'personalRelationshipsAndCommunity',
  LIFESTYLE_AND_ASSOCIATES: 'lifestyleAndAssociates',
  DRUG_USE: 'drugMisuse',
  DRUG_MISUSE: 'drugMisuse',
  ALCOHOL_USE: 'alcoholMisuse',
  ALCOHOL_MISUSE: 'alcoholMisuse',
  THINKING_ATTITUDES_AND_BEHAVIOUR: 'thinkingBehaviourAndAttitudes',
  THINKING_AND_BEHAVIOUR: 'thinkingBehaviourAndAttitudes',
  FINANCE: 'finance',
  HEALTH_AND_WELLBEING: 'healthAndWellbeing',
  EMOTIONAL_WELLBEING: 'healthAndWellbeing',
}

const emptyNeedArea = (): CriminogenicNeedArea => ({
  linkedToHarm: null,
  linkedToReoffending: null,
  linkedToStrengthsOrProtectiveFactors: null,
  score: null,
})

/**
 * Produces the same CriminogenicNeedsData shape as mapArnsNeedsToCriminogenicNeeds, so
 * transformAssessmentData works identically regardless of source.
 */
export function mapArnsIntegrationNeedsToCriminogenicNeeds(
  dto: AssessmentNeedsDetailsDto | undefined,
): CriminogenicNeedsData | null {
  if (!dto) {
    return null
  }

  const result: CriminogenicNeedsData = {
    accommodation: emptyNeedArea(),
    educationTrainingEmployability: emptyNeedArea(),
    finance: emptyNeedArea(),
    drugMisuse: emptyNeedArea(),
    alcoholMisuse: emptyNeedArea(),
    healthAndWellbeing: emptyNeedArea(),
    personalRelationshipsAndCommunity: emptyNeedArea(),
    thinkingBehaviourAndAttitudes: emptyNeedArea(),
  }

  const needs: AssessmentNeedDetailDto[] = dto.needs ?? []

  needs.forEach(need => {
    const key = need.section ? SECTION_TO_NEEDS_KEY[need.section] : undefined
    if (!key) {
      return
    }

    result[key] = {
      linkedToHarm: need.riskOfHarm ?? null,
      linkedToReoffending: need.riskOfReoffending ?? null,
      linkedToStrengthsOrProtectiveFactors: null,
      score: need.score ?? null,
    }
  })

  return result
}
