import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { summaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const thinkingBehavioursSummaryStep = step({
  path: `/${Step.thinkingBehavioursSummary.path}`,
  title: summaryPageTitle(Section.thinking_behaviours_and_attitudes),
  blocks: [summaryTab],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_SECTION_SUMMARY,
      Section.thinking_behaviours_and_attitudes,
      Step.thinkingBehavioursSummary,
    ),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.yes),
          auditPageAction(
            SanAuditEvent.MARK_SECTION_COMPLETE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinkingBehavioursSummary,
          ),
        ],
        next: [redirect({ goto: Step.thinkingBehavioursAnalysis.path })],
      },
    }),
  ],
})
