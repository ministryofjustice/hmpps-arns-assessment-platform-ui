import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKCheckboxInput } from '@form-engine/registry/components/govuk-frontend/checkbox-input/govukCheckboxInput'
import { GovUKCharacterCount } from '@form-engine/registry/components/govuk-frontend/character-count/govukCharacterCount'
import { characterLimits } from '../../../../constants'

export const suitableHousingLocation = field<GovUKRadioInput>({
  code: 'suitable_housing_location',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: "Is the location of [subject]'s accommodation suitable?",
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'No', value: 'NO' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select if the location of the accommodation is suitable',
    }),
  ],
})

export const suitableHousingLocationConcerns = field<GovUKCheckboxInput>({
  code: 'suitable_housing_location_concerns',
  variant: 'govukCheckboxInput',
  fieldset: {
    legend: {
      text: 'What are the concerns with the location?',
      classes: GovUKUtilityClasses.visuallyHidden,
    },
  },
  hint: 'Select all that apply (optional).',
  items: [
    { text: 'Close to criminal associates', value: 'CRIMINAL_ASSOCIATES' },
    { text: 'Close to someone who has victimised them', value: 'VICTIMISATION' },
    { text: 'Close to victim or possible victims', value: 'VICTIM_PROXIMITY' },
    { text: 'Difficulty with neighbours', value: 'NEIGHBOUR_DIFFICULTY' },
    { text: 'Safety of the area', value: 'AREA_SAFETY' },
    {
      text: 'Other',
      value: 'OTHER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'suitable_housing_location_concerns_other_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.IsRequired()),
            message: 'Enter details',
          }),
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} or less`,
          }),
        ],
        dependent: Answer('suitable_housing_location_concerns').match(Condition.Equals('OTHER')),
      }),
    },
  ],
  dependent: Answer('suitable_housing_location').match(Condition.Equals('NO')),
})
