import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKCheckboxInput } from '@form-engine/registry/components/govuk-frontend/checkbox-input/govukCheckboxInput'
import { GovUKCharacterCount } from '@form-engine/registry/components/govuk-frontend/character-count/govukCharacterCount'
import { characterLimits } from '../../../../constants'

export const suitableHousing = field<GovUKRadioInput>({
  code: 'suitable_housing',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: "Is [subject]'s accommodation suitable?",
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  hint: 'This includes things like safety or having appropriate amenities.',
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'Yes, with concerns', value: 'YES_WITH_CONCERNS' },
    { text: 'No', value: 'NO' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select if the accommodation is suitable',
    }),
  ],
})

export const suitableHousingConcerns = field<GovUKCheckboxInput>({
  code: 'suitable_housing_concerns',
  variant: 'govukCheckboxInput',
  fieldset: {
    legend: {
      text: 'What are the concerns?',
      classes: GovUKUtilityClasses.visuallyHidden,
    },
  },
  hint: 'Select all that apply (optional).',
  items: [
    { text: 'Issues with the property - for example, poor kitchen or bathroom facilities', value: 'FACILITIES' },
    { text: 'Overcrowding', value: 'OVERCROWDING' },
    { text: 'Risk of their accommodation being exploited by others - for example, cuckooing', value: 'EXPLOITATION' },
    { text: 'Safety of accommodation', value: 'SAFETY' },
    { text: 'Victim lives with them', value: 'LIVES_WITH_VICTIM' },
    { text: 'Victimised by someone living with them', value: 'VICTIMISATION' },
    {
      text: 'Other',
      value: 'OTHER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'suitable_housing_concerns_other_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.IsRequired()),
            message: 'Enter details',
          }),
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('suitable_housing_concerns').match(Condition.Array.Contains('OTHER')),
      }),
    },
  ],
  dependent: Answer('suitable_housing').match(Condition.Equals('YES_WITH_CONCERNS')),
})

export const unsuitableHousingConcerns = field<GovUKCheckboxInput>({
  code: 'unsuitable_housing_concerns',
  variant: 'govukCheckboxInput',
  fieldset: {
    legend: {
      text: 'What are the concerns?',
      classes: GovUKUtilityClasses.visuallyHidden,
    },
  },
  hint: 'Select all that apply (optional).',
  items: [
    { text: 'Issues with the property - for example, poor kitchen or bathroom facilities', value: 'FACILITIES' },
    { text: 'Overcrowding', value: 'OVERCROWDING' },
    { text: 'Risk of their accommodation being exploited by others - for example, cuckooing', value: 'EXPLOITATION' },
    { text: 'Safety of accommodation', value: 'SAFETY' },
    { text: 'Victim lives with them', value: 'LIVES_WITH_VICTIM' },
    { text: 'Victimised by someone living with them', value: 'VICTIMISATION' },
    {
      text: 'Other',
      value: 'OTHER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'unsuitable_housing_concerns_other_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.IsRequired()),
            message: 'Enter details',
          }),
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('unsuitable_housing_concerns').match(Condition.Array.Contains('OTHER')),
      }),
    },
  ],
  dependent: Answer('suitable_housing').match(Condition.Equals('NO')),
})
