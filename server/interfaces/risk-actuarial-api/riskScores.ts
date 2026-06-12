export type Type = 'STATIC' | 'DYNAMIC' | 'COMBINED'
export type Band = 'LOW' | 'MEDIUM' | 'HIGH' | 'VERY_HIGH' | 'NOT_APPLICABLE'

export interface ValidationError {
  type: string
  message: string
  fields: string[]
}

export interface RiskScores {
  actuarialPredictors: {
    allPredictor: {
      type: Type
      output: {
        band: Band
        twoYearScore: number
      }
      validationErrors: ValidationError[]
    }
    violentPredictor: {
      type: Type
      output: {
        band: Band
        twoYearScore: number
      }
      validationErrors: ValidationError[]
    }
    directContactSexualPredictor: {
      type: Type
      output: {
        band: Band
        score: number
      }
      validationErrors: ValidationError[]
    }
    indirectContactSexualPredictor: {
      type: Type
      output: {
        band: Band
        score: number
      }
      validationErrors: ValidationError[]
    }
    seriousViolencePredictor: {
      type: Type
      output: {
        band: Band
        score: number
      }
      validationErrors: ValidationError[]
    }
    seriousPredictor: {
      type: Type
      output: {
        band: Band
        overallScore: number
      }
      validationErrors: ValidationError[]
    }
  }
}

export interface RiskScoreInput {
  gender: string,
  dateOfBirth: string,
  dateOfCurrentConviction: string,
  dateAtStartOfFollowupCalculated: string,
  totalNumberOfSanctionsForAllOffences: number,
  ageAtFirstSanction: number,
  currentOffenceCode: string,
}
