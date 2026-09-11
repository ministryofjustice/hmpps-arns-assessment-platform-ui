import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { thinkingAttitudesBehavioursFields } from './fields'
import { continueButton } from '../../common'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'

export const thinkingAttitudesAndBehavioursStep = step({
  path: `/${Step.thinking_attitudes_and_behaviours.path}`,
  title: stepTitle(Step.thinking_attitudes_and_behaviours),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    thinkingAttitudesBehavioursFields.questions.regularOffendingActivitiesQuestion.displayModes.field,
    thinkingAttitudesBehavioursFields.questions.temperControlQuestion.displayModes.field,
    thinkingAttitudesBehavioursFields.questions.impulsivityProblemsQuestion.displayModes.field,
    thinkingAttitudesBehavioursFields.questions.proCriminalAttitudesQuestion.displayModes.field,
    continueButton,
  ],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CleardownAssessmentData(),
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: Step.offence_analysis.path })],
      },
    }),
  ],
})
