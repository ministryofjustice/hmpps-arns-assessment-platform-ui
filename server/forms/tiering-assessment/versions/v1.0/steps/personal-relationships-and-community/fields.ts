import { GovUKCheckboxInput, GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const importantRelationshipsField = GovUKCheckboxInput({
  code: 'important-relationships',
  multiple: true,
  hint: {
    text: 'Select all that apply.',
  },
  fieldset: {
    legend: {
      text: "Who are the important people in NAME's life",
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'partner',
      text: "Partner or someone they're in an intimate relationship with",
    },
    {
      value: 'children-or-wards',
      text: 'Their children or anyone they have parenting responsibilities for',
    },
    {
      value: 'other-children',
      text: 'Other children',
    },
    {
      value: 'family-members',
      text: 'Family members',
    },
    {
      value: 'friends',
      text: 'Friends',
    },
    {
      value: 'other-relationship',
      text: 'Other',
    },
    {
      divider: 'or',
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
      message: "Select who the important people in NAME's life are, or select 'Unknown'",
    }),
  ],
})

export const relationshipSatisfactionField = GovUKRadioInput({
  code: 'relationship-satisfaction',
  fieldset: {
    legend: {
      text: 'Is NAME happy with their current relationship status?',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Happy and positive about their relationship status, or their relationship is likely to act as a protective factor',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Has some concerns about their relationship status but is overall happy',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Unhappy about their relationship status, or their relationship is unhealthy and directly linked to offending',
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
      message: "Select whether NAME is happy with their current relationship status, or select 'Unknown'",
    }),
  ],
})
