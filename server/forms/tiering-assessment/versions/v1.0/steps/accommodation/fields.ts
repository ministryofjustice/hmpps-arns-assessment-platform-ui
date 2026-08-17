import { GovUKCheckboxInput, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Format, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const whoAreTheyLivingWithField = GovUKCheckboxInput({
  code: 'who-are-they-living-with',
  multiple: true,
  hint: {
    text: 'Select all that apply.',
  },
  fieldset: {
    legend: {
      text: Format('Who is %1 living with?', CaseData.Forename),
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
      value: 'person-under-18-years-old',
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
      message: Format("Select who %1 is living with, or select 'Alone' or 'Unknown'", CaseData.Forename),
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
      text: Format('Is %1 accommodation suitable?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Yes',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Yes, with concerns',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
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
