import { step, block, field, validation, Self, Answer, submitTransition, Format } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Transformers Playground - Strings
 *
 * Interactive examples of string transformers.
 * Submit the form to see the transformed values.
 */
export const stringsStep = step({
  path: '/strings',
  title: 'String Transformers',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">String Transformers Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see string transformers in action. Submit the form
          to apply the transformers and see the cleaned values.
        </p>
      `,
    }),

    // Trim
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.Trim()</h2>
        <p class="govuk-body">
          Add spaces before or after your text (e.g., "  hello  ") and submit.
          The whitespace will be removed.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_trim',
        label: 'Enter text with extra spaces',
        hint: 'Try "  hello world  "',
        formatters: [Transformer.String.Trim()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter some text',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
          Answer('transformers_trim'),
        ),
        hidden: Answer('transformers_trim').not.match(Condition.IsRequired()),
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
  code: 'transformers_trim',
  label: 'Enter text with extra spaces',
  formatters: [Transformer.String.Trim()],
})`,
        }),
      ],
    }),

    // ToUpperCase
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.ToUpperCase()</h2>
        <p class="govuk-body">
          Enter lowercase text and submit. Useful for postcodes and reference codes.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_upper',
        label: 'Enter a postcode',
        hint: 'Try "sw1a 2aa"',
        classes: 'govuk-input--width-10',
        formatters: [Transformer.String.Trim(), Transformer.String.ToUpperCase()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a postcode',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
          Answer('transformers_upper'),
        ),
        hidden: Answer('transformers_upper').not.match(Condition.IsRequired()),
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
  code: 'transformers_upper',
  label: 'Enter a postcode',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToUpperCase(),
  ],
})`,
        }),
      ],
    }),

    // ToLowerCase
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.ToLowerCase()</h2>
        <p class="govuk-body">
          Enter mixed case text and submit. Useful for email addresses.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_lower',
        label: 'Enter an email address',
        hint: 'Try "John.Smith@Example.COM"',
        inputType: 'email',
        formatters: [Transformer.String.Trim(), Transformer.String.ToLowerCase()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter an email address',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
          Answer('transformers_lower'),
        ),
        hidden: Answer('transformers_lower').not.match(Condition.IsRequired()),
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
  code: 'transformers_lower',
  label: 'Enter an email address',
  inputType: 'email',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToLowerCase(),
  ],
})`,
        }),
      ],
    }),

    // ToTitleCase
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.ToTitleCase()</h2>
        <p class="govuk-body">
          Enter text and submit to capitalise the first letter of each word.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_title',
        label: 'Enter a name',
        hint: 'Try "john smith"',
        formatters: [Transformer.String.Trim(), Transformer.String.ToTitleCase()],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a name',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
          Answer('transformers_title'),
        ),
        hidden: Answer('transformers_title').not.match(Condition.IsRequired()),
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
  code: 'transformers_title',
  label: 'Enter a name',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToTitleCase(),
  ],
})`,
        }),
      ],
    }),

    // Replace
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.Replace()</h2>
        <p class="govuk-body">
          Enter a phone number with spaces or dashes. The transformer removes them.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_replace',
        label: 'Enter a phone number',
        hint: 'Try "07700 900-123"',
        inputType: 'tel',
        formatters: [
          Transformer.String.Trim(),
          Transformer.String.Replace(' ', ''),
          Transformer.String.Replace('-', ''),
        ],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a phone number',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
          Answer('transformers_replace'),
        ),
        hidden: Answer('transformers_replace').not.match(Condition.IsRequired()),
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
  code: 'transformers_replace',
  label: 'Enter a phone number',
  inputType: 'tel',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.Replace(' ', ''),
    Transformer.String.Replace('-', ''),
  ],
})`,
        }),
      ],
    }),

    // PadStart
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.PadStart()</h2>
        <p class="govuk-body">
          Enter a short number. PadStart adds leading zeros to reach 5 characters.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_padstart',
        label: 'Enter a reference number',
        hint: 'Try "42"',
        classes: 'govuk-input--width-10',
        formatters: [Transformer.String.Trim(), Transformer.String.PadStart(5, '0')],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter a reference number',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
          Answer('transformers_padstart'),
        ),
        hidden: Answer('transformers_padstart').not.match(Condition.IsRequired()),
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
  code: 'transformers_padstart',
  label: 'Enter a reference number',
  hint: 'Try "42"',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.PadStart(5, '0'),  // "42" → "00042"
  ],
})`,
        }),
      ],
    }),

    // Substring
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.Substring()</h2>
        <p class="govuk-body">
          Enter a long string. Substring extracts the first 10 characters.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        code: 'transformers_substring',
        label: 'Enter some text',
        hint: 'Try "This is a very long string that will be truncated"',
        formatters: [Transformer.String.Trim(), Transformer.String.Substring(0, 10)],
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter some text',
          }),
        ],
      }),

      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
          Answer('transformers_substring'),
        ),
        hidden: Answer('transformers_substring').not.match(Condition.IsRequired()),
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
  code: 'transformers_substring',
  label: 'Enter some text',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.Substring(0, 10),  // First 10 characters
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
              href: '/forms/form-engine-developer-guide/transformers/playground/intro',
              labelText: 'Playground Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/transformers/playground/numbers',
              labelText: 'Number Transformers',
            },
          }),
        ],
      },
    }),
  ],
})
