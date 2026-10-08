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
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor, sectionPageTitle } from '../../../../locales'
import { CommonOption } from '../../../../constants/commonOption'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { createRoute } from '../../../../../../generators'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { baseSanRoute } from '../../../../constants/path'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'

export const thinkingBehavioursRiskOfSexualHarmStep = step({
  path: `/${Step.thinking_behaviours_attitudes_risk_of_sexual_harm.path}`,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  view: {
    locals: {
      sectionTitle: contentFor('step.thinking_behaviours_sexual_harm'),
      pageSubHeading: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes'),
      sectionTitleClass: 'govuk-body-l',
      backlink: createRoute([
        ...baseSanRoute,
        Section.thinking_behaviours_and_attitudes.path,
        Step.thinking_behaviours_attitudes.path,
      ]),
    },
  },
  blocks: [thinkingBehavioursAttitudesSection.questions.riskSexualHarm.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.thinking_behaviours_and_attitudes,
      Step.thinking_behaviours_attitudes_risk_of_sexual_harm,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours_attitudes_risk_of_sexual_harm.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours_attitudes_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinking_behaviours_attitudes_risk_of_sexual_harm,
          ),
        ],
        next: [
          redirect({
            when: Answer(Question.thinking_behaviours_attitudes_risk_sexual_harm).match(
              Condition.Equals(CommonOption.yes),
            ),
            goto: Step.thinking_behaviours_attitudes_risk_of_sexual_harm_details.path,
          }),
          redirect({
            goto: Step.thinking_behaviours_attitudes_summary.path,
          }),
        ],
      },
    }),
  ],
})
