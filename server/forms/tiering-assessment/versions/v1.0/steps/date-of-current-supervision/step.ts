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
import { dateOfCurrentSupervisionSection } from './section'
import { sectionPageTitle } from '../../locales'
import { Step } from './constants/step'
import { Section } from '../../constants/section'

export const dateOfCurrentSupervisionStep = step({
  path: `/${Step.date_of_current_supervision.path}`,
  title: sectionPageTitle(Section.date_of_current_supervision),
  onAccess: [
    access({
      effects: [TieringAssessmentEffects.LoadAssessmentData(), TieringAssessmentEffects.LoadCaseData()],
    }),
  ],
  blocks: [
    dateOfCurrentSupervisionSection.questions.dateOfCurrentSupervisionQuestion.displayModes.field,
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
                  Answer('number-of-contact-sexual-sanctions').match(Condition.IsRequired()),
                  Answer('number-of-contact-sexual-sanctions')
                    .pipe(Transformer.String.ToInt())
                    .match(Condition.Number.GreaterThan(0)),
                ),
                and(
                  Answer('number-of-contact-child-sexual-sanctions').match(Condition.IsRequired()),
                  Answer('number-of-contact-child-sexual-sanctions')
                    .pipe(Transformer.String.ToInt())
                    .match(Condition.Number.GreaterThan(0)),
                ),
                and(
                  Answer('non-contact').match(Condition.IsRequired()),
                  Answer('non-contact')
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
