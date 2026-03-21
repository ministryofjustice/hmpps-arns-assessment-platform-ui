import { validation, Self, Answer, Format } from '@form-engine/form/builders'
import { GovUKRadioInput, GovUKCheckboxInput, GovUKCharacterCount } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../../constants'

// --- Living With Group ---

const livingWithPartnerDetails = GovUKCharacterCount({
  code: 'living_with_partner_details',
  label: 'Give details (optional)',
  hint: 'Include name, age and gender.',
  maxLength: 2000,
  dependent: Answer('living_with').match(Condition.Array.Contains('PARTNER')),
})

const livingWithOtherDetails = GovUKCharacterCount({
  code: 'living_with_other_details',
  label: 'Give details (optional)',
  maxLength: 2000,
  dependent: Answer('living_with').match(Condition.Array.Contains('OTHER')),
})

export const livingWith = GovUKCheckboxInput({
  code: 'living_with',
  multiple: true,
  fieldset: {
    legend: {
      text: Format('Who is %1 living with?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: [
    { value: 'FAMILY', text: 'Family' },
    { value: 'FRIENDS', text: 'Friends' },
    { value: 'PARTNER', text: 'Partner', block: livingWithPartnerDetails },
    { value: 'PERSON_UNDER_18', text: 'Person under 18 years old' },
    { value: 'OTHER', text: 'Other', block: livingWithOtherDetails },
    { value: 'UNKNOWN', text: 'Unknown' },
    { divider: 'or' },
    { value: 'ALONE', text: 'Alone', behaviour: 'exclusive' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: "Select who they are living with, or select 'Alone'",
    }),
  ],
})

// --- Suitable Location Group ---

const suitableHousingLocationConcernsDetails = GovUKCharacterCount({
  code: 'suitable_housing_location_concerns_details',
  label: 'Give details',
  maxLength: 2000,
  dependent: Answer('suitable_housing_location_concerns').match(Condition.Array.Contains('OTHER')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

export const suitableHousingLocationConcerns = GovUKCheckboxInput({
  code: 'suitable_housing_location_concerns',
  multiple: true,
  fieldset: {
    legend: {
      text: 'What are the concerns with the location?',
      classes: 'govuk-visually-hidden',
    },
  },
  hint: 'Select all that apply (optional).',
  dependent: Answer('suitable_housing_location').match(Condition.Equals('NO')),
  items: [
    { value: 'CRIMINAL_ASSOCIATES', text: 'Close to criminal associates' },
    { value: 'VICTIMISATION', text: 'Close to someone who has victimised them' },
    { value: 'VICTIM_PROXIMITY', text: 'Close to victim or possible victims' },
    { value: 'NEIGHBOUR_DIFFICULTY', text: 'Difficulty with neighbours' },
    { value: 'AREA_SAFETY', text: 'Safety of the area' },
    { value: 'OTHER', text: 'Other', block: suitableHousingLocationConcernsDetails },
  ],
})

export const suitableHousingLocation = GovUKRadioInput({
  code: 'suitable_housing_location',
  fieldset: {
    legend: {
      text: Format("Is the location of %1's accommodation suitable?", CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: 'Yes' },
    { value: 'NO', text: 'No', block: suitableHousingLocationConcerns },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if the location of the accommodation is suitable',
    }),
  ],
})

// --- Suitable Accommodation Group ---

const suitableHousingConcernsOptions = [
  {
    value: 'FACILITIES',
    text: 'Issues with the property - for example, poor kitchen or bathroom facilities',
  },
  { value: 'OVERCROWDING', text: 'Overcrowding' },
  {
    value: 'EXPLOITATION',
    text: 'Risk of their accommodation being exploited by others - for example, cuckooing',
  },
  { value: 'SAFETY', text: 'Safety of accommodation' },
  { value: 'LIVES_WITH_VICTIM', text: 'Victim lives with them' },
  { value: 'VICTIMISATION', text: 'Victimised by someone living with them' },
]

const suitableHousingConcernsDetails = GovUKCharacterCount({
  code: 'suitable_housing_concerns_details',
  label: 'Give details',
  maxLength: 2000,
  dependent: Answer('suitable_housing_concerns').match(Condition.Array.Contains('OTHER')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

export const suitableHousingConcerns = GovUKCheckboxInput({
  code: 'suitable_housing_concerns',
  multiple: true,
  fieldset: {
    legend: {
      text: 'What are the concerns?',
      classes: 'govuk-visually-hidden',
    },
  },
  hint: 'Select all that apply (optional).',
  dependent: Answer('suitable_housing').match(Condition.Equals('YES_WITH_CONCERNS')),
  items: [...suitableHousingConcernsOptions, { value: 'OTHER', text: 'Other', block: suitableHousingConcernsDetails }],
})

const unsuitableHousingConcernsDetails = GovUKCharacterCount({
  code: 'unsuitable_housing_concerns_details',
  label: 'Give details',
  maxLength: 2000,
  dependent: Answer('unsuitable_housing_concerns').match(Condition.Array.Contains('OTHER')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

export const unsuitableHousingConcerns = GovUKCheckboxInput({
  code: 'unsuitable_housing_concerns',
  multiple: true,
  fieldset: {
    legend: {
      text: 'What are the concerns?',
      classes: 'govuk-visually-hidden',
    },
  },
  hint: 'Select all that apply (optional).',
  dependent: Answer('suitable_housing').match(Condition.Equals('NO')),
  items: [
    ...suitableHousingConcernsOptions,
    { value: 'OTHER', text: 'Other', block: unsuitableHousingConcernsDetails },
  ],
})

export const suitableHousing = GovUKRadioInput({
  code: 'suitable_housing',
  fieldset: {
    legend: {
      text: Format("Is %1's accommodation suitable?", CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'This includes things like safety or having appropriate amenities.',
  items: [
    { value: 'YES', text: 'Yes' },
    { value: 'YES_WITH_CONCERNS', text: 'Yes, with concerns', block: suitableHousingConcerns },
    { value: 'NO', text: 'No', block: unsuitableHousingConcerns },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if the accommodation is suitable',
    }),
  ],
})

// --- Want to Make Changes Group ---

const wantToMakeChangesOptions = [
  { value: 'MADE_CHANGES', text: 'I have already made changes and want to maintain them' },
  { value: 'MAKING_CHANGES', text: 'I am actively making changes' },
  { value: 'WANT_TO_MAKE_CHANGES', text: 'I want to make changes and know how to' },
  { value: 'NEEDS_HELP_TO_MAKE_CHANGES', text: 'I want to make changes but need help' },
  { value: 'THINKING_ABOUT_MAKING_CHANGES', text: 'I am thinking about making changes' },
  { value: 'DOES_NOT_WANT_TO_MAKE_CHANGES', text: 'I do not want to make changes' },
  { value: 'DOES_NOT_WANT_TO_ANSWER', text: 'I do not want to answer' },
  { divider: 'or' },
  { value: 'NOT_APPLICABLE', text: 'Not applicable' },
]

export const accommodationChanges = GovUKRadioInput({
  code: 'accommodation_changes',
  fieldset: {
    legend: {
      text: Format('Does %1 want to make changes to their accommodation?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: wantToMakeChangesOptions,
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they want to make changes to their accommodation',
    }),
  ],
})
