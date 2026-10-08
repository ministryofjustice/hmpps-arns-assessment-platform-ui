import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition } from '../../../../constants/userSubmitted'

export const thinkingBehavioursAttitudesSummaryStep = step({
  path: `/${Step.thinking_behaviours_attitudes_summary.path}`,
  title: summaryPageTitle(Section.thinking_behaviours_and_attitudes),
  blocks: [summaryTab],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_SECTION_SUMMARY,
      Section.thinking_behaviours_and_attitudes,
      Step.thinking_behaviours_attitudes_summary,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.thinking_behaviours_attitudes_summary.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.thinking_behaviours_attitudes_summary.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours_attitudes_summary.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.yes),
          auditPageAction(
            SanAuditEvent.MARK_SECTION_COMPLETE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinking_behaviours_attitudes_summary,
          ),
        ],
        next: [redirect({ goto: `${Step.thinking_behaviours_attitudes_analysis.path}#practitioner-analysis` })],
      },
    }),
  ],
})
