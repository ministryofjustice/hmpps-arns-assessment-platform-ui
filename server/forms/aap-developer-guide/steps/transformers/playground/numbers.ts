import { step, block, field, validation, Self, Answer, submitTransition, Format } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Transformers Playground - Numbers
 *
 * Interactive examples of number transformers.
 * Submit the form to see the transformed values.
 */
export const numbersStep = step({
  path: '/numbers',
  title: 'Number Transformers',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Number Transformers Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see number transformers in action. Submit the form
          to apply the transformers and see the results.
        </p>

        <div class="govuk-inset-text">
          <strong>Note:</strong> Text input values are strings. Use
          <code>Transformer.String.ToInt()</code> or <code>Transformer.String.ToFloat()</code>
          first to convert to numbers before applying number transformers.
        </div>
      `,
    }),

    // Round
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Round()</h2>
        <p class="govuk-body">
          Enter a decimal number. Round will round to the nearest integer.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_round',
  label: 'Enter a decimal number',
  inputMode: 'decimal',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToFloat(),
    Transformer.Number.Round(),  // 3.7 → 4, 3.2 → 3
  ],
})`,
        }),
      ],
    }),

    // Floor
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Floor()</h2>
        <p class="govuk-body">
          Enter a decimal number. Floor always rounds down to the nearest integer.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_floor',
  label: 'Enter a decimal number',
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.Floor(),  // 4.9 → 4, 4.1 → 4
  ],
})`,
        }),
      ],
    }),

    // Ceil
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Ceil()</h2>
        <p class="govuk-body">
          Enter a decimal number. Ceil always rounds up to the nearest integer.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_ceil',
  label: 'Enter a decimal number',
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.Ceil(),  // 4.1 → 5, 4.9 → 5
  ],
})`,
        }),
      ],
    }),

    // ToFixed
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.ToFixed()</h2>
        <p class="govuk-body">
          Enter a number with many decimal places. ToFixed rounds to the specified number of decimal places.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_tofixed',
  label: 'Enter a price',
  prefix: { text: '£' },
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.ToFixed(2),  // 19.999 → 20.00, 5 → 5.00
  ],
})`,
        }),
      ],
    }),

    // Multiply
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Multiply()</h2>
        <p class="govuk-body">
          Enter a base price. Multiply adds VAT (20%) to the value.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_multiply',
  label: 'Enter a price (excluding VAT)',
  prefix: { text: '£' },
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.Multiply(1.2),  // 100 → 120 (adds 20% VAT)
  ],
})`,
        }),
      ],
    }),

    // Divide
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Divide()</h2>
        <p class="govuk-body">
          Enter a percentage. Divide converts it to a decimal for storage.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_divide',
  label: 'Enter a discount percentage',
  suffix: { text: '%' },
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.Divide(100),  // 25 → 0.25
  ],
})`,
        }),
      ],
    }),

    // Clamp
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Clamp()</h2>
        <p class="govuk-body">
          Enter any number. Clamp constrains it to stay within the min/max range.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_clamp',
  label: 'Enter a quantity',
  hint: 'Will be clamped between 1 and 10',
  formatters: [
    Transformer.String.ToInt(),
    Transformer.Number.Clamp(1, 10),  // -5 → 1, 50 → 10, 5 → 5
  ],
})`,
        }),
      ],
    }),

    // Abs
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Abs()</h2>
        <p class="govuk-body">
          Enter a negative number. Abs returns the absolute (positive) value.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_abs',
  label: 'Enter a number',
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.Abs(),  // -42 → 42
  ],
})`,
        }),
      ],
    }),

    // Add
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Add()</h2>
        <p class="govuk-body">
          Enter a base price. Add will include a £5 service fee.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_add',
        label: 'Enter a base price',
        hint: 'Try "10"',
        prefix: { text: '£' },
        inputMode: 'decimal',
        classes: 'govuk-input--width-10',
        formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Add(5)],
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
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Total with £5 fee: <code>£%1</code></div>',
          Answer('transformers_add'),
        ),
        hidden: Answer('transformers_add').not.match(Condition.IsRequired()),
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
  code: 'transformers_add',
  label: 'Enter a base price',
  prefix: { text: '£' },
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.Add(5),  // 10 → 15
  ],
})`,
        }),
      ],
    }),

    // Subtract
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Number.Subtract()</h2>
        <p class="govuk-body">
          Enter a price. Subtract will apply a £10 discount.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_subtract',
        label: 'Enter a price',
        hint: 'Try "50"',
        prefix: { text: '£' },
        inputMode: 'decimal',
        classes: 'govuk-input--width-10',
        formatters: [Transformer.String.Trim(), Transformer.String.ToFloat(), Transformer.Number.Subtract(10)],
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
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">After £10 discount: <code>£%1</code></div>',
          Answer('transformers_subtract'),
        ),
        hidden: Answer('transformers_subtract').not.match(Condition.IsRequired()),
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
  code: 'transformers_subtract',
  label: 'Enter a price',
  prefix: { text: '£' },
  formatters: [
    Transformer.String.ToFloat(),
    Transformer.Number.Subtract(10),  // 50 → 40
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
    }),
  ],
})
