import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Transformers - Introduction
 *
 * How to use formatters/transformers to clean and normalise field values.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Transformers',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Transformers</h1>

        <p class="govuk-body-l">
          Transformers (also called formatters) clean and normalise field values after
          submission but before validation. They're essential for consistent data handling.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Why Use Transformers?</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Clean user input:</strong> Remove accidental whitespace
          </li>
          <li>
            <strong>Normalise data:</strong> Consistent casing for emails, postcodes
          </li>
          <li>
            <strong>Prevent validation issues:</strong> Whitespace-only values won't pass
            empty checks without trimming first
          </li>
          <li>
            <strong>Format for storage:</strong> Prepare data in the expected format
          </li>
        </ul>
      `,
    }),

    // Basic Usage
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Usage</h2>
        <p class="govuk-body">
          Add transformers to a field's <code>formatters</code> array. They're applied
          in order, with each transformer's output becoming the next one's input.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { Transformer } from '@form-engine/registry/transformers'

field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'email',
  label: 'Email address',
  formatters: [
    Transformer.String.Trim(),        // "  tom@example.com  " → "tom@example.com"
    Transformer.String.ToLowerCase(), // "Tom@Example.COM" → "tom@example.com"
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your email address',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // String Transformers
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">String Transformers</h2>
        <p class="govuk-body">
          Transform string values.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Whitespace
Transformer.String.Trim()           // Remove leading/trailing whitespace

// Case
Transformer.String.ToUpperCase()    // "hello" → "HELLO"
Transformer.String.ToLowerCase()    // "HELLO" → "hello"
Transformer.String.ToTitleCase()    // "hello world" → "Hello World"
Transformer.String.Capitalize()     // "hello world" → "Hello world"

// Substring
Transformer.String.Substring(0, 10)   // First 10 characters

// Replace
Transformer.String.Replace('old', 'new')  // Replace all occurrences

// Padding
Transformer.String.PadStart(5, '0')   // "42" → "00042"
Transformer.String.PadEnd(5, '0')     // "42" → "42000"

// Type conversion
Transformer.String.ToInt()            // "123" → 123
Transformer.String.ToFloat()          // "12.5" → 12.5
Transformer.String.ToArray(',')       // "a,b,c" → ["a", "b", "c"]`,
    }),

    // Number Transformers
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Number Transformers</h2>
        <p class="govuk-body">
          Transform numeric values.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Rounding
Transformer.Number.Round()        // 3.7 → 4, 3.2 → 3
Transformer.Number.Floor()        // 3.7 → 3
Transformer.Number.Ceil()         // 3.2 → 4
Transformer.Number.ToFixed(2)     // 3.14159 → 3.14

// Math
Transformer.Number.Abs()          // -5 → 5
Transformer.Number.Sqrt()         // 16 → 4
Transformer.Number.Multiply(100)  // 0.5 → 50
Transformer.Number.Divide(100)    // 50 → 0.5
Transformer.Number.Add(10)        // 5 → 15
Transformer.Number.Subtract(10)   // 15 → 5
Transformer.Number.Power(2)       // 3 → 9

// Limits
Transformer.Number.Min(0)         // Return smaller of value and 0
Transformer.Number.Max(100)       // Return larger of value and 100
Transformer.Number.Clamp(0, 100)  // Constrain between 0 and 100`,
    }),

    // Common Patterns
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Patterns</h2>
      `,
    }),

    // Email normalisation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Email Normalisation</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
field<GovUKTextInput>({
  code: 'email',
  variant: 'govukTextInput',
  label: 'Email address',
  inputType: 'email',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToLowerCase(),
  ],
})
// "  John.Smith@Example.COM  " → "john.smith@example.com"`,
          }),
        ],
      },
    }),

    // Postcode formatting
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Postcode Formatting</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
field<GovUKTextInput>({
  code: 'postcode',
  variant: 'govukTextInput',
  label: 'Postcode',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToUpperCase(),
  ],
})
// "  sw1a 2aa  " → "SW1A 2AA"`,
          }),
        ],
      },
    }),

    // Phone number cleaning
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Phone Number Cleaning</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
field<GovUKTextInput>({
  code: 'phone',
  variant: 'govukTextInput',
  label: 'Phone number',
  inputType: 'tel',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.Replace(' ', ''),  // Remove spaces
    Transformer.String.Replace('-', ''),  // Remove dashes
  ],
})
// "07700 900-123" → "07700900123"`,
          }),
        ],
      },
    }),

    // Percentage to decimal
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">Percentage to Decimal</h3>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// User enters percentage, store as decimal
field<GovUKTextInput>({
  code: 'discount_rate',
  variant: 'govukTextInput',
  label: 'Discount rate (%)',
  inputMode: 'decimal',
  formatters: [
    Transformer.Number.Divide(100),
  ],
})
// User enters "15" → stored as 0.15`,
          }),
        ],
      },
    }),

    // Execution Order
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Execution Order</h2>
        <p class="govuk-body">
          Transformers run in a specific order in the form lifecycle:
        </p>
        <ol class="govuk-list govuk-list--number">
          <li>User submits the form</li>
          <li><strong>Formatters run</strong> on each field value</li>
          <li>Validation rules are checked against the transformed values</li>
          <li>If valid, the transformed values are stored</li>
        </ol>
        <p class="govuk-body">
          This means validation always sees the cleaned, normalised values &mdash; not
          the raw user input.
        </p>
      `,
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
              href: '/forms/form-engine-developer-guide/validation/patterns',
              labelText: 'Validation Patterns',
            },
            next: {
              href: '/forms/form-engine-developer-guide/transformers/custom',
              labelText: 'Custom Transformers',
            },
          }),
        ],
      },
    }),
  ],
})
