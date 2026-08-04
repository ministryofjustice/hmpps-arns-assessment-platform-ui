import { access, Answer, Condition, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { interviewQuestionField } from './fields'

export const interviewQuestionStep = step({
  path: '/interview-question',
  title: 'Have you done an interview with NAME?',
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData()],
    }),
  ],
  blocks: [interviewQuestionField, GovUKButton({ text: 'Save and continue' })],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [TieringAssessmentEffects.SaveAssessmentData()],
        next: [
          redirect({
            when: Answer('have-you-done-an-interview').match(Condition.Equals('true')),
            goto: 'accommodation',
          }),
          redirect({ goto: 'check-your-answers' }),
        ],
      },
    }),
  ],
})
