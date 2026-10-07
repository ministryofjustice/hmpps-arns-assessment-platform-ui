import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition } from '../../../../constants/userSubmitted'

export const financeSummaryStep = step({
  path: `/${Step.finance_summary.path}`,
  title: summaryPageTitle(Section.finance),
  blocks: [summaryTab],
  onAccess: [auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.finance, Step.finance_summary)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.finance_summary.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.finance_summary.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.finance, SectionComplete.yes),
          auditPageAction(SanAuditEvent.MARK_SECTION_COMPLETE, Section.finance, Step.finance_summary),
        ],
        next: [redirect({ goto: `${Step.finance_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
