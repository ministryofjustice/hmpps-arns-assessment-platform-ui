import { block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: '<h1 class="govuk-heading-l">Privacy policy</h1>',
})

export const pageContent = block<HtmlBlock>({
  variant: 'html',
  content:
    '<p class="govuk-body" data-qa="privacy-policy-content">This is the Privacy policy page. Content for this page will be added soon.</p>',
})
