import { block, field, validation, Self, Answer, Format } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components/code-block/codeBlock'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Transformers Playground - Numbers
 *
 * Interactive examples of number transformers.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Number Transformers Playground

  Try these fields to see number transformers in action. Submit the form
  to apply the transformers and see the results. {.lead}

  <div class="govuk-inset-text">
    <strong>Note:</strong> Text input values are strings. Use
    <code>Transformer.String.ToInt()</code> or <code>Transformer.String.ToFloat()</code>
    first to convert to numbers before applying number transformers.
  </div>

  ---

  ## Transformer.Number.Round()

  Enter a decimal number. Round will round to the nearest integer.

  {{slot:roundExample}}

  {{slot:roundCode}}

  ---

  ## Transformer.Number.Floor()

  Enter a decimal number. Floor always rounds down to the nearest integer.

  {{slot:floorExample}}

  {{slot:floorCode}}

  ---

  ## Transformer.Number.Ceil()

  Enter a decimal number. Ceil always rounds up to the nearest integer.

  {{slot:ceilExample}}

  {{slot:ceilCode}}

  ---

  ## Transformer.Number.ToFixed()

  Enter a number with many decimal places. ToFixed rounds to the specified number of decimal places.

  {{slot:toFixedExample}}

  {{slot:toFixedCode}}

  ---

  ## Transformer.Number.Multiply()

  Enter a base price. Multiply adds VAT (20%) to the value.

  {{slot:multiplyExample}}

  {{slot:multiplyCode}}

  ---

  ## Transformer.Number.Divide()

  Enter a percentage. Divide converts it to a decimal for storage.

  {{slot:divideExample}}

  {{slot:divideCode}}

  ---

  ## Transformer.Number.Clamp()

  Enter any number. Clamp constrains it to stay within the min/max range.

  {{slot:clampExample}}

  {{slot:clampCode}}

  ---

  ## Transformer.Number.Abs()

  Enter a negative number. Abs returns the absolute (positive) value.

  {{slot:absExample}}

  {{slot:absCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    roundExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_round',
          label: 'Enter a decimal number',
          hint: 'Try "3.7" or "3.2"',
          inputMode: 'decimal',
          classes: 'govuk-input--width-10',
          formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Round()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a number',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>%1</code></div>',
            Answer('transformers_round'),
          ),
          hidden: Answer('transformers_round').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    roundCode: [
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
                code: 'transformers_round',
                label: 'Enter a decimal number',
                inputMode: 'decimal',
                formatters: [
                  Transformer.String.Trim(),
                  Transformer.String.ToFloat(),
                  Transformer.Number.Round(),  // 3.7 → 4, 3.2 → 3
                ],
              })
            `,
          }),
        ],
      }),
    ],
    floorExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_floor',
          label: 'Enter a decimal number',
          hint: 'Try "4.9" or "4.1"',
          inputMode: 'decimal',
          classes: 'govuk-input--width-10',
          formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Floor()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a number',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Floor result: <code>%1</code></div>',
            Answer('transformers_floor'),
          ),
          hidden: Answer('transformers_floor').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    floorCode: [
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
                code: 'transformers_floor',
                label: 'Enter a decimal number',
                formatters: [
                  Transformer.String.ToFloat(),
                  Transformer.Number.Floor(),  // 4.9 → 4, 4.1 → 4
                ],
              })
            `,
          }),
        ],
      }),
    ],
    ceilExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_ceil',
          label: 'Enter a decimal number',
          hint: 'Try "4.1" or "4.9"',
          inputMode: 'decimal',
          classes: 'govuk-input--width-10',
          formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Ceil()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a number',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Ceil result: <code>%1</code></div>',
            Answer('transformers_ceil'),
          ),
          hidden: Answer('transformers_ceil').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    ceilCode: [
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
                code: 'transformers_ceil',
                label: 'Enter a decimal number',
                formatters: [
                  Transformer.String.ToFloat(),
                  Transformer.Number.Ceil(),  // 4.1 → 5, 4.9 → 5
                ],
              })
            `,
          }),
        ],
      }),
    ],
    toFixedExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_tofixed',
          label: 'Enter a price',
          hint: 'Try "19.999" or "5"',
          prefix: { text: '£' },
          inputMode: 'decimal',
          classes: 'govuk-input--width-10',
          formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.ToFixed(2)],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a price',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>£%1</code></div>',
            Answer('transformers_tofixed'),
          ),
          hidden: Answer('transformers_tofixed').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    toFixedCode: [
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
                code: 'transformers_tofixed',
                label: 'Enter a price',
                prefix: { text: '£' },
                formatters: [
                  Transformer.String.ToFloat(),
                  Transformer.Number.ToFixed(2),  // 19.999 → 20.00, 5 → 5.00
                ],
              })
            `,
          }),
        ],
      }),
    ],
    multiplyExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_multiply',
          label: 'Enter a price (excluding VAT)',
          hint: 'Try "100"',
          prefix: { text: '£' },
          inputMode: 'decimal',
          classes: 'govuk-input--width-10',
          formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Multiply(1.2)],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a price',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Price including VAT: <code>£%1</code></div>',
            Answer('transformers_multiply'),
          ),
          hidden: Answer('transformers_multiply').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    multiplyCode: [
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
                code: 'transformers_multiply',
                label: 'Enter a price (excluding VAT)',
                prefix: { text: '£' },
                formatters: [
                  Transformer.String.ToFloat(),
                  Transformer.Number.Multiply(1.2),  // 100 → 120 (adds 20% VAT)
                ],
              })
            `,
          }),
        ],
      }),
    ],
    divideExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_divide',
          label: 'Enter a discount percentage',
          hint: 'Try "25" (for 25%)',
          suffix: { text: '%' },
          inputMode: 'numeric',
          classes: 'govuk-input--width-5',
          formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Divide(100)],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a percentage',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Stored as decimal: <code>%1</code></div>',
            Answer('transformers_divide'),
          ),
          hidden: Answer('transformers_divide').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    divideCode: [
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
                code: 'transformers_divide',
                label: 'Enter a discount percentage',
                suffix: { text: '%' },
                formatters: [
                  Transformer.String.ToFloat(),
                  Transformer.Number.Divide(100),  // 25 → 0.25
                ],
              })
            `,
          }),
        ],
      }),
    ],
    clampExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_clamp',
          label: 'Enter a quantity',
          hint: 'Will be clamped between 1 and 10',
          inputMode: 'numeric',
          classes: 'govuk-input--width-5',
          formatters: [Transformer.String.Trim(), Transformer.String.ToInt(), Transformer.Number.Clamp(1, 10)],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a quantity',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Clamped value: <code>%1</code> (range: 1-10)</div>',
            Answer('transformers_clamp'),
          ),
          hidden: Answer('transformers_clamp').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    clampCode: [
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
                code: 'transformers_clamp',
                label: 'Enter a quantity',
                hint: 'Will be clamped between 1 and 10',
                formatters: [
                  Transformer.String.ToInt(),
                  Transformer.Number.Clamp(1, 10),  // -5 → 1, 50 → 10, 5 → 5
                ],
              })
            `,
          }),
        ],
      }),
    ],
    absExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_abs',
          label: 'Enter a number',
          hint: 'Try "-42"',
          inputMode: 'numeric',
          classes: 'govuk-input--width-10',
          formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Abs()],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter a number',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Absolute value: <code>%1</code></div>',
            Answer('transformers_abs'),
          ),
          hidden: Answer('transformers_abs').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    absCode: [
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
                code: 'transformers_abs',
                label: 'Enter a number',
                formatters: [
                  Transformer.String.ToFloat(),
                  Transformer.Number.Abs(),  // -42 → 42
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
          href: '/forms/form-engine-developer-guide/transformers/playground/strings',
          labelText: 'String Transformers',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transformers/playground/arrays',
          labelText: 'Array Transformers',
        },
      }),
    ],
  },
})
