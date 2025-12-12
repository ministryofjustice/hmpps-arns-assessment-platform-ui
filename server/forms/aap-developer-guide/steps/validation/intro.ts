import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Validation - Introduction
 *
 * Overview of validation, the validation() builder, and best practices.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Validation',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Validation</h1>

        <p class="govuk-body-l">
          Validation ensures users provide correct data before proceeding. The form-engine
          uses a declarative approach where you define conditions that trigger error messages.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">How Validation Works</h2>

        <p class="govuk-body">
          Each field can have a <code>validate</code> array containing validation rules.
          Each rule specifies:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li><strong>when</strong> &mdash; A condition that, when true, triggers the error</li>
          <li><strong>message</strong> &mdash; The error message to display</li>
        </ul>

        <p class="govuk-body">
          Think of it as: <em>"Show this error <strong>when</strong> this condition is true."</em>
        </p>
      `,
    }),

    // Basic example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Example</h2>
        <p class="govuk-body">Here's a field with two validation rules:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { field, validation, Self, Condition } from '@form-engine/form/builders'

field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'email',
  label: 'Email address',
  validate: [
    validation({
      when: Self().match(Condition.String.IsEmpty()),
      message: 'Enter your email address',
    }),
    validation({
      when: Self().not.match(Condition.String.IsEmail()),
      message: 'Enter a valid email address',
    }),
  ],
})`,
          }),
        ],
      },
    }),

    // The validation() builder
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The validation() Builder</h2>
        <p class="govuk-body">
          The <code>validation()</code> function creates a validation rule with these properties:
        </p>
      `,
    }),

    // when property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        {{slot:description}}
      `,
      values: { name: 'when' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                A predicate expression that, when <strong>true</strong>, triggers the error.
                Typically uses <code>Self()</code> to reference the current field's value.
              </p>
            `,
          }),
        ],
      },
    }),

    // message property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code> <span class="govuk-tag govuk-tag--red">Required</span></h3>
        {{slot:description}}
      `,
      values: { name: 'message' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                The error message shown to the user. Follow GOV.UK guidelines:
                be specific, tell users what to do, and avoid jargon.
              </p>
            `,
          }),
        ],
      },
    }),

    // submissionOnly property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'submissionOnly' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                When <code>true</code>, validation only runs on form submission, not during
                navigation. Useful for expensive checks or partial saves.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `validation({
  when: Self().not.match(Condition.Custom.UniqueUsername()),
  message: 'This username is already taken',
  submissionOnly: true,
})`,
          }),
        ],
      },
    }),

    // details property
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s"><code>{{name}}</code></h3>
        {{slot:description}}
        {{slot:example}}
      `,
      values: { name: 'details' },
      slots: {
        description: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <p class="govuk-body">
                Optional metadata for the error. i.e. GovUKDateInput, use
                <code>{ field: 'day' | 'month' | 'year' }</code> to highlight
                the specific field with the error.
              </p>
            `,
          }),
        ],
        example: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `validation({
  when: Self().path('month').not.match(Condition.Number.Between(1, 12)),
  message: 'Month must be between 1 and 12',
  details: { field: 'month' },
})`,
          }),
        ],
      },
    }),

    // Validation Order section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Validation Order</h2>
        <p class="govuk-body">
          Rules are checked in array order. The first failing rule's message is shown.
          Order from most basic to most specific:
        </p>
        <ol class="govuk-list govuk-list--number">
          <li>Required check (is the field empty?)</li>
          <li>Format check (is it the right type/format?)</li>
          <li>Business rules (is the value valid for this context?)</li>
        </ol>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
validate: [
  // 1. Required
  validation({
    when: Self().match(Condition.String.IsEmpty()),
    message: 'Enter your age',
  }),
  // 2. Format
  validation({
    when: Self().not.match(Condition.String.IsNumeric()),
    message: 'Age must be a number',
  }),
  // 3. Business rule
  validation({
    when: Self().not.match(Condition.Number.Between(18, 120)),
    message: 'You must be between 18 and 120 years old',
  }),
]`,
    }),

    // Best Practices section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>
        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Be specific:</strong> "Enter your email address" is better than "This field is required"
          </li>
          <li>
            <strong>Tell users what to do:</strong> "Enter a date in the past" not "Date is invalid"
          </li>
          <li>
            <strong>Check for empty first:</strong> Other validations may fail unexpectedly on empty values
          </li>
          <li>
            <strong>Use formatters:</strong> Trim whitespace so "  " isn't considered valid
          </li>
          <li>
            <strong>Consider accessibility:</strong> Error messages are read by screen readers
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
    }),
  ],
})
