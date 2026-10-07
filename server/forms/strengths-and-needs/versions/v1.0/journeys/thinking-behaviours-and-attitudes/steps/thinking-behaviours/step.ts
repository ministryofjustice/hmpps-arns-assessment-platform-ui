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

export const thinkingBehavioursStep = step({
  path: `/${Step.thinking_behaviours.path}`,
  title: sectionPageTitle(Section.thinking_behaviours_and_attitudes),
  reachability: { entryWhen: true },
  blocks: [
    thinkingBehavioursAttitudesSection.questions.consequences.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.stableBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.offendingActivities.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.peerPressure.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.problemSolving.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.peoplesViews.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.manipulativePredatoryBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.temperManagement.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.violenceControllingBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.impulsiveBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.positiveAttitude.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.hostileOrientation.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.supervision.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.criminalBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.questions.changes.displayModes.field,
    saveButton,
  ],
  onAccess: [
    auditPageView(
      SanAuditEvent.VIEW_QUESTION_PAGE,
      Section.thinking_behaviours_and_attitudes,
      Step.thinking_behaviours,
    ),
  ],
  validWhen: [
    validation({
      condition: isUserSubmittedCondition(Step.thinking_behaviours.code),
      message: 'This step is not user submitted',
    }),
  ],
  onSubmission: [
    autosaveSubmit(Step.thinking_behaviours.code),
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onAlways: {
        effects: [StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours.code)],
      },
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveAndClearStaleAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
          StrengthsAndNeedsEffects.setUserSubmitted(Step.thinking_behaviours_summary.code, IsUserSubmitted.false),
          auditPageAction(
            SanAuditEvent.SAVE_QUESTION_PAGE,
            Section.thinking_behaviours_and_attitudes,
            Step.thinking_behaviours,
          ),
        ],
        next: [
          redirect({
            goto: Step.thinking_behaviours_risk_of_sexual_harm.path,
          }),
        ],
      },
    }),
  ],
})
