import { GovUKUtilityClasses } from '@form-engine/utils/govukUtilityClasses'
import { Answer, field, Self, validation } from '@form-engine/form/builders'
import { GovUKCheckboxInput } from '@form-engine/registry/components/govuk-frontend/checkbox-input/govukCheckboxInput'
import { GovUKCharacterCount } from '@form-engine/registry/components/govuk-frontend/character-count/govukCharacterCount'
import { Condition } from '@form-engine/registry/conditions'
import { GovukTextareaInput } from '@form-engine/registry/components/govuk-frontend/textarea-input/govukTextareaInput'
import { Transformer } from '@form-engine/registry/transformers'
import { characterLimits } from '../../../../constants'

const noAccommodationHint = `
  <div class="govuk-!-width-two-thirds">
    <p class="govuk-hint">Consider current and past homelessness issues.</p>
    <p class="govuk-hint">Select all that apply.</p>
  </div>
`

export const noAccommodationReason = field<GovUKCheckboxInput>({
  code: 'no_accommodation_reason',
  variant: 'govukCheckboxInput',
  fieldset: {
    legend: {
      text: 'Why does [subject] have no accommodation?',
      classes: GovUKUtilityClasses.Fieldset.mediumLabel,
    },
  },
  hint: {
    html: noAccommodationHint,
  },
  items: [
    { text: 'Alcohol related problems', value: 'ALCOHOL_PROBLEMS' },
    { text: 'Drug related problems', value: 'DRUG_PROBLEMS' },
    { text: 'Financial difficulties', value: 'FINANCIAL_DIFFICULTIES' },
    { text: 'Left previous accommodation due to risk to others', value: 'RISK_TO_OTHERS' },
    { text: 'Left previous accommodation for their own safety', value: 'SAFETY' },
    { text: 'No accommodation when released from prison', value: 'PRISON_RELEASE' },
    {
      text: 'Other',
      value: 'OTHER',
      block: field<GovUKCharacterCount>({
        variant: 'govukCharacterCount',
        code: 'no_accommodation_reason_other_details',
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
        dependent: Answer('no_accommodation_reason').match(Condition.Array.Contains('OTHER')),
      }),
    },
  ],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.IsRequired()),
      message: 'Select why they have no accommodation',
    }),
  ],
})

export const pastAccommodationDetails = field<GovukTextareaInput>({
  code: 'past_accommodation_details',
  variant: 'govukTextarea',
  label: "What's helped [subject] stay in accommodation in the past? (optional)",
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: Answer(Self()).not.match(Condition.String.HasMaxLength(characterLimits.default)),
      message: `Details must be ${characterLimits.default} characters or less`,
    }),
  ],
})
