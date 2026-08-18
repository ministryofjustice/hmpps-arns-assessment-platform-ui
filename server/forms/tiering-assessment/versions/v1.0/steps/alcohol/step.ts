import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { currentAlcoholUseFrequencyField, bingeDrinkingField, unitsOfAlcoholField, alcoholUnitsTable } from './fields'
import { continueButton } from '../../common'

export const alcoholStep = step({
  path: '/alcohol',
  title: 'Alcohol',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadForename()],
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
        next: [redirect({ goto: 'personal-relationships-and-community' })],
      },
    }),
  ],
})
