import { block, field, Format, validation, Self, Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKCheckboxInput, GovUKButton } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { ConditionalString } from '@form-engine/form/types/structures.type'

const createPrivacyContent = (personForename: ConditionalString) =>
  block<HtmlBlock>({
    variant: 'html',
    content: Format(
      `<h1 class="govuk-heading-l">Remember to close any other applications before starting an appointment with %1</h1>
    <p class="govuk-body">For example, Outlook, Teams or NDelius.</p>
    <p class="govuk-body">You must also close other people's assessments or plans if you have them open in other tabs.</p>
    <p class="govuk-body">Do not let %1 use your device either.</p>
    <p class="govuk-body">This is to avoid sharing sensitive information.</p>`,
      personForename,
    ),
  })

const privacyCheckbox = field<GovUKCheckboxInput>({
  variant: 'govukCheckboxInput',
  code: 'confirm_privacy',
  multiple: true,
  items: [
    {
      value: 'confirmed',
      text: "I confirm I'll do this before starting an appointment",
    },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.Array.Contains('confirmed')),
      message: 'Confirm you will do this before starting an appointment',
    }),
  ],
})

const confirmButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
  preventDoubleClick: true,
})

const returnToOasysLink = block<HtmlBlock>({
  variant: 'html',
  hidden: Data('accessDetails.accessType').not.match(Condition.Equals('handover')),
  content: Format(
    '<a href="%1" class="govuk-link govuk-link--no-visited-state">Return to OASys</a>',
    Data('accessDetails.oasysRedirectUrl'),
  ),
})

const buttonGroup = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: '<div class="govuk-button-group">{{slot:buttons}}</div>',
  slots: {
    buttons: [confirmButton, returnToOasysLink],
  },
})

/**
 * Creates the privacy screen form content with the given person forename expression.
 *
 * @param personForename - Expression to resolve the person's forename (e.g., Data('caseData.name.forename'))
 */
export const createFormContent = (personForename: ConditionalString) =>
  block<TemplateWrapper>({
    variant: 'templateWrapper',
    template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        {{slot:content}}
      </div>
    </div>
  `,
    slots: {
      content: [createPrivacyContent(personForename), privacyCheckbox, buttonGroup],
    },
  })
