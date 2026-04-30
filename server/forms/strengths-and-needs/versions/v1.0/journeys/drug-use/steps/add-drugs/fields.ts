import { validation, Self, Answer, Format, and, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCheckboxInput, GovUKRadioInput, GovUKTextInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'
import { Drug, drugsList, fieldCode, otherDrugOption } from '../../constants'

const drugLastUsedField = (drug: Drug) =>
  GovUKRadioInput({
    code: fieldCode('drug_last_used', drug.value),
    fieldset: {
      legend: {
        text: `When did they last use ${drug.text}?`,
        classes: 'govuk-visually-hidden',
      },
    },
    dependentWhen: and(
      Answer('select_misused_drugs').match(Condition.IsRequired()),
      Answer('select_misused_drugs').match(Condition.Array.Contains(drug.value)),
    ),
    items: [
      { value: 'LAST_SIX', text: 'Used in the last 6 months' },
      { value: 'MORE_THAN_SIX', text: 'Used more than 6 months ago' },
    ],
    validWhen: [
      validation({
        condition: not(Self().not.match(Condition.IsRequired())),
        message: 'Select when they last used this drug',
      }),
    ],
  })

const otherDrugName = GovUKTextInput({
  code: 'other_drug_name',
  label: {
    text: "Enter which other drug they've misused",
    classes: 'govuk-visually-hidden',
  },
  hint: 'Add drug name',
  dependentWhen: and(
    Answer('select_misused_drugs').match(Condition.IsRequired()),
    Answer('select_misused_drugs').match(Condition.Array.Contains(otherDrugOption.value)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: "Enter which other drug they've misused",
    }),
    validation({
      condition: not(Self().not.match(Condition.String.HasMaxLength(200))),
      message: 'Drug name must be 200 characters or less',
    }),
  ],
})

const drugsListItems = [
  ...drugsList.map(drug => ({
    value: drug.value,
    text: drug.text,
    block: drugLastUsedField(drug),
  })),
  {
    value: otherDrugOption.value,
    text: otherDrugOption.text,
    block: [otherDrugName, drugLastUsedField(otherDrugOption)],
  },
]

export const selectMisusedDrugs = GovUKCheckboxInput({
  code: 'select_misused_drugs',
  multiple: true,
  fieldset: {
    legend: {
      text: Format('Which drugs has %1 misused?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: drugsListItems,
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: "Select which drugs they've misused",
    }),
  ],
})
