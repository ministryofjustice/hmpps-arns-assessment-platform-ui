import { and, Answer, Condition, Format, not, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCheckboxInput, GovUKRadioInput, GovUKTextInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'

export const drugLastUsedField = (drugValue: string) =>
  GovUKRadioInput({
    code: `${drugValue}-radio`,
    fieldset: {
      legend: {
        text: drugValue,
        classes: 'govuk-visually-hidden',
      },
    },
    dependentWhen: and(
      Answer('drug-misuse').match(Condition.IsRequired()),
      Answer('drug-misuse').match(Condition.Array.Contains(drugValue)),
    ),
    items: [
      { value: 'true', text: 'Used in the last 6 months' },
      { value: 'false', text: 'Used more than 6 months ago' },
      { divider: 'or' },
      { value: 'unknown', text: 'Unknown' },
    ],
    validWhen: [
      validation({
        condition: Self().match(Condition.IsRequired()),
        message: 'This is a required field',
      }),
    ],
  })

const otherDrugName = GovUKTextInput({
  code: 'other-drug-name',
  label: {
    text: 'other drug name',
    classes: 'govuk-visually-hidden',
  },
  dependentWhen: and(
    Answer('drug-misuse').match(Condition.IsRequired()),
    Answer('drug-misuse').match(Condition.Array.Contains('other-drug')),
  ),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
    validation({
      condition: not(Self().not.match(Condition.String.HasMaxLength(200))),
      message: 'Must be 200 characters or less',
    }),
  ],
})

export const whatDrugsMisusedField = GovUKCheckboxInput({
  code: 'drug-misuse',
  fieldset: {
    legend: {
      text: Format('Which drugs has %1 misused?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: {
    text: 'Select all that apply.',
  },
  items: [
    {
      value: 'amphetamines',
      text: 'Amphetamines',
      block: drugLastUsedField('amphetamines'),
    },
    {
      value: 'benzodiazepines',
      text: 'Benzodiazepines',
      block: drugLastUsedField('benzodiazepines'),

    },
    {
      value: 'cannabis',
      text: 'Cannabis',
      block: drugLastUsedField('cannabis'),

    },
    {
      value: 'cocaine-hydrochloride',
      text: 'Cocaine hydrochloride',
      block: drugLastUsedField('cocaine-hydrochloride'),
    },
    {
      value: 'crack-or-cocaine',
      text: 'Crack or cocaine',
      block: drugLastUsedField('crack-or-cocaine'),
    },
    {
      value: 'ecstasy',
      text: 'Ecstasy (also known as MDMA)',
      block: drugLastUsedField('ecstasy'),
    },
    {
      value: 'hallucinogens',
      text: 'Hallucinogens',
      block: drugLastUsedField('hallucinogens'),
    },
    {
      value: 'heroin',
      text: 'Heroin',
      block: drugLastUsedField('heroin'),
    },
    {
      value: 'ketamine',
      text: 'Ketamine',
      block: drugLastUsedField('ketamine'),
    },
    {
      value: 'methadone',
      text: 'Methadone (not prescribed)',
      block: drugLastUsedField('methadone'),
    },
    {
      value: 'misused-prescribed-drugs',
      text: 'Misused prescribed drugs',
      block: drugLastUsedField('misused-prescribed-drugs'),
    },
    {
      value: 'other-opiates',
      text: 'Other opiates',
      block: drugLastUsedField('other-opiates'),
    },
    {
      value: 'solvents',
      text: 'Solvents (including gases and glues)',
      block: drugLastUsedField('solvents'),
    },
    {
      value: 'spice',
      text: 'Spice',
      block: drugLastUsedField('spice'),
    },
    {
      value: 'steroids',
      text: 'Steroids',
      block: drugLastUsedField('steroids'),
    },
    {
      value: 'other-drug',
      text: 'Other',
      block: [otherDrugName, drugLastUsedField('other-drug')],
    },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})

export const motivationToStopMisuseField = GovUKRadioInput({
  code: 'motivation-to-tackle-drug-misuse',
  fieldset: {
    legend: {
      text: Format('Does %1 seem motivated to stop or reduce their drug use?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    { value: 'NO_MOTIVATION', text: 'Does not show motivation to stop or reduce' },
    { value: 'PARTIAL_MOTIVATION', text: 'Shows some motivation to stop or reduce' },
    { value: 'FULL_MOTIVATION', text: 'Motivated to stop or reduce' },
    { divider: 'or' },
    { value: 'unknown', text: 'Unknown' },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'This is a required field',
    }),
  ],
})
