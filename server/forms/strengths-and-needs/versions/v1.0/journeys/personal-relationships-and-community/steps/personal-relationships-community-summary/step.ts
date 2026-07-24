import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { personalRelationshipsCommunitySummaryTab } from './fields'

export const personalRelationshipsCommunitySummaryStep = step({
  path: `/${Step.personal_relationships_community_summary.path}`,
  title: 'Personal Relationships and Community summary',
  blocks: [personalRelationshipsCommunitySummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.personal_relationships_and_community.statusKey,
            SectionStatus.complete,
          ),
        ],
        next: [redirect({ goto: Step.personal_relationships_community_analysis.path })],
      },
    }),
  ],
})
