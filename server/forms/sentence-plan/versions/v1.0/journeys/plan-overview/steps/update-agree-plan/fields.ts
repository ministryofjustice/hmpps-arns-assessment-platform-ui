import { Answer, Format, Self, validation } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKRadioInput } from '@form-engine-govuk-components/components/radio-input/govukRadioInput'
import { GovUKTextareaInput } from '@form-engine-govuk-components/components/textarea-input/govukTextareaInput'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKButtonGroup } from '@form-engine-govuk-components/wrappers/govukButtonGroup'
import { CaseData } from '../../../../constants'

const detailsForNoField = GovUKTextareaInput({
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

export const updatePlanAgreementQuestion = GovUKRadioInput({
  code: 'update_plan_agreement_question',
  fieldset: {
    legend: {
      text: Format('Does %1 agree to their plan?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--l',
      isPageHeading: true,
    },
  },
  hint: Format('%1 must answer this question.', CaseData.Forename),
  items: [
    { value: 'yes', text: 'Yes, I agree' },
    { value: 'no', text: 'No, I do not agree', block: detailsForNoField },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Select if they agree to the plan',
    }),
  ],
})

const saveButton = GovUKButton({
  text: 'Save',
  name: 'action',
  value: 'save',
})

const goBackLink = HtmlBlock({
  content: Format(
    '<a href="overview?type=current" class="govuk-link govuk-link--no-visited-state">Go back to %1\'s plan</a>',
    CaseData.Forename,
  ),
})

export const buttonGroup = GovUKButtonGroup({ buttons: [saveButton, goBackLink] })
