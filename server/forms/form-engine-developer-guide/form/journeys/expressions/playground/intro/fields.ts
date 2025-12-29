import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Expressions Playground - Hub
 *
 * Entry point to the interactive expression examples.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Expressions Playground

  Try out expressions in real time. Each page below has live fields and
  dynamic content where you can see how expressions work in practice. {.lead}

  ---

  ## Choose an expression type

  - [**Format Expressions**](/forms/form-engine-developer-guide/expressions/playground/format)

    String interpolation with \`Format()\` - combine values into dynamic text.

  - [**Conditional Expressions**](/forms/form-engine-developer-guide/expressions/playground/conditional)

    If/then/else logic with \`when()\` and \`Conditional()\`.

  - [**Predicate Combinators**](/forms/form-engine-developer-guide/expressions/playground/predicates)

    Boolean logic with \`and()\`, \`or()\`, and \`not()\`.

  ---

  {{slot:pagination}}
`),
  slots: {
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/expressions/predicates',
          labelText: 'Predicate Combinators',
        },
        next: {
          href: '/forms/form-engine-developer-guide/expressions/playground/format',
          labelText: 'Format Playground',
        },
      }),
    ],
  },
})
