import { validation, Self, Answer, Format } from '@form-engine/form/builders'
import { TemplateWrapper, HtmlBlock } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKTextInput, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Transformers Playground - Strings
 *
 * Interactive examples of string transformers.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # String Transformers Playground

  Try these fields to see string transformers in action. Submit the form
  to apply the transformers and see the cleaned values. {.lead}

  ---

  ## Transformer.String.Trim()

  Add spaces before or after your text (e.g., "  hello  ") and submit.
  The whitespace will be removed.

  {{slot:trimExample}}

  {{slot:trimCode}}

  ---

  ## Transformer.String.ToUpperCase()

  Enter lowercase text and submit. Useful for postcodes and reference codes.

  {{slot:upperExample}}

  {{slot:upperCode}}

  ---

  ## Transformer.String.ToLowerCase()

  Enter mixed case text and submit. Useful for email addresses.

  {{slot:lowerExample}}

  {{slot:lowerCode}}

  ---

  ## Transformer.String.ToTitleCase()

  Enter text and submit to capitalise the first letter of each word.

  {{slot:titleExample}}

  {{slot:titleCode}}

  ---

  ## Transformer.String.Replace()

  Enter a phone number with spaces or dashes. The transformer removes them.

  {{slot:replaceExample}}

  {{slot:replaceCode}}

  ---

  ## Transformer.String.PadStart()

  Enter a short number. PadStart adds leading zeros to reach 5 characters.

  {{slot:padStartExample}}

  {{slot:padStartCode}}

  ---

  ## Transformer.String.Substring()

  Enter a long string. Substring extracts the first 10 characters.

  {{slot:substringExample}}

  {{slot:substringCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    trimExample: [
      exampleBox([
        GovUKTextInput({
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
        HtmlBlock({
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
            Answer('transformers_trim'),
          ),
          hidden: Answer('transformers_trim').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    trimCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
              code: 'transformers_trim',
              label: 'Enter text with extra spaces',
              formatters: [Transformer.String.Trim()],
            })`,
          }),
        ],
      }),
    ],
    upperExample: [
      exampleBox([
        GovUKTextInput({
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
        HtmlBlock({
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
            Answer('transformers_upper'),
          ),
          hidden: Answer('transformers_upper').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    upperCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
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
    ],
    lowerExample: [
      exampleBox([
        GovUKTextInput({
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
        HtmlBlock({
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
            Answer('transformers_lower'),
          ),
          hidden: Answer('transformers_lower').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    lowerCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
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
    ],
    titleExample: [
      exampleBox([
        GovUKTextInput({
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
        HtmlBlock({
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
            Answer('transformers_title'),
          ),
          hidden: Answer('transformers_title').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    titleCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
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
    ],
    replaceExample: [
      exampleBox([
        GovUKTextInput({
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
        HtmlBlock({
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
            Answer('transformers_replace'),
          ),
          hidden: Answer('transformers_replace').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    replaceCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
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
    ],
    padStartExample: [
      exampleBox([
        GovUKTextInput({
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
        HtmlBlock({
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
            Answer('transformers_padstart'),
          ),
          hidden: Answer('transformers_padstart').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    padStartCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
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
    ],
    substringExample: [
      exampleBox([
        GovUKTextInput({
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
        HtmlBlock({
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Transformed value: <code>"%1"</code></div>',
            Answer('transformers_substring'),
          ),
          hidden: Answer('transformers_substring').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    substringCode: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `GovUKTextInput({
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
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/transformers/playground/intro',
          labelText: 'Playground Hub',
        },
        next: {
          href: '/form-engine-developer-guide/transformers/playground/numbers',
          labelText: 'Number Transformers',
        },
      }),
    ],
  },
})
