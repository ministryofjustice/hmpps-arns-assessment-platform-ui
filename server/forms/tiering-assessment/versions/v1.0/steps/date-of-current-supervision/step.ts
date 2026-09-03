import {
  access,
  and,
  Answer,
  Condition,
  or,
  redirect,
  step,
  submit,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { TieringAssessmentEffects } from '../../../../effects/TieringAssessmentEffects'
import { continueButton, redirectToCheckYourAnswers } from '../../common'
import { dateOfCurrentSupervisionFields } from './fields'
import { stepTitle } from '../../locales'
import { Step } from '../../constants/page'

export const dateOfCurrentSupervisionStep = step({
  path: `/${Step.date_of_current_supervision.path}`,
  title: stepTitle(Step.date_of_current_supervision),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    dateOfCurrentSupervisionFields.questions.dateOfCurrentSupervisionQuestion.displayModes.field,
    continueButton,
  ],
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
              Answer('date_of_current_supervision').not.match(Condition.Date.IsFutureDate()),
              Answer('has_ever_committed_sexual_offence').match(Condition.Equals('YES')),
              or(
                and(
                  Answer('number_of_contact_sexual_sanctions').match(Condition.IsRequired()),
                  Answer('number_of_contact_sexual_sanctions')
                    .pipe(Transformer.String.ToInt())
                    .match(Condition.Number.GreaterThan(0)),
                ),
                and(
                  Answer('number_of_contact_child_sexual_sanctions').match(Condition.IsRequired()),
                  Answer('number_of_contact_child_sexual_sanctions')
                    .pipe(Transformer.String.ToInt())
                    .match(Condition.Number.GreaterThan(0)),
                ),
                and(
                  Answer('non_contact').match(Condition.IsRequired()),
                  Answer('non_contact')
                    .pipe(Transformer.String.ToInt())
                    .match(Condition.Number.GreaterThan(0)),
                ),
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
