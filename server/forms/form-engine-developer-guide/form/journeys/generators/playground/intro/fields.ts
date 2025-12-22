import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Generators Playground - Hub
 *
 * Entry point to the interactive generator examples.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Generators Playground

  Try out generators in real time. Each page below has live examples
  where you can see how generators produce dynamic values. {.lead}

  ---

  ## Choose a generator type

  - [**Date Generators**](/forms/form-engine-developer-guide/generators/playground/dates)

    Generate current dates and times for use in forms.

  <div class="govuk-inset-text">
    More generator types will be added in future updates.
  </div>

  ---

  {{slot:pagination}}
`),
  slots: {
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/generators/intro',
          labelText: 'Understanding Generators',
        },
        next: {
          href: '/forms/form-engine-developer-guide/generators/playground/dates',
          labelText: 'Date Generators',
        },
      }),
    ],
  },
})
