import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Previous Versions</h1>',
})
