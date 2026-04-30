import { step, submit, redirect, block, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { strengthsOrProtectiveFactors, riskOfSeriousHarm, riskOfReoffending } from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save',
  name: 'action',
  value: 'save',
})

export const accommodationSummaryStep = step({
  path: '/accommodation-summary',
  title: 'Accommodation analysis',
  blocks: [strengthsOrProtectiveFactors, riskOfSeriousHarm, riskOfReoffending, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'accommodation-analysis#practitioner-analysis' })],
      },
    }),
  ],
})
