import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'
import { previousConvictionsFields } from './fields'
import { continueButton } from '../../common'

export const previousConvictionsStep = step({
  path: `/${Step.previous_convictions.path}`,
  title: stepTitle(Step.previous_convictions),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [previousConvictionsFields.questions.previousConvictionsQuestion.displayModes.field, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CleardownAssessmentData(),
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: Step.check_your_answers.path })],
      },
    }),
  ],
})
