import {
  Answer,
  ChainableConditional,
  Condition,
  not,
  Post,
  redirect,
  step,
  submit,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
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
import { CommonOption } from '../../../../constants/commonOption'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { Option } from '../../constants/option'

const backlinkLogic: ChainableConditional = when(
  Answer(Question.personal_relationships_community_domestic_abuse_perpetrator)
    .match(Condition.Equals(CommonOption.no)),
).then(
    createRoute([
      ...baseSanRoute,
      Section.personal_relationships_and_community.path,
      Step.personal_relationships_domestic_abuse_perpetrator.path,
    ]),
  ).else(
    when(
      not(
        Answer(Question.personal_relationships_community_domestic_abuse_against)
          .match(Condition.Array.Contains(Option.intimate_partner || Option.family_member_and_intimate_partner)),
      ),
    ).then(
        createRoute([
          ...baseSanRoute,
          Section.personal_relationships_and_community.path,
          Step.personal_relationships_domestic_abuse_against.path,
        ]),
      ).else(
        createRoute([
          ...baseSanRoute,
          Section.personal_relationships_and_community.path,
          Step.personal_relationships_strangulation.path,
        ]),
      ),
  )

export const personalRelationshipsDomesticAbuseVictimStep = step({
  path: `/${Step.personal_relationships_domestic_abuse_victim.path}`,
  title: sectionPageTitle(Section.personal_relationships_and_community),
  view: {
    locals: {
      sectionTitleClass,
      backlink: backlinkLogic,
    },
  },
  blocks: [personalRelationshipsCommunitySection.questions.domesticAbuseVictim.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.personal_relationships_and_community,
      Step.personal_relationships_domestic_abuse_victim,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.personal_relationships_domestic_abuse_victim.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(
      Step.personal_relationships_domestic_abuse_victim.code,
      Section.personal_relationships_and_community,
    ),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.personal_relationships_domestic_abuse_victim.code)],
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
            Step.personal_relationships_domestic_abuse_victim,
          ),
        ],
        next: [
          redirect({
            when: Answer(Question.personal_relationships_community_domestic_abuse_victim).match(
              Condition.Equals(CommonOption.yes),
            ),
            goto: Step.personal_relationships_domestic_abuse_victim_by.path,
          }),
          redirect({ goto: Step.personal_relationships_want_to_make_changes.path }),
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
            Step.personal_relationships_domestic_abuse_victim,
          ),
        ],
      },
    }),
  ],
})
