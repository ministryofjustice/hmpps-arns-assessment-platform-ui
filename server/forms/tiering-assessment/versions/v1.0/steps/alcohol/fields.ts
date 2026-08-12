import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Format, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const currentAlcoholUseFrequencyField = GovUKRadioInput({
  code: 'current-alcohol-use-frequency',
  fieldset: {
    legend: {
      text: Format('How often has %1 drank alcohol in the last 3 months?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    { value: '0', text: 'Once a month or less' },
    { value: '1', text: '2 to 4 times a month' },
    { value: '3', text: '2 to 3 times a week' },
    { value: '4', text: 'More than 4 times a week' },
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

export const unitsOfAlcoholField = GovUKRadioInput({
  code: 'units-of-alcohol',
  fieldset: {
    legend: {
      text: Format('How many units of alcohol does %1 have on a typical day of drinking?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    { value: '0', text: '1 to 2 units' },
    { value: '1', text: '3 to 4 units' },
    { value: '2', text: '5 to 6 units' },
    { value: '3', text: '7 to 9 units' },
    { value: '4', text: '10 or more units' },
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
