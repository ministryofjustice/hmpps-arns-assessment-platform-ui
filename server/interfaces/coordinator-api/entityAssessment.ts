import { PlanType } from './oasysCreate'

/**
 * OASys equivalent data structure - flat key-value pairs following naming convention:
 * {area}_section_complete
 * {area}_practitioner_analysis_risk_of_serious_harm
 * {area}_practitioner_analysis_risk_of_serious_harm_{yes|no}_details
 * {area}_practitioner_analysis_risk_of_reoffending
 * {area}_practitioner_analysis_risk_of_reoffending_{yes|no}_details
 * {area}_practitioner_analysis_strengths_or_protective_factors
 * {area}_practitioner_analysis_strengths_or_protective_factors_{yes|no}_details
 * {area}_practitioner_analysis_motivation_to_make_changes
 */
export type OasysEquivalent = Record<string, string | string[]>

/**
 * Response from Coordinator API: GET /entity/{entityUuid}/ASSESSMENT
 */
export interface EntityAssessmentResponse {
  sanAssessmentId: string
  sanAssessmentVersion: number
  sanAssessmentData: Record<string, unknown>
  sanOasysEquivalent: OasysEquivalent
  lastUpdatedTimestampSAN: string
  sentencePlanId: string
  sentencePlanVersion: number
  planComplete: 'COMPLETE' | 'INCOMPLETE'
  planType: PlanType
  lastUpdatedTimestampSP: string
}

/**
 * Linked indicator values from OASys practitioner analysis
 */
export type LinkedIndicator = 'YES' | 'NO' | null

/**
 * Motivation levels for making changes (from OASys practitioner analysis)
 */
export type MotivationLevel =
  | 'MADE_CHANGES'
  | 'MAKING_CHANGES'
  | 'WANT_TO_MAKE_CHANGES'
  | 'NEEDS_HELP_TO_MAKE_CHANGES'
  | 'THINKING_ABOUT_MAKING_CHANGES'
  | 'DOES_NOT_WANT_TO_MAKE_CHANGES'
  | 'DOES_NOT_WANT_TO_ANSWER'
  | 'NOT_PRESENT'
  | 'NOT_APPLICABLE'
  | null

/**
 * Processed assessment area with extracted and transformed fields.
 */
export interface AssessmentArea {
  title: string
  goalRoute: string
  isAssessmentSectionComplete: boolean
  linkedToHarm: LinkedIndicator
  linkedToReoffending: LinkedIndicator
  linkedToStrengthsOrProtectiveFactors: LinkedIndicator
  riskOfSeriousHarmDetails: string
  riskOfReoffendingDetails: string
  strengthsOrProtectiveFactorsDetails: string
  motivationToMakeChanges: MotivationLevel
  score: number | null
  upperBound: number | null
  isHighScoring: boolean
  isLowScoring: boolean
}

export interface CriminogenicNeedArea {
  linkedToHarm: boolean | null
  linkedToReoffending: boolean | null
  linkedToStrengthsOrProtectiveFactors: boolean | null
  score: number | null
}

export interface CriminogenicNeedsData {
  accommodation: CriminogenicNeedArea
  educationTrainingEmployability: CriminogenicNeedArea
  finance: CriminogenicNeedArea
  drugMisuse: CriminogenicNeedArea
  alcoholMisuse: CriminogenicNeedArea
  healthAndWellbeing: CriminogenicNeedArea
  personalRelationshipsAndCommunity: CriminogenicNeedArea
  thinkingBehaviourAndAttitudes: CriminogenicNeedArea
}
