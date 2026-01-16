import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">View Historic Version</h1>',
})

export const backButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Back to previous versions',
  name: 'action',
  value: 'back',
  classes: 'govuk-button--secondary',
})
