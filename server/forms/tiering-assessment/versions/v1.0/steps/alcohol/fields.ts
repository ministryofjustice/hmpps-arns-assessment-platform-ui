import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { currentAlcoholUseFrequencyFieldText } from '../../common'

export const currentAlcoholUseFrequencyField = GovUKRadioInput({
  code: 'current-alcohol-use-frequency',
  fieldset: {
    legend: {
      text: currentAlcoholUseFrequencyFieldText,
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
