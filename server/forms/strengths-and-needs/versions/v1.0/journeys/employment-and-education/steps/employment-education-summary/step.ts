import {
  Condition,
  Post,
  redirect,
  Session,
  step,
  submit,
  tieBreaker
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {StrengthsAndNeedsEffects} from '../../../../../../effects'
import {employmentStatusSummaryTab} from './fields'

export const employmentEducationSummaryStep = step({
  path: '/employment-education-summary',
  title: 'Employment and Education Summary',
  view: {
    template: 'strengths-and-needs/views/san-step',
  },
  blocks: [employmentStatusSummaryTab],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,

      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.markJourneyAsComplete()
        ],
        next: [redirect({ goto: 'employment-education-analysis' })],
      },
    }),
  ],
})
