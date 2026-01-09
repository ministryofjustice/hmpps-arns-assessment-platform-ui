import { block, field, Format, validation, Self, Answer } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKTextareaInput } from '@form-engine-govuk-components/components/textarea-input/govukTextareaInput'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../../constants'

const detailsForNoField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'plan_agreement_details_no',
  label: 'Enter details',
  dependent: Answer('plan_agreement_question').match(Condition.Equals('no')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details about why they do not agree',
    }),
  ],
})

const detailsForCouldNotAnswerField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'plan_agreement_details_could_not_answer',
  label: 'Enter details',
  dependent: Answer('plan_agreement_question').match(Condition.Equals('could_not_answer')),
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter details about why they could not answer',
    }),
  ],
})

export const planAgreementQuestion = field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'plan_agreement_question',
  fieldset: {
    legend: {
      text: Format('Does %1 agree to this plan?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
    },
  },
  hint: Format('%1 must answer this question, or you must record why %1 could not.', CaseData.Forename),
  items: [
    { value: 'yes', text: 'Yes, I agree' },
    { value: 'no', text: 'No, I do not agree', block: detailsForNoField },
    { divider: 'or' },
    {
      value: 'could_not_answer',
      text: Format('%1 could not answer this question', CaseData.Forename),
      hint: Format('Share this plan with %1 next time you see them.', CaseData.Forename),
      block: detailsForCouldNotAnswerField,
    },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they agree to the plan, or that they could not answer this question',
    }),
  ],
})

export const notesField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'plan_agreement_notes',
  label: {
    text: 'Add any notes (optional)',
    classes: 'govuk-label--m',
  },
})

export const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save',
  name: 'action',
  value: 'save',
})
