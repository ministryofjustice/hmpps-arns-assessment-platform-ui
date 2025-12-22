import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - Self()
 *
 * Comprehensive documentation for the Self() reference,
 * covering field-scoped access, validation patterns, and how it resolves.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
# Self()

The \`Self()\` reference points to the current field's own value.
It's primarily used in validation rules and field-scoped expressions. {.lead}

---

## Signature

{{slot:signatureCode}}

No parameters required. \`Self()\` automatically resolves to the
nearest containing field's code at compile time.

---

## How Self() Works

When the form-engine compiles your form definition, it transforms \`Self()\`
into an \`Answer()\` reference with the field's actual code:

{{slot:transformCode}}

---

## Why Use Self()?

You might wonder why not just write \`Answer('email')\` directly.
Using \`Self()\` provides several benefits:

- **DRY principle:** You don't repeat the field code, reducing the chance of typos
- **Refactoring safety:** If you rename the field code, validations using \`Self()\` update automatically
- **Readability:** It's immediately clear the validation applies to "this field" rather than some other field
- **Reusable patterns:** You can extract common validation patterns that work with any field

---

## Primary Use: Validation

The most common use of \`Self()\` is in validation rules:

{{slot:validationCode}}

---

## Using .not for Negative Conditions

The \`.not\` modifier inverts the condition. This is useful for
"must be" validations:

{{slot:notCode}}

---

## Implicit Self() Usage

Behind the scenes, the form-engine automatically uses \`Self()\`
for a field's display value. Every field implicitly has:

{{slot:implicitCode}}

This means the field automatically displays its own answer value without
you needing to specify it.

---

## Restrictions

{{slot:warning}}

**Valid locations:**

- \`validate\` array
- \`hidden\` condition
- \`dependent\` condition
- Any expression within the field definition

**Invalid locations:**

- Inside the field's own \`code\` property (would cause infinite recursion)
- Outside any field block (no "self" to reference)
- In step-level or journey-level configurations

{{slot:advancedDetails}}

---

## Best Practices

- **Always use Self() for field's own validation:** Prefer \`Self().match(...)\` over \`Answer('fieldCode').match(...)\`
- **Check for empty first:** The first validation should usually be an empty check, as other conditions may behave unexpectedly on empty values
- **Use Answer() for cross-field validation:** When comparing to another field, use \`Answer()\` for the other field, not \`Self()\`

{{slot:crossFieldCode}}

---

{{slot:pagination}}
`),
  slots: {
    signatureCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          Self(): ReferenceExpr
        `,
      }),
    ],
    transformCode: [
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
          })
        `,
      }),
    ],
    validationCode: [
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
          })
        `,
      }),
    ],
    notCode: [
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
          })
        `,
      }),
    ],
    implicitCode: [
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
          })
        `,
      }),
    ],
    warning: [
      block<GovUKWarningText>({
        variant: 'govukWarningText',
        html: '<code>Self()</code> can only be used inside a field block. Using it elsewhere will throw a compilation error.',
      }),
    ],
    advancedDetails: [
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
              })
            `,
          }),
        ],
      }),
    ],
    crossFieldCode: [
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
          })
        `,
      }),
    ],
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
})
