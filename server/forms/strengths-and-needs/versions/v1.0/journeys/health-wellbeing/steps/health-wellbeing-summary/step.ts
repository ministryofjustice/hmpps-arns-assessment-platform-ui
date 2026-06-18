import {Condition, Post, redirect, step, submit,} from '@ministryofjustice/hmpps-forge/core/authoring'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {healthWellbeingSummaryTab} from './fields'

export const healthWellbeingSummaryStep = step({
  path: '/health-wellbeing-summary',
  title: 'Health and Wellbeing Summary',
  view: {
    template: 'strengths-and-needs/views/san-step',
  },
  blocks: [healthWellbeingSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress('health_section_status', 'COMPLETE')
        ],
        next: [redirect({ goto: 'health-wellbeing-analysis' })],
      },
    }),
  ],
})
