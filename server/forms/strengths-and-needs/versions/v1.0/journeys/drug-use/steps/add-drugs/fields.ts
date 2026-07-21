import {
  and,
  Answer,
  ChainableExpr,
  Condition,
  Format,
  not,
  PipelineExpr,
  Self,
  validation
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {GovUKCheckboxInput, GovUKRadioInput, GovUKTextInput} from '@ministryofjustice/hmpps-forge/govuk-components'
import {CaseData} from '../../../../constants/formVersion'
import {Question} from '../../constants/question'
import {contentFor, drugValueToText} from '../../locales'
import {Option} from '../../constants/option'
import {commonContentFor} from '../../../../locales'
import {CommonOption} from '../../../../constants/commonOption'

export const drugLastUsedField = (drugValue: string | ChainableExpr<PipelineExpr>) =>
  GovUKRadioInput({
    code: Format(Question.drug_last_used_value, drugValue.toString().toLowerCase()),
    fieldset: {
      legend: {
        text: contentFor('question.drug_last_used.text', drugValueToText(drugValue)),
        classes: 'govuk-visually-hidden',
      },
    },
    dependentWhen: and(
      Answer(Question.select_misused_drugs).match(Condition.IsRequired()),
      Answer(Question.select_misused_drugs).match(Condition.Array.Contains(drugValue)),
    ),
    items: [
      { value: Option.last_six, text: contentFor('option.LAST_SIX') },
      { value: Option.more_than_six, text: contentFor('question.drug_last_used.option.MORE_THAN_SIX') },
    ],
    validWhen: [
      validation({
        condition: not(Self().not.match(Condition.IsRequired())),
        message: contentFor('question.drug_last_used.validation'),
        groups: ['drugs']
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
    Answer(Question.select_misused_drugs).match(Condition.Array.Contains(CommonOption.other)),
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
  items: [
    {
      value: Option.amphetamines,
      text: contentFor('option.AMPHETAMINES'),
      block: drugLastUsedField(Option.amphetamines),
    },
    {
      value: Option.benzodiazepines,
      text: contentFor('option.BENZODIAZEPINES'),
      block: drugLastUsedField(Option.benzodiazepines),
    },
    { value: Option.cannabis, text: contentFor('option.CANNABIS'), block: drugLastUsedField(Option.cannabis)},
    { value: Option.cocaine, text: contentFor('option.COCAINE'), block: drugLastUsedField(Option.cocaine)},
    { value: Option.crack, text: contentFor('option.CRACK'), block: drugLastUsedField(Option.crack)},
    { value: Option.ecstasy, text: contentFor('option.ECSTASY'), block: drugLastUsedField(Option.ecstasy)},
    {
      value: Option.hallucinogenics,
      text: contentFor('option.HALLUCINOGENICS'),
      block: drugLastUsedField(Option.hallucinogenics),
    },
    { value: Option.heroin, text: contentFor('option.HEROIN'), block: drugLastUsedField(Option.heroin)},
    {
      value: Option.methadone_not_prescribed,
      text: contentFor('option.METHADONE_NOT_PRESCRIBED'),
      block: drugLastUsedField(Option.methadone_not_prescribed),
    },
    {
      value: Option.misused_prescribed_drugs,
      text: contentFor('option.MISUSED_PRESCRIBED_DRUGS'),
      block: drugLastUsedField(Option.misused_prescribed_drugs),
    },
    {
      value: Option.other_opiates,
      text: contentFor('option.OTHER_OPIATES'),
      block: drugLastUsedField(Option.other_opiates),
    },
    { value: Option.solvents, text: contentFor('option.SOLVENTS'), block: drugLastUsedField(Option.solvents)},
    { value: Option.steroids, text: contentFor('option.STEROIDS'), block: drugLastUsedField(Option.steroids)},
    { value: Option.spice, text: contentFor('option.SPICE'), block: drugLastUsedField(Option.spice)},
    { value: CommonOption.other, text: commonContentFor('option.OTHER'), block: [otherDrugName, drugLastUsedField(CommonOption.other)], },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: contentFor('question.select_misused_drugs.validation'),
      groups: ['drugs']
    }),
  ],
})
