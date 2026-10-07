import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { sectionPageTitle } from '../../../../locales'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { personalRelationshipsCommunitySection } from '../../section'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const personalRelationshipsStep = step({
  path: `/${Step.personal_relationships.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  view: {
    locals: {
      sectionTitleClass,
      backlink: createRoute([...baseSanRoute, Section.personal_relationships_and_community.path]),
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
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.personal_relationships.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.personal_relationships.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.personal_relationships.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.personal_relationships_and_community, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(
            Step.personal_relationships_community_summary.code,
            IsUserSubmitted.false,
          ),
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
