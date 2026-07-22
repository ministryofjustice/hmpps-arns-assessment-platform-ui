import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  thinkingBehavioursSexualPreoccupation,
  thinkingBehavioursOffenceRelatedSexualInterest,
  thinkingBehavioursEmotionalIntimacy,
} from './fields'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'

export const thinkingBehavioursSexualHarmStep = step({
  path: `/${Step.thinkingBehavioursSexualHarm.path}`,
  title: 'Risk of sexual harm', // TODO: contentFor('step.thinking_behaviours_sexual_harm')
  reachability: { entryWhen: true },
  blocks: [
    thinkingBehavioursSexualPreoccupation,
    thinkingBehavioursOffenceRelatedSexualInterest,
    thinkingBehavioursEmotionalIntimacy,
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
            goto: Step.thinkingBehavioursSummary.path,
          }),
        ],
      },
    }),
  ],
})
