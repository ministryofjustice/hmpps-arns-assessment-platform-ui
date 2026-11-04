import {
  Answer,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { financeSection, hasFamilyOrFriendsIncome } from '../../section'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { Question } from '../../constants/question'
import { CommonOption } from '../../../../constants/commonOption'

const answeredNo = Answer(Question.finance_concerns).match(Condition.Equals(CommonOption.no))

export const financeConcernsStep = step({
  path: `/${Step.finance_concerns.path}`,
  title: sectionPageTitle(Section.finance),
  view: {
    locals: {
      backlink: when(hasFamilyOrFriendsIncome)
        .then(createRoute([...baseSanRoute, Section.finance.path, Step.community_finance_income_friends_family.path]))
        .else(createRoute([...baseSanRoute, Section.finance.path, Step.finance_income.path])),
    },
    template: 'strengths-and-needs/views/san-step',
  },
  blocks: [financeSection.questions.financialConcerns.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.finance, Step.finance_concerns)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.finance_concerns.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.finance_concerns.code, Section.finance),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_concerns.code)],
      },
      onValid: {
        effects: [
          // AC 7: When "No", default all downstream finance questions to NULL.
          // TODO: Replace with agreed default value logic once confirmed.
          StrengthsAndNeedsEffects.clearFinanceConcernsDownstreamAnswers(),
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance_concerns),
        ],
        next: [
          redirect({
            when: answeredNo,
            goto: Step.finance_summary.path,
          }),
          redirect({
            goto: Step.finance_money_management.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.finance, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.finance_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.finance, Step.finance_concerns),
        ],
      },
    }),
  ],
})
