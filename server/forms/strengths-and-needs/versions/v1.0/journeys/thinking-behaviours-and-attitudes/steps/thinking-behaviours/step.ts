import { Answer, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
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
  thinkingBehavioursRiskSexualHarm,
  thinkingBehavioursChanges,
} from './fields'
import { Step } from '../../constants/step'
import { Question } from '../../constants/question'
import { Option } from '../../constants/option'
import { Section, SectionStatus } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'

export const thinkingBehavioursStep = step({
  path: `/${Step.thinkingBehaviours.path}`,
  title: 'Thinking, behaviours and attitudes', // TODO: contentFor('step.thinking_behaviours')
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
    thinkingBehavioursRiskSexualHarm,
    thinkingBehavioursChanges,
    saveButton,
  ],
  view: {
    template: 'strengths-and-needs/views/san-step',
  },
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
            when: Answer(Question.thinking_behaviours_attitudes_risk_sexual_harm).match(
              Condition.Equals(Option.yes_risk_sexual_harm),
            ),
            goto: Step.thinkingBehavioursSexualHarm.path,
          }),
          redirect({
            goto: Step.thinkingBehavioursSummary.path,
          }),
        ],
      },
    }),
  ],
})
