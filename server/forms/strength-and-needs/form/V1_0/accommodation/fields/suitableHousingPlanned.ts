import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKCharacterCount } from '@form-engine/registry/components/govuk-frontend/character-count/govukCharacterCount'
import { characterLimits } from '../../../../constants'

export const suitableHousingPlanned = field<GovUKRadioInput>({
  code: 'suitable_housing_planned',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'Does [subject] have future accommodation planned?',
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  items: [
    { text: 'Yes', value: 'YES' },
    { text: 'No', value: 'NO' },
    { text: 'Unknown', value: 'UNKNOWN' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select if they have future accommodation planned',
    }),
  ],
})

export const futureAccommodationType = field<GovUKRadioInput>({
  code: 'future_accommodation_type',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'What is the type of future accommodation?',
      classes: GovUKUtilityClasses.visuallyHidden,
    },
  },
  items: [
    {
      text: 'Awaiting assessment',
      value: 'AWAITING_ASSESSMENT',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'future_accommodation_awaiting_assessment_details',
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
        dependent: Answer('future_accommodation_type').match(Condition.Equals('AWAITING_ASSESSMENT')),
      }),
    },
    {
      text: 'Awaiting placement',
      value: 'AWAITING_PLACEMENT',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'future_accommodation_awaiting_placement_details',
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
        dependent: Answer('future_accommodation_type').match(Condition.Equals('AWAITING_PLACEMENT')),
      }),
    },
    { text: 'Buy a house', value: 'BUYING_HOUSE' },
    { text: 'Living with friends or family', value: 'LIVING_WITH_FRIENDS_OR_FAMILY' },
    { text: 'Rent privately', value: 'RENT_PRIVATELY' },
    { text: 'Rent from social, local authority or other', value: 'RENT_SOCIAL' },
    { text: 'Residential healthcare', value: 'RESIDENTIAL_HEALTHCARE' },
    { text: 'Supported accommodation', value: 'SUPPORTED_ACCOMMODATION' },
    {
      text: 'Other',
      value: 'OTHER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'future_accommodation_other_details',
        label: 'Give details',
        hint: 'Include where and who with.',
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
        dependent: Answer('future_accommodation_type').match(Condition.Equals('OTHER')),
      }),
    },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select the type of future accommodation',
    }),
  ],
  dependent: Answer('suitable_housing_planned').match(Condition.Equals('YES')),
})
