import {
  access,
  and,
  Answer,
  Condition,
  Format,
  or,
  redirect,
  step,
  submit,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { dateOfCurrentSupervisionField } from './fields'
import { continueButton, redirectToCheckYourAnswers } from '../../common'

export const dateOfCurrentSupervisionStep = step({
  path: '/date-of-current-supervision',
  title: Format('What date did %1 current supervision in the community begin?', CaseData.ForenamePossessive),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadForename()],
    }),
  ],
  blocks: [dateOfCurrentSupervisionField, continueButton],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [
          TieringAssessmentEffects.CalculateRiskActuarialScores(),
          TieringAssessmentEffects.SaveAssessmentData(),
        ],
        next: [
          redirectToCheckYourAnswers,
          redirect({
            when: and(
              Answer('gender').match(Condition.Equals('MALE')),
              Answer('supervision-status').not.match(Condition.Equals('CUSTODY')),
              Answer('date-of-current-supervision').not.match(Condition.Date.IsFutureDate()),
              Answer('has-ever-committed-sexual-offence').match(Condition.Equals('true')),
              or(
                Answer('number-of-contact-sexual-sanctions')
                  .pipe(Transformer.String.ToInt())
                  .match(Condition.Number.GreaterThan(0)),
                Answer('number-of-contact-child-sexual-sanctions')
                  .pipe(Transformer.String.ToInt())
                  .match(Condition.Number.GreaterThan(0)),
                Answer('non-contact').pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThan(0)),
              ),
            ),
            goto: 'offences-since-supervision',
          }),
          redirect({ goto: 'interview-question' }),
        ],
      },
    }),
  ],
})
