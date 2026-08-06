import { AssessmentNeedsDto, AssessmentNeedDto } from '../interfaces/arns-api/assessmentNeeds'
import { CriminogenicNeedsData, CriminogenicNeedArea } from '../interfaces/coordinator-api/entityAssessment'

const SECTION_TO_NEEDS_KEY: Record<string, keyof CriminogenicNeedsData> = {
  ACCOMMODATION: 'accommodation',
  EMPLOYMENT_AND_EDUCATION: 'educationTrainingEmployability',
  PERSONAL_RELATIONSHIPS_AND_COMMUNITY: 'personalRelationshipsAndCommunity',
  LIFESTYLE_AND_ASSOCIATES: 'lifestyleAndAssociates',
  DRUG_USE: 'drugMisuse',
  ALCOHOL_USE: 'alcoholMisuse',
  THINKING_ATTITUDES_AND_BEHAVIOUR: 'thinkingBehaviourAndAttitudes',
}

const emptyNeedArea = (): CriminogenicNeedArea => ({
  linkedToHarm: null,
  linkedToReoffending: null,
  linkedToStrengthsOrProtectiveFactors: null,
  score: null,
})

/**
 * Maps an ARNS AssessmentNeedsDto to the internal CriminogenicNeedsData shape — the same
 * shape mapHandoverToCriminogenicNeeds produces — so transformAssessmentData stays source-agnostic.
 * SAN carries no finance/health-and-wellbeing sections and no strengths indicator, so those
 * stay as empty (null) areas.
 */
export function mapArnsNeedsToCriminogenicNeeds(dto: AssessmentNeedsDto | undefined): CriminogenicNeedsData | null {
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

  const allNeeds: AssessmentNeedDto[] = [...dto.identifiedNeeds, ...dto.notIdentifiedNeeds, ...dto.unansweredNeeds]

  allNeeds.forEach(need => {
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
