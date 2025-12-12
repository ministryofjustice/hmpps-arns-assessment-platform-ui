import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'

/**
 * References - Self()
 *
 * Comprehensive documentation for the Self() reference,
 * covering field-scoped access, validation patterns, and how it resolves.
 */
export const selfStep = step({
  path: '/self',
  title: 'Self Reference',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Self()</h1>

        <p class="govuk-body-l">
          The <code>Self()</code> reference points to the current field's own value.
          It's primarily used in validation rules and field-scoped expressions.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Signature</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `Self(): ReferenceExpr`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          No parameters required. <code>Self()</code> automatically resolves to the
          nearest containing field's code at compile time.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">How Self() Works</h2>

        <p class="govuk-body">
          When the form-engine compiles your form definition, it transforms <code>Self()</code>
          into an <code>Answer()</code> reference with the field's actual code:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// You write:
field({
  code: 'email',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your email address',
    }),
  ],
})

// The form-engine transforms it to:
field({
  code: 'email',
  validate: [
    validation({
      when: Answer('email').not.match(Condition.IsRequired()),
      message: 'Enter your email address',
    }),
  ],
})`,
    }),

    // Why use Self()
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Why Use Self()?</h2>

        <p class="govuk-body">
          You might wonder why not just write <code>Answer('email')</code> directly.
          Using <code>Self()</code> provides several benefits:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>DRY principle:</strong> You don't repeat the field code, reducing
            the chance of typos
          </li>
          <li>
            <strong>Refactoring safety:</strong> If you rename the field code, validations
            using <code>Self()</code> update automatically
          </li>
          <li>
            <strong>Readability:</strong> It's immediately clear the validation applies to
            "this field" rather than some other field
          </li>
          <li>
            <strong>Reusable patterns:</strong> You can extract common validation patterns
            that work with any field
          </li>
        </ul>
      `,
    }),

    // Primary use case: Validation
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Primary Use: Validation</h2>

        <p class="govuk-body">
          The most common use of <code>Self()</code> is in validation rules:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { field, validation, Self, Condition } from '@form-engine/form/builders'

field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'fullName',
  label: 'Full name',
  validate: [
    // 1. Required check
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your full name',
    }),
    // 2. Format check
    validation({
      when: Self().not.match(Condition.String.HasMinLength(2)),
      message: 'Full name must be at least 2 characters',
    }),
    // 3. Business rule
    validation({
      when: Self().not.match(Condition.String.LettersWithSpaceDashApostrophe()),
      message: 'Full name must only contain letters, spaces, hyphens and apostrophes',
    }),
  ],
})`,
    }),

    // Using .not for negative conditions
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Using .not for Negative Conditions</h2>
        <p class="govuk-body">
          The <code>.not</code> modifier inverts the condition. This is useful for
          "must be" validations:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// "Show error when value is NOT a valid email"
validation({
  when: Self().not.match(Condition.Email.IsValidEmail()),
  message: 'Enter a valid email address',
})

// "Show error when value is NOT at least 18"
validation({
  when: Self().not.match(Condition.Number.GreaterThanOrEqual(18)),
  message: 'You must be at least 18 years old',
})

// "Show error when value is NOT in the allowed list"
validation({
  when: Self().not.match(Condition.Array.IsIn(['red', 'green', 'blue'])),
  message: 'Select a valid colour',
})`,
          }),
        ],
      },
    }),

    // Implicit Self() in fields
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Implicit Self() Usage</h2>

        <p class="govuk-body">
          Behind the scenes, the form-engine automatically uses <code>Self()</code>
          for a field's display value. Every field implicitly has:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// What you write:
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'email',
  label: 'Email',
})

// What the form-engine adds internally:
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'email',
  label: 'Email',
  value: Self(),  // <-- Added automatically
})`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          This means the field automatically displays its own answer value without
          you needing to specify it.
        </p>
      `,
    }),

    // Restrictions
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Restrictions</h2>
      `,
    }),

    block<GovUKWarningText>({
      variant: 'govukWarningText',
      html: '<code>Self()</code> can only be used inside a field block. Using it elsewhere will throw a compilation error.',
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          <strong>Valid locations:</strong>
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li><code>validate</code> array</li>
          <li><code>hidden</code> condition</li>
          <li><code>dependent</code> condition</li>
          <li>Any expression within the field definition</li>
        </ul>

        <p class="govuk-body">
          <strong>Invalid locations:</strong>
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Inside the field's own <code>code</code> property (would cause infinite recursion)</li>
          <li>Outside any field block (no "self" to reference)</li>
          <li>In step-level or journey-level configurations</li>
        </ul>
      `,
    }),

    // Advanced: Accessing nested properties
    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'Advanced: Accessing nested properties within Self()',
      content: [
        block<HtmlBlock>({
          variant: 'html',
          content: `
            <p class="govuk-body">
              For composite fields (like date inputs that store structured objects),
              you can access nested properties:
            </p>
          `,
        }),
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `
// Date input stores { day, month, year }
// You can validate individual parts:
field<GovUKDateInputFull>({
  variant: 'govukDateInputFull',
  code: 'startDate',
  validate: [
    validation({
      when: Self().path('month').not.match(Condition.Number.Between(1, 12)),
      message: 'Month must be between 1 and 12',
      details: { field: 'month' },
    }),
    validation({
      when: Self().path('day').not.match(Condition.Number.Between(1, 31)),
      message: 'Day must be between 1 and 31',
      details: { field: 'day' },
    }),
  ],
})`,
        }),
      ],
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Always use Self() for field's own validation:</strong> Prefer
            <code>Self().match(...)</code> over <code>Answer('fieldCode').match(...)</code>
          </li>
          <li>
            <strong>Check for empty first:</strong> The first validation should usually
            be an empty check, as other conditions may behave unexpectedly on empty values
          </li>
          <li>
            <strong>Use Answer() for cross-field validation:</strong> When comparing to
            another field, use <code>Answer()</code> for the other field, not <code>Self()</code>
          </li>
        </ul>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Cross-field validation pattern
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'confirmEmail',
  label: 'Confirm email address',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Confirm your email address',
    }),
    validation({
      when: Self().not.match(Condition.Equals(Answer('email'))),
      message: 'Email addresses do not match',
    }),
  ],
})`,
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
              href: '/forms/form-engine-developer-guide/references/data',
              labelText: 'Data Reference',
            },
            next: {
              href: '/forms/form-engine-developer-guide/references/item',
              labelText: 'Item Reference',
            },
          }),
        ],
      },
    }),
  ],
})
