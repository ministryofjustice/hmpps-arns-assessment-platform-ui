import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Recipe: Format a Dynamic Value
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipe: Format a Dynamic Value

Display computed or formatted text using expressions. {.lead}

---

## The Pattern

Use \`Format()\` to interpolate values into text with \`%1\`, \`%2\` placeholders.

{{slot:basicExample}}

---

## How It Works

1. \`Format(template, ...values)\` takes a template string and values
2. \`%1\`, \`%2\`, \`%3\` are replaced with the corresponding values
3. Values can be static strings, \`Answer()\`, \`Data()\`, or piped expressions

---

## Common Variations

### Combine multiple values

{{slot:multipleExample}}

### Conditional text with Conditional()

{{slot:conditionalExample}}

### Format with Data reference

{{slot:dataExample}}

### Use with pipe transformers

{{slot:pipeExample}}

### Dynamic field labels

{{slot:labelExample}}

---

## Related Concepts

- [Expressions](/form-engine-developer-guide/expressions/intro) - Full expressions documentation
- [References](/form-engine-developer-guide/references/intro) - Answer(), Data(), and other references
- [Chaining](/form-engine-developer-guide/references/chaining) - The fluent .pipe() API

---

{{slot:pagination}}
`),
  slots: {
    basicExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { block, Format, Answer } from '@form-engine/form/builders'
          import { HtmlBlock } from '@form-engine/registry/components/html'

          export const greeting = HtmlBlock({
            content: Format('Hello, %1!', Answer('firstName')),
          })
        `,
      }),
    ],
    multipleExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Combine multiple references
          content: Format('%1 %2', Answer('firstName'), Answer('lastName'))
          // "John Smith"

          // In HTML content
          HtmlBlock({
            content: Format(
              '<h1>Welcome, %1</h1><p>Your email: %2</p>',
              Answer('name'),
              Answer('email')
            ),
          })
        `,
      }),
    ],
    conditionalExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Conditional, Answer } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'

          // Show different text based on a condition
          content: Conditional({
            when: Answer('memberType').match(Condition.Equals('premium')),
            then: Format('Welcome back, %1! You have premium access.', Answer('firstName')),
            else: Format('Welcome, %1. Upgrade to premium for more features.', Answer('firstName')),
          })
        `,
      }),
    ],
    dataExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Format, Data } from '@form-engine/form/builders'

          // Format with data loaded from an effect
          content: Format('Your account balance is £%1', Data('account.balance'))
        `,
      }),
    ],
    pipeExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Format, Answer, Transformer } from '@form-engine/form/builders'

          // Combine with pipe transformers
          content: Format(
            'Total: £%1',
            Answer('price').pipe(Transformer.Number.ToFixed(2))
          )
        `,
      }),
    ],
    labelExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Conditional, Answer } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'

          // Dynamic label and hint based on country
          export const postalCode = GovUKTextInput({
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
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/recipes/load-data',
          labelText: 'Load Data on Entry',
        },
        next: {
          href: '/form-engine-developer-guide/recipes/save-answers',
          labelText: 'Save Answers on Submit',
        },
      }),
    ],
  },
})
