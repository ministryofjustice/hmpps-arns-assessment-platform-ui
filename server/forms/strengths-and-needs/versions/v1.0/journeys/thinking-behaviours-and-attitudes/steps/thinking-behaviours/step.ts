import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { sectionPageTitle } from '../../../../locales'
import { thinkingBehavioursAttitudesSection } from '../../section'

export const thinkingBehavioursStep = step({
  path: `/${Step.thinkingBehaviours.path}`,
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
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.thinking_behaviours_and_attitudes, SectionComplete.no),
        ],
        next: [
          redirect({
            goto: Step.thinkingBehavioursRiskOfSexualHarm.path,
          }),
        ],
      },
    }),
  ],
})
