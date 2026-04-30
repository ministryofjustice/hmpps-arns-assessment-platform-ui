import { validation, Self, Format, Condition, not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKRadioInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'

export const drugUse = GovUKRadioInput({
  code: 'drug_use',
  fieldset: {
    legend: {
      text: Format('Has %1 ever misused drugs?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'This includes illegal and prescription drugs.',
  items: [
    { value: 'YES', text: 'Yes' },
    { value: 'NO', text: 'No' },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: "Select if they've ever misused drugs",
    }),
  ],
})
