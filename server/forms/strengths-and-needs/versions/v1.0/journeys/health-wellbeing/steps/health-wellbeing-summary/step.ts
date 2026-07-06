import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSummaryTab } from './fields'
import { Step } from '../../constants/step'

export const healthWellbeingSummaryStep = step({
  path: `/${Step.health_wellbeing_summary.path}`,
  title: 'Health and Wellbeing Summary',
  blocks: [healthWellbeingSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress('health_section_status', 'COMPLETE'),
        ],
        next: [redirect({ goto: 'health-wellbeing-analysis' })],
      },
    }),
  ],
})
