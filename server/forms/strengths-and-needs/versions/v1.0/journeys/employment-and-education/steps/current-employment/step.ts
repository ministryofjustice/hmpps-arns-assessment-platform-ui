import { step, submitTransition, redirect, block, Post, Answer, and, or } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { currentEmployment } from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const currentEmploymentStep = step({
  path: '/current-employment',
  title: 'Current Employment',
  isEntryPoint: true,
  blocks: [currentEmployment, saveButton],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [
          redirect({
            when: and(
              Answer('current_employment').match(Condition.Equals('EMPLOYED')),
              or(
                Answer('type_of_employment').match(Condition.Equals('FULL_TIME')),
                Answer('type_of_employment').match(Condition.Equals('PART_TIME')),
                Answer('type_of_employment').match(Condition.Equals('TEMPORARY_OR_CASUAL')),
                Answer('type_of_employment').match(Condition.Equals('APPRENTICESHIP')),
              ),
            ),
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
