import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { financeSection, hasDebt } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'

export const financeMoneyManagementStep = step({
  path: `/${Step.finance_money_management.path}`,
  title: sectionPageTitle(Section.finance),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.finance.path, Step.finance_concerns.path]),
    },
    template: 'strengths-and-needs/views/san-step',
  },
  blocks: [
    financeSection.questions.moneyManagement.displayModes.field,
    financeSection.questions.debt.displayModes.field,
    saveButton,
  ],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.finance, Step.finance_money_management)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.finance_money_management.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.finance_money_management.code, Section.finance),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_money_management.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.clearFinanceDebtTypeAnswers(),
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance_money_management),
        ],
        next: [
          redirect({
            when: hasDebt,
            goto: Step.finance_debt.path,
          }),
          redirect({
            goto: Step.finance_changes.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance_money_management),
        ],
      },
    }),
  ],
})
