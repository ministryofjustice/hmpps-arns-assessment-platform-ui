import { step, submit, redirect, block, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationChanges } from '../settled-accommodation/fields'
import { suitableHousingPlanned } from '../temporary-accommodation/fields'
import { noAccommodationReason, pastAccommodationDetails } from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const noAccommodationStep = step({
  path: '/no-accommodation',
  title: 'No accommodation',
  blocks: [noAccommodationReason, pastAccommodationDetails, suitableHousingPlanned, accommodationChanges, saveButton],
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
