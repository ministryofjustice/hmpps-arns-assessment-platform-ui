import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { personalRelationshipsChildrenInformation } from './fields'
import { contentFor } from '../../locales'

export const personalRelationshipsChildrenInformationStep = step({
  path: `/${Step.personal_relationships_children_information.path}`,
  title: contentFor(`step.personal_relationships_children_information`),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [personalRelationshipsChildrenInformation, saveButton],
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
            goto: Step.personal_relationships.path,
          }),
        ],
      },
    }),
  ],
})
