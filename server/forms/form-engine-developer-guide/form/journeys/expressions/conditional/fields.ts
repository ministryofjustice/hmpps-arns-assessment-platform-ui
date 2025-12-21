import { block, Answer, field, when, Conditional } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination, GovUKRadioInput, GovUKTextInput } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { exampleBox } from '../../../../helpers/exampleBox'

/**
 * Expressions - Conditional
 *
 * Documentation for when() and Conditional() if/then/else expressions.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Conditional Expressions

  Conditional expressions return different values based on a predicate.
  The form-engine provides two equivalent APIs: \`when()\` for fluent
  chaining and \`Conditional()\` for object syntax. {.lead}

  ---

  ## Two Equivalent APIs

  Both APIs produce the same result. Choose based on readability:

  {{slot:apiCode}}

  ---

  ## when() - Fluent Builder

  The \`when()\` function starts a fluent chain:

  {{slot:whenCode}}

  ---

  ## Conditional() - Object Syntax

  The \`Conditional()\` function takes an options object:

  {{slot:conditionalCode}}

  ---

  ## Live Example

  Select a country to see the label change dynamically:

  {{slot:liveExample}}

  The code for this example:

  {{slot:liveExampleCode}}

  ---

  ## Nested Conditionals

  For multiple conditions, nest conditionals in the \`else\` branch:

  {{slot:nestedCode}}

  ---

  ## Choosing Between APIs

  | Use Case | Recommended |
  |----------|-------------|
  | Simple conditionals | Either — personal preference |
  | Inline in properties | \`when()\` — more concise |
  | Deeply nested logic | \`Conditional()\` — clearer structure |
  | Complex predicates | \`Conditional()\` — easier to read |

  ---

  ## Common Use Cases

  {{slot:useCasesCode}}

  ---

  ## Values Can Be Expressions

  The \`then\` and \`else\` values can be any expression,
  not just strings:

  {{slot:expressionValuesCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    apiCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          import { when, Conditional, Answer, Condition } from '@form-engine/form/builders'

          // Fluent API: when().then().else()
          when(Answer('country').match(Condition.Equals('UK')))
            .then('Postcode')
            .else('ZIP Code')

          // Object API: Conditional({ when, then, else })
          Conditional({
            when: Answer('country').match(Condition.Equals('UK')),
            then: 'Postcode',
            else: 'ZIP Code',
          })

          // Both produce the same result!
        `,
      }),
    ],
    whenCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Basic structure
          when(predicate)
            .then(valueIfTrue)
            .else(valueIfFalse)

          // Examples
          when(Answer('age').match(Condition.Number.GreaterThan(18)))
            .then('Adult')
            .else('Minor')

          when(Answer('hasAccount').match(Condition.Equals(true)))
            .then('Welcome back!')
            .else('Create an account to continue')

          // else is optional (returns undefined when false)
          when(Answer('isPremium').match(Condition.Equals(true)))
            .then('Premium features enabled')
        `,
      }),
    ],
    conditionalCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Basic structure
          Conditional({
            when: predicate,
            then: valueIfTrue,
            else: valueIfFalse,  // optional
          })

          // Examples
          Conditional({
            when: Answer('membershipType').match(Condition.Equals('gold')),
            then: 'Gold member discount: 20%',
            else: 'Standard pricing',
          })

          // Without else
          Conditional({
            when: Answer('showBanner').match(Condition.Equals(true)),
            then: '<div class="banner">Special offer!</div>',
          })
        `,
      }),
    ],
    liveExample: [
      exampleBox([
        field<GovUKRadioInput>({
          variant: 'govukRadioInput',
          code: 'conditionalExampleCountry',
          fieldset: {
            legend: { text: 'Where do you live?' },
          },
          items: [
            { value: 'UK', text: 'United Kingdom' },
            { value: 'US', text: 'United States' },
            { value: 'other', text: 'Other' },
          ],
        }),

        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'conditionalExamplePostcode',
          label: when(Answer('conditionalExampleCountry').match(Condition.Equals('US')))
            .then('ZIP Code')
            .else('Postcode'),
          hint: Conditional({
            when: Answer('conditionalExampleCountry').match(Condition.Equals('US')),
            then: 'For example, 90210',
            else: 'For example, SW1A 1AA',
          }),
          hidden: Answer('conditionalExampleCountry').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    liveExampleCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          field<GovUKRadioInput>({
            variant: 'govukRadioInput',
            code: 'conditionalExampleCountry',
            fieldset: { legend: { text: 'Where do you live?' } },
            items: [
              { value: 'UK', text: 'United Kingdom' },
              { value: 'US', text: 'United States' },
              { value: 'other', text: 'Other' },
            ],
          })

          field<GovUKTextInput>({
            variant: 'govukTextInput',
            code: 'conditionalExamplePostcode',

            // Dynamic label using when()
            label: when(Answer('conditionalExampleCountry').match(Condition.Equals('US')))
              .then('ZIP Code')
              .else('Postcode'),

            // Dynamic hint using Conditional()
            hint: Conditional({
              when: Answer('conditionalExampleCountry').match(Condition.Equals('US')),
              then: 'For example, 90210',
              else: 'For example, SW1A 1AA',
            }),

            // Only show when country is selected
            hidden: Answer('conditionalExampleCountry').not.match(Condition.IsRequired()),
          })
        `,
      }),
    ],
    nestedCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Using when() - fluent nesting
          when(Answer('tier').match(Condition.Equals('premium')))
            .then('Premium Support (24/7)')
            .else(
              when(Answer('tier').match(Condition.Equals('standard')))
                .then('Standard Support (9-5)')
                .else('Basic Support (email only)')
            )

          // Using Conditional() - object nesting
          Conditional({
            when: Answer('tier').match(Condition.Equals('premium')),
            then: 'Premium Support (24/7)',
            else: Conditional({
              when: Answer('tier').match(Condition.Equals('standard')),
              then: 'Standard Support (9-5)',
              else: 'Basic Support (email only)',
            }),
          })

          // Three-level nesting
          Conditional({
            when: Answer('score').match(Condition.Number.GreaterThan(90)),
            then: 'A',
            else: Conditional({
              when: Answer('score').match(Condition.Number.GreaterThan(80)),
              then: 'B',
              else: Conditional({
                when: Answer('score').match(Condition.Number.GreaterThan(70)),
                then: 'C',
                else: 'D',
              }),
            }),
          })
        `,
      }),
    ],
    useCasesCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // 1. Dynamic field labels
          field<GovUKTextInput>({
            code: 'identifier',
            label: when(Answer('idType').match(Condition.Equals('email')))
              .then('Email address')
              .else('Phone number'),
          })

          // 2. Conditional content blocks
          block<HtmlBlock>({
            variant: 'html',
            content: when(Answer('formComplete').match(Condition.Equals(true)))
              .then('<div class="govuk-panel govuk-panel--confirmation">Complete!</div>')
              .else('<p>Please complete all required fields.</p>'),
          })

          // 3. Dynamic validation messages
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: Conditional({
              when: Answer('fieldType').match(Condition.Equals('email')),
              then: 'Enter your email address',
              else: 'Enter your phone number',
            }),
          })

          // 4. Conditional default values
          field<GovUKTextInput>({
            code: 'country',
            defaultValue: Conditional({
              when: Data('user.location').match(Condition.Equals('GB')),
              then: 'United Kingdom',
              else: Data('user.location'),
            }),
          })

          // 5. Dynamic HTML content
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              '<p>Status: %1</p>',
              when(Answer('approved').match(Condition.Equals(true)))
                .then('<strong class="govuk-tag govuk-tag--green">Approved</strong>')
                .else('<strong class="govuk-tag govuk-tag--red">Pending</strong>')
            ),
          })
        `,
      }),
    ],
    expressionValuesCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Reference values
          Conditional({
            when: Answer('useBusinessAddress').match(Condition.Equals(true)),
            then: Data('business.address'),      // Return reference value
            else: Answer('homeAddress'),          // Return another reference
          })

          // Format expressions
          when(Answer('hasTitle').match(Condition.Equals(true)))
            .then(Format('%1 %2', Answer('title'), Answer('name')))
            .else(Answer('name'))

          // Nested conditionals as values
          Conditional({
            when: Answer('country').match(Condition.Equals('UK')),
            then: 'British Pound (£)',
            else: Conditional({
              when: Answer('country').match(Condition.Equals('US')),
              then: 'US Dollar ($)',
              else: 'Euro (€)',
            }),
          })
        `,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/expressions/format',
          labelText: 'Format Expressions',
        },
        next: {
          href: '/forms/form-engine-developer-guide/expressions/predicates',
          labelText: 'Predicate Combinators',
        },
      }),
    ],
  },
})
