import {
  SanAssessmentData,
  LinkedIndicator,
  MotivationLevel,
  AssessmentArea,
  CriminogenicNeedsData,
  CriminogenicNeedArea,
} from '../interfaces/coordinator-api/entityAssessment'
import { areasOfNeed } from '../forms/sentence-plan/versions/v1.0/constants'
import { AreaOfNeed } from '../forms/sentence-plan/effects/types'

/**
 * Converts boolean from handover to LinkedIndicator format.
 * Linked indicators come from handover (OASys).
 */
function toLinkedIndicator(value: boolean | null | undefined): LinkedIndicator {
  if (value === true) return 'YES'
  if (value === false) return 'NO'
  return null
}

function getAssessmentValue(sanAssessmentData: SanAssessmentData, key: string): string {
  const answer = sanAssessmentData[key]
  if (!answer) return ''
  if (Array.isArray(answer.values)) {
    return answer.values.join(', ')
  }
  return typeof answer.value === 'string' ? answer.value : ''
}

function parseMotivation(value: string): MotivationLevel {
  const validLevels: MotivationLevel[] = [
    'MADE_CHANGES',
    'MAKING_CHANGES',
    'WANT_TO_MAKE_CHANGES',
    'NEEDS_HELP_TO_MAKE_CHANGES',
    'THINKING_ABOUT_MAKING_CHANGES',
    'DOES_NOT_WANT_TO_MAKE_CHANGES',
    'DOES_NOT_WANT_TO_ANSWER',
    'NOT_PRESENT',
    'NOT_APPLICABLE',
  ]
  return validLevels.includes(value as MotivationLevel) ? (value as MotivationLevel) : null
}

function getLinkedDetails(
  sanAssessmentData: SanAssessmentData,
  assessmentKey: string,
  detailType: 'risk_of_serious_harm' | 'risk_of_reoffending' | 'strengths_or_protective_factors',
  linkedIndicator: LinkedIndicator,
): string {
  if (!linkedIndicator) return ''

  const suffix = linkedIndicator.toLowerCase()
  const key = `${assessmentKey}_practitioner_analysis_${detailType}_${suffix}_details`
  return getAssessmentValue(sanAssessmentData, key)
}

function processAssessmentArea(
  areaOfNeed: AreaOfNeed,
  sanAssessmentData: SanAssessmentData,
  criminogenicNeedsData: CriminogenicNeedsData | null,
): AssessmentArea {
  const { assessmentKey, crimNeedsKey, text: title, slug: goalRoute, upperBound, threshold } = areaOfNeed

  const crimNeedsArea: CriminogenicNeedArea | null = criminogenicNeedsData
    ? (criminogenicNeedsData[crimNeedsKey] ?? null)
    : null

  // Section complete comes from coordinator API (sanAssessmentData)
  const sectionCompleteValue = getAssessmentValue(sanAssessmentData, `${assessmentKey}_section_complete`)
  const isAssessmentSectionComplete = sectionCompleteValue === 'YES'

  // Linked indicators come from handover (OASys)
  const linkedToHarm = toLinkedIndicator(crimNeedsArea?.linkedToHarm)
  const linkedToReoffending = toLinkedIndicator(crimNeedsArea?.linkedToReoffending)
  const linkedToStrengthsOrProtectiveFactors = toLinkedIndicator(crimNeedsArea?.linkedToStrengthsOrProtectiveFactors)

  // Details come from coordinator API (sanAssessmentData), keyed by the linked indicator value
  const riskOfSeriousHarmDetails = getLinkedDetails(
    sanAssessmentData,
    assessmentKey,
    'risk_of_serious_harm',
    linkedToHarm,
  )

  const riskOfReoffendingDetails = getLinkedDetails(
    sanAssessmentData,
    assessmentKey,
    'risk_of_reoffending',
    linkedToReoffending,
  )

  const strengthsOrProtectiveFactorsDetails = getLinkedDetails(
    sanAssessmentData,
    assessmentKey,
    'strengths_or_protective_factors',
    linkedToStrengthsOrProtectiveFactors,
  )

  // Motivation comes from coordinator API (sanAssessmentData)
  const motivationValue = getAssessmentValue(sanAssessmentData, `${assessmentKey}_changes`)
  const motivationToMakeChanges = parseMotivation(motivationValue)

  // Score comes from handover (OASys) only
  const score = crimNeedsArea?.score ?? null

  // High scoring: score at or above threshold (score >= threshold)
  // Low scoring: score below threshold (score < threshold)
  // Areas without scoring (Finance, Health) have both as false
  const isHighScoring = threshold !== null && score !== null && score >= threshold
  const isLowScoring = threshold !== null && score !== null && score < threshold

  return {
    title,
    goalRoute,
    isAssessmentSectionComplete,
    linkedToHarm,
    linkedToReoffending,
    linkedToStrengthsOrProtectiveFactors,
    riskOfSeriousHarmDetails,
    riskOfReoffendingDetails,
    strengthsOrProtectiveFactorsDetails,
    motivationToMakeChanges,
    score,
    upperBound,
    threshold,
    isHighScoring,
    isLowScoring,
  }
}

export function transformAssessmentData(
  sanAssessmentData: SanAssessmentData,
  criminogenicNeedsData: CriminogenicNeedsData | null = null,
): AssessmentArea[] {
  return areasOfNeed.map(areaOfNeed => processAssessmentArea(areaOfNeed, sanAssessmentData, criminogenicNeedsData))
}
