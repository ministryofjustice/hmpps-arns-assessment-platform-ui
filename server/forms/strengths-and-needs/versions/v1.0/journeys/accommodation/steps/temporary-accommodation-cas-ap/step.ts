import { step, submit, redirect, block, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { suitableHousingLocation, suitableHousing, accommodationChanges } from '../settled-accommodation/fields'
import { suitableHousingPlanned } from '../temporary-accommodation/fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const temporaryAccommodationCasApStep = step({
  path: '/temporary-accommodation-cas-ap',
  title: 'Temporary accommodation',
  blocks: [suitableHousingLocation, suitableHousing, suitableHousingPlanned, accommodationChanges, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'accommodation-summary' })],
      },
    }),
  ],
})
