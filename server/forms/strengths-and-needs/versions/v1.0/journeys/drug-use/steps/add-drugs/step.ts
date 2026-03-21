import { step, submitTransition, redirect, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { selectMisusedDrugs } from './fields'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const addDrugsStep = step({
  path: '/add-drugs',
  title: 'Add drugs',
  blocks: [selectMisusedDrugs, saveButton],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'drug-details' })],
      },
    }),
  ],
})
