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
import { Section, SectionComplete } from '../../../../constants/section'
import { baseSanRoute } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { CommonOption } from '../../../../constants/commonOption'

export const alcoholUseExcessiveDrinkingPastIssuesStep = step({
  path: `/${Step.alcohol_use_excessive_drinking_past_issues.path}`,
  title: sectionPageTitle(Section.alcohol_use),
  view: {
    locals: {
      backlink: createRoute([...baseSanRoute, Section.alcohol_use.path]),
    },
  },
  blocks: [
    alcoholUseSection.questions.evidenceOfExcessDrinking.displayModes.field,
    alcoholUseSection.questions.pastIssues.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.alcohol_use,
      Step.alcohol_use_excessive_drinking_past_issues,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.alcohol_use_excessive_drinking_past_issues.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.alcohol_use_excessive_drinking_past_issues.code, Section.alcohol_use),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_excessive_drinking_past_issues.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.alcohol_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.alcohol_use,
            Step.alcohol_use_excessive_drinking_past_issues,
          ),
        ],
        next: [
          redirect({
            when: Answer('alcohol_past_issues').match(Condition.Equals(CommonOption.no)),
            goto: Step.alcohol_use_summary.path,
          }),
          redirect({ goto: Step.alcohol_use_stopped_or_reduced.path }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.alcohol_use, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.alcohol_use_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.alcohol_use,
            Step.alcohol_use_excessive_drinking_past_issues,
          ),
        ],
      },
    }),
  ],
})
