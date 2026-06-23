import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  financeBankAccount,
  financeChanges,
  financeDebt,
  financeGambling,
  financeIncome,
  financeMoneyManagement,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'

export const financeStep = step({
  path: '/' + Step.finance.path,
  title: 'Finance', // TODO: contentFor('step.finance')
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
          StrengthsAndNeedsEffects.setSectionProgress(Section.finance.statusKey, SectionStatus.incomplete),
        ],
        next: [
          redirect({
            goto: Step.financeSummary.path,
          }),
        ],
      },
    }),
  ],
})
