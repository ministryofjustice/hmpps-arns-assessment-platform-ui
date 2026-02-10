import { Answer, block, field, Format, Self, validation } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKRadioInput, GovUKTextareaInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../../constants'

const detailsForNoField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'update_plan_agreement_details_no',
  label: 'Enter details',
  dependent: Answer('update_plan_agreement_question').match(Condition.Equals('no')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details about why they do not agree',
    }),
  ],
})

export const updatePlanAgreementQuestion = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'update_plan_agreement_question',
  fieldset: {
    legend: {
      text: Format('Does %1 agree to their plan?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  hint: Format('%1 must answer this question, or you must record why %1 could not.', CaseData.Forename),
  items: [
    { value: 'yes', text: 'Yes, I agree' },
    { value: 'no', text: 'No, I do not agree', block: detailsForNoField },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they agree to the plan, or that they could not answer this question',
    }),
  ],
})

export const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save',
  name: 'action',
  value: 'save',
})
