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
 * SAN assessment answer - the raw form answer structure from SAN.
 * Single answers use `value`, multi-select uses `values`, repeating groups use `collection`.
 */
export interface AnswerDto {
  value?: string
  values?: string[]
  collection?: Record<string, AnswerDto>[]
}

/**
 * SAN assessment data - raw form answers keyed by SAN field codes.
 * Keys follow the pattern: {area}_section_complete, {area}_practitioner_analysis_*, {area}_changes
 */
export type SanAssessmentData = Record<string, AnswerDto>

/**
 * Response from Coordinator API: GET /entity/{entityUuid}/ASSESSMENT
 */
export interface EntityAssessmentResponse {
  sanAssessmentId: string
  sanAssessmentVersion: number
  sanAssessmentData: SanAssessmentData
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
  threshold: number | null
  isHighScoring: boolean
  isLowScoring: boolean
  subArea?: SubAreaData
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
  lifestyleAndAssociates?: CriminogenicNeedArea
}

// sub-area data for areas with nested scoring
// (for example, Lifestyle and associates within Thinking, behaviours and attitudes)
export interface SubAreaData {
  title: string
  score: number | null
  upperBound: number
  threshold: number
}
