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
    thinkingBehavioursAttitudesSection.fields.consequences.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.stableBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.offendingActivities.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.peerPressure.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.problemSolving.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.peoplesViews.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.manipulativePredatoryBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.temperManagement.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.violenceControllingBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.impulsiveBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.positiveAttitude.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.hostileOrientation.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.supervision.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.criminalBehaviour.displayModes.field,
    thinkingBehavioursAttitudesSection.fields.changes.displayModes.field,
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
