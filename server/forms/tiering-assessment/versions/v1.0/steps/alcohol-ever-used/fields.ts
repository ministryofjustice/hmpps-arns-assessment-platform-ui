import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const alcoholEverUsedField = GovUKRadioInput({
  code: 'has-ever-drunk-alcohol',
  items: [
    {
      value: 'YES_IN_LAST_THREE_MONTHS',
      text: 'Yes, including in the last 3 months',
    },
    {
      value: 'YES_NOT_IN_LAST_THREE_MONTHS',
      text: 'Yes, but not in the last 3 months',
    },
    {
      value: 'NO',
      text: 'No',
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
