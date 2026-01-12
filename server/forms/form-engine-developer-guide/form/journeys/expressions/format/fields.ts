import { Answer, Format, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKPagination, GovUKTextInput } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { exampleBox } from '../../../../helpers/exampleBox'

/**
 * Expressions - Format
 *
 * Documentation for Format() string interpolation expressions.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Format() - String Interpolation

  \`Format()\` creates dynamic strings by combining a template
  with placeholder values. Think of it as template literals for form definitions. {.lead}

  ---

  ## Basic Syntax

  Format takes a template string with \`%1\`, \`%2\`, \`%3\`
  placeholders, followed by the values to substitute:

  {{slot:syntaxCode}}

  ---

  ## Live Example

  Try typing your name below to see Format() in action:

  {{slot:liveExample}}

  The code for this example:

  {{slot:liveExampleCode}}

  ---

  ## Using in HTML Content

  Format() is commonly used to inject dynamic values into HTML:

  {{slot:htmlCode}}

  ---

  ## Combining with Transformers

  Use \`.pipe()\` to transform values before formatting:

  {{slot:transformerCode}}

  ---

  ## Using in Field Properties

  Format() works in labels, hints, and error messages:

  {{slot:fieldPropsCode}}

  ---

  ## Reusing Placeholders

  You can use the same placeholder multiple times in a template:

  {{slot:reuseCode}}

  ---

  ## Best Practices

  > - Use Format() for dynamic content, not static strings
  > - Apply transformers when values need formatting (currency, dates)
  > - Keep templates readable - use template literals for multiline HTML
  > - Consider Conditional() if you need different text based on conditions

  ---

  ## Common Patterns

  {{slot:patternsCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    syntaxCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Format, Answer } from '@form-engine/form/builders'

          // Single placeholder
          Format('Hello, %1!', Answer('firstName'))
          // → "Hello, John!"

          // Multiple placeholders
          Format('%1 %2', Answer('firstName'), Answer('lastName'))
          // → "John Smith"

          // Placeholder numbers match argument positions
          Format('Name: %1, Email: %2, Phone: %3',
            Answer('name'),
            Answer('email'),
            Answer('phone')
          )
        `,
      }),
    ],
    liveExample: [
      exampleBox([
        GovUKTextInput({
          code: 'formatExampleName',
          label: 'Your name',
          hint: 'Enter any name to see the greeting update',
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a name to see the example',
            }),
          ],
        }),

        HtmlBlock({
          hidden: Answer('formatExampleName').not.match(Condition.IsRequired()),
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
              <strong>Result:</strong> Hello, %1! Welcome to the form-engine developer guide.
            </div>`,
            Answer('formatExampleName'),
          ),
        }),
      ]),
    ],
    liveExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKTextInput({
            code: 'formatExampleName',
            label: 'Your name',
          })

          HtmlBlock({
            content: Format(
              '<div class="govuk-inset-text">Hello, %1! Welcome to the guide.</div>',
              Answer('formatExampleName')
            ),
          })
        `,
      }),
    ],
    htmlCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Dynamic page heading
          HtmlBlock({
            content: Format(
              '<h1 class="govuk-heading-l">Application for %1</h1>',
              Data('applicant.fullName')
            ),
          })

          // Summary list with multiple values
          HtmlBlock({
            content: Format(
              \`<dl class="govuk-summary-list">
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Name</dt>
                  <dd class="govuk-summary-list__value">%1 %2</dd>
                </div>
                <div class="govuk-summary-list__row">
                  <dt class="govuk-summary-list__key">Email</dt>
                  <dd class="govuk-summary-list__value">%3</dd>
                </div>
              </dl>\`,
              Answer('firstName'),
              Answer('lastName'),
              Answer('email')
            ),
          })
        `,
      }),
    ],
    transformerCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Format, Answer, Transformer } from '@form-engine/form/builders'

          // Format currency
          Format('Total: £%1',
            Answer('price').pipe(Transformer.Number.ToFixed(2))
          )
          // price = 99.5 → "Total: £99.50"

          // Clean and format name
          Format('Hello, %1!',
            Answer('name').pipe(
              Transformer.String.Trim(),
              Transformer.String.ToTitleCase()
            )
          )
          // name = "  john smith  " → "Hello, John Smith!"

          // Format date
          Format('Submitted on %1',
            Answer('submittedDate').pipe(Transformer.String.ToDate())
          )

          // Array count
          Format('You selected %1 items',
            Answer('selections').pipe(Transformer.Array.Length())
          )
          // selections = ['a', 'b', 'c'] → "You selected 3 items"
        `,
      }),
    ],
    fieldPropsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Dynamic label
          GovUKTextInput({
            code: 'phoneNumber',
            label: Format('Phone number for %1', Answer('contactName')),
            hint: Format('We will call %1 on this number', Answer('contactName')),
          })

          // Dynamic validation message
          GovUKTextInput({
            code: 'confirmEmail',
            label: 'Confirm email address',
            validate: [
              validation({
                when: Self().not.match(Condition.Equals(Answer('email'))),
                message: Format(
                  'Email must match %1',
                  Answer('email')
                ),
              }),
            ],
          })
        `,
      }),
    ],
    reuseCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Same value used twice
          Format('Hello %1, your username is %1', Answer('username'))
          // username = "john" → "Hello john, your username is john"

          // Mix and match
          Format('%1 likes %2. %2 is %1\\'s favourite.',
            Answer('name'),
            Answer('food')
          )
          // name = "John", food = "pizza" → "John likes pizza. pizza is John's favourite."
        `,
      }),
    ],
    patternsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // 1. Greeting message
          Format('Welcome back, %1', Data('user.firstName'))

          // 2. Confirmation summary
          Format('You are applying for %1 at %2',
            Answer('position'),
            Answer('company')
          )

          // 3. Error context
          Format('%1 is not a valid %2', Self(), 'email address')

          // 4. Numbered items in collections
          Format('%1. %2',
            Item().index().pipe(Transformer.Number.Add(1)),
            Item().path('title')
          )

          // 5. Combining multiple data sources
          Format('%1 (%2)',
            Data('organisation.name'),
            Answer('department')
          )
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/expressions/intro',
          labelText: 'Expressions Overview',
        },
        next: {
          href: '/forms/form-engine-developer-guide/expressions/conditional',
          labelText: 'Conditional Expressions',
        },
      }),
    ],
  },
})
