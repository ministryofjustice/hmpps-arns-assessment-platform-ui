import { AssessmentNeedDetailDto, AssessmentNeedsDetailsDto } from '../interfaces/arns-api/assessmentNeedsDetails'
import { CriminogenicNeedsData, CriminogenicNeedArea } from '../interfaces/coordinator-api/entityAssessment'

const SECTION_TO_NEEDS_KEY: Record<string, keyof CriminogenicNeedsData> = {
  ACCOMMODATION: 'accommodation',
  EMPLOYMENT_AND_EDUCATION: 'educationTrainingEmployability',
  PERSONAL_RELATIONSHIPS_AND_COMMUNITY: 'personalRelationshipsAndCommunity',
  LIFESTYLE_AND_ASSOCIATES: 'lifestyleAndAssociates',
  DRUG_USE: 'drugMisuse',
  ALCOHOL_USE: 'alcoholMisuse',
  THINKING_ATTITUDES_AND_BEHAVIOUR: 'thinkingBehaviourAndAttitudes',
  FINANCE: 'finance',
  HEALTH_AND_WELLBEING: 'healthAndWellbeing',
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
