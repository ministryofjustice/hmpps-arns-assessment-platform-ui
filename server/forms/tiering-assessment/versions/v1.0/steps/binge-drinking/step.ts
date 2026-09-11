import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'
import { bingeDrinkingFields } from './fields'
import { continueButton } from '../../common'

export const bingeDrinkingStep = step({
  path: `/${Step.binge_drinking.path}`,
  title: stepTitle(Step.binge_drinking),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [bingeDrinkingFields.questions.bingeDrinkingQuestion.displayModes.field, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CleardownAssessmentData(),
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: Step.personal_relationships_and_community.path })],
      },
    }),
  ],
})
