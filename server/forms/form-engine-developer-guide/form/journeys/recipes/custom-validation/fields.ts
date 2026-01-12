import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Recipe: Custom Validation
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipe: Custom Validation

Add validation rules with custom error messages. {.lead}

---

## The Pattern

Use the \`validate\` property with an array of \`validation()\` objects.
Each validation has a \`when\` condition and a \`message\`.

{{slot:basicExample}}

---

## How It Works

1. \`Self()\` references the current field's value
2. \`.not.match(Condition.IsRequired())\` returns true when the field is empty
3. When the condition is true, the error message is shown
4. Multiple validations run in order until one fails

---

## The Validation Pattern

Validations check for the **error condition** - when the condition is true,
the error is shown. Think of it as "show error when...":

| Pattern | Meaning |
|---------|---------|
| \`Self().not.match(Condition.IsRequired())\` | Error when empty |
| \`Self().not.match(Condition.Email.IsValidEmail())\` | Error when not valid email |
| \`Self().not.match(Condition.String.HasMinLength(8))\` | Error when too short |

---

## Common Variations

### Email format validation

{{slot:emailExample}}

### Minimum length

{{slot:minLengthExample}}

### Numeric range

{{slot:rangeExample}}

### Cross-field validation

{{slot:crossFieldExample}}

---

## Related Concepts

- [Validation](/forms/form-engine-developer-guide/validation/intro) - Full validation documentation
- [Conditions](/forms/form-engine-developer-guide/conditions/intro) - All available condition types

---

{{slot:pagination}}
`),
  slots: {
    basicExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { validation, Self } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'

          export const firstName = GovUKTextInput({
            code: 'firstName',
            label: 'First name',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter your first name',
              }),
            ],
          })
        `,
      }),
    ],
    emailExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your email address',
            }),
            validation({
              when: Self().not.match(Condition.Email.IsValidEmail()),
              message: 'Enter a valid email address',
            }),
          ]
        `,
      }),
    ],
    minLengthExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a password',
            }),
            validation({
              when: Self().not.match(Condition.String.HasMinLength(8)),
              message: 'Password must be at least 8 characters',
            }),
          ]
        `,
      }),
    ],
    rangeExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { and } from '@form-engine/form/builders'

          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a quantity',
            }),
            validation({
              when: not(
                and(
                  Self().match(Condition.Number.GreaterThanOrEqual(1)),
                  Self().match(Condition.Number.LessThanOrEqual(100))
                )
              ),
              message: 'Enter a number between 1 and 100',
            }),
          ]
        `,
      }),
    ],
    crossFieldExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Validate that confirmation matches password
          export const confirmPassword = GovUKTextInput({
            code: 'confirmPassword',
            label: 'Confirm password',
            inputType: 'password',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Confirm your password',
              }),
              validation({
                when: Self().not.match(Condition.Equals(Answer('password'))),
                message: 'Passwords do not match',
              }),
            ],
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/recipes/conditional-visibility',
          labelText: 'Conditional Visibility',
        },
        next: {
          href: '/forms/form-engine-developer-guide/recipes/load-data',
          labelText: 'Load Data on Entry',
        },
      }),
    ],
  },
})
