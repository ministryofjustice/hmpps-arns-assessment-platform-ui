import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { contentFor } from '../../locales'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { personalRelationshipsCommunityImportantPeople } from './fields'

export const personalRelationshipsStep = step({
  path: `/${Step.personal_relationships.path}`,
  title: contentFor(`step.personal_relationships`),
  view: {
    locals: {
      sectionTitleClass,
      backlink: sectionPath(Section.personal_relationships_and_community),
    },
  },
  blocks: [personalRelationshipsCommunityImportantPeople, saveButton],
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
            goto: Step.personal_relationships_community.path,
          }),
        ],
      },
    }),
  ],
})
