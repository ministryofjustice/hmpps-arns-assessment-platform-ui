import { step, block, field, validation, Self, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Validation Playground - Numbers
 *
 * Interactive examples of number validation conditions.
 */
export const numbersStep = step({
  path: '/numbers',
  title: 'Number Validation',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Number Validation Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see number validation in action. Submit the form to
          trigger validation and see error messages.
        </p>

        <div class="govuk-inset-text">
          <strong>Note:</strong> Number conditions require numeric values. Add
          <code>formatters: [Transformer.String.ToInt()]</code> or
          <code>Transformer.String.ToFloat()</code> to convert string input to numbers
          before validation runs.
        </div>
      `,
    }),

    // Range Validation
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Range Validation</h2>
        <p class="govuk-body">Age must be between 18 and 120. Try 0, 17, 121, or 150.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_range',
        label: 'Your age',
        hint: 'You must be at least 18 years old',
        inputMode: 'numeric',
        formatters: [Transformer.String.ToInt()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your age',
          }),
          validation({
            when: Self().not.match(Condition.Number.IsInteger()),
            message: 'Age must be a number',
          }),
          validation({
            when: Self().not.match(Condition.Number.Between(18, 120)),
            message: 'Age must be between 18 and 120',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_range',
  label: 'Your age',
  hint: 'You must be at least 18 years old',
  inputMode: 'numeric',
  formatters: [Transformer.String.ToInt()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your age',
    }),
    validation({
      when: Self().not.match(Condition.Number.IsInteger()),
      message: 'Age must be a number',
    }),
    validation({
      when: Self().not.match(Condition.Number.Between(18, 120)),
      message: 'Age must be between 18 and 120',
    }),
  ],
})`,
        }),
      ],
    }),

    // Greater Than
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Minimum Value</h2>
        <p class="govuk-body">Amount must be greater than 0. Try 0 or a negative number.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_minimum',
        label: 'Amount to pay',
        prefix: { text: '£' },
        inputMode: 'numeric',
        formatters: [Transformer.String.ToFloat()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an amount',
          }),
          validation({
            when: Self().not.match(Condition.Number.IsNumber()),
            message: 'Enter a valid amount',
          }),
          validation({
            when: Self().not.match(Condition.Number.GreaterThan(0)),
            message: 'Amount must be greater than £0',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_minimum',
  label: 'Amount to pay',
  prefix: { text: '£' },
  inputMode: 'numeric',
  formatters: [Transformer.String.ToFloat()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an amount',
    }),
    validation({
      when: Self().not.match(Condition.Number.IsNumber()),
      message: 'Enter a valid amount',
    }),
    validation({
      when: Self().not.match(Condition.Number.GreaterThan(0)),
      message: 'Amount must be greater than £0',
    }),
  ],
})`,
        }),
      ],
    }),

    // Less Than or Equal
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Maximum Value</h2>
        <p class="govuk-body">Percentage must be at most 100. Try 101 or 150.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_maximum',
        label: 'Discount percentage',
        suffix: { text: '%' },
        inputMode: 'numeric',
        formatters: [Transformer.String.ToFloat()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a percentage',
          }),
          validation({
            when: Self().not.match(Condition.Number.IsNumber()),
            message: 'Percentage must be a number',
          }),
          validation({
            when: Self().not.match(Condition.Number.GreaterThanOrEqual(0)),
            message: 'Percentage cannot be negative',
          }),
          validation({
            when: Self().not.match(Condition.Number.LessThanOrEqual(100)),
            message: 'Percentage cannot exceed 100',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_maximum',
  label: 'Discount percentage',
  suffix: { text: '%' },
  inputMode: 'numeric',
  formatters: [Transformer.String.ToFloat()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a percentage',
    }),
    validation({
      when: Self().not.match(Condition.Number.IsNumber()),
      message: 'Percentage must be a number',
    }),
    validation({
      when: Self().not.match(Condition.Number.GreaterThanOrEqual(0)),
      message: 'Percentage cannot be negative',
    }),
    validation({
      when: Self().not.match(Condition.Number.LessThanOrEqual(100)),
      message: 'Percentage cannot exceed 100',
    }),
  ],
})`,
        }),
      ],
    }),

    // Comparison operators
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Multiple Items</h2>
        <p class="govuk-body">Must order between 1 and 10 items. Try 0 or 11.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'playground_items',
        label: 'Number of items',
        hint: 'You can order between 1 and 10 items',
        inputMode: 'numeric',
        formatters: [Transformer.String.ToInt()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter the number of items',
          }),
          validation({
            when: Self().not.match(Condition.Number.IsInteger()),
            message: 'Enter a number',
          }),
          validation({
            when: Self().not.match(Condition.Number.GreaterThanOrEqual(1)),
            message: 'You must order at least 1 item',
          }),
          validation({
            when: Self().not.match(Condition.Number.LessThanOrEqual(10)),
            message: 'You can order at most 10 items',
          }),
        ],
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'playground_items',
  label: 'Number of items',
  hint: 'You can order between 1 and 10 items',
  inputMode: 'numeric',
  formatters: [Transformer.String.ToInt()],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter the number of items',
    }),
    validation({
      when: Self().not.match(Condition.Number.IsInteger()),
      message: 'Enter a number',
    }),
    validation({
      when: Self().not.match(Condition.Number.GreaterThanOrEqual(1)),
      message: 'You must order at least 1 item',
    }),
    validation({
      when: Self().not.match(Condition.Number.LessThanOrEqual(10)),
      message: 'You can order at most 10 items',
    }),
  ],
})`,
        }),
      ],
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
              href: '/forms/form-engine-developer-guide/validation/playground/strings',
              labelText: 'String Validation',
            },
            next: {
              href: '/forms/form-engine-developer-guide/validation/playground/dates',
              labelText: 'Date Validation',
            },
          }),
        ],
      },
    }),
  ],
})
