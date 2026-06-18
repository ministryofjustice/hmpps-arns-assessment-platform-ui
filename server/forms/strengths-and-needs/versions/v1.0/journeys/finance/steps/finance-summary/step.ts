import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { summaryTab } from './fields'

export const financeSummaryStep = step({
  path: '/finance-summary',
  title: 'Finance Summary',
  view: {
    template: 'strengths-and-needs/views/san-step',
  },
  blocks: [summaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress('finance_section_status', 'COMPLETE'),
        ],
        next: [redirect({ goto: 'finance-analysis' })],
      },
    }),
  ],
})
