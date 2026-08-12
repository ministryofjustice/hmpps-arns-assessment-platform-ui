import {
  Condition,
  Conditional,
  Format,
  Query,
  redirect,
  Self,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../sentence-plan/versions/v1.0/constants'

export const checkYourAnswersQuery = Query('returnTo').match(Condition.Equals('check-your-answers'))
export const returnToAnswersQueryText = '?returnTo=check-your-answers'

export const redirectToCheckYourAnswers = redirect({
  when: checkYourAnswersQuery,
  goto: 'check-your-answers',
})

export const continueButton = GovUKButton({
  text: Conditional({
    when: checkYourAnswersQuery,
    then: 'Check your answers',
    else: 'Save and continue',
  }),
})

// Alcohol
export const currentAlcoholUseFrequencyFieldText = Format(
  'How often has %1 drank alcohol in the last 3 months?',
  CaseData.Forename,
)

export const bingeDrinkingField = GovUKRadioInput({
  code: 'binge-drinking',
  fieldset: {
    legend: {
      text: Format(
        'Has %1 shown evidence of binge drinking or excessive alcohol use in the last 6 months?',
        CaseData.Forename,
      ),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    { value: 'NO_PROBLEMS', text: 'No evidence of binge drinking or excessive alcohol use' },
    {
      value: 'SOME_PROBLEMS',
      text: 'Some evidence of binge drinking or excessive alcohol use',
      hint: 'There is a pattern of alcohol use but has not caused any serious problems',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Evidence of binge drinking or excessive alcohol use',
      hint: 'There is a detrimental effect on other areas of their life and is often directly related to offending',
    },
    { divider: 'or' },
    { value: null, text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})
