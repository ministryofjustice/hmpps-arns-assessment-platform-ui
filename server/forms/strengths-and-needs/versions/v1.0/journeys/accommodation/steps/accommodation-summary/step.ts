import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { Section, SectionStatus } from '../../../../constants/section'
import { Step } from '../../constants/step'
import { accommodationSummaryTab } from './fields'

export const accommodationSummaryStep = step({
  path: `/${Step.accommodation_summary.path}`,
  title: 'Accommodation summary', // TODO: contentFor('step.accommodation_summary')
  blocks: [accommodationSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation.statusKey, SectionStatus.complete),
        ],
        next: [redirect({ goto: Step.accommodation_analysis.path })],
      },
    }),
  ],
})
