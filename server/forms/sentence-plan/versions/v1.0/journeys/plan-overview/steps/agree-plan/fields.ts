import { Format, validation, Self, Answer, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKRadioInput, GovUKTextareaInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../../constants'

const detailsForNoField = GovUKTextareaInput({
  code: 'plan_agreement_details_no',
  label: 'Enter details',
  dependentWhen: Answer('plan_agreement_question').match(Condition.Equals('no')),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter details about why they do not agree',
    }),
  ],
})

const detailsForCouldNotAnswerField = GovUKTextareaInput({
  code: 'plan_agreement_details_could_not_answer',
  label: 'Enter details',
  dependentWhen: Answer('plan_agreement_question').match(Condition.Equals('could_not_answer')),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter details about why they could not answer',
    }),
  ],
})

export const planAgreementQuestion = GovUKRadioInput({
  code: 'plan_agreement_question',
  fieldset: {
    legend: {
      text: Format('Does %1 agree to this plan?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
      isPageHeading: true,
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
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they agree to the plan, or that they could not answer this question',
    }),
  ],
})

export const notesField = GovUKTextareaInput({
  code: 'plan_agreement_notes',
  label: {
    text: 'Add any notes (optional)',
    classes: 'govuk-label--m',
  },
})

export const saveButton = GovUKButton({
  text: 'Save',
  name: 'action',
  value: 'save',
  attributes: {
    'data-ai-id': 'agree-plan-save-button',
  },
})
