import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Expressions - Introduction
 *
 * High-level overview of what expressions are, their purpose, and
 * the different types available in the form-engine.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Expressions

  **Expressions** compute values dynamically at runtime.
  They combine references, conditions, and transformations to produce
  text, boolean logic, and complex data structures. {.lead}

  ---

  ## What is an Expression?

  While **references** point to single values, **expressions**
  combine and transform those values into something new. They are the building blocks
  for dynamic form behaviour.

  Expressions enable:

  - String interpolation with placeholders
  - If/then/else conditional logic
  - Boolean combinations (AND, OR, XOR)
  - Iterating over collections
  - Transforming values through pipelines

  ---

  ## Expression Types

  The form-engine provides four main expression builders:

  | Expression | Returns | Purpose |
  |------------|---------|---------|
  | \`Format()\` | String | String interpolation with placeholders |
  | \`when()\` / \`Conditional()\` | Any value | If/then/else branching logic |
  | \`and()\`, \`or()\`, \`xor()\`, \`not()\` | Boolean | Combining multiple predicates |
  | \`Collection()\` | Array of blocks | Iterating over data to generate content |

  ---

  ## Importing Expression Builders

  All expression builders are available from the main builders module:

  {{slot:importCode}}

  ---

  ## Expressions vs References

  Understanding the difference:

  | References | Expressions |
  |------------|-------------|
  | Point to existing values | Compute new values |
  | \`Answer('name')\` | \`Format('Hello, %1!', Answer('name'))\` |
  | Single data source | Combine multiple sources |
  | No logic | Conditional branching, iteration |

  > **Key insight:** Expressions often contain references.
  > A \`Format()\` expression interpolates reference values.
  > A \`Conditional()\` branches based on a reference comparison.

  ---

  ## Quick Examples

  Here's a taste of what each expression type can do:

  {{slot:exampleCode}}

  ---

  ## Where Expressions Are Used

  Expressions can be used in most field and block properties:

  | Property | Expression Types |
  |----------|------------------|
  | \`content\` | Format, Conditional, references |
  | \`label\`, \`hint\` | Format, Conditional, references |
  | \`hidden\`, \`dependent\` | Predicates (and, or, xor, .match()) |
  | \`when\` (validation) | Predicates |
  | \`defaultValue\` | Conditional, references |
  | \`collection\` | Collection() |

  ---

  ## What's Next

  The following pages cover each expression type in detail:

  - **Format()** — String interpolation with placeholders
  - **Conditional Expressions** — If/then/else with when() and Conditional()
  - **Predicate Combinators** — Combining conditions with and(), or(), xor(), not()
  - **Collection()** — Iterating over arrays to generate content

  ---

  {{slot:pagination}}
`),
  slots: {
    importCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import {
            // String formatting
            Format,

            // Conditional logic
            when, Conditional,

            // Predicate combinators
            and, or, xor, not,

            // Collection iteration
            Collection, Item,

            // References (used within expressions)
            Answer, Data, Self, Params, Query, Post,
          } from '@form-engine/form/builders'
        `,
      }),
    ],
    exampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Format() - String interpolation
          Format('Welcome, %1 %2!', Answer('firstName'), Answer('lastName'))
          // → "Welcome, John Smith!"

          // when() - Conditional branching
          when(Answer('age').match(Condition.Number.GreaterThan(18)))
            .then('Adult pricing')
            .else('Child pricing')

          // Conditional() - Same thing, object syntax
          Conditional({
            when: Answer('country').match(Condition.Equals('UK')),
            then: 'Postcode',
            else: 'ZIP Code',
          })

          // and() - Both conditions must be true
          and(
            Answer('hasAccount').match(Condition.Equals(true)),
            Answer('isVerified').match(Condition.Equals(true))
          )

          // Collection() - Iterate over array
          Collection({
            collection: Data('items'),
            template: [
              block<HtmlBlock>({
                variant: 'html',
                content: Format('<li>%1</li>', Item().path('name')),
              }),
            ],
          })
        `,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/hub',
          labelText: 'Guide Hub',
        },
        next: {
          href: '/forms/form-engine-developer-guide/expressions/format',
          labelText: 'Format Expressions',
        },
      }),
    ],
  },
})
