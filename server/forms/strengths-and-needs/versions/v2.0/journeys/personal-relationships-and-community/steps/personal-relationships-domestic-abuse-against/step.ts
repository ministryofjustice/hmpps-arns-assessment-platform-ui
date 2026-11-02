import {
  Answer,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { saveButton } from '../../../../constants/buttons'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionComplete } from '../../../../constants/section'
import { personalRelationshipsCommunitySection } from '../../section'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'

export const personalRelationshipsDomesticAbuseAgainstStep = step({
  path: `/${Step.personal_relationships_domestic_abuse_against.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  view: {
    locals: {
      backlink: createRoute([
        ...baseSanRoute,
        Section.personal_relationships_and_community.path,
        Step.personal_relationships_domestic_abuse_perpetrator.path,
      ]),
    },
  },
  blocks: [
    personalRelationshipsCommunitySection.questions.domesticAbuseAgainst.displayModes.field,
    personalRelationshipsCommunitySection.questions.coerciveBehaviour.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.personal_relationships_and_community,
      Step.personal_relationships_domestic_abuse_against,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.personal_relationships_domestic_abuse_against.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(
      Step.personal_relationships_domestic_abuse_against.code,
      Section.personal_relationships_and_community,
    ),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.personal_relationships_domestic_abuse_against.code)],
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
            Step.personal_relationships_domestic_abuse_against,
          ),
        ],
        next: [
          redirect({
            when: Answer(Question.personal_relationships_community_domestic_abuse_against).match(
              Condition.Array.Contains(Option.intimate_partner || Option.family_member_and_intimate_partner),
            ),
            goto: Step.personal_relationships_strangulation.path,
          }),
          redirect({ goto: Step.personal_relationships_domestic_abuse_victim.path }),
        ],
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
            Step.personal_relationships_domestic_abuse_against,
          ),
        ],
      },
    }),
  ],
})
