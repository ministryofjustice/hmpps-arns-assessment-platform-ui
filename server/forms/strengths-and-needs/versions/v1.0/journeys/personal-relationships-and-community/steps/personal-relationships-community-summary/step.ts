import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { personalRelationshipsCommunitySummaryTab } from './fields'
import { summaryPageTitle } from '../../../../locales'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const personalRelationshipsCommunitySummaryStep = step({
  path: `/${Step.personal_relationships_community_summary.path}`,
  title: summaryPageTitle(Section.personal_relationships_and_community),
  blocks: [personalRelationshipsCommunitySummaryTab],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_SECTION_SUMMARY,
      Section.personal_relationships_and_community,
      Step.personal_relationships_community_summary,
    ),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.personal_relationships_and_community,
            SectionComplete.yes,
          ),
          auditPageAction(
            SanAuditEvent.MARK_SECTION_COMPLETE,
            Section.personal_relationships_and_community,
            Step.personal_relationships_community_summary,
          ),
        ],
        next: [redirect({ goto: Step.personal_relationships_community_analysis.path })],
      },
    }),
  ],
})
