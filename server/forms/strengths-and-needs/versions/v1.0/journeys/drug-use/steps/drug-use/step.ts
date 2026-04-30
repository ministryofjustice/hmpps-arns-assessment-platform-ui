import { step, submit, redirect, Post, Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
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
  reachability: { entryWhen: true },
  blocks: [drugUse, saveButton],
  onSubmission: [
    submit({
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
