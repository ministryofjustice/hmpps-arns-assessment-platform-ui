import { step, block, Answer, Format, field, validation, Self, submitTransition } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination, GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { exampleBox } from '../../helpers/exampleBox'

/**
 * Expressions - Format
 *
 * Documentation for Format() string interpolation expressions.
 */
export const formatStep = step({
  path: '/format',
  title: 'Format Expressions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Format() - String Interpolation</h1>

        <p class="govuk-body-l">
          <code>Format()</code> creates dynamic strings by combining a template
          with placeholder values. Think of it as template literals for form definitions.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Basic Syntax</h2>

        <p class="govuk-body">
          Format takes a template string with <code>%1</code>, <code>%2</code>, <code>%3</code>
          placeholders, followed by the values to substitute:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
)`,
    }),

    // Live example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Live Example</h2>
        <p class="govuk-body">
          Try typing your name below to see Format() in action:
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
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

      block<HtmlBlock>({
        variant: 'html',
        hidden: Answer('formatExampleName').not.match(Condition.IsRequired()),
        content: Format(
          `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            <strong>Result:</strong> Hello, %1! Welcome to the form-engine developer guide.
          </div>`,
          Answer('formatExampleName'),
        ),
      }),
    ]),

    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <p class="govuk-body">The code for this example:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'formatExampleName',
  label: 'Your name',
})

block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<div class="govuk-inset-text">Hello, %1! Welcome to the guide.</div>',
    Answer('formatExampleName')
  ),
})`,
          }),
        ],
      },
    }),

    // Using in HTML content
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using in HTML Content</h2>

        <p class="govuk-body">
          Format() is commonly used to inject dynamic values into HTML:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Dynamic page heading
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<h1 class="govuk-heading-l">Application for %1</h1>',
    Data('applicant.fullName')
  ),
})

// Summary list with multiple values
block<HtmlBlock>({
  variant: 'html',
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
})`,
    }),

    // Combining with pipes
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Combining with Transformers</h2>

        <p class="govuk-body">
          Use <code>.pipe()</code> to transform values before formatting:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
// selections = ['a', 'b', 'c'] → "You selected 3 items"`,
    }),

    // Using in field properties
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using in Field Properties</h2>

        <p class="govuk-body">
          Format() works in labels, hints, and error messages:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Dynamic label
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'phoneNumber',
  label: Format('Phone number for %1', Answer('contactName')),
  hint: Format('We will call %1 on this number', Answer('contactName')),
})

// Dynamic validation message
field<GovUKTextInput>({
  variant: 'govukTextInput',
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
})`,
    }),

    // Reusing placeholders
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Reusing Placeholders</h2>

        <p class="govuk-body">
          You can use the same placeholder multiple times in a template:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
// name = "John", food = "pizza" → "John likes pizza. pizza is John's favourite."`,
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <div class="govuk-inset-text">
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">
            <li>Use Format() for dynamic content, not static strings</li>
            <li>Apply transformers when values need formatting (currency, dates)</li>
            <li>Keep templates readable - use template literals for multiline HTML</li>
            <li>Consider Conditional() if you need different text based on conditions</li>
          </ul>
        </div>
      `,
    }),

    // Common patterns
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Patterns</h2>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
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
)`,
          }),
        ],
      },
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
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
    }),
  ],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
