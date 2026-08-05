import { GovUKCheckboxInput, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const whoAreTheyLivingWithField = GovUKCheckboxInput({
  code: 'who-are-they-living-with',
  multiple: true,
  hint: {
    text: 'Select all that apply.',
  },
  fieldset: {
    legend: {
      text: 'Who is Name living with?',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'Family',
      text: 'Family',
    },
    {
      value: 'friends',
      text: 'Friends',
    },
    {
      value: 'partner',
      text: 'Partner',
    },
    {
      value: 'person under 18 years old',
      text: 'Person under 18 years old',
    },
    {
      value: 'other',
      text: 'Other',
    },
    {
      divider: 'or',
    },
    {
      value: 'alone',
      text: 'Alone',
      behaviour: 'exclusive',
    },
    {
      value: 'unknown',
      text: 'Unknown',
      behaviour: 'exclusive',
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: "Select who NAME is living with, or select 'alone' or 'Unknown'",
    }),
  ],
})

export const suitabilityOfAccommodationField = GovUKRadioInput({
  code: 'suitability-of-accommodation',
  hint: {
    text: 'This includes things like safety or having appropriate amenities.',
  },
  fieldset: {
    legend: {
      text: "Is NAME's accommodation suitable?",
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'yes',
      text: 'Yes',
    },
    {
      value: 'yes, with concerns',
      text: 'Yes, with concerns',
    },
    {
      value: 'no',
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
