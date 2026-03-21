import { validation, Self, Format } from '@form-engine/form/builders'
import { GovUKRadioInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
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
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: "Select if they've ever misused drugs",
    }),
  ],
})
