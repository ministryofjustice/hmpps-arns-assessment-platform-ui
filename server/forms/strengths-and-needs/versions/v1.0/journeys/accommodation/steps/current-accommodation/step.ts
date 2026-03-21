import { step, submitTransition, redirect, block, Post, Answer, and, or } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { currentAccommodation } from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const currentAccommodationStep = step({
  path: '/current-accommodation',
  title: 'Current accommodation',
  isEntryPoint: true,
  blocks: [currentAccommodation, saveButton],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [
          redirect({
            when: Answer('current_accommodation').match(Condition.Equals('SETTLED')),
            goto: 'settled-accommodation',
          }),
          redirect({
            when: and(
              Answer('current_accommodation').match(Condition.Equals('TEMPORARY')),
              or(
                Answer('type_of_temporary_accommodation').match(Condition.Equals('SHORT_TERM')),
                Answer('type_of_temporary_accommodation').match(Condition.Equals('IMMIGRATION')),
              ),
            ),
            goto: 'temporary-accommodation',
          }),
          redirect({
            when: Answer('current_accommodation').match(Condition.Equals('TEMPORARY')),
            goto: 'temporary-accommodation-cas-ap',
          }),
          redirect({
            when: Answer('current_accommodation').match(Condition.Equals('NO_ACCOMMODATION')),
            goto: 'no-accommodation',
          }),
        ],
      },
    }),
  ],
})
