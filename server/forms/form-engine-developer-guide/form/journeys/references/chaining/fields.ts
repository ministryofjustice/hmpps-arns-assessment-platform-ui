import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - Chaining
 *
 * Documentation for chaining references with .pipe(), .match(), .not,
 * and combining references with Format() and Conditional().
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Chaining References

References can be extended with transformations, conditions, and combined
into complex expressions. This page covers the fluent API for building
powerful data pipelines. {.lead}

---

## The Fluent API

Every reference returns a \`ChainableRef\` that supports these methods:

- \`.match(condition)\` — Test the value against a condition
- \`.not.match(condition)\` — Negate a condition test
- \`.pipe(...transformers)\` — Transform the value through a pipeline
- \`.path('property')\` — Navigate to a nested property

---

## .match() - Condition Testing

The \`.match()\` method tests a reference value against a condition,
returning a boolean expression that can be used in \`when\`,
\`hidden\`, and \`dependent\` properties.

{{slot:matchCode}}

### .not - Negating Conditions

Use \`.not\` before \`.match()\` to invert the condition:

{{slot:notCode}}

---

## .pipe() - Transformation Pipelines

The \`.pipe()\` method passes the reference value through one or more
transformers, creating a pipeline that processes the data step by step.

{{slot:pipeCode}}

### Common Pipeline Patterns

{{slot:pipePatterns}}

{{slot:pipeDetails}}

---

## Format() - String Interpolation

\`Format()\` combines multiple references into a formatted string
using placeholder syntax:

{{slot:formatCode}}

---

## Conditional() - If/Then/Else Logic

\`Conditional()\` returns different values based on a condition:

{{slot:conditionalCode}}

### Dynamic Field Labels

Combine \`Conditional()\` and \`Format()\` for dynamic labels:

{{slot:dynamicLabels}}

---

## Putting It All Together

Here's a complete example showing multiple chaining techniques:

{{slot:completeExample}}

---

## Quick Reference

| Method | Returns | Use For |
|--------|---------|---------|
| \`.match()\` | Boolean expression | Validation, hidden, dependent |
| \`.not.match()\` | Boolean expression (negated) | "must be" validations |
| \`.pipe()\` | Transformed value | Data transformation |
| \`.path()\` | Nested property | Object navigation |
| \`Format()\` | Formatted string | String interpolation |
| \`Conditional()\` | Conditional value | If/then/else logic |

---

{{slot:pagination}}
`),
  slots: {
    matchCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Answer, Self, Condition } from '@form-engine/form/builders'

          // Basic condition matching
          Answer('country').match(Condition.Equals('UK'))
          Answer('age').match(Condition.Number.GreaterThan(18))
          Self().not.match(Condition.IsRequired())

          // Use in validation
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your full name',
          })

          // Use in hidden condition
          field({
            code: 'ukDetails',
            hidden: Answer('country').not.match(Condition.Equals('UK')),
          })
        `,
      }),
    ],
    notCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // "Show error when value is NOT a valid email"
          Self().not.match(Condition.Email.IsValidEmail())

          // "Show error when value is NOT at least 8 characters"
          Self().not.match(Condition.String.HasMinLength(8))

          // "Hide field when user has NOT selected 'other'"
          Answer('selection').not.match(Condition.Equals('other'))

          // Common validation pattern (Required → Format → Business)
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your email address',
            }),
            validation({
              when: Self().not.match(Condition.Email.IsValidEmail()),
              message: 'Enter a valid email address',
            }),
          ]
        `,
      }),
    ],
    pipeCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Answer, Transformer } from '@form-engine/form/builders'

          // Single transformer
          Answer('email').pipe(Transformer.String.ToLowerCase())

          // Multiple transformers (executed left to right)
          Answer('email').pipe(
            Transformer.String.Trim(),
            Transformer.String.ToLowerCase()
          )

          // Chain with conditions
          Answer('quantity').pipe(
            Transformer.String.ToInt()
          ).match(Condition.Number.GreaterThan(0))
        `,
      }),
    ],
    pipePatterns: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Clean string input
          Answer('postcode').pipe(
            Transformer.String.Trim(),
            Transformer.String.ToUpperCase()
          )
          // "  sw1a 1aa  " → "SW1A 1AA"

          // 2. Parse and format numbers
          Answer('price').pipe(
            Transformer.String.ToFloat(),
            Transformer.Number.ToFixed(2)
          )
          // "99.999" → "100.00"

          // 3. Array length for validation
          Answer('selections').pipe(
            Transformer.Array.Length()
          )
          // ["a", "b", "c"] → 3

          // 4. Calculate values
          Answer('quantity').pipe(
            Transformer.String.ToInt(),
            Transformer.Number.Multiply(10)
          )
        `,
      }),
    ],
    pipeDetails: [
      GovUKDetails({
        summaryText: 'Alternative: Standalone Pipe() function',
        content: [
          HtmlBlock({
            content: `
              <p class="govuk-body">
                You can also use the standalone <code>Pipe()</code> function with any expression:
              </p>
            `,
          }),
          CodeBlock({
            language: 'typescript',
            code: `
          // The .pipe() method is chainable:
          Answer('email').pipe(Transformer.String.Trim())

          // You can chain multiple transformers:
          Answer('email').pipe(
            Transformer.String.Trim(),
            Transformer.String.ToLowerCase()
          )

          // Works with Item() for collection indices
          Item().index().pipe(Transformer.Number.Add(1))
        `,
          }),
        ],
      }),
    ],
    formatCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Format, Answer, Data } from '@form-engine/form/builders'

          // Basic placeholders: %1, %2, %3, etc.
          Format('Hello, %1!', Answer('firstName'))
          // "Hello, John!"

          Format('%1 %2', Answer('firstName'), Answer('lastName'))
          // "John Smith"

          // Use in HTML content
          HtmlBlock({
            content: Format(
              '<h1>Welcome, %1</h1><p>Your email: %2</p>',
              Answer('name'),
              Answer('email')
            ),
          })

          // Combine with pipes
          Format('Total: £%1',
            Answer('price').pipe(Transformer.Number.ToFixed(2))
          )
        `,
      }),
    ],
    conditionalCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Conditional, Answer, Condition } from '@form-engine/form/builders'

          // Basic if/then/else
          Conditional({
            when: Answer('country').match(Condition.Equals('UK')),
            then: 'Postcode',
            else: 'ZIP Code',
          })

          // With references as then/else values
          Conditional({
            when: Answer('useBusinessAddress').match(Condition.Equals(true)),
            then: Data('business.address'),
            else: Answer('homeAddress'),
          })

          // Nested conditionals
          Conditional({
            when: Answer('tier').match(Condition.Equals('premium')),
            then: 'Premium Support',
            else: Conditional({
              when: Answer('tier').match(Condition.Equals('standard')),
              then: 'Standard Support',
              else: 'Basic Support',
            }),
          })
        `,
      }),
    ],
    dynamicLabels: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKTextInput({
            code: 'postalCode',
            label: Conditional({
              when: Answer('country').match(Condition.Equals('US')),
              then: 'ZIP Code',
              else: 'Postcode',
            }),
            hint: Conditional({
              when: Answer('country').match(Condition.Equals('US')),
              then: 'For example, 90210',
              else: 'For example, SW1A 1AA',
            }),
          })
        `,
      }),
    ],
    completeExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // A sophisticated address validation field
          GovUKTextInput({
            code: 'postcode',

            // Dynamic label based on country
            label: Conditional({
              when: Answer('country').match(Condition.Equals('US')),
              then: 'ZIP Code',
              else: 'Postcode',
            }),

            // Dynamic hint
            hint: Conditional({
              when: Answer('country').match(Condition.Equals('US')),
              then: 'For example, 90210 or 90210-1234',
              else: 'For example, SW1A 1AA',
            }),

            // Only show for certain countries
            hidden: Answer('country').not.match(
              Condition.Array.IsIn(['UK', 'US', 'CA', 'AU'])
            ),

            // Validation depends on country
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: Conditional({
                  when: Answer('country').match(Condition.Equals('US')),
                  then: 'Enter your ZIP Code',
                  else: 'Enter your postcode',
                }),
              }),
              validation({
                when: and(
                  Answer('country').match(Condition.Equals('UK')),
                  Self().not.match(Condition.Address.IsValidPostcode()),
                ),
                message: 'Enter a valid UK postcode',
              }),
            ],

            // Clean up the input
            formatters: [
              Transformer.String.Trim(),
              Transformer.String.ToUpperCase(),
            ],
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/references/http',
          labelText: 'HTTP References',
        },
      }),
    ],
  },
})
