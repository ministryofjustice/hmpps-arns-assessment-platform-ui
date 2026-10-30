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
import { CommonOption } from '../../../../constants/commonOption'
import { sectionTitleClass } from '../../../../constants/formVersion'

const backlinkLogic: ChainableConditional = when(
  Answer(Question.personal_relationships_community_domestic_abuse_victim)
    .match(Condition.Equals(CommonOption.yes)),
).then(
    createRoute([
      ...baseSanRoute,
      Section.personal_relationships_and_community.path,
      Step.personal_relationships_domestic_abuse_victim_by.path,
    ]),
  ).else(
    createRoute([
      ...baseSanRoute,
      Section.personal_relationships_and_community.path,
      Step.personal_relationships_domestic_abuse_victim.path,
    ]),
  )

export const personalRelationshipsWantToMakeChangesStep = step({
  path: `/${Step.personal_relationships_want_to_make_changes.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  view: {
    locals: {
      sectionTitleClass,
      backlink: backlinkLogic,
    },
  },
  blocks: [personalRelationshipsCommunitySection.questions.changes.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.personal_relationships_and_community,
      Step.personal_relationships_want_to_make_changes,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.personal_relationships_want_to_make_changes.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.personal_relationships_want_to_make_changes.code, Section.personal_relationships_and_community),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.personal_relationships_want_to_make_changes.code)],
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
            Step.personal_relationships_want_to_make_changes,
          ),
        ],
        next: [redirect({ goto: Step.personal_relationships_community_summary.path })],
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
            Step.personal_relationships_want_to_make_changes,
          ),
        ],
      },
    }),
  ],
})
