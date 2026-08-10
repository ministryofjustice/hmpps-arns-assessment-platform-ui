import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { sectionPageTitle } from '../../../../locales'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { personalRelationshipsCommunitySection } from '../../section'

export const personalRelationshipsStep = step({
  path: `/${Step.personal_relationships.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  view: {
    locals: {
      sectionTitleClass,
      backlink: sectionPath(Section.personal_relationships_and_community),
    },
  },
  blocks: [personalRelationshipsCommunitySection.fields.importantPeople.displayModes.field, saveButton],
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
