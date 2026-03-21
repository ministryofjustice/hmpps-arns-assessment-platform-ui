import { step, submitTransition, redirect, block, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { livingWith, suitableHousingLocation, suitableHousing, accommodationChanges } from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const settledAccommodationStep = step({
  path: '/settled-accommodation',
  title: 'Settled accommodation',
  blocks: [livingWith, suitableHousingLocation, suitableHousing, accommodationChanges, saveButton],
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
