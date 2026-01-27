import { validation, Self, Answer, and } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Conditions Playground - Numbers
 *
 * Interactive examples of number conditions with validation.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Number Conditions Playground

  Try these fields to see number conditions in action. Submit the form to
  trigger validation and see error messages. {.lead}

  <div class="govuk-inset-text">
    <strong>Note:</strong> Text input values are strings. Use <code>.pipe(Transformer.String.ToInt())</code>
    or <code>.pipe(Transformer.String.ToFloat())</code> to convert before applying number conditions.
  </div>

  ---

  ## Condition.Number.IsNumber()

  Enter something that isn't a number (e.g., "abc") to see the validation error.

  {{slot:isNumberExample}}

  {{slot:isNumberCode}}

  ---

  ## Condition.Number.IsInteger()

  Enter a decimal number (e.g., "5.5") to see the validation error.

  {{slot:isIntegerExample}}

  {{slot:isIntegerCode}}

  ---

  ## Condition.Number.GreaterThan()

  Enter 10 or less to see the validation error.

  {{slot:greaterThanExample}}

  {{slot:greaterThanCode}}

  ---

  ## Condition.Number.LessThan()

  Enter 5 or more to see the validation error.

  {{slot:lessThanExample}}

  {{slot:lessThanCode}}

  ---

  ## Condition.Number.Between()

  Enter a number outside 18-65 to see the validation error.

  {{slot:betweenExample}}

  {{slot:betweenCode}}

  ---

  ## Condition.Number.GreaterThanOrEqual()

  Enter less than 100 to see the validation error. Try 99 vs 100.

  {{slot:gteExample}}

  {{slot:gteCode}}

  ---

  ## Dynamic Comparison (Cross-Field)

  Condition arguments can be **expressions**, not just static values.
  This example validates that the maximum is greater than the minimum using
  \`Condition.Number.GreaterThan(Answer('min'))\`.

  {{slot:dynamicExample}}

  {{slot:dynamicCode}}

  <div class="govuk-inset-text">
    <strong>Other dynamic argument examples:</strong>
    <ul class="govuk-list govuk-list--bullet govuk-!-margin-bottom-0">
      <li><code>Condition.Number.Between(Data('limits.min'), Data('limits.max'))</code></li>
      <li><code>Condition.String.HasMaxLength(Answer('charLimit'))</code></li>
      <li><code>Condition.Date.IsAfter(Answer('startDate'))</code></li>
    </ul>
  </div>

  ---

  {{slot:pagination}}
`),
  slots: {
    isNumberExample: [
      exampleBox([
        GovUKTextInput({
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
    ],
    isNumberCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    isIntegerExample: [
      exampleBox([
        GovUKTextInput({
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
    ],
    isIntegerCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    greaterThanExample: [
      exampleBox([
        GovUKTextInput({
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
    ],
    greaterThanCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    lessThanExample: [
      exampleBox([
        GovUKTextInput({
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
    ],
    lessThanCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    betweenExample: [
      exampleBox([
        GovUKTextInput({
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
    ],
    betweenCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    gteExample: [
      exampleBox([
        GovUKTextInput({
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
    ],
    gteCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    dynamicExample: [
      exampleBox([
        GovUKTextInput({
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
        GovUKTextInput({
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
                  .not.match(
                    Condition.Number.GreaterThan(Answer('cond_dynamic_min').pipe(Transformer.String.ToFloat())),
                  ),
              ),
              message: 'Maximum must be greater than minimum',
            }),
          ],
        }),
      ]),
    ],
    dynamicCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // The maximum field validates against the minimum field's value
              GovUKTextInput({
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
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/conditions/playground/strings',
          labelText: 'String Conditions',
        },
        next: {
          href: '/form-engine-developer-guide/conditions/playground/dates',
          labelText: 'Date Conditions',
        },
      }),
    ],
  },
})
