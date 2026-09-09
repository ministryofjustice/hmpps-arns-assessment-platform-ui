import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { alcoholFields, alcoholUnitsTable } from './fields'
import { continueButton } from '../../common'
import { Step } from '../../constants/page'
import { stepTitle } from '../../locales'

export const alcoholStep = step({
  path: `/${Step.alcohol.path}`,
  title: stepTitle(Step.alcohol),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    alcoholFields.questions.currentAlcoholUseFrequencyQuestion.displayModes.field,
    alcoholFields.questions.unitsOfAlcoholQuestion.displayModes.field,
    alcoholUnitsTable,
    alcoholFields.questions.bingeDrinkingQuestion.displayModes.field,
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
        next: [redirect({ goto: Step.personal_relationships_and_community.path })],
      },
    }),
  ],
})
