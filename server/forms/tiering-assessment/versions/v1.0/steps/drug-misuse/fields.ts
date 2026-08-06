import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const drugMisuseField = GovUKRadioInput({
  code: 'ever-misused-drugs',
  hint: {
    text: 'This includes illegal and prescriptin drugs.',
  },
  items: [
    {
      value: 'true',
      text: 'Yes',
    },
    {
      value: 'false',
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
