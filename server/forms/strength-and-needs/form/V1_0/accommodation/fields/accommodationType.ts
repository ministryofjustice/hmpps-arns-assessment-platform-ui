import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { GovUKDateInputFull } from '@form-engine/registry/components/govuk-frontend/date-input/govukDateInputVariants'
import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'

const immigrationAccommodationHint = `
    <div class="govuk-grid-column-full">
      <p class="govuk-hint">This includes:</p>
      <ul class="govuk-hint govuk-list govuk-list--bullet">
        <li class=" govuk-!-margin-bottom-5">Schedule 10 - Home Office provides accommodation under the Immigration Act 2016</li>
        <li>Schedule 4 - Home Office provides accommodation for those on immigration bail, prior to the Immigration Act 2016</li>
      </ul>
    </div>
  `

export const typeOfSettledAccommodation = field<GovUKRadioInput>({
  code: 'type_of_settled_accommodation',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'Select the type of settled accommodation?',
      classes: GovUKUtilityClasses.visuallyHidden,
    },
  },
  items: [
    { text: 'Homeowner', value: 'HOMEOWNER' },
    { text: 'Living with friends or family', value: 'FRIENDS_OR_FAMILY' },
    { text: 'Renting privately', value: 'RENTING_PRIVATELY' },
    { text: 'Renting from social, local authority or other', value: 'RENTING_OTHER' },
    { text: 'Residential healthcare', value: 'RESIDENTIAL_HEALTHCARE' },
    { text: 'Supported accommodation', value: 'SUPPORTED_ACCOMMODATION' },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select the type of settled accommodation',
    }),
  ],
  dependent: Answer('current_accommodation').match(Condition.Equals('SETTLED')),
})

export const typeOfTemporaryAccommodation = field<GovUKRadioInput>({
  code: 'type_of_temporary_accommodation',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'Select the type of temporary accommodation?',
      classes: GovUKUtilityClasses.visuallyHidden,
    },
  },
  items: [
    { text: 'Approved premises', value: 'APPROVED_PREMISES' },
    { text: 'Community Accommodation Service Tier 2 (CAS2)', value: 'CAS2' },
    { text: 'Community Accommodation Service Tier 3 (CAS3)', value: 'CAS3' },
    {
      text: 'Immigration accommodation',
      value: 'IMMIGRATION',
      hint: {
        html: immigrationAccommodationHint,
      },
    },
    {
      text: 'Short term accommodation',
      value: 'SHORT_TERM',
      hint: { text: 'Includes living with friends or family' },
    },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select the type of temporary accommodation',
    }),
  ],
  dependent: Answer('current_accommodation').match(Condition.Equals('TEMPORARY')),
})

export const shortTermAccommodationEndDate = field<GovUKDateInputFull>({
  code: 'short_term_accommodation_end_date',
  variant: 'govukDateInputFull',
  label: 'Enter expected end date (optional)',
  formatters: [
    Transformer.Object.ToISO({
      day: 'day',
      month: 'month',
      year: 'year',
    }),
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidDay()),
      message: 'Enter a valid day',
      details: { field: 'day' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidMonth()),
      message: 'Enter a valid month',
      details: { field: 'month' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidYear()),
      message: 'Enter a valid year',
      details: { field: 'year' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValid()),
      message: 'Enter a valid date',
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsFutureDate()),
      message: 'Enter a future date',
      submissionOnly: true,
    }),
  ],
  dependent: Answer('type_of_temporary_accommodation').match(Condition.Equals('SHORT_TERM')),
})

export const approvedPremisesEndDate = field<GovUKDateInputFull>({
  code: 'approved_premises_end_date',
  variant: 'govukDateInputFull',
  label: 'Enter expected end date (optional)',
  formatters: [
    Transformer.Object.ToISO({
      day: 'day',
      month: 'month',
      year: 'year',
    }),
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidDay()),
      message: 'Enter a valid day',
      details: { field: 'day' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidMonth()),
      message: 'Enter a valid month',
      details: { field: 'month' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidYear()),
      message: 'Enter a valid year',
      details: { field: 'year' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValid()),
      message: 'Enter a valid date',
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsFutureDate()),
      message: 'Enter a future date',
      submissionOnly: true,
    }),
  ],
  dependent: Answer('type_of_temporary_accommodation').match(Condition.Equals('APPROVED_PREMISES')),
})

