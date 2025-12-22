import { block, field, validation, Self, Answer, Format } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import {
  GovUKTextInput,
  GovUKCheckboxInput,
  GovUKDetails,
  GovUKPagination,
} from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components/code-block/codeBlock'
import { exampleBox } from '../../../../../helpers/exampleBox'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Transformers Playground - Arrays
 *
 * Interactive examples of array transformers.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Array Transformers Playground

  Try these fields to see array transformers in action. Submit the form
  to apply the transformers and see the results. {.lead}

  <div class="govuk-inset-text">
    <strong>Note:</strong> Array transformers work with arrays from checkboxes
    or strings converted to arrays using <code>Transformer.String.ToArray()</code>.
  </div>

  ---

  ## Transformer.String.ToArray()

  Enter comma-separated values. ToArray splits them into an array.

  {{slot:toArrayExample}}

  {{slot:toArrayCode}}

  ---

  ## Transformer.Array.Join()

  Select multiple options. Join converts the array back to a string.

  {{slot:joinExample}}

  {{slot:joinCode}}

  ---

  ## Transformer.Array.Length()

  Select options to see the count. Length returns the number of items.

  {{slot:lengthExample}}

  {{slot:lengthCode}}

  ---

  ## Transformer.Array.First()

  Enter comma-separated values. First returns the first item in the array.

  {{slot:firstExample}}

  {{slot:firstCode}}

  ---

  ## Transformer.Array.Last()

  Enter comma-separated values. Last returns the last item in the array.

  {{slot:lastExample}}

  {{slot:lastCode}}

  ---

  ## Transformer.Array.Reverse()

  Enter items to see them reversed.

  {{slot:reverseExample}}

  {{slot:reverseCode}}

  ---

  ## Transformer.Array.Slice()

  Enter several items. Slice extracts the first 3.

  {{slot:sliceExample}}

  {{slot:sliceCode}}

  ---

  ## Transformer.Array.Unique()

  Enter items with duplicates. Unique removes them.

  {{slot:uniqueExample}}

  {{slot:uniqueCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    toArrayExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_toarray',
          label: 'Enter tags (comma-separated)',
          hint: 'Try "red, green, blue"',
          formatters: [Transformer.String.Trim(), Transformer.String.ToArray(',')],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter at least one tag',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Array: <code>%1</code> (%2 items)</div>',
            Answer('transformers_toarray').pipe(Transformer.Array.Join(', ')),
            Answer('transformers_toarray').pipe(Transformer.Array.Length()),
          ),
          hidden: Answer('transformers_toarray').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    toArrayCode: [
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
            code: 'transformers_toarray',
            label: 'Enter tags (comma-separated)',
            formatters: [
              Transformer.String.Trim(),
              Transformer.String.ToArray(','),  // "red, green, blue" → ["red", " green", " blue"]
            ],
          })
        `,
          }),
        ],
      }),
    ],
    joinExample: [
      exampleBox([
        field<GovUKCheckboxInput>({
          variant: 'govukCheckboxInput',
          code: 'transformers_join',
          multiple: true,
          fieldset: {
            legend: { text: 'Select your favourite colours' },
          },
          items: [
            { value: 'red', text: 'Red' },
            { value: 'green', text: 'Green' },
            { value: 'blue', text: 'Blue' },
            { value: 'yellow', text: 'Yellow' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select at least one colour',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Joined string: <code>"%1"</code></div>',
            Answer('transformers_join').pipe(Transformer.Array.Join(', ')),
          ),
          hidden: Answer('transformers_join').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    joinCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          // In a pipe chain for display
          Answer('colours').pipe(
            Transformer.Array.Join(', '),  // ["red", "green"] → "red, green"
          )

          // Different separators
          Transformer.Array.Join(' | ')   // ["a", "b", "c"] → "a | b | c"
          Transformer.Array.Join('')      // ["a", "b", "c"] → "abc"
        `,
          }),
        ],
      }),
    ],
    lengthExample: [
      exampleBox([
        field<GovUKCheckboxInput>({
          variant: 'govukCheckboxInput',
          code: 'transformers_length',
          multiple: true,
          fieldset: {
            legend: { text: 'Select your interests' },
          },
          items: [
            { value: 'sports', text: 'Sports' },
            { value: 'music', text: 'Music' },
            { value: 'reading', text: 'Reading' },
            { value: 'cooking', text: 'Cooking' },
            { value: 'travel', text: 'Travel' },
          ],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Select at least one interest',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">You selected <code>%1</code> interest(s)</div>',
            Answer('transformers_length').pipe(Transformer.Array.Length()),
          ),
          hidden: Answer('transformers_length').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    lengthCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          // Get the number of selected items
          Answer('interests').pipe(
            Transformer.Array.Length(),  // ["sports", "music"] → 2
          )
        `,
          }),
        ],
      }),
    ],
    firstExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_first',
          label: 'Enter items (comma-separated)',
          hint: 'Try "apple, banana, cherry, date"',
          formatters: [Transformer.String.Trim(), Transformer.String.ToArray(',')],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter at least one item',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">First item: <code>%1</code></div>',
            Answer('transformers_first').pipe(Transformer.Array.First()),
          ),
          hidden: Answer('transformers_first').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    firstCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          Answer('transformers_first').pipe(
            Transformer.Array.First(),  // ["apple", "banana", "cherry"] → "apple"
          )
        `,
          }),
        ],
      }),
    ],
    lastExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_last',
          label: 'Enter items (comma-separated)',
          hint: 'Try "apple, banana, cherry, date"',
          formatters: [Transformer.String.Trim(), Transformer.String.ToArray(',')],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter at least one item',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            '<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">Last item: <code>%1</code></div>',
            Answer('transformers_last').pipe(Transformer.Array.Last()),
          ),
          hidden: Answer('transformers_last').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    lastCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          Answer('transformers_last').pipe(
            Transformer.Array.Last(),  // ["apple", "banana", "cherry"] → "cherry"
          )
        `,
          }),
        ],
      }),
    ],
    reverseExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_reverse',
          label: 'Enter items (comma-separated)',
          hint: 'Try "1, 2, 3, 4, 5"',
          formatters: [Transformer.String.Trim(), Transformer.String.ToArray(',')],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter at least one item',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            Original: <code>%1</code><br>
            Reversed: <code>%2</code>
          </div>`,
            Answer('transformers_reverse').pipe(Transformer.Array.Join(', ')),
            Answer('transformers_reverse').pipe(Transformer.Array.Reverse(), Transformer.Array.Join(', ')),
          ),
          hidden: Answer('transformers_reverse').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    reverseCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          Answer('transformers_reverse').pipe(
            Transformer.Array.Reverse(),  // ["1", "2", "3"] → ["3", "2", "1"]
          )
        `,
          }),
        ],
      }),
    ],
    sliceExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_slice',
          label: 'Enter items (comma-separated)',
          hint: 'Try "a, b, c, d, e, f"',
          formatters: [Transformer.String.Trim(), Transformer.String.ToArray(',')],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter at least one item',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            Full array: <code>%1</code><br>
            First 3: <code>%2</code>
          </div>`,
            Answer('transformers_slice').pipe(Transformer.Array.Join(', ')),
            Answer('transformers_slice').pipe(Transformer.Array.Slice(0, 3), Transformer.Array.Join(', ')),
          ),
          hidden: Answer('transformers_slice').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    sliceCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          Answer('transformers_slice').pipe(
            Transformer.Array.Slice(0, 3),  // ["a","b","c","d","e"] → ["a","b","c"]
          )
        `,
          }),
        ],
      }),
    ],
    uniqueExample: [
      exampleBox([
        field<GovUKTextInput>({
          variant: 'govukTextInput',
          code: 'transformers_unique',
          label: 'Enter items (comma-separated)',
          hint: 'Try "apple, banana, apple, cherry, banana"',
          formatters: [Transformer.String.Trim(), Transformer.String.ToArray(',')],
          validate: [
            validation({
              when: Self().not.match(Condition.IsRequired()),
              message: 'Enter at least one item',
            }),
          ],
        }),
        block<HtmlBlock>({
          variant: 'html',
          content: Format(
            `<div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            With duplicates: <code>%1</code> (%2 items)<br>
            Unique only: <code>%3</code> (%4 items)
          </div>`,
            Answer('transformers_unique').pipe(Transformer.Array.Join(', ')),
            Answer('transformers_unique').pipe(Transformer.Array.Length()),
            Answer('transformers_unique').pipe(Transformer.Array.Unique(), Transformer.Array.Join(', ')),
            Answer('transformers_unique').pipe(Transformer.Array.Unique(), Transformer.Array.Length()),
          ),
          hidden: Answer('transformers_unique').not.match(Condition.IsRequired()),
        }),
      ]),
    ],
    uniqueCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
          Answer('transformers_unique').pipe(
            Transformer.Array.Unique(),  // ["apple","banana","apple"] → ["apple","banana"]
          )
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
          href: '/forms/form-engine-developer-guide/transformers/playground/numbers',
          labelText: 'Number Transformers',
        },
        next: {
          href: '/forms/form-engine-developer-guide/generators/intro',
          labelText: 'Generators',
        },
      }),
    ],
  },
})
