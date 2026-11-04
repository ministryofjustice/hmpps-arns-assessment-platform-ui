import { Condition, Post, redirect, step, submit, validation, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { financeSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { hasDebt } from '../../section'

export const financeChangesStep = step({
  path: `/${Step.finance_changes.path}`,
  title: sectionPageTitle(Section.finance),
  view: {
    locals: {
      backlink: when(hasDebt)
        .then(createRoute([...baseSanRoute, Section.finance.path, Step.finance_debt.path]))
        .else(createRoute([...baseSanRoute, Section.finance.path, Step.finance_money_management.path])),
    },
    template: 'strengths-and-needs/views/san-step',
  },
  blocks: [financeSection.questions.changes.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.finance, Step.finance_changes)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.finance_changes.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.finance_changes.code, Section.finance),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_changes.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance_changes),
        ],
        next: [
          redirect({
            goto: Step.finance_summary.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance_changes),
        ],
      },
    }),
  ],
})
