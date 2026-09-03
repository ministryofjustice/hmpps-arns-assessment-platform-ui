import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { financeSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const financeStep = step({
  path: `/${Step.finance.path}`,
  title: sectionPageTitle(Section.finance),
  reachability: { entryWhen: true },
  blocks: [
    financeSection.questions.income.displayModes.field,
    financeSection.questions.bankAccount.displayModes.field,
    financeSection.questions.moneyManagement.displayModes.field,
    financeSection.questions.gambling.displayModes.field,
    financeSection.questions.debt.displayModes.field,
    financeSection.questions.changes.displayModes.field,
    saveButton,
  ],
  view: {
    template: 'strengths-and-needs/views/san-step',
  },
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.finance, Step.finance)],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.finance, SectionComplete.no),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance),
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
