import {
  Answer,
  block,
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKButton, GovUKTag} from '@ministryofjustice/hmpps-forge/govuk-components'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {currentEmploymentStatus } from './fields'

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
  blocks: [currentEmploymentStatus, saveButton],
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
        ],
      },
    }),
  ],
})
