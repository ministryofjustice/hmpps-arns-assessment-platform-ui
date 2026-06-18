import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffectContext, TieringAssessmentEffectsDeps } from './types'
import { RiskScoreInput } from '../../../interfaces/risk-actuarial-api/riskScores'
import { unwrapAll, wrapAll } from '../../../data/aap-api/wrappers'

export interface TieringAssessmentEffectShape {
  CalculateRiskActuarialScores: () => EffectFunctionExpr
  InitialiseAssessment: () => EffectFunctionExpr
  SetupUUIDInData: () => EffectFunctionExpr
  LoadAssessmentData: () => EffectFunctionExpr
  SaveAssessmentData: () => EffectFunctionExpr
  SetAssessmentComplete: () => EffectFunctionExpr
  LogSomething: () => EffectFunctionExpr
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
      context.setAnswer('risk-scores-ogrs3-score', riskScores.actuarialPredictors.allPredictor.output.twoYearScore)
      context.setAnswer('risk-scores-ogrs3-band', riskScores.actuarialPredictors.allPredictor.output.band)
      context.setAnswer('risk-scores-ogrs3-errors', JSON.stringify(riskScores.actuarialPredictors.allPredictor.validationErrors))
    },
    InitialiseAssessment: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      const assessmentUuid = context.getAnswer('assessment-uuid') as string || (await deps.api.executeCommand({
        type: 'CreateAssessmentCommand',
        assessmentType: 'TIERING_ASSESSMENT',
        formVersion: '0',
        user: context.getState('user'),
        properties: {
          status: { type: 'Single', value: 'DRAFT' },
        },
      })).assessmentUuid

      const session = context.getSession()
      session.assessmentUuid = assessmentUuid
    },
    SetupUUIDInData: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      const session = context.getSession()
      const assessmentUuid = session.assessmentUuid
      context.setData('assessment-uuid', assessmentUuid)
    },
    LoadAssessmentData: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      const session = context.getSession()
      const assessmentUuid = session.assessmentUuid
      const assessment = await deps.api.executeQuery({
        type: 'AssessmentVersionQuery',
        user: context.getState('user'),
        assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
      })

      const answers = unwrapAll<Record<string, unknown>>(assessment.answers)
      Object.entries(answers).forEach(([code, value]) => {
        context.setAnswer(code, value)
      })

    },
    SaveAssessmentData: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      const session = context.getSession()
      const assessmentUuid = session.assessmentUuid

      await deps.api.executeCommand({
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid,
        user: context.getState('user'),
        added: wrapAll(context.getAllAnswers()),
        removed: [],
      })
    },
    SetAssessmentComplete: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      const session = context.getSession()
      const assessmentUuid = session.assessmentUuid

      await deps.api.executeCommand({
        type: 'UpdateAssessmentPropertiesCommand',
        assessmentUuid,
        user: context.getState('user'),
        added: {
          status: { type: 'Single', value: 'COMPLETE' },
        },
        removed: [],
      })
    },
    LogSomething: (deps: TieringAssessmentEffectsDeps)=> async (context: TieringAssessmentEffectContext) => {
      console.log('This is in the invalid block')
    }
  })
