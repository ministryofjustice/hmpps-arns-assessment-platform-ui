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
 * Transformers Playground - Strings
 *
 * Interactive examples of string transformers.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
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
    ],
    trimCode: [
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
    ],
    upperExample: [
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
    ],
    upperCode: [
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
    ],
    lowerExample: [
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
    ],
    lowerCode: [
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
    ],
    titleExample: [
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
    ],
    titleCode: [
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
    ],
    replaceExample: [
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
    ],
    replaceCode: [
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
    ],
    padStartExample: [
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
    ],
    padStartCode: [
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
    ],
    substringExample: [
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
    ],
    substringCode: [
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
    ],
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
})
