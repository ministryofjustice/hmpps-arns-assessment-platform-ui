import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { currentAlcoholUseFrequencyField } from './fields'
import { bingeDrinkingField, continueButton } from '../../common'

export const alcoholStep = step({
  path: '/alcohol',
  title: 'Alcohol',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [currentAlcoholUseFrequencyField, bingeDrinkingField, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [redirect({ goto: 'binge-drinking' })],
      },
    }),
  ],
})
