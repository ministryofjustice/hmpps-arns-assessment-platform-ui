import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const currentEmploymentStatusField = GovUKRadioInput({
  code: 'is-unemployed',
  items: [
    {
      value: 'false',
      text: 'Employed',
    },
    {
      value: 'false',
      text: 'Self-employed',
    },
    {
      value: 'false',
      text: 'Retired',
    },
    {
      value: 'false',
      text: 'Currently unavailable for work',
    },
    {
      value: 'true',
      text: 'Unemployed - actively looking for work',
    },
    {
      value: 'true',
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
