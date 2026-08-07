import {GovUKRadioInput, GovUKSummaryList} from '@ministryofjustice/hmpps-forge/govuk-components'
import {Condition, Self, Session, validation} from '@ministryofjustice/hmpps-forge/core/authoring'

export const alcoholEverUsedField = GovUKRadioInput({
  code: 'is-current-alcohol-use-a-problem',
  items: [
    {
      value: 'true',
      text: 'Yes, including in the last 3 months',
    },
    {
      value: 'false',
      text: 'Yes, but not in the last 3 months',
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
