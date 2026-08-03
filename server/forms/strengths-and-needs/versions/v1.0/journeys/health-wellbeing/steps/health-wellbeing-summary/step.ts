import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthWellbeingSummaryTab } from './fields'
import { Step } from '../../constants/step'
import { summaryPageTitle } from '../../../../locales'
import { Section } from '../../../../constants/section'

export const healthWellbeingSummaryStep = step({
  path: `/${Step.health_wellbeing_summary.path}`,
  title: summaryPageTitle(Section.health_and_wellbeing),
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
