import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { financeSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'

export const financeStep = step({
  path: `/${Step.finance.path}`,
  title: sectionPageTitle(Section.finance),
  reachability: { entryWhen: true },
  blocks: [
    financeSection.fields.income.displayModes.field,
    financeSection.fields.bankAccount.displayModes.field,
    financeSection.fields.moneyManagement.displayModes.field,
    financeSection.fields.gambling.displayModes.field,
    financeSection.fields.debt.displayModes.field,
    financeSection.fields.changes.displayModes.field,
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
          StrengthsAndNeedsEffects.setSectionProgress(Section.finance.statusKey, SectionComplete.no),
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
