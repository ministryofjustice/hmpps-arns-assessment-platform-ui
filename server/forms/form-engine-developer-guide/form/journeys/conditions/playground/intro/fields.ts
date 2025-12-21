import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Conditions Playground - Hub
 *
 * Entry point to the interactive conditions examples.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Conditions Playground

  Try out conditions in real time. Each page below has live fields
  where you can test different conditions and see the validation error messages. {.lead}

  ---

  ## Choose a condition type

  - [**String Conditions**](/forms/form-engine-developer-guide/conditions/playground/strings)

    Test equality, length, patterns, and character validation.

  - [**Number Conditions**](/forms/form-engine-developer-guide/conditions/playground/numbers)

    Test numeric comparisons, ranges, and type checks.

  - [**Date Conditions**](/forms/form-engine-developer-guide/conditions/playground/dates)

    Test date validity, comparisons, and relative checks.

  - [**Predicate Combinators**](/forms/form-engine-developer-guide/conditions/playground/combinators)

    Combine conditions with and(), or(), xor(), and not().

  ---

  {{slot:pagination}}
`),
  slots: {
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/conditions/custom',
          labelText: 'Custom Conditions',
        },
        next: {
          href: '/forms/form-engine-developer-guide/conditions/playground/strings',
          labelText: 'String Conditions',
        },
      }),
    ],
  },
})
