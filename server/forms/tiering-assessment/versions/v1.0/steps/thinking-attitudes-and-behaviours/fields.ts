import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'

export const regularOffendingActivitiesField = GovUKRadioInput({
  code: 'regular-offending-activities',
  fieldset: {
    legend: {
      text: 'Does Name engage in activities that could link to offending?',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Engages in pro-social activities and understands the link to offending',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Sometimes engages in activities linked to offending but recognises the link',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Regularly engages in activities which encourage offending and is not aware or does not care about the link to offending',
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
      message: 'This is a required field',
    }),
  ],
})

export const temperControlField = GovUKRadioInput({
  code: 'temper-control',
  fieldset: {
    legend: {
      text: 'Is Name able to manage their temper?',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Yes, is able to manage their temper well',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Sometimes has outbreaks of uncontrolled anger',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'No, easily loses their temper',
      hint: 'This may result in a loss of control or inability to stay calm until they have expressed their anger',
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
      message: 'This is a required field',
    }),
  ],
})

export const impulsivityProblemsField = GovUKRadioInput({
  code: 'impulsivity-problems',
  fieldset: {
    legend: {
      text: 'Does Name act on impulse?',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'NO_PROBLEMS',
      text: 'Considers all aspects of a situation before acting on or making a decision',
    },
    {
      value: 'SOME_PROBLEMS',
      text: 'Sometimes acts on impulse which causes problems',
    },
    {
      value: 'SIGNIFICANT_PROBLEMS',
      text: 'Acts on impulse which causes significant problems',
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
      message: 'This is a required field',
    }),
  ],
})

export const proCriminalAttitudesField = GovUKRadioInput({
  code: 'pro-criminal-attitudes',
  fieldset: {
    legend: {
      text: 'Does Name support or excuse criminal behaviour?',
      classes: 'govuk-fieldset__legend--s',
    },
  },
  items: [
    {
      value: 'YES_IN_LAST_THREE_MONTHS',
      text: 'Does not support or excuse criminal behaviour',
    },
    {
      value: 'YES_NOT_IN_LAST_THREE_MONTHS',
      text: 'Sometimes supports or excuses criminal behaviour',
    },
    {
      value: 'NO',
      text: 'Supports or excuses criminal behaviour or their pattern of behaviour and other evidence indicates this is an issue',
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
      message: 'This is a required field',
    }),
  ],
})
