import {
  access,
  Answer,
  Condition,
  Format,
  redirect,
  step,
  submit,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { interviewQuestionField } from './fields'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { Step } from '../accommodation/constants/step'

export const interviewQuestionStep = step({
  path: '/interview-question',
  title: Format('Have you done an interview with %1?', CaseData.Forename),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
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
            goto: Step.accommodation.path,
          }),
          redirect({ goto: 'check-your-answers' }),
        ],
      },
    }),
  ],
})
