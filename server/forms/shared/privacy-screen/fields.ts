import { block, field, Format, validation, Self, Data } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKCheckboxInput } from '@form-engine-govuk-components/components/checkbox-input/govukCheckboxInput'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKButton } from '@form-engine-govuk-components/components'
import { TemplateWrapper } from '@form-engine/registry/components'
import { ConditionalString } from '@form-engine/form/types/structures.type'

export const createPrivacyContent = (forenameRef: ConditionalString) =>
  block<HtmlBlock>({
    variant: 'html',
    content: Format(
      `<h1 class="govuk-heading-l">Remember to close any other applications before starting an appointment with %1</h1>
    <p class="govuk-body">For example, Outlook, Teams or NDelius.</p>
    <p class="govuk-body">You must also close other people's assessments or plans if you have them open in other tabs.</p>
    <p class="govuk-body">Do not let %1 use your device either.</p>
    <p class="govuk-body">This is to avoid sharing sensitive information.</p>`,
      forenameRef,
    ),
  })

export const privacyCheckbox = field<GovUKCheckboxInput>({
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

const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
  preventDoubleClick: true,
})

/**
 * Return to OASys link - only shown when accessType is 'oasys'
 */
// TODO: insert correct return to oasys link once we have OASys return url available
const returnToOasysLink = block<HtmlBlock>({
  variant: 'html',
  hidden: Data('session.accessType').not.match(Condition.Equals('oasys')),
  content: Format(
    '<a href="%1" class="govuk-link govuk-link--no-visited-state">Return to OASys</a>',
    Data('systemReturnUrl'),
  ),
})

export const buttonGroup = TemplateWrapper({
  template: '<div class="govuk-button-group">{{slot:buttons}}</div>',
  slots: {
    buttons: [confirmButton, returnToOasysLink],
  },
})
