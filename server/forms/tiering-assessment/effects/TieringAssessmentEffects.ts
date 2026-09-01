import {
  defineEffectFunctions,
  EffectFunctionExpr,
  EffectRegistry,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { unwrapAll, wrapAll } from '../../../data/aap-api/wrappers'
import { TieringAssessmentEffectsDeps } from '../@types/TieringAssessmentEffectsDeps'
import { TieringAssessmentEffectContext } from '../@types/TieringAssessmentEffectContext'
import { OffenceCodeDetails } from '../../../interfaces/risk-actuarial-api/offenceCodes'

export interface TieringAssessmentEffectShape {
  InitialiseAssessment: () => EffectFunctionExpr
  SetupUUIDInData: () => EffectFunctionExpr
  LoadAssessmentData: () => EffectFunctionExpr
  SaveAssessmentData: () => EffectFunctionExpr
  SetAssessmentComplete: () => EffectFunctionExpr
  LoadOffenceCodeDetails: () => EffectFunctionExpr
  CalculateRiskActuarialScores: () => EffectFunctionExpr
  LoadCaseData: () => EffectFunctionExpr
  TransformRiskData: () => EffectFunctionExpr

}

export const TieringAssessmentEffectsImplementations = defineEffectFunctions<
  TieringAssessmentEffectShape,
  TieringAssessmentEffectsDeps
>({
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
  SetupUUIDInData: () => async (context: TieringAssessmentEffectContext) => {
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
  LoadOffenceCodeDetails: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
    const session = context.getSession()
    const offenceCodes = (await deps.riskActuarialApiClient.getOffenceCodes())?.offenceCodes
    const assessmentUuid = session.assessmentUuid

    if (assessmentUuid != null) {
      const assessment = await deps.api.executeQuery({
        type: 'AssessmentVersionQuery',
        user: context.getState('user'),
        assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
      })
      const offenceCodeAnswer = assessment.answers['offence-code']
      const key = offenceCodeAnswer?.type === 'Single' ? offenceCodeAnswer.value : undefined
      const offenceDetails: OffenceCodeDetails =
        key && key in offenceCodes ? offenceCodes[key as keyof typeof offenceCodes] : undefined
      context.setData('offence-description', offenceDetails.subCategoryDescription)

    }
  },
  CalculateRiskActuarialScores:
    (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
      await deps.riskActuarialService.calculateAndSaveScores(context)
    },
  LoadCaseData: () => async (context: TieringAssessmentEffectContext) => {
    const forename: string = context.getAnswer('forename') as string
    if (forename) {
      context.setData('caseData', {
        name: {
          forename,
          surname: 'Smith',
          fullName: `${forename} Smith`,
        },
        crn: 'X123456',
        pnc: '01/23456789A',
        dateOfBirth: '1980-01-15',
      })
    }
  },
  TransformRiskData: (deps: TieringAssessmentEffectsDeps) => async (context: TieringAssessmentEffectContext) => {
    context.setData('riskData', deps.riskActuarialService.createV2AssessmentRiskData(context))
  },
})

export const TieringAssessmentEffectsRegistry = new EffectRegistry<TieringAssessmentEffectsDeps>()

export const TieringAssessmentEffects: TieringAssessmentEffectShape = {
  InitialiseAssessment: TieringAssessmentEffectsRegistry.register(
    'InitialiseAssessment',
    TieringAssessmentEffectsImplementations.implementations.InitialiseAssessment,
  ),
  SetupUUIDInData: TieringAssessmentEffectsRegistry.register(
    'SetupUUIDInData',
    TieringAssessmentEffectsImplementations.implementations.SetupUUIDInData,
  ),
  LoadAssessmentData: TieringAssessmentEffectsRegistry.register(
    'LoadAssessmentData',
    TieringAssessmentEffectsImplementations.implementations.LoadAssessmentData,
  ),
  SaveAssessmentData: TieringAssessmentEffectsRegistry.register(
    'SaveAssessmentData',
    TieringAssessmentEffectsImplementations.implementations.SaveAssessmentData,
  ),
  SetAssessmentComplete: TieringAssessmentEffectsRegistry.register(
    'SetAssessmentComplete',
    TieringAssessmentEffectsImplementations.implementations.SetAssessmentComplete,
  ),
  LoadOffenceCodeDetails: TieringAssessmentEffectsRegistry.register(
    'LoadOffenceCodeDetails',
    TieringAssessmentEffectsImplementations.implementations.LoadOffenceCodeDetails,
  ),
  CalculateRiskActuarialScores: TieringAssessmentEffectsRegistry.register(
    'CalculateRiskActuarialScores',
    TieringAssessmentEffectsImplementations.implementations.CalculateRiskActuarialScores,
  ),
  LoadCaseData: TieringAssessmentEffectsRegistry.register(
    'LoadCaseData',
    TieringAssessmentEffectsImplementations.implementations.LoadCaseData,
  ),
  TransformRiskData: TieringAssessmentEffectsRegistry.register(
    'TransformRiskData',
    TieringAssessmentEffectsImplementations.implementations.TransformRiskData,
  ),
}
