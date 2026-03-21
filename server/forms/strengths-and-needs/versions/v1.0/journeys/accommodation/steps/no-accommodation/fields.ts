import { validation, Self, Answer, Format } from '@form-engine/form/builders'
import { GovUKCheckboxInput, GovUKCharacterCount } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../../constants'

// --- No Accommodation Reason Group ---

const noAccommodationReasonOtherDetails = GovUKCharacterCount({
  code: 'no_accommodation_reason_other_details',
  label: 'Give details',
  maxLength: 2000,
  dependent: Answer('no_accommodation_reason').match(Condition.Array.Contains('OTHER')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details',
    }),
  ],
})

export const noAccommodationReason = GovUKCheckboxInput({
  code: 'no_accommodation_reason',
  multiple: true,
  fieldset: {
    legend: {
      text: Format('Why does %1 have no accommodation?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Consider current and past homelessness issues. Select all that apply.',
  items: [
    { value: 'ALCOHOL_PROBLEMS', text: 'Alcohol related problems' },
    { value: 'DRUG_PROBLEMS', text: 'Drug related problems' },
    { value: 'FINANCIAL_DIFFICULTIES', text: 'Financial difficulties' },
    {
      value: 'RISK_TO_OTHERS',
      text: 'Left previous accommodation due to risk to others',
    },
    {
      value: 'SAFETY',
      text: 'Left previous accommodation for their own safety',
    },
    {
      value: 'PRISON_RELEASE',
      text: 'No accommodation when released from prison',
    },
    { value: 'OTHER', text: 'Other', block: noAccommodationReasonOtherDetails },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select why they have no accommodation',
    }),
  ],
})

export const pastAccommodationDetails = GovUKCharacterCount({
  code: 'past_accommodation_details',
  label: {
    text: Format("What's helped %1 stay in accommodation in the past? (optional)", CaseData.Forename),
    classes: 'govuk-label--m',
  },
  maxLength: 2000,
})
