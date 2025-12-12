import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Conditions - Introduction
 *
 * Complete reference of all condition types: String, Number, Date, Array,
 * and combining conditions with and()/or()/xor().
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Conditions',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Conditions</h1>

        <p class="govuk-body-l">
          Conditions test values and return true or false. They're the building blocks
          of validation rules and conditional logic throughout the form-engine.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Self() Reference</h2>

        <p class="govuk-body">
          <code>Self()</code> references the current field's value. It's the starting point
          for most validation conditions.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Check if value is missing/empty
Self().not.match(Condition.IsRequired())

// Check if NOT a valid email
Self().not.match(Condition.Email.IsValidEmail())

// Access nested property (for complex values)
Self().path('postcode').not.match(Condition.IsRequired())`,
    }),

    // String Conditions section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">String Conditions</h2>
        <p class="govuk-body">
          Test string values for emptiness, equality, length, patterns, and format.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
Condition.String.AlphanumericWithAllSafeSymbols()`,
    }),

    // Number Conditions section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Number Conditions</h2>
        <p class="govuk-body">
          Test numeric values for equality, comparison, and type.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
Condition.Number.Between(1, 100)  // Inclusive: 1 <= value <= 100`,
    }),

    // Date Conditions section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Date Conditions</h2>
        <p class="govuk-body">
          Test date values (ISO format strings) for validity and comparison.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
Condition.Date.IsFutureDate()  // Date is after today (UTC)`,
    }),

    // Array Conditions section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Array Conditions</h2>
        <p class="govuk-body">
          Test array values for length and contents. Useful for checkbox fields with
          <code>multiple: true</code>.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Check if value is in an array
Condition.Array.IsIn(['red', 'green', 'blue'])  // Value is one of these

// Check array contents
Condition.Array.Contains('value')              // Array has this item
Condition.Array.ContainsAll(['a', 'b', 'c'])   // Array has all of these
Condition.Array.ContainsAny(['x', 'y', 'z'])   // Array has at least one

// For empty array checks, use Condition.IsRequired()
// which returns false for empty arrays`,
    }),

    // Combining Conditions section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Combining Conditions</h2>
        <p class="govuk-body">
          Use <code>and()</code>, <code>or()</code>, <code>xor()</code>, and <code>.not</code>
          to build complex conditions from simple ones.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
)`,
    }),

    // Using with Answer() section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using with Answer()</h2>
        <p class="govuk-body">
          Replace <code>Self()</code> with <code>Answer('fieldCode')</code> to test
          other fields' values. This enables cross-field validation.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
)`,
    }),

    // Dynamic Arguments section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Condition Arguments</h2>
        <p class="govuk-body">
          Condition arguments can be <strong>dynamic expressions</strong>, not just static values.
          Use <code>Answer()</code>, <code>Data()</code>, or other references to create conditions
          that adapt based on other form values or loaded data.
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
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
Condition.Array.IsIn(Data('allowedValues'))`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          This is particularly useful for:
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li><strong>Cross-field validation</strong> &mdash; "End date must be after start date"</li>
          <li><strong>Data-driven rules</strong> &mdash; Limits loaded from an API or config</li>
          <li><strong>User-configurable validation</strong> &mdash; Admin sets max length</li>
        </ul>
      `,
    }),

    // Next steps
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Next Steps</h2>
        <ul class="govuk-list">
          <li>
            <a href="/forms/form-engine-developer-guide/conditions/custom" class="govuk-link govuk-link--no-visited-state">
              <strong>Building Custom Conditions &rarr;</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Learn how to create your own domain-specific conditions.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/conditions/playground/intro" class="govuk-link govuk-link--no-visited-state">
              <strong>Conditions Playground &rarr;</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Try out conditions with live, interactive examples.
            </p>
          </li>
        </ul>
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
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Guide Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/conditions/custom',
              labelText: 'Custom Conditions',
            },
          }),
        ],
      },
    }),
  ],
})
