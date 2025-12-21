import { block, field, validation, Self } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'
import { exampleBox } from '../../../../../helpers/exampleBox'

/**
 * Number Validation Playground
 *
 * Interactive examples of number validation conditions.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Number Validation Playground

  Try these fields to see number validation in action. Submit the form to
  trigger validation and see error messages. {.lead}

  <div class="govuk-inset-text">
    <strong>Note:</strong> Number conditions require numeric values. Add
    <code>formatters: [Transformer.String.ToInt()]</code> or
    <code>Transformer.String.ToFloat()</code> to convert string input to numbers
    before validation runs.
  </div>

  ---

  ## Range Validation

  Age must be between 18 and 120. Try 0, 17, 121, or 150.

  {{slot:rangeValidationExample}}

  {{slot:rangeValidationCode}}

  ---

  ## Minimum Value

  Amount must be greater than 0. Try 0 or a negative number.

  {{slot:minimumValueExample}}

  {{slot:minimumValueCode}}

  ---

  ## Maximum Value

  Percentage must be at most 100. Try 101 or 150.

  {{slot:maximumValueExample}}

  {{slot:maximumValueCode}}

  ---

  ## Multiple Items

  Must order between 1 and 10 items. Try 0 or 11.

  {{slot:multipleItemsExample}}

  {{slot:multipleItemsCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    rangeValidationExample: [
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
    ],
    rangeValidationCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
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
              })
            `,
          }),
        ],
      }),
    ],
    minimumValueExample: [
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
    ],
    minimumValueCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
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
              })
            `,
          }),
        ],
      }),
    ],
    maximumValueExample: [
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
    ],
    maximumValueCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
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
              })
            `,
          }),
        ],
      }),
    ],
    multipleItemsExample: [
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
    ],
    multipleItemsCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
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
              })
            `,
          }),
        ],
      }),
    ],
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
})
