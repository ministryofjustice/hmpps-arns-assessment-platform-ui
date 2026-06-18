import { block, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  financeBankAccount,
  financeChanges,
  financeDebt,
  financeGambling,
  financeIncome,
  financeMoneyManagement,
} from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const financeStep = step({
  path: '/finance',
  title: 'Finance',
  reachability: { entryWhen: true },
  blocks: [
    financeIncome,
    financeBankAccount,
    financeMoneyManagement,
    financeGambling,
    financeDebt,
    financeChanges,
    saveButton,
  ],
  view: {
    template: 'strengths-and-needs/views/san-step',
  },
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress('finance_section_status', 'INCOMPLETE'),
        ],
        next: [
          redirect({
            goto: 'finance-summary',
          }),
        ],
      },
    }),
  ],
})
