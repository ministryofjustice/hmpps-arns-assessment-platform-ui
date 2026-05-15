import {Condition, Post, redirect, step, submit} from '@ministryofjustice/hmpps-forge/core/authoring'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {employmentStatusAnalysisSummaryTab} from './fields'

export const employmentEducationAnalysisStep = step({
  path: '/employment-education-analysis',
  title: 'Employment and Education Analysis',
  blocks: [employmentStatusAnalysisSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'employment-education-analysis' })],
      },
    }),
  ],
})
