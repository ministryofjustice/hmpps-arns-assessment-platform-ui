import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKTextInput } from '@form-engine-govuk-components/components/text-input/govukTextInput'
import { GovUKCheckboxInput } from '@form-engine-govuk-components/components/checkbox-input/govukCheckboxInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Answer, block, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'

const operatorName = field<GovUKTextInput>({
  code: 'operatorName',
  variant: 'govukTextInput',
  label: 'Operator name',
  hint: 'Full name of the person responsible for food safety',
  formatters: [Transformer.String.Trim(), Transformer.String.ToTitleCase()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter the operator name',
    }),
  ],
  dependent: Answer('operatorSameAsBusiness').match(Condition.Equals('no')),
})

export const operatorSameAsBusiness = field<GovUKRadioInput>({
  code: 'operatorSameAsBusiness',
  variant: 'govukRadioInput',
  label: 'Is the food business operator the same as the business contact?',
  hint: 'The operator is the person responsible for food safety',
  items: [
    { value: 'yes', text: 'Yes' },
    { value: 'no', text: 'No', block: operatorName },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select yes if the operator is the same as the business contact',
    }),
  ],
})

export const operatorQualifications = field<GovUKCheckboxInput>({
  code: 'operatorQualifications',
  variant: 'govukCheckboxInput',
  label: 'What food safety qualifications does the operator have?',
  hint: 'Select all that apply',
  multiple: true,
  items: [
    {
      value: 'level2',
      text: 'Level 2 Food Safety and Hygiene',
      hint: 'Basic food hygiene certificate',
    },
    {
      value: 'level3',
      text: 'Level 3 Food Safety',
      hint: 'Advanced food safety for supervisors',
    },
    {
      value: 'level4',
      text: 'Level 4 Food Safety',
      hint: 'HACCP and food safety management',
    },
    {
      value: 'none',
      text: 'No formal qualifications',
      behaviour: 'exclusive',
    },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: "Select the operator's qualifications",
    }),
    validation({
      when: Self().match(Condition.Array.Contains('none')),
      message: 'At least one Level 2 or higher food safety qualification is required for registration',
    }),
  ],
})

export const saveAndContinueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'continue',
})
