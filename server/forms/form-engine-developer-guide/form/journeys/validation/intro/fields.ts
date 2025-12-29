import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Validation Introduction Page
 *
 * Single markdown template with component slots for code examples and navigation.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Validation

  Validation ensures users provide correct data before proceeding. The form-engine
  uses a declarative approach where you define conditions that trigger error messages. {.lead}

  ---

  ## How Validation Works

  Each field can have a \`validate\` array containing validation rules.
  Each rule specifies:

  - **when** — A condition that, when true, triggers the error
  - **message** — The error message to display

  Think of it as: *"Show this error **when** this condition is true."*

  ---

  ## Basic Example

  Here's a field with two validation rules:

  {{slot:basicExampleCode}}

  ---

  ## The validation() Builder

  The \`validation()\` function creates a validation rule with these properties:

  <h3 class="govuk-heading-s"><code>when</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

  A predicate expression that, when **true**, triggers the error.
  Typically uses \`Self()\` to reference the current field's value.

  <h3 class="govuk-heading-s"><code>message</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>

  The error message shown to the user. Follow GOV.UK guidelines:
  be specific, tell users what to do, and avoid jargon.

  <h3 class="govuk-heading-s"><code>submissionOnly</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  When \`true\`, validation only runs on form submission, not during
  navigation. Useful for expensive checks or partial saves.

  {{slot:submissionOnlyCode}}

  <h3 class="govuk-heading-s"><code>details</code> <span class="govuk-tag govuk-tag--grey">Optional</span></h3>

  Optional metadata for the error. For GovUKDateInput, use
  \`{ field: 'day' | 'month' | 'year' }\` to highlight the specific field with the error.

  {{slot:detailsCode}}

  ---

  ## Validation Order

  Rules are checked in array order. The first failing rule's message is shown.
  Order from most basic to most specific:

  1. Required check (is the field empty?)
  2. Format check (is it the right type/format?)
  3. Business rules (is the value valid for this context?)

  {{slot:orderExampleCode}}

  ---

  ## Best Practices

  - **Be specific:** "Enter your email address" is better than "This field is required"
  - **Tell users what to do:** "Enter a date in the past" not "Date is invalid"
  - **Check for empty first:** Other validations may fail unexpectedly on empty values
  - **Use formatters:** Trim whitespace so "  " isn't considered valid
  - **Consider accessibility:** Error messages are read by screen readers

  ---

  {{slot:pagination}}
`),
  slots: {
    basicExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { validation, Self, Condition } from '@form-engine/form/builders'
          import { GovUKTextInput } from '@form-engine-govuk-components/components'

          GovUKTextInput({
            code: 'email',
            label: 'Email address',
            validate: [
              validation({
                when: Self().not.match(Condition.IsRequired()),
                message: 'Enter your email address',
              }),
              validation({
                when: Self().not.match(Condition.Email.IsValidEmail()),
                message: 'Enter a valid email address',
              }),
            ],
          })
        `,
      }),
    ],
    submissionOnlyCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          validation({
            when: Self().not.match(Condition.Custom.UniqueUsername()),
            message: 'This username is already taken',
            submissionOnly: true,
          })
        `,
      }),
    ],
    detailsCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          validation({
            when: Self().path('month').not.match(Condition.Number.Between(1, 12)),
            message: 'Month must be between 1 and 12',
            details: { field: 'month' },
          })
        `,
      }),
    ],
    orderExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          validate: [
            // 1. Required
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter your age',
            }),
            // 2. Format
            validation({
              when: Self().not.match(Condition.Number.IsInteger()),
              message: 'Age must be a whole number',
            }),
            // 3. Business rule
            validation({
              when: Self().not.match(Condition.Number.Between(18, 120)),
              message: 'You must be between 18 and 120 years old',
            }),
          ]
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/conditions/intro',
          labelText: 'Conditions',
        },
        next: {
          href: '/forms/form-engine-developer-guide/validation/patterns',
          labelText: 'Common Patterns',
        },
      }),
    ],
  },
})
