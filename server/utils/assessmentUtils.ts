import {
  OasysEquivalent,
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

function getOasysValue(oasysEquivalent: OasysEquivalent, key: string): string {
  const value = oasysEquivalent[key]
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return typeof value === 'string' ? value : ''
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
  oasysEquivalent: OasysEquivalent,
  assessmentKey: string,
  detailType: 'risk_of_serious_harm' | 'risk_of_reoffending' | 'strengths_or_protective_factors',
  linkedIndicator: LinkedIndicator,
): string {
  if (!linkedIndicator) return ''

  const suffix = linkedIndicator.toLowerCase()
  const key = `${assessmentKey}_practitioner_analysis_${detailType}_${suffix}_details`
  return getOasysValue(oasysEquivalent, key)
}

function processAssessmentArea(
  areaOfNeed: AreaOfNeed,
  oasysEquivalent: OasysEquivalent,
  criminogenicNeedsData: CriminogenicNeedsData | null,
): AssessmentArea {
  const { assessmentKey, crimNeedsKey, text: title, slug: goalRoute, upperBound, threshold } = areaOfNeed

  const crimNeedsArea: CriminogenicNeedArea | null = criminogenicNeedsData
    ? (criminogenicNeedsData[crimNeedsKey] ?? null)
    : null

  // Section complete comes from coordinator API (sanOasysEquivalent)
  const sectionCompleteValue = getOasysValue(oasysEquivalent, `${assessmentKey}_section_complete`)
  const isAssessmentSectionComplete = sectionCompleteValue === 'YES'

  // Linked indicators come from handover (OASys)
  const linkedToHarm = toLinkedIndicator(crimNeedsArea?.linkedToHarm)
  const linkedToReoffending = toLinkedIndicator(crimNeedsArea?.linkedToReoffending)
  const linkedToStrengthsOrProtectiveFactors = toLinkedIndicator(crimNeedsArea?.linkedToStrengthsOrProtectiveFactors)

  // Details come from coordinator API (sanOasysEquivalent), keyed by the linked indicator value
  const riskOfSeriousHarmDetails = getLinkedDetails(
    oasysEquivalent,
    assessmentKey,
    'risk_of_serious_harm',
    linkedToHarm,
  )

  const riskOfReoffendingDetails = getLinkedDetails(
    oasysEquivalent,
    assessmentKey,
    'risk_of_reoffending',
    linkedToReoffending,
  )

  const strengthsOrProtectiveFactorsDetails = getLinkedDetails(
    oasysEquivalent,
    assessmentKey,
    'strengths_or_protective_factors',
    linkedToStrengthsOrProtectiveFactors,
  )

  // Motivation comes from coordinator API (sanOasysEquivalent)
  const motivationValue = getOasysValue(
    oasysEquivalent,
    `${assessmentKey}_practitioner_analysis_motivation_to_make_changes`,
  )
  const motivationToMakeChanges = parseMotivation(motivationValue)

  // Score comes from handover (OASys) only
  const score = crimNeedsArea?.score ?? null

  // High scoring: score exceeds threshold (score > threshold)
  // Low scoring: score at or below threshold (score <= threshold)
  // Areas without scoring (Finance, Health) have both as false
  const isHighScoring = threshold !== null && score !== null && score > threshold
  const isLowScoring = threshold !== null && score !== null && score <= threshold

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
  oasysEquivalent: OasysEquivalent,
  criminogenicNeedsData: CriminogenicNeedsData | null = null,
): AssessmentArea[] {
  return areasOfNeed.map(areaOfNeed => processAssessmentArea(areaOfNeed, oasysEquivalent, criminogenicNeedsData))
}
