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
import { drugUseSection } from '../../section'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { CommonOption } from '../../../../constants/commonOption'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { sectionPageTitle } from '../../../../locales'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { saveButton } from '../../../../constants/buttons'
import { autosaveSubmit } from '../../../../autosave'
import { IsUserSubmitted, isUserSubmittedCondition } from '../../../../constants/userSubmitted'

export const drugUseStep = step({
  path: `/${Step.drug_use_status.path}`,
  title: sectionPageTitle(Section.drug_use),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [drugUseSection.questions.drugUse.displayModes.field, saveButton],
  onAccess: [auditPageView(SanAuditEvent.VIEW_QUESTION_PAGE, Section.drug_use, Step.drug_use_status)],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.drug_use_status.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.drug_use_status.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_status.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.drug_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.drug_use_summary.code, IsUserSubmitted.false),
          auditPageAction(SanAuditEvent.SAVE_QUESTION_PAGE, Section.drug_use, Step.drug_use_status),
        ],
        next: [
          redirect({
            when: Answer(Question.drug_use).match(Condition.Equals(CommonOption.yes)),
            goto: Step.drug_use_types.path,
          }),
          redirect({
            when: Answer(Question.drug_use).match(Condition.Equals(CommonOption.no)),
            goto: Step.drug_use_summary.path,
          }),
        ],
      },
    }),
  ],
})
