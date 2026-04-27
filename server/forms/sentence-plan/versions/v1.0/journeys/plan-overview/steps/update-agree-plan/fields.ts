import { Answer, Format, Self, validation, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKRadioInput,
  GovUKTextareaInput,
  GovUKButtonGroup,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { CaseData } from '../../../../constants'

const detailsForNoField = GovUKTextareaInput({
  code: 'update_plan_agreement_details_no',
  label: 'Enter details',
  dependentWhen: Answer('update_plan_agreement_question').match(Condition.Equals('no')),
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
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
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
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
