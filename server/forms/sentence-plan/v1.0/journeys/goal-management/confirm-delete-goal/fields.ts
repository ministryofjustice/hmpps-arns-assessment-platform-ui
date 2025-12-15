import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Confirm Delete Goal</h1>',
})

export const confirmButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Confirm removal',
  name: 'action',
  value: 'confirm',
  classes: 'govuk-button--warning',
})
