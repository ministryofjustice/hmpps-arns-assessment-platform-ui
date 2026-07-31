import { GovUKDateInputFull, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Format, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const mostRecentOffenceDate = GovUKDateInputFull({
  code: 'most-recent-offence-date',
  fieldset: {
    legend: {
      text: Format('What is the date of %1 most recent offence?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Date of most recent offence is a required field',
    }),
    validation({
      condition: Self().match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
  ],
})

export const offenceHistoryField = GovUKRadioInput({
  code: 'has-commited-offence-since-assessment-date',
  items: [
    {
      value: 'true',
      text: 'Yes',
      block: mostRecentOffenceDate,
    },

    { value: 'false', text: 'No' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})
