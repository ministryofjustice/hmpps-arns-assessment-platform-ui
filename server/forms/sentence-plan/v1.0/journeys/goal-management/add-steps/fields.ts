import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Add Steps to Goal</h1>',
})

export const continueButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Continue',
  name: 'action',
  value: 'continue',
})
