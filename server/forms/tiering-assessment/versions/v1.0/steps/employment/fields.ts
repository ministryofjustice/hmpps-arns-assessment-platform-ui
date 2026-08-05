import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const currentEmploymentStatusField = GovUKRadioInput({
  code: 'employment-status',
  items: [
    {
      value: 'employed',
      text: 'Employed',
    },
    {
      value: 'self-employed',
      text: 'Self-employed',
    },
    {
      value: 'retired',
      text: 'Retired',
    },
    {
      value: 'currently-unavailable-for-work',
      text: 'Currently unavailable for work',
    },
    {
      value: 'unemployed-actively-looking-for-work',
      text: 'Unemployed - actively looking for work',
    },
    {
      value: 'unemployed-not-actively-looking-for-work',
      text: 'Unemployed - not actively looking for work',
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