export const cas2EndDate = field<GovUKDateInputFull>({
  code: 'cas2_end_date',
  variant: 'govukDateInputFull',
  label: 'Enter expected end date (optional)',
  formatters: [
    Transformer.Object.ToISO({
      day: 'day',
      month: 'month',
      year: 'year',
    }),
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidDay()),
      message: 'Enter a valid day',
      details: { field: 'day' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidMonth()),
      message: 'Enter a valid month',
      details: { field: 'month' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidYear()),
      message: 'Enter a valid year',
      details: { field: 'year' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValid()),
      message: 'Enter a valid date',
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsFutureDate()),
      message: 'Enter a future date',
      submissionOnly: true,
    }),
  ],
  dependent: Answer('type_of_temporary_accommodation').match(Condition.Equals('CAS2')),
})

export const cas3EndDate = field<GovUKDateInputFull>({
  code: 'cas3_end_date',
  variant: 'govukDateInputFull',
  label: 'Enter expected end date (optional)',
  formatters: [
    Transformer.Object.ToISO({
      day: 'day',
      month: 'month',
      year: 'year',
    }),
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidDay()),
      message: 'Enter a valid day',
      details: { field: 'day' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidMonth()),
      message: 'Enter a valid month',
      details: { field: 'month' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidYear()),
      message: 'Enter a valid year',
      details: { field: 'year' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValid()),
      message: 'Enter a valid date',
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsFutureDate()),
      message: 'Enter a future date',
      submissionOnly: true,
    }),
  ],
  dependent: Answer('type_of_temporary_accommodation').match(Condition.Equals('CAS3')),
})

export const immigrationAccommodationEndDate = field<GovUKDateInputFull>({
  code: 'immigration_accommodation_end_date',
  variant: 'govukDateInputFull',
  label: 'Enter expected end date (optional)',
  formatters: [
    Transformer.Object.ToISO({
      day: 'day',
      month: 'month',
      year: 'year',
    }),
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidDay()),
      message: 'Enter a valid day',
      details: { field: 'day' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidMonth()),
      message: 'Enter a valid month',
      details: { field: 'month' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValidYear()),
      message: 'Enter a valid year',
      details: { field: 'year' },
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsValid()),
      message: 'Enter a valid date',
    }),
    validation({
      when: Answer(Self()).not.match(Condition.Date.IsFutureDate()),
      message: 'Enter a future date',
      submissionOnly: true,
    }),
  ],
  dependent: Answer('type_of_temporary_accommodation').match(Condition.Equals('IMMIGRATION')),
})

export const typeOfNoAccommodation = field<GovUKRadioInput>({
  code: 'type_of_no_accommodation',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'Select the type of accommodation?',
      classes: GovUKUtilityClasses.visuallyHidden,
    },
  },
  items: [
    { text: 'Campsite', value: 'CAMPSITE' },
    { text: 'Emergency hostel', value: 'EMERGENCY_HOSTEL' },
    { text: 'Homeless - includes squatting', value: 'HOMELESS' },
    { text: 'Rough sleeping', value: 'ROUGH_SLEEPING' },
    { text: 'Shelter', value: 'SHELTER' },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select the type of no accommodation',
    }),
  ],
  dependent: Answer('current_accommodation').match(Condition.Equals('NO_ACCOMMODATION')),
})

export const currentAccommodation = field<GovUKRadioInput>({
  code: 'current_accommodation',
  variant: 'govukRadioInput',
  label: 'What type of accommodation does [subject] currently have?',
  items: [
    { text: 'Settled', value: 'SETTLED', block: typeOfSettledAccommodation },
    { text: 'Temporary', value: 'TEMPORARY', block: typeOfTemporaryAccommodation },
    { text: 'No accommodation', value: 'NO_ACCOMMODATION', block: typeOfNoAccommodation },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select the type of accommodation they currently have',
    }),
  ],
})
