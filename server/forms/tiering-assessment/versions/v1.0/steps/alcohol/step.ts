import { access, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { alcoholFrequencyLastThreeMonthsField, signsOfBingeDrinkingField, unitsOfAlcoholTypicalDrinkingDayField } from './fields'

export const alcoholStep = step({
  path: '/alcohol',
  title: 'Alcohol',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [alcoholFrequencyLastThreeMonthsField, unitsOfAlcoholTypicalDrinkingDayField, signsOfBingeDrinkingField, GovUKButton({ text: 'Save and continue' })],
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
