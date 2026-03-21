import { step, submitTransition, redirect, block, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Condition } from '@form-engine/registry/conditions'
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
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'accommodation-summary' })],
      },
    }),
  ],
})
