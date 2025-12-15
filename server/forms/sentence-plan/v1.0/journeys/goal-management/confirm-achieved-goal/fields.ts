import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Confirm Goal Achieved</h1>',
})

export const confirmButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Mark as achieved',
  name: 'action',
  value: 'confirm',
})
