import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Components - Introduction
 *
 * Understanding the component system in form-engine.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Components

Components are the visual building blocks of forms. They render HTML from
your form definitions, handling everything from simple text to complex
interactive widgets. {.lead}

> This section focuses on how components work under the hood and how to build your own.
> For a quick overview of using \`block()\` and \`field()\` in forms,
> see [Blocks & Fields](/form-engine-developer-guide/blocks-and-fields/intro).

---

## Two Types of Components

Form-engine distinguishes between two types of components:

| Type | Description |
|------|-------------|
| **Blocks** | Display-only components that show content but don't collect data. Created with \`block()\`. |
| **Fields** | Input components that collect user data. Created with \`field()\` and require a \`code\` property to identify the answer. |

---

## Using block()

Blocks display content without collecting data. Common uses include headings,
instructions, warnings, and navigation.

{{slot:blockCode}}

---

## Using field()

Fields collect user input. Every field needs a \`code\` which becomes
the key for the answer in your form data.

{{slot:fieldCode}}

---

## Component Architecture

Each component consists of three parts:

1. **TypeScript interface** — defines the component's properties and ensures type safety
2. **Renderer function** — transforms the evaluated block data into template parameters
3. **Nunjucks template** — generates the final HTML output

This separation allows the TypeScript layer to handle complex logic (data
transformation, format conversion, conditional properties) while keeping
templates simple and focused on presentation.

---

## Common Properties

All components share these properties:

### \`variant\` <span class="govuk-tag govuk-tag--red">Required</span>

Identifies which component to render. Must match the component's registered name.

{{slot:variantCode}}

The generic type parameter (e.g., \`<GovUKTextInput>\`) provides
TypeScript autocomplete for that component's specific properties.

---

{{slot:pagination}}
`),
  slots: {
    blockCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { block } from '@form-engine/form/builders'
          import { HtmlBlock } from '@form-engine/registry/components/html'
          import { GovUKWarningText } from '@form-engine-govuk-components/components'

          // Simple HTML content
          HtmlBlock({
            content: '<h1 class="govuk-heading-l">Welcome</h1>',
          })

          // GOV.UK warning component
          GovUKWarningText({
            text: 'You could be fined if you do not register.',
          })
        `,
      }),
    ],
    fieldCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { validation, Self } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'
          import { GovUKTextInput, GovUKRadioInput } from '@form-engine-govuk-components/components'

          // Text input
          GovUKTextInput({
            code: 'email',              // Answer stored as answers.email
            label: 'Email address',
            hint: 'We will use this to contact you',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter your email address',
              }),
            ],
          })

          // Radio buttons
          GovUKRadioInput({
            code: 'contactPreference',  // Answer stored as answers.contactPreference
            fieldset: {
              legend: { text: 'How should we contact you?' },
            },
            items: [
              { value: 'email', text: 'Email' },
              { value: 'phone', text: 'Phone' },
              { value: 'post', text: 'Post' },
            ],
          })
        `,
      }),
    ],
    variantCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Wrapper functions provide type-safe, clean API
          GovUKTextInput({
            code: 'name',
            label: 'Full name',
          })

          // Different component = different wrapper function
          GovUKTextareaInput({
            code: 'description',
            label: 'Description',
            rows: 5,
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/hub',
          labelText: 'Developer Guide Hub',
        },
        next: {
          href: '/form-engine-developer-guide/components/built-in',
          labelText: 'Built-in Components',
        },
      }),
    ],
  },
})
