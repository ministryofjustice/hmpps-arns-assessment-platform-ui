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
 * Raw response from GET /entity/{entityUuid}/ASSESSMENT
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
 * Linked indicator values from OASys
 */
export type LinkedIndicator = 'YES' | 'NO' | null

/**
 * Motivation levels for making changes
 */
export type MotivationLevel =
  | 'READY_TO_MAKE_CHANGES'
  | 'WANTS_TO_MAKE_CHANGES'
  | 'NEEDS_HELP_TO_MAKE_CHANGES'
  | 'DOES_NOT_WANT_TO_MAKE_CHANGES'
  | null

/**
 * Processed assessment area with extracted and transformed fields
 */
export interface AssessmentArea {
  /** Display name for the area */
  title: string
  /** URL-friendly route segment */
  goalRoute: string
  /** Whether the practitioner has completed this section */
  isAssessmentSectionComplete: boolean
  /** Risk of serious harm indicator (YES/NO/null) */
  linkedToHarm: LinkedIndicator
  /** Risk of reoffending indicator (YES/NO/null) */
  linkedToReoffending: LinkedIndicator
  /** Strengths/protective factors indicator (YES/NO/null) */
  linkedToStrengthsOrProtectiveFactors: LinkedIndicator
  /** Practitioner's analysis of risk of serious harm */
  riskOfSeriousHarmDetails: string
  /** Practitioner's analysis of risk of reoffending */
  riskOfReoffendingDetails: string
  /** Identified strengths or protective factors */
  strengthsOrProtectiveFactorsDetails: string
  /** Motivation to make changes */
  motivationToMakeChanges: MotivationLevel
  /** Calculated score for this area (if applicable) */
  score: number | null
  /** Upper bound threshold for high-scoring classification */
  upperBound: number | null
  /** Whether this area is classified as high-scoring */
  isHighScoring: boolean
  /** Whether this area is classified as low-scoring */
  isLowScoring: boolean
}

/**
 * Assessment areas grouped by category for display
 */
export interface FormattedAssessment {
  /** Areas where the practitioner hasn't completed the section */
  incompleteAreas: AssessmentArea[]
  /** Areas with scores at or above threshold - require attention */
  highScoring: AssessmentArea[]
  /** Areas with scores below threshold - positive indicators */
  lowScoring: AssessmentArea[]
  /** Areas without scoring (e.g., Finance, Health) */
  other: AssessmentArea[]
}

/**
 * Criminogenic needs data from a separate source (e.g., ARNS API)
 * Used to determine linked indicators and scores
 */
export interface CriminogenicNeedArea {
  linkedToHarm: boolean | null
  linkedToReoffending: boolean | null
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
