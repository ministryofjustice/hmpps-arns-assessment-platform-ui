import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Accessibility</h1>',
})

export const pageContent = block<HtmlBlock>({
  variant: 'html',
  content:
    '<p class="govuk-body" data-qa="accessibility-content">This is the Accessibility page. Content for this page will be added soon.</p>',
})
