import {
  step,
  submit,
  redirect,
  block,
  Post,
  Answer,
  and,
  or,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
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
