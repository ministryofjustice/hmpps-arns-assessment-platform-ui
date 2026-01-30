import {
  OasysEquivalent,
  LinkedIndicator,
  MotivationLevel,
  AssessmentArea,
  FormattedAssessment,
  CriminogenicNeedsData,
  CriminogenicNeedArea,
} from '../interfaces/coordinator-api/entityAssessment'
import { assessmentAreaConfigs, AssessmentAreaConfig } from './assessmentAreaConfig'

/**
 * Converts a boolean or null to a LinkedIndicator string
 */
function toLinkedIndicator(value: boolean | null | undefined): LinkedIndicator {
  if (value === true) return 'YES'
  if (value === false) return 'NO'
  return null
}

/**
 * Extracts a string value from OasysEquivalent, handling array values
 */
function getOasysValue(oasysEquivalent: OasysEquivalent, key: string): string {
  const value = oasysEquivalent[key]
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  return typeof value === 'string' ? value : ''
}

/**
 * Converts raw motivation value to MotivationLevel type
 */
function parseMotivation(value: string): MotivationLevel {
  const validLevels: MotivationLevel[] = [
    'READY_TO_MAKE_CHANGES',
    'WANTS_TO_MAKE_CHANGES',
    'NEEDS_HELP_TO_MAKE_CHANGES',
    'DOES_NOT_WANT_TO_MAKE_CHANGES',
  ]
  return validLevels.includes(value as MotivationLevel) ? (value as MotivationLevel) : null
}

/**
 * Extracts the linked indicator from OASys data
 * Falls back to criminogenic needs data if OASys value not present
 */
function getLinkedIndicator(
  oasysEquivalent: OasysEquivalent,
  assessmentKey: string,
  indicatorType: 'risk_of_serious_harm' | 'risk_of_reoffending' | 'strengths_or_protective_factors',
  crimNeedsValue: boolean | null | undefined,
): LinkedIndicator {
  const oasysKey = `${assessmentKey}_practitioner_analysis_${indicatorType}`
  const oasysValue = getOasysValue(oasysEquivalent, oasysKey)

  if (oasysValue === 'YES' || oasysValue === 'NO') {
    return oasysValue as LinkedIndicator
  }

  return toLinkedIndicator(crimNeedsValue)
}

/**
 * Extracts the detail text for a linked indicator
 * Uses the YES or NO suffix based on the indicator value
 */
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

/**
 * Processes a single assessment area from raw data
 */
function processAssessmentArea(
  config: AssessmentAreaConfig,
  oasysEquivalent: OasysEquivalent,
  criminogenicNeedsData: CriminogenicNeedsData | null,
): AssessmentArea {
  const { assessmentKey, crimNeedsKey, title, goalRoute, upperBound } = config

  // Get criminogenic needs data for this area (if available)
  const crimNeedsArea: CriminogenicNeedArea | null = criminogenicNeedsData
    ? (criminogenicNeedsData[crimNeedsKey as keyof CriminogenicNeedsData] ?? null)
    : null

  // Check section completion
  const sectionCompleteValue = getOasysValue(oasysEquivalent, `${assessmentKey}_section_complete`)
  const isAssessmentSectionComplete = sectionCompleteValue === 'YES'

  // Extract linked indicators
  const linkedToHarm = getLinkedIndicator(
    oasysEquivalent,
    assessmentKey,
    'risk_of_serious_harm',
    crimNeedsArea?.linkedToHarm,
  )

  const linkedToReoffending = getLinkedIndicator(
    oasysEquivalent,
    assessmentKey,
    'risk_of_reoffending',
    crimNeedsArea?.linkedToReoffending,
  )

  const linkedToStrengthsOrProtectiveFactors = getLinkedIndicator(
    oasysEquivalent,
    assessmentKey,
    'strengths_or_protective_factors',
    null, // No criminogenic needs equivalent for this
  )

  // Extract detail text based on linked indicators
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

  // Extract motivation
  const motivationValue = getOasysValue(
    oasysEquivalent,
    `${assessmentKey}_practitioner_analysis_motivation_to_make_changes`,
  )
  const motivationToMakeChanges = parseMotivation(motivationValue)

  // Get score from criminogenic needs data
  const score = crimNeedsArea?.score ?? null

  // Determine scoring classification
  const isHighScoring = upperBound !== null && score !== null && score >= upperBound
  const isLowScoring = upperBound !== null && score !== null && score < upperBound

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
    isHighScoring,
    isLowScoring,
  }
}

/**
 * Transforms raw OASys equivalent data into structured assessment areas
 *
 * @param oasysEquivalent - Flat key-value data from coordinator API
 * @param criminogenicNeedsData - Optional scoring data from ARNS API
 * @returns Array of processed assessment areas
 */
export function transformAssessmentData(
  oasysEquivalent: OasysEquivalent,
  criminogenicNeedsData: CriminogenicNeedsData | null = null,
): AssessmentArea[] {
  return assessmentAreaConfigs.map(config => processAssessmentArea(config, oasysEquivalent, criminogenicNeedsData))
}

/**
 * Groups assessment areas by category for display
 *
 * @param areas - Processed assessment areas
 * @returns Assessment areas grouped into incomplete, high-scoring, low-scoring, and other
 */
export function formatAssessmentAreas(areas: AssessmentArea[]): FormattedAssessment {
  const incompleteAreas: AssessmentArea[] = []
  const highScoring: AssessmentArea[] = []
  const lowScoring: AssessmentArea[] = []
  const other: AssessmentArea[] = []

  for (const area of areas) {
    if (!area.isAssessmentSectionComplete) {
      incompleteAreas.push(area)
    } else if (area.upperBound === null) {
      // Areas without scoring go to "other"
      other.push(area)
    } else if (area.isHighScoring) {
      highScoring.push(area)
    } else {
      lowScoring.push(area)
    }
  }

  return {
    incompleteAreas,
    highScoring,
    lowScoring,
    other,
  }
}

/**
 * Main entry point: transforms and formats assessment data in one call
 *
 * @param oasysEquivalent - Flat key-value data from coordinator API
 * @param criminogenicNeedsData - Optional scoring data from ARNS API
 * @returns Formatted assessment with areas grouped by category
 */
export function processAssessmentInfo(
  oasysEquivalent: OasysEquivalent,
  criminogenicNeedsData: CriminogenicNeedsData | null = null,
): FormattedAssessment {
  const areas = transformAssessmentData(oasysEquivalent, criminogenicNeedsData)
  return formatAssessmentAreas(areas)
}

/**
 * Converts MotivationLevel to user-friendly display text
 * Follows GOV.UK content guidelines (plain English, sentence case)
 *
 * @param motivation - The motivation level from the assessment
 * @returns Human-readable text for display in templates
 */
export function getMotivationDisplayText(motivation: MotivationLevel): string {
  switch (motivation) {
    case 'READY_TO_MAKE_CHANGES':
      return 'Ready to make changes'
    case 'WANTS_TO_MAKE_CHANGES':
      return 'Wants to make changes'
    case 'NEEDS_HELP_TO_MAKE_CHANGES':
      return 'Needs help to make changes'
    case 'DOES_NOT_WANT_TO_MAKE_CHANGES':
      return 'Does not want to make changes'
    default:
      return ''
  }
}
