import { step, submitTransition, redirect, block, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Condition } from '@form-engine/registry/conditions'
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
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'accommodation-analysis#practitioner-analysis' })],
      },
    }),
  ],
})
