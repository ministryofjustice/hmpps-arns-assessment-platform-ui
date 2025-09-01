import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { GovUKCheckboxInput } from '@form-engine/registry/components/govuk-frontend/checkbox-input/govukCheckboxInput'
import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { GovUKCharacterCount } from '@form-engine/registry/components/govuk-frontend/character-count/govukCharacterCount'
import { Condition } from '@form-engine/registry/conditions'
import { and } from '@form-engine/form/builders/PredicateTestExprBuilder'
import { characterLimits } from '../../../../constants'

export const livingWith = field<GovUKCheckboxInput>({
  code: 'living_with',
  variant: 'govukCheckboxInput',
  fieldset: {
    legend: {
      text: 'Who is [subject] living with?',
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  hint: 'Select all that apply.',
  items: [
    { text: 'Family', value: 'FAMILY' },
    { text: 'Friends', value: 'FRIENDS' },
    {
      text: 'Partner',
      value: 'PARTNER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'living_with_partner_details',
        label: 'Give details',
        hint: 'Include name, age and gender.',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('living_with').match(Condition.Array.Contains('PARTNER')),
      }),
    },
    { text: 'Person under 18 years old', value: 'PERSON_UNDER_18' },
    {
      text: 'Other',
      value: 'OTHER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'living_with_other_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('living_with').match(Condition.Array.Contains('OTHER')),
      }),
    },
    { text: 'Unknown', value: 'UNKNOWN' },
    { divider: 'or' },
    { text: 'Alone', value: 'ALONE', behaviour: 'exclusive' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: "Select who they are living with, or select 'Alone'",
    }),
    validation({
      when: and(
        Self().match(Condition.Array.Contains('ALONE')),
        Self().match(
          Condition.Array.ContainsAny(['FAMILY', 'FRIENDS', 'PARTNER', 'PERSON_UNDER_18', 'OTHER', 'UNKNOWN']),
        ),
      ),
      message: "Select who they are living with, or select 'Alone'",
    }),
  ],
})
