import { Condition, Post, redirect, step, submit, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { auditPageAction, auditPageView, SanAuditEvent } from '../../../../audit'
import { autosaveSubmit } from '../../../../autosave'
import { isUserSubmittedCondition, IsUserSubmitted } from '../../../../constants/userSubmitted'
import { createRoute } from '../../../../../../generators'
import { baseSanRoute } from '../../../../constants/path'
import { sectionTitleClassV2 } from '../../../../constants/formVersion'

export const thinkingBehavioursAttitudesChangesStep = step({
  path: `/${Step.thinking_behaviours_attitudes_changes.path}`,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  view: {
    locals: {
      sectionTitleClass: sectionTitleClassV2,
      backlink: createRoute([
        ...baseSanRoute,
        Section.thinking_behaviours_and_attitudes.path,
        Step.thinking_behaviours_attitudes.path,
      ]),
    },
  },
  blocks: [thinkingBehavioursAttitudesSection.questions.changes.displayModes.field, saveButton],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.thinking_behaviours_and_attitudes,
      Step.thinking_behaviours_attitudes_changes,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.thinking_behaviours_attitudes_changes.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.thinking_behaviours_attitudes_changes.code, Section.thinking_behaviours_and_attitudes),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours_attitudes_changes.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(
            Step.thinking_behaviours_attitudes_summary.code,
            IsUserSubmitted.false,
          ),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinking_behaviours_attitudes_changes,
          ),
        ],
        next: [
          redirect({
            goto: Step.thinking_behaviours_attitudes_risk_of_sexual_harm.path,
          }),
        ],
      },
      onInvalid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(false),
          StrengthsAndNeedsEffects.setSectionProgressV2(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(
            Step.thinking_behaviours_attitudes_summary.code,
            IsUserSubmitted.false,
          ),
          StrengthsAndNeedsEffects.commitPendingCommands(),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinking_behaviours_attitudes_changes,
          ),
        ],
      },
    }),
  ],
})
