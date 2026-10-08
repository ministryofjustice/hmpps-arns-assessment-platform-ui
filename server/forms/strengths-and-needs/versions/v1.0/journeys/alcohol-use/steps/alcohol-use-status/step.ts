import {
  Answer,
  Condition,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { alcoholUseSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { Section, SectionComplete } from '../../../../constants/section'
import { CommonOption } from '../../../../constants/commonOption'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { IsUserSubmitted, isUserSubmittedCondition } from '../../../../constants/userSubmitted'

export const alcoholUseStatusStep = step({
  path: `/${Step.alcohol_use_status.path}`,
  title: sectionPageTitle(Section.alcohol_use),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass: 'govuk-body-l',
    },
  },
  blocks: [alcoholUseSection.questions.alcoholUse.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.alcohol_use, Step.alcohol_use_status)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.alcohol_use_status.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.alcohol_use_status.code, Section.alcohol_use),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_status.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.alcohol_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.alcohol_use, Step.alcohol_use_status),
        ],
        next: [
          redirect({
            when: Answer(Question.alcohol_use).match(Condition.Equals(CommonOption.no)),
            goto: Step.alcohol_use_summary.path,
          }),
          redirect({
            when: Answer(Question.alcohol_use).not.match(Condition.Equals(CommonOption.no)),
            goto: Step.alcohol_use_details.path,
          }),
        ],
      },
    }),
  ],
})
