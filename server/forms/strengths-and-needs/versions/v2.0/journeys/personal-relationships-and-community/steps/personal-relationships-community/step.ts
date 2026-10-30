import {
  Answer,
  ChainableConditional,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { sectionPageTitle } from '../../../../locales'
import { baseSanRoute } from '../../../../constants/path'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { personalRelationshipsCommunitySection } from '../../section'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'

const backlinkLogic: ChainableConditional = when(
  Answer(Question.personal_relationships_community_children_details)
    .match(Condition.Equals(Option.no_children)),
).then(
    createRoute([
      ...baseSanRoute,
      Section.personal_relationships_and_community.path,
      Step.personal_relationships_children_information.path,
    ]),
  ).else(
    createRoute([
      ...baseSanRoute,
      Section.personal_relationships_and_community.path,
      Step.personal_relationships_any_parenting_responsibilities.path,
    ]),
  )

export const personalRelationshipsCommunityStep = step({
  path: `/${Step.personal_relationships_community.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  view: {
    locals: {
      backlink: backlinkLogic,
    },
  },
  blocks: [
    personalRelationshipsCommunitySection.questions.parentalResponsibilities.displayModes.field,
    personalRelationshipsCommunitySection.questions.familyRelationship.displayModes.field,
    personalRelationshipsCommunitySection.questions.childhood.displayModes.field,
    personalRelationshipsCommunitySection.questions.childhoodBehaviour.displayModes.field,
    personalRelationshipsCommunitySection.questions.belonging.displayModes.field,
    personalRelationshipsCommunitySection.questions.inRelationship.displayModes.field,
    personalRelationshipsCommunitySection.questions.currentRelationship.displayModes.field,
    personalRelationshipsCommunitySection.questions.intimateRelationship.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.personal_relationships_and_community,
      Step.personal_relationships_community,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.personal_relationships_community.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.personal_relationships_community.code, Section.personal_relationships_and_community),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.personal_relationships_community.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(
            Section.personal_relationships_and_community,
            SectionComplete.no,
          ),
          StrengthsAndNeedsEffects.setUserSubmitted(
            Step.personal_relationships_community_summary.code,
            IsUserSubmitted.false,
          ),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.personal_relationships_and_community,
            Step.personal_relationships_community,
          ),
        ],
        next: [redirect({ goto: Step.personal_relationships_domestic_abuse_perpetrator.path })],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(
            Section.personal_relationships_and_community,
            SectionComplete.no,
          ),
          StrengthsAndNeedsEffects.setUserSubmitted(
            Step.personal_relationships_community_summary.code,
            IsUserSubmitted.false,
          ),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.personal_relationships_and_community,
            Step.personal_relationships_community,
          ),
        ],
      },
    }),
  ],
})
