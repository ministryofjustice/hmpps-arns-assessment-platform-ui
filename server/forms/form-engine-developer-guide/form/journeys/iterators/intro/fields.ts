import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Iterators - Introduction
 *
 * Overview of iterators in form-engine.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Iterators

  Iterators provide a composable, chainable way to perform per-item operations on collections.
  They allow you to filter, transform, and search through arrays of data using
  \`Item()\` references to access each element during iteration. {.lead}

  ---

  ## Available Iterators

  The \`Iterator\` namespace provides three iterator types:

  | Iterator | Description |
  |----------|-------------|
  | \`Iterator.Map\` | Transform each item to a new shape using a yield template |
  | \`Iterator.Filter\` | Keep only items matching a predicate condition |
  | \`Iterator.Find\` | Return the first item matching a predicate (or undefined) |

  ---

  ## Key Benefits

  | Feature | Description |
  |---------|-------------|
  | **Chainable** | Each operation is a separate \`.each()\` call |
  | **Composable** | Easy to add, remove, or reorder operations |
  | **Consistent** | Uses the same fluent API as other expressions |
  | **Extendable** | Can chain with \`.pipe()\` for whole-array transforms |

  ---

  ## Basic Syntax

  Iterators are used with the \`.each()\` method on any reference or expression
  that evaluates to an array. Use \`Literal()\` for static arrays:

  {{slot:syntaxCode}}

  ---

  ## What You'll Learn

  This section covers:

  1. **Iterator.Map** — Transform items to new shapes with yield templates
  2. **Iterator.Filter** — Keep only items matching conditions
  3. **Iterator.Find** — Get the first matching item
  4. **Chaining** — Combine multiple iterators and transformers
  5. **Interactive Playground** — Try out iterators with working examples

  ---

  {{slot:pagination}}
`),
  slots: {
    syntaxCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import { Data, Item, Iterator, Literal } from '@form-engine/form/builders'

          // With Data reference
          Data('users').each(Iterator.Map(Item().path('name')))

          // With static array using Literal()
          const options = [
            { id: 1, label: 'Option A' },
            { id: 2, label: 'Option B' },
          ]
          Literal(options).each(Iterator.Map({ value: Item().path('id'), text: Item().path('label') }))
        `,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/hub',
          labelText: 'Developer Guide Hub',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/map',
          labelText: 'Iterator.Map',
        },
      }),
    ],
  },
})
