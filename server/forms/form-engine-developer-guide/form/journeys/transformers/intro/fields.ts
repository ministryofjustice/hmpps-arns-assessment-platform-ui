import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Transformers - Introduction
 *
 * How to use formatters/transformers to clean and normalise field values.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Transformers

  Transformers (also called formatters) clean and normalise field values after
  submission but before validation. They're essential for consistent data handling. {.lead}

  ---

  ## Why Use Transformers?

  - **Clean user input:** Remove accidental whitespace
  - **Normalise data:** Consistent casing for emails, postcodes
  - **Prevent validation issues:** Whitespace-only values won't pass
    empty checks without trimming first
  - **Format for storage:** Prepare data in the expected format

  ---

  ## Basic Usage

  Add transformers to a field's \`formatters\` array. They're applied
  in order, with each transformer's output becoming the next one's input.

  {{slot:basicUsageCode}}

  ---

  ## String Transformers

  Transform string values.

  {{slot:stringTransformersCode}}

  ---

  ## Number Transformers

  Transform numeric values.

  {{slot:numberTransformersCode}}

  ---

  ## Date Transformers

  Transform Date values. These work with JavaScript Date objects.

  {{slot:dateTransformersCode}}

  ---

  ## Common Patterns

  ### Email Normalisation

  {{slot:emailPatternCode}}

  ### Postcode Formatting

  {{slot:postcodePatternCode}}

  ### Phone Number Cleaning

  {{slot:phonePatternCode}}

  ### Percentage to Decimal

  {{slot:percentagePatternCode}}

  ---

  ## Execution Order

  Transformers run in a specific order in the form lifecycle:

  1. User submits the form
  2. **Formatters run** on each field value
  3. Validation rules are checked against the transformed values
  4. If valid, the transformed values are stored

  This means validation always sees the cleaned, normalised values — not
  the raw user input.

  ---

  {{slot:pagination}}
`),
  slots: {
    basicUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Transformer } from '@form-engine/registry/transformers'

          GovUKTextInput({
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
          })
        `,
      }),
    ],
    stringTransformersCode: [
      CodeBlock({
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
          Transformer.String.ToArray(',')       // "a,b,c" → ["a", "b", "c"]
        `,
      }),
    ],
    numberTransformersCode: [
      CodeBlock({
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
          Transformer.Number.Clamp(0, 100)  // Constrain between 0 and 100
        `,
      }),
    ],
    dateTransformersCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Formatting
          Transformer.Date.Format('DD/MM/YYYY')     // Date → "15/03/2024"
          Transformer.Date.Format('YYYY-MM-DD')     // Date → "2024-03-15"
          Transformer.Date.Format('HH:mm:ss')       // Date → "14:30:45"
          Transformer.Date.ToISOString()            // Date → "2024-03-15T14:30:45.123Z"
          Transformer.Date.ToLocaleString()         // Date → locale-specific string
          Transformer.Date.ToLocaleString('en-US')  // Date → "3/15/2024, 2:30:45 PM"

          // Adding time
          Transformer.Date.AddDays(7)               // Add 7 days
          Transformer.Date.AddMonths(1)             // Add 1 month
          Transformer.Date.AddYears(1)              // Add 1 year

          // Subtracting time
          Transformer.Date.SubtractDays(7)          // Subtract 7 days
          Transformer.Date.AddDays(-7)              // Also subtracts 7 days
          Transformer.Date.AddMonths(-6)            // Subtract 6 months
          Transformer.Date.AddYears(-18)            // Subtract 18 years

          // Day boundaries
          Transformer.Date.StartOfDay()             // Set to 00:00:00.000
          Transformer.Date.EndOfDay()               // Set to 23:59:59.999
        `,
      }),
    ],
    emailPatternCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKTextInput({
            code: 'email',
            label: 'Email address',
            inputType: 'email',
            formatters: [
              Transformer.String.Trim(),
              Transformer.String.ToLowerCase(),
            ],
          })
          // "  John.Smith@Example.COM  " → "john.smith@example.com"
        `,
      }),
    ],
    postcodePatternCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKTextInput({
            code: 'postcode',
            label: 'Postcode',
            formatters: [
              Transformer.String.Trim(),
              Transformer.String.ToUpperCase(),
            ],
          })
          // "  sw1a 2aa  " → "SW1A 2AA"
        `,
      }),
    ],
    phonePatternCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          GovUKTextInput({
            code: 'phone',
            label: 'Phone number',
            inputType: 'tel',
            formatters: [
              Transformer.String.Trim(),
              Transformer.String.Replace(' ', ''),  // Remove spaces
              Transformer.String.Replace('-', ''),  // Remove dashes
            ],
          })
          // "07700 900-123" → "07700900123"
        `,
      }),
    ],
    percentagePatternCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // User enters percentage, store as decimal
          GovUKTextInput({
            code: 'discount_rate',
            label: 'Discount rate (%)',
            inputMode: 'decimal',
            formatters: [
              Transformer.Number.Divide(100),
            ],
          })
          // User enters "15" → stored as 0.15
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/validation/playground/arrays',
          labelText: 'Array Validation',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transformers/custom',
          labelText: 'Custom Transformers',
        },
      }),
    ],
  },
})
