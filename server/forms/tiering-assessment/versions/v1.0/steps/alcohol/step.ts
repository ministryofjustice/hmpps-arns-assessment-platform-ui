import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { currentAlcoholUseFrequencyField, bingeDrinkingField, unitsOfAlcoholField, alcoholUnitsTable } from './fields'
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
  blocks: [currentAlcoholUseFrequencyField, unitsOfAlcoholField, alcoholUnitsTable, bingeDrinkingField, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [redirect({ goto: Step.personal_relationships_and_community.path })],
      },
    }),
  ],
})
