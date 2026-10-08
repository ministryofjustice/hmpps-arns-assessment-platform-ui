import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { financeSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

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
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.finance.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.finance.code, Section.finance),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.finance.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance),
        ],
        next: [
          redirect({
            goto: Step.finance_summary.path,
          }),
        ],
      },
    }),
  ],
})
