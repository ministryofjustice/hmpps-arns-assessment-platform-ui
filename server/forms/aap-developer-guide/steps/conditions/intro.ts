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
// Check if empty
Self().match(Condition.String.IsEmpty())

// Check if NOT a valid email
Self().not.match(Condition.String.IsEmail())

// Access nested property (for complex values)
Self().path('postcode').match(Condition.String.IsEmpty())`,
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
import { Condition } from '@form-engine/form/builders'

// Emptiness
Condition.String.IsEmpty()
Condition.String.IsNotEmpty()

// Equality
Condition.String.Equals('expected value')
Condition.String.EqualsIgnoreCase('EXPECTED')

// Length
Condition.String.MinLength(5)
Condition.String.MaxLength(100)
Condition.String.LengthBetween(5, 100)

// Pattern matching
Condition.String.Matches(/^[A-Z]{2}[0-9]{6}$/)  // Regex
Condition.String.Contains('substring')
Condition.String.StartsWith('prefix')
Condition.String.EndsWith('suffix')

// Format validation
Condition.String.IsEmail()
Condition.String.IsUrl()
Condition.String.IsNumeric()
Condition.String.IsAlpha()
Condition.String.IsAlphanumeric()`,
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
// Comparison
Condition.Number.Equals(42)
Condition.Number.GreaterThan(0)
Condition.Number.GreaterThanOrEqual(1)
Condition.Number.LessThan(100)
Condition.Number.LessThanOrEqual(99)
Condition.Number.Between(1, 100)

// Type
Condition.Number.IsInteger()
Condition.Number.IsPositive()
Condition.Number.IsNegative()`,
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
// Validity
Condition.Date.IsValid()

// Comparison
Condition.Date.IsBefore('2024-01-01')
Condition.Date.IsAfter('2000-01-01')
Condition.Date.IsBetween('2000-01-01', '2024-12-31')

// Relative to today
Condition.Date.IsInPast()
Condition.Date.IsInFuture()
Condition.Date.IsToday()`,
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
// Length
Condition.Array.IsEmpty()
Condition.Array.IsNotEmpty()
Condition.Array.MinLength(1)
Condition.Array.MaxLength(5)

// Contents
Condition.Array.Contains('value')
Condition.Array.ContainsAll(['a', 'b', 'c'])
Condition.Array.ContainsAny(['x', 'y', 'z'])`,
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
Self().not.match(Condition.String.IsEmail())

// AND: All conditions must be true
and(
  Self().match(Condition.String.IsNotEmpty()),
  Self().match(Condition.String.MaxLength(100)),
)

// OR: At least one condition must be true
or(
  Self().match(Condition.String.Equals('yes')),
  Self().match(Condition.String.Equals('no')),
)

// XOR: Exactly one condition must be true
xor(
  Answer('option_a').match(Condition.String.Equals('yes')),
  Answer('option_b').match(Condition.String.Equals('yes')),
)

// Complex nested combinations
and(
  Self().match(Condition.String.IsNotEmpty()),
  or(
    Self().match(Condition.String.IsEmail()),
    Self().match(Condition.String.Matches(/^\\+?[0-9]{10,14}$/)),
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
Answer('country').match(Condition.String.Equals('UK'))

// Compare two fields
Self().not.match(Condition.String.Equals(Answer('email')))

// Conditional logic based on another field
and(
  Answer('hasPhone').match(Condition.String.Equals('yes')),
  Self().match(Condition.String.IsEmpty()),
)`,
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
              href: '/forms/form-engine-developer-guide/validation/intro',
              labelText: 'Validation',
            },
          }),
        ],
      },
    }),
  ],
})
