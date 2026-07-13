import { and, Answer, Condition, not, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCheckboxInput, GovUKRadioInput, GovUKTextInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Drug, drugsList, fieldCode, otherDrugOption } from '../../constants'
import { CaseData } from '../../../../constants/formVersion'
import { Question } from '../../constants/question'
import { contentFor, drugValueToText } from '../../locales'
import { Option } from '../../constants/option'
import { commonContentFor } from '../../../../locales'

const drugLastUsedField = (drug: Drug) =>
  GovUKRadioInput({
    code: fieldCode(Question.drug_last_used, drug.value),
    fieldset: {
      legend: {
        text: contentFor('question.drug_last_used.text', drugValueToText(drug.value)),
        classes: 'govuk-visually-hidden',
      },
    },
    dependentWhen: and(
      Answer(Question.select_misused_drugs).match(Condition.IsRequired()),
      Answer(Question.select_misused_drugs).match(Condition.Array.Contains(drug.value)),
    ),
    items: [
      { value: Option.last_six, text: contentFor('question.drug_last_used.option.LAST_SIX') },
      { value: Option.more_than_six, text: contentFor('question.drug_last_used.option.MORE_THAN_SIX') },
    ],
    validWhen: [
      validation({
        condition: not(Self().not.match(Condition.IsRequired())),
        message: contentFor('question.drug_last_used.validation'),
      }),
    ],
  })

const otherDrugName = GovUKTextInput({
  code: Question.other_drug_name,
  label: {
    text: contentFor('question.other_drug_name.text'),
    classes: 'govuk-visually-hidden',
  },
  hint: contentFor('question.other_drug_name.hint'),
  dependentWhen: and(
    Answer(Question.select_misused_drugs).match(Condition.IsRequired()),
    Answer(Question.select_misused_drugs).match(Condition.Array.Contains(otherDrugOption.value)),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.other_drug_name.text'),
    }),
    validation({
      condition: not(Self().not.match(Condition.String.HasMaxLength(200))),
      message: contentFor('question.other_drug_name.validation'),
    }),
  ],
})

const drugsListItems = [
  ...drugsList.map(drug => ({
    value: drug.value,
    // text: drugValueToText(drug.value),
    text: drug.text,
    block: drugLastUsedField(drug),
  })),
  {
    value: otherDrugOption.value,
    text: commonContentFor('option.OTHER'),
    block: [otherDrugName, drugLastUsedField(otherDrugOption)],
  },
]

export const selectMisusedDrugs = GovUKCheckboxInput({
  code: Question.select_misused_drugs,
  multiple: true,
  fieldset: {
    legend: {
      text: contentFor('question.select_misused_drugs.text', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: contentFor('question.select_misused_drugs.hint'),
  items: drugsListItems,
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.select_misused_drugs.validation'),
    }),
  ],
})
