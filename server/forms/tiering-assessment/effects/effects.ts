import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffectContext, TieringAssessmentEffectsDeps } from './types'
import { RiskScoreInput } from '../../../interfaces/risk-actuarial-api/riskScores'

export interface TieringAssessmentEffectShape {
  CalculateRiskActuarialScores: () => EffectFunctionExpr
  InitialiseAssessment: () => EffectFunctionExpr
  LoadAssessmentData: () => EffectFunctionExpr
  SaveAssessmentData: () => EffectFunctionExpr
  SetAssessmentComplete: () => EffectFunctionExpr
}

export const { effects: TieringAssessmentEffects, implementations: TieringAssessmentEffectsImplementations } =
  defineEffectFunctions<TieringAssessmentEffectShape, TieringAssessmentEffectsDeps>({
    CalculateRiskActuarialScores: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
      const riskScoreInput: RiskScoreInput = {
        gender: context.getAnswer('gender') as string,
        dateOfBirth: context.getAnswer('date-of-birth') as string,
        dateOfCurrentConviction: context.getAnswer('date-of-current-conviction') as string,
        dateAtStartOfFollowupCalculated: context.getAnswer('date-at-start-of-followup') as string,
        totalNumberOfSanctionsForAllOffences: Number(context.getAnswer('total-number-of-sanctions') as string),
        ageAtFirstSanction: Number(context.getAnswer('age-at-first-sanction')),
        currentOffenceCode: context.getAnswer('offence-code') as string,
      }
      const riskScores = await deps.riskActuarialApi.getRiskScores(riskScoreInput)
      context.setAnswer('risk-scores-ogrs3', riskScores.actuarialPredictors.allPredictor.output)
      context.setAnswer('risk-scores-ogrs3-errors', JSON.stringify(riskScores.actuarialPredictors.allPredictor.validationErrors))
    },
    InitialiseAssessment: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      // TODO
    },
    LoadAssessmentData: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      // TODO
    },
    SaveAssessmentData: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      // TODO
    },
    SetAssessmentComplete: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      // TODO
    },
  })
