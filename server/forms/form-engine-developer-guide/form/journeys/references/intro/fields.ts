import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - Introduction
 *
 * High-level overview of what references are, their purpose, and
 * the different types available in the form-engine.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# References

**References** are pointers to data within the form engine.
They get resolved at runtime to retrieve actual values from various sources. {.lead}

---

## What is a Reference?

A reference is a declarative way to say "get this value from somewhere".
Instead of hardcoding values, you describe *where* the value comes from,
and the form engine resolves it at runtime.

This enables:

- Dynamic content based on user input
- Conditional visibility of fields and blocks
- Validation rules that depend on other fields
- Pre-populating fields from external data
- Building complex expressions from multiple values

---

## Reference Types

The form-engine provides six reference types, each pointing to a different data source:

| Reference | Data Source | Common Use |
|-----------|-------------|------------|
| \`Answer('field')\` | Field responses | Referencing user input from any field |
| \`Data('key')\` | External data | API responses, database lookups |
| \`Self()\` | Current field | Validation rules, field-scoped logic |
| \`Item()\` | Collection item | Iterating over arrays, dynamic fields |
| \`Params('id')\` | URL path params | Route parameters like \`/users/:id\` |
| \`Query('search')\` | URL query string | Query params like \`?search=term\` |
| \`Post('field')\` | Raw POST body | Accessing raw submission data |

---

## Basic Example

Here's a simple example showing different reference types in action:

{{slot:exampleCode}}

---

## How References Resolve

References are evaluated at runtime through these steps:

1. The reference is encountered during form rendering or submission
2. The form-engine identifies the reference type from its path
3. A handler fetches the value from the appropriate source
4. Any nested path segments are navigated (e.g., \`.property.subProperty\`)
5. The final value is returned and used in the expression

> **Key insight:** References are lazy — they only resolve when needed.
> This means you can reference values that don't exist yet (like answers from fields
> the user hasn't filled in), and the form-engine handles missing values gracefully.

---

## Accessing Nested Properties

All references support dot notation to access nested properties:

{{slot:nestedCode}}

---

## What's Next

The following pages cover each reference type in detail:

- **Answer()** — Referencing field values
- **Data()** — Referencing external data
- **Self()** — Referencing the current field
- **Item()** — Referencing collection items
- **Params, Query & Post** — HTTP request references
- **Chaining** — Combining references with pipes and conditions

---

{{slot:pagination}}
`),
  slots: {
    exampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { block, Answer, Data, Self, Condition, validation } from '@form-engine/form/builders'

          // Using Answer() to show a greeting based on user input
          HtmlBlock({
            content: Format('Hello, %1!', Answer('firstName')),
          })

          // Using Data() to pre-populate from external source
          GovUKTextInput({
            code: 'email',
            label: 'Email address',
            defaultValue: Data('user.email'),
          })

          // Using Self() in validation
          GovUKTextInput({
            code: 'age',
            label: 'Your age',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter your age',
              }),
            ],
          })
        `,
      }),
    ],
    nestedCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Accessing nested data properties
          Data('user.profile.address.street')

          // Accessing nested answer values
          Answer('primaryContact.email')

          // Deep nesting works to any level
          Data('api.response.data.results.0.id')
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/hub',
          labelText: 'Guide Hub',
        },
        next: {
          href: '/forms/form-engine-developer-guide/references/answer',
          labelText: 'Answer Reference',
        },
      }),
    ],
  },
})
