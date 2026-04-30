import {
  validation,
  Self,
  Answer,
  Format,
  and,
  or,
  Condition,
  Transformer,
  not,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput, GovUKDateInputFull } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'

const hasAnyDatePart = () => {
  return and(
    Self().match(Condition.Object.IsObject()),
    or(
      Self().match(Condition.Object.PropertyHasValue('day')),
      Self().match(Condition.Object.PropertyHasValue('month')),
      Self().match(Condition.Object.PropertyHasValue('year')),
    ),
  )
}

const hasAllDateParts = () => {
  return and(
    Self().match(Condition.Object.IsObject()),
    Self().match(Condition.Object.PropertyHasValue('day')),
    Self().match(Condition.Object.PropertyHasValue('month')),
    Self().match(Condition.Object.PropertyHasValue('year')),
  )
}

const optionalFutureDateValidations = () => {
  return [
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('day')))),
      message: 'Date must include a day',
      details: { field: 'day' },
    }),
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('month')))),
      message: 'Date must include a month',
      details: { field: 'month' },
    }),
    validation({
      condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('year')))),
      message: 'Date must include a year',
      details: { field: 'year' },
    }),
    validation({
      condition: not(hasAllDateParts()),
      message: 'Enter a valid date',
    }),
    validation({
      condition: not(
        and(
          Self().match(Condition.IsRequired()),
          Self().not.match(Condition.Object.IsObject()),
          Self().not.match(Condition.Date.IsValid()),
        ),
      ),
      message: 'Enter a valid date',
    }),
    validation({
      condition: not(
        and(
          Self().match(Condition.IsRequired()),
          Self().not.match(Condition.Object.IsObject()),
          Self().match(Condition.Date.IsValid()),
          Self().not.match(Condition.Date.IsFutureDate()),
        ),
      ),
      message: 'The date must be in the future',
    }),
  ]
}

const shortTermEndDate = GovUKDateInputFull({
  code: 'short_term_accommodation_end_date',
  fieldset: {
    legend: { text: 'Enter expected end date (optional)' },
  },
  hint: 'For example, 27 3 2025',
  dependentWhen: Answer('type_of_temporary_accommodation').match(Condition.Equals('SHORT_TERM')),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const approvedPremisesEndDate = GovUKDateInputFull({
  code: 'approved_premises_end_date',
  fieldset: {
    legend: { text: 'Enter expected end date (optional)' },
  },
  hint: 'For example, 27 3 2025',
  dependentWhen: Answer('type_of_temporary_accommodation').match(Condition.Equals('APPROVED_PREMISES')),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const cas2EndDate = GovUKDateInputFull({
  code: 'cas2_end_date',
  fieldset: {
    legend: { text: 'Enter expected end date (optional)' },
  },
  hint: 'For example, 27 3 2025',
  dependentWhen: Answer('type_of_temporary_accommodation').match(Condition.Equals('CAS2')),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const cas3EndDate = GovUKDateInputFull({
  code: 'cas3_end_date',
  fieldset: {
    legend: { text: 'Enter expected end date (optional)' },
  },
  hint: 'For example, 27 3 2025',
  dependentWhen: Answer('type_of_temporary_accommodation').match(Condition.Equals('CAS3')),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const immigrationEndDate = GovUKDateInputFull({
  code: 'immigration_accommodation_end_date',
  fieldset: {
    legend: { text: 'Enter expected end date (optional)' },
  },
  hint: 'For example, 27 3 2025',
  dependentWhen: Answer('type_of_temporary_accommodation').match(Condition.Equals('IMMIGRATION')),
  formatters: [Transformer.Object.ToISO({ year: 'year', month: 'month', day: 'day' })],
  validWhen: optionalFutureDateValidations(),
})

const typeOfSettledAccommodation = GovUKRadioInput({
  code: 'type_of_settled_accommodation',
  fieldset: {
    legend: {
      text: 'Select the type of settled accommodation',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_accommodation').match(Condition.Equals('SETTLED')),
  items: [
    { value: 'HOMEOWNER', text: 'Homeowner' },
    { value: 'FRIENDS_OR_FAMILY', text: 'Living with friends or family' },
    { value: 'RENTING_PRIVATELY', text: 'Renting privately' },
    { value: 'RENTING_OTHER', text: 'Renting from social, local authority or other' },
    { value: 'RESIDENTIAL_HEALTHCARE', text: 'Residential healthcare' },
    { value: 'SUPPORTED_ACCOMMODATION', text: 'Supported accommodation' },
    { value: 'UNKNOWN', text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type of settled accommodation',
    }),
  ],
})

const typeOfTemporaryAccommodation = GovUKRadioInput({
  code: 'type_of_temporary_accommodation',
  fieldset: {
    legend: {
      text: 'Select the type of temporary accommodation',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_accommodation').match(Condition.Equals('TEMPORARY')),
  items: [
    { value: 'APPROVED_PREMISES', text: 'Approved premises', block: approvedPremisesEndDate },
    {
      value: 'CAS2',
      text: 'Community Accommodation Service Tier 2 (CAS2)',
      block: cas2EndDate,
    },
    {
      value: 'CAS3',
      text: 'Community Accommodation Service Tier 3 (CAS3)',
      block: cas3EndDate,
    },
    {
      value: 'IMMIGRATION',
      text: 'Immigration accommodation',
      hint: {
        text: 'Includes accommodation provided under Schedule 10 of the Immigration and Asylum Act 1999 or under section 4 of the same Act.',
      },
      block: immigrationEndDate,
    },
    {
      value: 'SHORT_TERM',
      text: 'Short term accommodation',
      hint: { text: 'Includes living with friends or family.' },
      block: shortTermEndDate,
    },
    { value: 'UNKNOWN', text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type of temporary accommodation',
    }),
  ],
})

const typeOfNoAccommodation = GovUKRadioInput({
  code: 'type_of_no_accommodation',
  fieldset: {
    legend: {
      text: 'Select the type of no accommodation',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_accommodation').match(Condition.Equals('NO_ACCOMMODATION')),
  items: [
    { value: 'CAMPSITE', text: 'Campsite' },
    { value: 'EMERGENCY_HOSTEL', text: 'Emergency hostel' },
    { value: 'HOMELESS', text: 'Homeless - includes squatting' },
    { value: 'ROUGH_SLEEPING', text: 'Rough sleeping' },
    { value: 'SHELTER', text: 'Shelter' },
    { value: 'UNKNOWN', text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type of no accommodation',
    }),
  ],
})

export const currentAccommodation = GovUKRadioInput({
  code: 'current_accommodation',
  fieldset: {
    legend: {
      text: Format('What type of accommodation does %1 currently have?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: 'SETTLED', text: 'Settled', block: typeOfSettledAccommodation },
    { value: 'TEMPORARY', text: 'Temporary', block: typeOfTemporaryAccommodation },
    { value: 'NO_ACCOMMODATION', text: 'No accommodation', block: typeOfNoAccommodation },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type of accommodation they currently have',
    }),
  ],
})
