import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { sectionPageTitle } from '../../../../locales'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { personalRelationshipsCommunitySection } from '../../section'
import { SanAuditEvent, auditPageAction, auditPageView } from '../../../../audit'

export const personalRelationshipsStep = step({
  path: `/${Step.personal_relationships.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  view: {
    locals: {
      sectionTitleClass,
      backlink: sectionPath(Section.personal_relationships_and_community),
    },
  },
  blocks: [personalRelationshipsCommunitySection.questions.importantPeople.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.personal_relationships_and_community,
      Step.personal_relationships,
    ),
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.personal_relationships_and_community, SectionComplete.no),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.personal_relationships_and_community,
            Step.personal_relationships,
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
