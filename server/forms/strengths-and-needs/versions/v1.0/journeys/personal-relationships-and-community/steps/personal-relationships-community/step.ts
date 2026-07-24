import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { contentFor } from '../../locales'
import { sectionPath } from '../../../../constants/path'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { contentBlocks } from './fields'

export const personalRelationshipsCommunityStep = step({
  path: `/${Step.personal_relationships_community.path}`,
  title: contentFor(`step.personal_relationships_community`),
  view: {
    locals: {
      backlink: sectionPath(Section.personal_relationships_and_community) + Step.personal_relationships.path,
    },
  },
  blocks: [...contentBlocks, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.personal_relationships_and_community.statusKey,
            SectionStatus.incomplete,
          ),
        ],
        next: [
          redirect({
            goto: Step.personal_relationships_community_summary.path,
          }),
        ],
      },
    }),
  ],
})
