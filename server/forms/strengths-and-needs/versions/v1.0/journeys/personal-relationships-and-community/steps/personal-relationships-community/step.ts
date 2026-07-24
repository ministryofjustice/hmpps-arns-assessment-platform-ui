import { Answer, Condition, not, or, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { contentFor } from '../../locales'
import { sectionPath } from '../../../../constants/path'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { contentBlocks } from './fields'

// allow redirect only if either (makes summary page unreachable unless):
// > child_parental_responsibilities ticked (then this page would have required parenting responsibilities Q user can't bypass
// OR
// > parenting_responsibilities Q doesn't exist on this page (means child_parental_responsibilities wasn't ticked on important_people Q)
const noStaleParentalResponsibilitiesData = or(
  Answer(Question.personal_relationships_community_important_people).match(
    Condition.Array.Contains(Option.child_parental_responsibilities),
  ),
  not(Answer(Question.personal_relationships_community_parental_responsibilities).match(Condition.IsRequired())),
)

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
            when: noStaleParentalResponsibilitiesData,
            goto: Step.personal_relationships_community_summary.path,
          }),
        ],
      },
    }),
  ],
})
