import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovukTextareaInput } from '@form-engine-govuk-components/components/textarea-input/govukTextareaInput'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Answer, block, field, Self, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { and } from '@form-engine/form/builders/PredicateTestExprBuilder'

export const allergenHeading = block<HtmlBlock>({
  variant: 'html',
  content: `
    <h1 class="govuk-heading-l">Allergen information</h1>
    <p class="govuk-body">You must provide information about allergens in your menu items.</p>
    <p class="govuk-body">This helps customers with food allergies make safe choices.</p>
  `,
})

export const allergenPolicyInPlace = field<GovUKRadioInput>({
  code: 'allergenPolicyInPlace',
  variant: 'govukRadioInput',
  label: 'Do you have an allergen management policy?',
  hint: 'This should include how you prevent cross-contamination',
  items: [
    { value: 'yes', text: 'Yes' },
    { value: 'no', text: 'No' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select yes if you have an allergen management policy',
    }),
  ],
})

export const allergenPolicyDetails = field<GovukTextareaInput>({
  code: 'allergenPolicyDetails',
  variant: 'govukTextarea',
  label: 'Describe your allergen management policy',
  hint: 'Include how you prevent cross-contamination and how staff are trained',
  hidden: Answer('allergenPolicyInPlace').match(Condition.Equals('no')),
  formatters: [Transformer.String.Trim()],
  validate: [
    validation({
      when: and(
        Answer('allergenPolicyInPlace').match(Condition.Equals('yes')),
        Self().not.match(Condition.IsRequired()),
      ),
      message: 'Describe your allergen management policy',
    }),
    validation({
      when: and(
        Answer('allergenPolicyInPlace').match(Condition.Equals('yes')),
        Self().not.match(Condition.String.HasMinLength(50)),
      ),
      message: 'Please provide more detail about your policy (at least 50 characters)',
    }),
  ],
})

export const allergenStaffTraining = field<GovUKRadioInput>({
  code: 'allergenStaffTraining',
  variant: 'govukRadioInput',
  label: 'Are staff trained in allergen awareness?',
  items: [
    { value: 'yes', text: 'Yes' },
    { value: 'no', text: 'No' },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select yes if staff are trained in allergen awareness',
    }),
  ],
})

export const saveAndContinueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'continue',
})
