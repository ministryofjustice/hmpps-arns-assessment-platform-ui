import { validation, Self, Answer, Format, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'

const typeOfEmployment = GovUKRadioInput({
  code: 'type_of_employment',
  fieldset: {
    legend: {
      text: 'Select the type of employment',
      classes: 'govuk-visually-hidden',
    },
  },
  dependentWhen: Answer('current_employment').match(Condition.Equals('EMPLOYED')),
  items: [
    { value: 'FULL_TIME', text: 'Full-time' },
    { value: 'PART_TIME', text: 'Living with friends or family' },
    { value: 'TEMPORARY_OR_CASUAL', text: 'Renting privately' },
    { value: 'APPRENTICESHIP', text: 'Renting from social, local authority or other' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type employment',
    }),
  ],
})

export const currentEmployment = GovUKRadioInput({
  code: 'current_employment',
  fieldset: {
    legend: {
      text: Format('What is %1 current employment status?', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  items: [
    { value: 'EMPLOYED', text: 'Employed', block: typeOfEmployment },
    { value: 'SELF_EMPLOYED', text: 'Self-employed' },
    { value: 'RETIRED', text: 'Retired' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select the type of employment they currently have',
    }),
  ],
})
