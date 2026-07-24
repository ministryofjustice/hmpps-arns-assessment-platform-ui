import { defineEffectFunctions, EffectFunctionExpr } from '@ministryofjustice/hmpps-forge/core/authoring'
import { unwrapAll, wrapAll } from '../../../data/aap-api/wrappers'
import { TieringAssessmentEffectsDeps } from '../@types/TieringAssessmentEffectsDeps'
import { TieringAssessmentEffectContext } from '../@types/TieringAssessmentEffectContext'

export interface TieringAssessmentEffectShape {
  InitialiseAssessment: () => EffectFunctionExpr
  SetupUUIDInData: () => EffectFunctionExpr
  LoadAssessmentData: () => EffectFunctionExpr
  SaveAssessmentData: () => EffectFunctionExpr
  SetAssessmentComplete: () => EffectFunctionExpr
  LogSomething: () => EffectFunctionExpr
}

export const { effects: TieringAssessmentEffects, implementations: TieringAssessmentEffectsImplementations } =
  defineEffectFunctions<TieringAssessmentEffectShape, TieringAssessmentEffectsDeps>({
    InitialiseAssessment: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
      const assessmentUuid =
        (context.getAnswer('assessment-uuid') as string) ||
        (
          await deps.api.executeCommand({
            type: 'CreateAssessmentCommand',
            assessmentType: 'TIERING_ASSESSMENT',
            formVersion: '0',
            user: context.getState('user'),
            properties: {
              status: { type: 'Single', value: 'DRAFT' },
            },
          })
        ).assessmentUuid

      const session = context.getSession()
      session.assessmentUuid = assessmentUuid
    },
    SetupUUIDInData: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
      const session = context.getSession()
      const assessmentUuid = session.assessmentUuid
      context.setData('assessment-uuid', assessmentUuid)
    },
    LoadAssessmentData: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
      const session = context.getSession()
      const assessmentUuid = session.assessmentUuid

      if (assessmentUuid != null) {
        const assessment = await deps.api.executeQuery({
          type: 'AssessmentVersionQuery',
          user: context.getState('user'),
          assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
        })

        const answers = unwrapAll<Record<string, unknown>>(assessment.answers)
        Object.entries(answers).forEach(([code, value]) => {
          context.setAnswer(code, value)
        })
      }
    },
    SaveAssessmentData: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
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
    SetAssessmentComplete: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
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
    LogSomething: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
      console.log('This is in the invalid block')
    },
  })
