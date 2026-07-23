import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
import { summaryTab } from './fields'

export const thinkingBehavioursSummaryStep = step({
  path: `/${Step.thinkingBehavioursSummary.path}`,
  title: 'Thinking, behaviours and attitudes Summary', // TODO: contentFor('step.thinking_behaviours_summary')
  blocks: [summaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.thinking_behaviours_and_attitudes.statusKey,
            SectionStatus.complete,
          ),
        ],
        next: [redirect({ goto: Step.thinkingBehavioursAnalysis.path })],
      },
    }),
  ],
})
