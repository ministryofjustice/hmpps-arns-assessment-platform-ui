import {Answer, block, Condition, Post, redirect, step, submit,} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKButton} from '@ministryofjustice/hmpps-forge/govuk-components'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {currentEmployment, employmentProgressStatus} from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const currentEmploymentStep = step({
  path: '/current-employment',
  title: 'Current Employment',
  reachability: { entryWhen: true },
  blocks: [currentEmployment, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [
          redirect({
            goto: 'employed',
          }),
          redirect({
            when: Answer('current_employment').match(Condition.Equals('SELF_EMPLOYED')),
            goto: 'employed',
          }),
          redirect({
            when: Answer('current_employment').match(Condition.Equals('RETIRED')),
            goto: 'employed',
          }),
        ],
      },
    }),
  ],
})
