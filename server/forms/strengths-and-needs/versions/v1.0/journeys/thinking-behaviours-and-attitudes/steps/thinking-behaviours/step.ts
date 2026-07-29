import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  thinkingBehavioursConsequences,
  thinkingBehavioursStableBehaviour,
  thinkingBehavioursOffendingActivities,
  thinkingBehavioursPeerPressure,
  thinkingBehavioursProblemSolving,
  thinkingBehavioursPeoplesViews,
  thinkingBehavioursManipulativePredatoryBehaviour,
  thinkingBehavioursTemperManagement,
  thinkingBehavioursViolenceControllingBehaviour,
  thinkingBehavioursImpulsiveBehaviour,
  thinkingBehavioursPositiveAttitude,
  thinkingBehavioursHostileOrientation,
  thinkingBehavioursSupervision,
  thinkingBehavioursCriminalBehaviour,
  thinkingBehavioursChanges,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { contentFor } from '../../locales'

export const thinkingBehavioursStep = step({
  path: `/${Step.thinkingBehaviours.path}`,
  title: contentFor('step.thinking_behaviours'),
  reachability: { entryWhen: true },
  blocks: [
    thinkingBehavioursConsequences,
    thinkingBehavioursStableBehaviour,
    thinkingBehavioursOffendingActivities,
    thinkingBehavioursPeerPressure,
    thinkingBehavioursProblemSolving,
    thinkingBehavioursPeoplesViews,
    thinkingBehavioursManipulativePredatoryBehaviour,
    thinkingBehavioursTemperManagement,
    thinkingBehavioursViolenceControllingBehaviour,
    thinkingBehavioursImpulsiveBehaviour,
    thinkingBehavioursPositiveAttitude,
    thinkingBehavioursHostileOrientation,
    thinkingBehavioursSupervision,
    thinkingBehavioursCriminalBehaviour,
    thinkingBehavioursChanges,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.thinking_behaviours_and_attitudes.statusKey,
            SectionStatus.incomplete,
          ),
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
