import { step, block, field, validation, Self, Answer, submitTransition, and } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Conditions Playground - Numbers
 *
 * Interactive examples of number conditions with validation.
 * Submit the form to see validation errors.
 */
export const numbersStep = step({
  path: '/numbers',
  title: 'Number Conditions',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Number Conditions Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see number conditions in action. Submit the form to
          trigger validation and see error messages.
        </p>

        <div class="govuk-inset-text">
          <strong>Note:</strong> Text input values are strings. Use <code>.pipe(Transformer.String.ToInt())</code>
          or <code>.pipe(Transformer.String.ToFloat())</code> to convert before applying number conditions.
        </div>
      `,
    }),

    // IsNumber
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Number.IsNumber()</h2>
        <p class="govuk-body">Enter something that isn't a number (e.g., "abc") to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_isnumber',
        label: 'Enter a number',
        inputMode: 'numeric',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a number',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.IsNumber()),
            message: 'Enter a valid number',
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
  code: 'cond_isnumber',
  label: 'Enter a number',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a number',
    }),
    validation({
      when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.IsNumber()),
      message: 'Enter a valid number',
    }),
  ],
})`,
        }),
      ],
    }),

    // IsInteger
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Number.IsInteger()</h2>
        <p class="govuk-body">Enter a decimal number (e.g., "5.5") to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_isinteger',
        label: 'Enter a whole number',
        inputMode: 'numeric',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a whole number',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.IsInteger()),
            message: 'Enter a whole number with no decimal places',
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
  code: 'cond_isinteger',
  label: 'Enter a whole number',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a whole number',
    }),
    validation({
      when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.IsInteger()),
      message: 'Enter a whole number with no decimal places',
    }),
  ],
})`,
        }),
      ],
    }),

    // GreaterThan
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Number.GreaterThan()</h2>
        <p class="govuk-body">Enter 10 or less to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_greaterthan',
        label: 'Enter a number',
        hint: 'Must be greater than 10',
        inputMode: 'numeric',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a number',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.GreaterThan(10)),
            message: 'Enter a number greater than 10',
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
  code: 'cond_greaterthan',
  label: 'Enter a number',
  hint: 'Must be greater than 10',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a number',
    }),
    validation({
      when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.GreaterThan(10)),
      message: 'Enter a number greater than 10',
    }),
  ],
})`,
        }),
      ],
    }),

    // LessThan
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Number.LessThan()</h2>
        <p class="govuk-body">Enter 5 or more to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_lessthan',
        label: 'Enter a number',
        hint: 'Must be less than 5',
        inputMode: 'numeric',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a number',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.LessThan(5)),
            message: 'Enter a number less than 5',
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
  code: 'cond_lessthan',
  label: 'Enter a number',
  hint: 'Must be less than 5',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter a number',
    }),
    validation({
      when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.LessThan(5)),
      message: 'Enter a number less than 5',
    }),
  ],
})`,
        }),
      ],
    }),

    // Between
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Number.Between()</h2>
        <p class="govuk-body">Enter a number outside 18-65 to see the validation error.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_between',
        label: 'Enter your age',
        hint: 'Must be between 18 and 65',
        inputMode: 'numeric',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter your age',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToInt()).not.match(Condition.Number.Between(18, 65)),
            message: 'Enter an age between 18 and 65',
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
  code: 'cond_between',
  label: 'Enter your age',
  hint: 'Must be between 18 and 65',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter your age',
    }),
    validation({
      when: Self().pipe(Transformer.String.ToInt()).not.match(Condition.Number.Between(18, 65)),
      message: 'Enter an age between 18 and 65',
    }),
  ],
})`,
        }),
      ],
    }),

    // GreaterThanOrEqual
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Condition.Number.GreaterThanOrEqual()</h2>
        <p class="govuk-body">Enter less than 100 to see the validation error. Try 99 vs 100.</p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_gte',
        label: 'Enter an amount',
        hint: 'Minimum order: £100',
        inputMode: 'numeric',
        prefix: { text: '£' },
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an amount',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.GreaterThanOrEqual(100)),
            message: 'Enter an amount of £100 or more',
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
  code: 'cond_gte',
  label: 'Enter an amount',
  hint: 'Minimum order: £100',
  prefix: { text: '£' },
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter an amount',
    }),
    validation({
      when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.GreaterThanOrEqual(100)),
      message: 'Enter an amount of £100 or more',
    }),
  ],
})`,
        }),
      ],
    }),

    // Dynamic Comparison
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Comparison (Cross-Field)</h2>
        <p class="govuk-body">
          Condition arguments can be <strong>expressions</strong>, not just static values.
          This example validates that the maximum is greater than the minimum using
          <code>Condition.Number.GreaterThan(Answer('min'))</code>.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_dynamic_min',
        label: 'Minimum value',
        hint: 'Enter any number',
        inputMode: 'numeric',
        classes: 'govuk-input--width-5',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a minimum value',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.IsNumber()),
            message: 'Minimum must be a valid number',
          }),
        ],
      }),

      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'cond_dynamic_max',
        label: 'Maximum value',
        hint: 'Must be greater than minimum',
        inputMode: 'numeric',
        classes: 'govuk-input--width-5',
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a maximum value',
          }),
          validation({
            when: Self().pipe(Transformer.String.ToFloat()).not.match(Condition.Number.IsNumber()),
            message: 'Maximum must be a valid number',
          }),
          validation({
            when: and(
              Answer('cond_dynamic_min').match(Condition.IsRequired()),
              Self()
                .pipe(Transformer.String.ToFloat())
                .not.match(Condition.Number.GreaterThan(Answer('cond_dynamic_min').pipe(Transformer.String.ToFloat()))),
            ),
            message: 'Maximum must be greater than minimum',
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
          code: `// The maximum field validates against the minimum field's value
field<GovUKTextInput>({
  code: 'max',
  label: 'Maximum value',
  validate: [
    validation({
      when: and(
        Answer('min').match(Condition.IsRequired()),
        Self()
          .pipe(Transformer.String.ToFloat())
          .not.match(
            // Dynamic argument: compare against another field!
            Condition.Number.GreaterThan(
              Answer('min').pipe(Transformer.String.ToFloat())
            )
          )
      ),
      message: 'Maximum must be greater than minimum',
    }),
  ],
})`,
        }),
      ],
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <div class="govuk-inset-text">
          <strong>Other dynamic argument examples:</strong>
          <ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">
            <li><code>Condition.Number.Between(Data('limits.min'), Data('limits.max'))</code></li>
            <li><code>Condition.String.HasMaxLength(Answer('charLimit'))</code></li>
            <li><code>Condition.Date.IsAfter(Answer('startDate'))</code></li>
          </ul>
        </div>
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
              href: '/forms/form-engine-developer-guide/conditions/playground/strings',
              labelText: 'String Conditions',
            },
            next: {
              href: '/forms/form-engine-developer-guide/conditions/playground/dates',
              labelText: 'Date Conditions',
            },
          }),
        ],
      },
    }),
  ],
})
