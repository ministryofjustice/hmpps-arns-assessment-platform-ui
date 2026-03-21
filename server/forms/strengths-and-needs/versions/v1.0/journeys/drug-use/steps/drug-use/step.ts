import { step, submitTransition, redirect, Post, Answer } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugUse } from './fields'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugUseStep = step({
  path: '/drug-use',
  title: 'Drug use',
  isEntryPoint: true,
  blocks: [drugUse, saveButton],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [
          redirect({
            when: Answer('drug_use').match(Condition.Equals('YES')),
            goto: 'add-drugs',
          }),
          redirect({
            when: Answer('drug_use').match(Condition.Equals('NO')),
            goto: 'drug-use-summary',
          }),
        ],
      },
    }),
  ],
})
