import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const alcoholUseSummaryStep = step({
  path: `/${Step.alcohol_use_summary.path}`,
  title: summaryPageTitle(Section.alcohol_use),
  blocks: [summaryTab],
  onAccess: [auditPageView(SanAuditEvent.VIEW_SECTION_SUMMARY, Section.alcohol_use, Step.alcohol_use_summary)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.alcohol_use_summary.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.alcohol_use_summary.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_summary.code, IsUserSubmitted.true)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use, SectionComplete.yes),
          auditPageAction(SanAuditEvent.MARK_SECTION_COMPLETE, Section.alcohol_use, Step.alcohol_use_summary),
        ],
        next: [redirect({ goto: `${Step.alcohol_use_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
