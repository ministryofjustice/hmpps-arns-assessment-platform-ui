import {
  Condition,
  Data,
  Post,
  redirect,
  step,
  submit,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { IsUserSubmitted, Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'
import { commonContentFor, sectionPageTitle } from '../../../../locales'
import { baseSanRoute } from '../../../../constants/path'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { createRoute } from '../../../../../../generators'
import { autosaveSubmit } from '../../../../autosave'

export const thinkingBehavioursSexualHarmStep = step({
  path: `/${Step.thinking_behaviours_sexual_harm.path}`,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  view: {
    locals: {
      sectionTitle: contentFor('step.thinking_behaviours_sexual_harm'),
      pageSubHeading: commonContentFor('sectionTitle.thinking-behaviours-and-attitudes'),
      backlink: createRoute([
        ...baseSanRoute,
        Section.thinking_behaviours_and_attitudes.path,
        Step.thinking_behaviours_risk_of_sexual_harm.path,
      ]),
    },
  },
  blocks: [
    thinkingBehavioursAttitudesSection.questions.sexualPreoccupation.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.offenceRelatedSexualInterest.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.emotionalIntimacy.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.thinking_behaviours_and_attitudes,
      Step.thinking_behaviours_sexual_harm,
    ),
  ],
  validWhen: [
    validation({
      condition: Data(Step.thinking_behaviours_sexual_harm.code).match(Condition.Equals(IsUserSubmitted.true)),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.thinking_behaviours_sexual_harm.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours_sexual_harm.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinking_behaviours_sexual_harm,
          ),
        ],
        next: [
          redirect({
            goto: Step.thinking_behaviours_summary.path,
          }),
        ],
      },
    }),
  ],
})
