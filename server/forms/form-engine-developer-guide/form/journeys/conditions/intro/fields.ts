import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Conditions - Introduction
 *
 * Complete reference of all condition types: String, Number, Date, Array,
 * and combining conditions with and()/or()/xor().
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Conditions

  Conditions test values and return true or false. They're the building blocks
  of validation rules and conditional logic throughout the form-engine. {.lead}

  ---

  ## The Self() Reference

  \`Self()\` references the current field's value. It's the starting point
  for most validation conditions.

  {{slot:selfCode}}

  ---

  ## String Conditions

  Test string values for emptiness, equality, length, patterns, and format.

  {{slot:stringConditionsCode}}

  ---

  ## Number Conditions

  Test numeric values for equality, comparison, and type.

  {{slot:numberConditionsCode}}

  ---

  ## Date Conditions

  Test date values (ISO format strings) for validity and comparison.

  {{slot:dateConditionsCode}}

  ---

  ## Array Conditions

  Test array values for length and contents. Useful for checkbox fields with
  \`multiple: true\`.

  {{slot:arrayConditionsCode}}

  ---

  ## Combining Conditions

  Use \`and()\`, \`or()\`, \`xor()\`, and \`.not\`
  to build complex conditions from simple ones.

  {{slot:combiningConditionsCode}}

  ---

  ## Using with Answer()

  Replace \`Self()\` with \`Answer('fieldCode')\` to test
  other fields' values. This enables cross-field validation.

  {{slot:answerCode}}

  ---

  ## Dynamic Condition Arguments

  Condition arguments can be **dynamic expressions**, not just static values.
  Use \`Answer()\`, \`Data()\`, or other references to create conditions
  that adapt based on other form values or loaded data.

  {{slot:dynamicArgsCode}}

  This is particularly useful for:

  - **Cross-field validation** — "End date must be after start date"
  - **Data-driven rules** — Limits loaded from an API or config
  - **User-configurable validation** — Admin sets max length

  ---

  ## Next Steps

  - [**Building Custom Conditions →**](/form-engine-developer-guide/conditions/custom)

    Learn how to create your own domain-specific conditions.

  - [**Conditions Playground →**](/form-engine-developer-guide/conditions/playground/intro)

    Try out conditions with live, interactive examples.

  ---

  {{slot:pagination}}
`),
  slots: {
    selfCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Check if value is missing/empty
          Self().not.match(Condition.IsRequired())

          // Check if NOT a valid email
          Self().not.match(Condition.Email.IsValidEmail())

          // Access nested property (for complex values)
          Self().path('postcode').not.match(Condition.IsRequired())
        `,
      }),
    ],
    stringConditionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Condition } from '@form-engine/registry/conditions'

          // General conditions (root level)
          Condition.IsRequired()           // Not empty/null/undefined
          Condition.Equals('expected')     // Strict equality (===)

          // String length
          Condition.String.HasMinLength(5)
          Condition.String.HasMaxLength(100)
          Condition.String.HasExactLength(10)
          Condition.String.HasMaxWords(50)

          // Pattern matching
          Condition.String.MatchesRegex('^[A-Z]{2}[0-9]{6}$')

          // Character validation
          Condition.String.LettersOnly()
          Condition.String.DigitsOnly()
          Condition.String.LettersAndDigitsOnly()
          Condition.String.LettersWithSpaceDashApostrophe()  // For names
          Condition.String.LettersWithCommonPunctuation()
          Condition.String.AlphanumericWithCommonPunctuation()
          Condition.String.AlphanumericWithAllSafeSymbols()
        `,
      }),
    ],
    numberConditionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Type checking
          Condition.Number.IsNumber()      // Valid number (not NaN, not string)
          Condition.Number.IsInteger()     // Whole number

          // Comparison
          Condition.Number.GreaterThan(0)
          Condition.Number.GreaterThanOrEqual(1)
          Condition.Number.LessThan(100)
          Condition.Number.LessThanOrEqual(99)
          Condition.Number.Between(1, 100)  // Inclusive: 1 <= value <= 100
        `,
      }),
    ],
    dateConditionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // All date conditions expect ISO-8601 format: YYYY-MM-DD

          // Validity
          Condition.Date.IsValid()       // Valid ISO date (no Feb 30, etc.)
          Condition.Date.IsValidYear()   // Year is 1000-9999
          Condition.Date.IsValidMonth()  // Month is 1-12
          Condition.Date.IsValidDay()    // Day valid for month/year

          // Comparison
          Condition.Date.IsBefore('2024-01-01')
          Condition.Date.IsAfter('2000-01-01')

          // Relative to today
          Condition.Date.IsFutureDate()  // Date is after today (UTC)
        `,
      }),
    ],
    arrayConditionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Check if value is in an array
          Condition.Array.IsIn(['red', 'green', 'blue'])  // Value is one of these

          // Check array contents
          Condition.Array.Contains('value')              // Array has this item
          Condition.Array.ContainsAll(['a', 'b', 'c'])   // Array has all of these
          Condition.Array.ContainsAny(['x', 'y', 'z'])   // Array has at least one

          // For empty array checks, use Condition.IsRequired()
          // which returns false for empty arrays
        `,
      }),
    ],
    combiningConditionsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { and, or, xor } from '@form-engine/form/builders'

          // NOT: Negate a condition
          Self().not.match(Condition.Email.IsValidEmail())

          // AND: All conditions must be true
          and(
            Self().match(Condition.IsRequired()),
            Self().match(Condition.String.HasMaxLength(100)),
          )

          // OR: At least one condition must be true
          or(
            Self().match(Condition.Equals('yes')),
            Self().match(Condition.Equals('no')),
          )

          // XOR: Exactly one condition must be true
          xor(
            Answer('option_a').match(Condition.Equals('yes')),
            Answer('option_b').match(Condition.Equals('yes')),
          )

          // Complex nested combinations
          and(
            Self().match(Condition.IsRequired()),
            or(
              Self().match(Condition.Email.IsValidEmail()),
              Self().match(Condition.Phone.IsValidPhoneNumber()),
            )
          )
        `,
      }),
    ],
    answerCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Answer, and } from '@form-engine/form/builders'

          // Check another field's value
          Answer('country').match(Condition.Equals('UK'))

          // Compare two fields (e.g., confirm email matches email)
          Self().not.match(Condition.Equals(Answer('email')))

          // Conditional logic based on another field
          and(
            Answer('hasPhone').match(Condition.Equals('yes')),
            Self().not.match(Condition.IsRequired()),
          )
        `,
      }),
    ],
    dynamicArgsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Static: compare against a fixed value
          Condition.Number.GreaterThan(18)

          // Dynamic: compare against another field's value
          Condition.Number.GreaterThan(Answer('minAge'))

          // Dynamic date comparison - end date must be after start date
          Self().not.match(Condition.Date.IsAfter(Answer('startDate')))

          // Dynamic range from loaded data
          Condition.Number.Between(Data('limits.min'), Data('limits.max'))

          // Dynamic string length from config
          Condition.String.HasMaxLength(Answer('maxChars'))

          // Dynamic array membership
          Condition.Array.IsIn(Data('allowedValues'))
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/hub',
          labelText: 'Guide Hub',
        },
        next: {
          href: '/form-engine-developer-guide/conditions/custom',
          labelText: 'Custom Conditions',
        },
      }),
    ],
  },
})
