import { GovUKDateInputFull } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const dateOfCurrentSupervisionField = GovUKDateInputFull({
  code: 'date-of-current-supervision-field',
  hint: 'We will fill in this date from NDelius if it is available. Change the date if it is wrong.',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
    validation({
      condition: Self().match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
  ],
})
