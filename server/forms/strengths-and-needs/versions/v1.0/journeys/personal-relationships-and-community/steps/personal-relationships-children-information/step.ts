import {
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { IsUserSubmitted, Section, SectionComplete } from '../../../../constants/section'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { personalRelationshipsCommunitySection } from '../../section'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'

export const personalRelationshipsChildrenInformationStep = step({
  path: `/${Step.personal_relationships_children_information.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [personalRelationshipsCommunitySection.questions.childrenDetails.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.personal_relationships_and_community,
      Step.personal_relationships_children_information,
    ),
  ],
  validWhen: [
    validation({
      condition: Data(Step.personal_relationships_children_information.code).match(
        Condition.Equals(IsUserSubmitted.true),
      ),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.personal_relationships_children_information.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.personal_relationships_children_information.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.personal_relationships_and_community, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(
            Step.personal_relationships_community_summary.code,
            IsUserSubmitted.false,
          ),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.personal_relationships_and_community,
            Step.personal_relationships_children_information,
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
