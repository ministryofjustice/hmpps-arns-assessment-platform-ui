import { GovUKDateInputFull, GovUKRadioInput, GovUKTextInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const genderField = GovUKRadioInput({
  code: 'gender',
  label: 'Gender',
  items: [
    { value: 'MALE', text: 'Male' },
    { value: 'FEMALE', text: 'Female' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Gender is a required field',
    }),
  ],
})

export const dobField = GovUKDateInputFull({
  code: 'date-of-birth',
  label: 'Date of birth',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Date of Birth is a required field',
    }),
    validation({
      condition: Self().match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
  ],
})

export const dateOfCurrentConviction = GovUKDateInputFull({
  code: 'date-of-current-conviction',
  label: 'Date of current conviction',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Date current conviction is a required field',
    }),
    validation({
      condition: Self().match(Condition.Date.IsValid()),
      message: 'Please enter a valid date',
    }),
  ],
})

export const offenceCodeField = GovUKTextInput({
  code: 'offence-code',
  label: 'Offence code',
  hint: 'For example 10426',
  classes: 'govuk-input--width-5',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Offence code is a required field',
    }),
    validation({
      condition: Self().match(Condition.String.MatchesRegex('^\\d{5}$')),
      message: 'Offence code should be 5 digits',
    }),
  ],
})
