import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const bingeDrinkingField = GovUKRadioInput({
  code: 'binge-drinking',
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'No evidence of binge drinking or excessive alcohol use',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Some evidence of binge drinking or excessive alcohol use',
      hint: 'There is a pattern of alcohol use but has not caused any serious problems.',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Evidence of binge drinking or excessive alcohol use',
      hint: 'There is a detrimental effect on other areas of their life and is often directly related to offending',
    },
    {
      divider: 'or',
    },
    {
      value: 'unknown',
      text: 'Unknown',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})
