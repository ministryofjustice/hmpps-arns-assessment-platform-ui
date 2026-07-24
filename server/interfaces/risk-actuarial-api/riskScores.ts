export type Type = 'STATIC' | 'DYNAMIC' | 'COMBINED'
export type Band = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'NOT_APPLICABLE'
export type ProblemLevel = 'NO_PROBLEMS' | 'SOME_PROBLEMS' | 'SIGNIFICANT_PROBLEMS'
export type MotivationLevel = 'FULL_MOTIVATION' | 'PARTIAL_MOTIVATION' | 'NO_MOTIVATION'
export type CurrentRelationshipStatus =
  | 'NOT_IN_RELATIONSHIP'
  | 'IN_RELATIONSHIP_LIVING_TOGETHER'
  | 'IN_RELATIONSHIP_NOT_LIVING_TOGETHER'
export type PreviousConviction =
  | 'HOMICIDE'
  | 'WOUNDING_GBH'
  | 'KIDNAPPING'
  | 'FIREARMS'
  | 'ROBBERY'
  | 'AGGRAVATED_BURGLARY'
  | 'WEAPON'
  | 'CRIMINAL_DAMAGE'
  | 'ARSON'
export type SupervisionStatus = 'CUSTODY' | 'COMMUNITY' | 'REMAND'

export interface RiskScores {
  actuarialPredictors: {
    allPredictor: {
      algorithm: string
      type?: Type
      modelVersion: string
      thresholdsVersion: string
      output: {
        band?: Band
        score?: number
      }
      featureValues: Record<string, number>
      validationErrors: ValidationError[]
    }
    violentPredictor: {
      algorithm: string
      type?: Type
      modelVersion: string
      thresholdsVersion: string
      output: {
        band?: Band
        score?: number
      }
      featureValues: Record<string, number>
      validationErrors: ValidationError[]
    }
    directContactSexualPredictor: DirectContactSexualPredictorResponse
    indirectContactSexualPredictor: IndirectContactSexualPredictorResponse
    seriousViolentPredictor: SeriousViolentPredictorResponse
    seriousPredictor: {
      algorithm: string
      type?: Type
      modelVersion: string
      thresholdsVersion: string
      output: {
        band?: Band
        overallScore?: number
        femaleVersion?: boolean
        hasSexualOffenceHistory?: boolean
        componentScores: SeriousPredictorComponentScores
      }
      featureValues: Record<string, number>
      validationErrors: ValidationError[]
    }
  }
}

export interface RiskScoreInput {
  gender?: string
  assessmentDate?: string,
  dateOfBirth?: string
  dateOfCurrentConviction?: string
  dateAtStartOfFollowup?: string
  totalNumberOfSanctionsForAllOffences?: number
  ageAtFirstSanction?: number
  currentOffenceCode?: string
  totalNumberOfViolentSanctions?: number
  isUnemployed?: boolean
  currentAlcoholUseProblems?: ProblemLevel
  excessiveAlcoholUse?: ProblemLevel
  temperControl?: ProblemLevel
  proCriminalAttitudes?: ProblemLevel
  regularOffendingActivities?: ProblemLevel
  motivationToTackleDrugMisuse?: MotivationLevel
  impulsivityProblems?: ProblemLevel
  supervisionStatus?: SupervisionStatus
  hasEverCommittedSexualOffence?: boolean
  didOffenceInvolveCarryingOrUsingWeapon?: boolean
  evidenceOfDomesticAbuse?: boolean
  totalContactAdultSexualSanctions?: number
  totalContactChildSexualSanctions?: number
  totalIndecentImageSanctions?: number
  totalNonContactSexualOffences?: number
  dateOfMostRecentSexualOffence?: string
  isCurrentOffenceAgainstVictimStranger?: boolean
  suitabilityOfAccommodation?: ProblemLevel
  currentRelationshipWithPartner?: ProblemLevel
  currentRelationshipStatus?: CurrentRelationshipStatus
  previousConvictions?: PreviousConviction[]
  isCurrentOffenceSexuallyMotivated?: boolean
  mostRecentOffenceDate?: string
  hasHeroinUsage?: boolean
  hasOtherOpiateUsage?: boolean
  hasCrackCocaineUsage?: boolean
  hasPowderCocaineUsage?: boolean
  hasMisusedPrescriptionDrugUsage?: boolean
  hasBenzodiazepinesUsage?: boolean
  hasCannabisUsage?: boolean
  hasSteroidsUsage?: boolean
  hasOtherDrugsUsage?: boolean
  hasKetamineUsage?: boolean
  hasSpiceUsage?: boolean
  hasHallucinogensUsage?: boolean
  hasSolventsUsage?: boolean
  hasMethadoneUsage?: boolean
}

export interface ValidationError {
  type: string
  message: string
  fields: string[]
}

interface DirectContactSexualPredictorResponse {
  algorithm: string
  type?: Type
  modelVersion: string
  thresholdsVersion: string
  output: {
    band?: Band
    score?: number
    pointScore?: number
    femaleVersion?: boolean
    hasSexualOffenceHistory?: boolean
    riskBandReductionApplied?: boolean
  }
  featureValues: Record<string, number>
  validationErrors: ValidationError[]
}

interface IndirectContactSexualPredictorResponse {
  algorithm: string
  type?: Type
  modelVersion: string
  thresholdsVersion: string
  output: {
    band?: Band
    score?: number
    femaleVersion?: boolean
    hasSexualOffenceHistory?: boolean
  }
  featureValues: Record<string, number>
  validationErrors: ValidationError[]
}

interface SeriousViolentPredictorResponse {
  algorithm: string
  type?: Type
  modelVersion: string
  thresholdsVersion: string
  output: {
    band?: Band
    score?: number
  }
  featureValues: Record<string, number>
  validationErrors: ValidationError[]
}

interface SeriousPredictorComponentScores {
  directContactSexualPredictorScore: DirectContactSexualPredictorResponse
  indirectContactSexualPredictorScore: IndirectContactSexualPredictorResponse
  seriousViolentPredictorScore: SeriousViolentPredictorResponse
}
