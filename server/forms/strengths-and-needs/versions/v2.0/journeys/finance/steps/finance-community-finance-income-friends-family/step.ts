import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { financeSection } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'

export const overReliantOnFamilyOrFriendsStep = step({
  path: `/${Step.community_finance_income_friends_family.path}`,
  title: sectionPageTitle(Section.finance),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.finance.path, Step.finance_income.path]),
    },
    template: 'strengths-and-needs/views/san-step',
  },
  blocks: [financeSection.questions.overReliantOnFamilyOrFriends.displayModes.field, saveButton],
  onAccess: [
    auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.finance, Step.community_finance_income_friends_family),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.community_finance_income_friends_family.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.community_finance_income_friends_family.code, Section.finance),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.community_finance_income_friends_family.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.finance,
            Step.community_finance_income_friends_family,
          ),
        ],
        next: [
          redirect({
            goto: Step.finance_concerns.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.finance,
            Step.community_finance_income_friends_family,
          ),
        ],
      },
    }),
  ],
})
