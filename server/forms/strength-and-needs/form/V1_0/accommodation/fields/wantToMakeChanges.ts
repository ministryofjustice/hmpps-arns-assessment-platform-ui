import { GovUKCharacterCount } from '@form-engine/registry/components/govuk-frontend/character-count/govukCharacterCount'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { GovUKRadioInput } from '@form-engine/registry/components/govuk-frontend/radio-input/govukRadioInput'
import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Condition } from '@form-engine/registry/conditions'
import { characterLimits } from '../../../../constants'

// TODO: In SAN, this is actually a factory field - it's probably worth making it a factory thing
//  again here.
export const wantToMakeChanges = field<GovUKRadioInput>({
  code: 'accommodation_changes',
  variant: 'govukRadioInput',
  fieldset: {
    legend: {
      text: 'Does [subject] want to make changes to their accommodation?',
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  hint: '[subject] must answer this question.',
  items: [
    {
      text: 'I have already made positive changes and want to maintain them',
      value: 'MADE_CHANGES',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'accommodation_changes_made_changes_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('accommodation_changes').match(Condition.Equals('MADE_CHANGES')),
      }),
    },
    {
      text: 'I am actively making changes',
      value: 'MAKING_CHANGES',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'accommodation_changes_making_changes_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('accommodation_changes').match(Condition.Equals('MAKING_CHANGES')),
      }),
    },
    {
      text: 'I want to make changes and know how to',
      value: 'WANT_TO_MAKE_CHANGES',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'accommodation_changes_want_to_make_changes_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('accommodation_changes').match(Condition.Equals('WANT_TO_MAKE_CHANGES')),
      }),
    },
    {
      text: 'I want to make changes but need help',
      value: 'NEEDS_HELP_TO_MAKE_CHANGES',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'accommodation_changes_needs_help_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('accommodation_changes').match(Condition.Equals('NEEDS_HELP_TO_MAKE_CHANGES')),
      }),
    },
    {
      text: 'I am thinking about making changes',
      value: 'THINKING_ABOUT_MAKING_CHANGES',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'accommodation_changes_thinking_about_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('accommodation_changes').match(Condition.Equals('THINKING_ABOUT_MAKING_CHANGES')),
      }),
    },
    {
      text: 'I do not want to make changes',
      value: 'DOES_NOT_WANT_TO_MAKE_CHANGES',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'accommodation_changes_does_not_want_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('accommodation_changes').match(Condition.Equals('DOES_NOT_WANT_TO_MAKE_CHANGES')),
      }),
    },
    {
      text: 'I do not want to answer',
      value: 'DOES_NOT_WANT_TO_ANSWER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'accommodation_changes_does_not_want_to_answer_details',
        label: 'Give details',
        maxLength: characterLimits.c200,
        validate: [
          validation({
            when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.c200)),
            message: `Details must be ${characterLimits.c200} characters or less`,
          }),
        ],
        dependent: Answer('accommodation_changes').match(Condition.Equals('DOES_NOT_WANT_TO_ANSWER')),
      }),
    },
    { divider: 'or' },
    { text: '[subject] is not present', value: 'NOT_PRESENT' },
    { text: 'Not applicable', value: 'NOT_APPLICABLE' },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select if they want to make changes to their accommodation',
    }),
  ],
})
