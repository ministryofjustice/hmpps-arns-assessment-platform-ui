import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { drugsSummaryTab } from './fields'

export const drugUseSummaryStep = step({
  path: '/drug-use-summary',
  title: 'Drug use analysis',
  blocks: [drugsSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'drug-use-analysis#practitioner-analysis' })],
      },
    }),
  ],
})
