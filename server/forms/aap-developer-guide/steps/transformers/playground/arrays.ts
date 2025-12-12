import { step, block, field, validation, Self, Answer, submitTransition, Format } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import {
  GovUKTextInput,
  GovUKCheckboxInput,
  GovUKDetails,
  GovUKPagination,
} from '@form-engine-govuk-components/components'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Transformers Playground - Arrays
 *
 * Interactive examples of array transformers.
 * Submit the form to see the transformed values.
 */
export const arraysStep = step({
  path: '/arrays',
  title: 'Array Transformers',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Array Transformers Playground</h1>

        <p class="govuk-body-l">
          Try these fields to see array transformers in action. Submit the form
          to apply the transformers and see the results.
        </p>

        <div class="govuk-inset-text">
          <strong>Note:</strong> Array transformers work with arrays from checkboxes
          or strings converted to arrays using <code>Transformer.String.ToArray()</code>.
        </div>
      `,
    }),

    // ToArray (String → Array)
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.String.ToArray()</h2>
        <p class="govuk-body">
          Enter comma-separated values. ToArray splits them into an array.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_toarray',
  label: 'Enter tags (comma-separated)',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToArray(','),  // "red, green, blue" → ["red", " green", " blue"]
  ],
})`,
        }),
      ],
    }),

    // Join (Array → String)
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Array.Join()</h2>
        <p class="govuk-body">
          Select multiple options. Join converts the array back to a string.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `// In a pipe chain for display
Answer('colours').pipe(
  Transformer.Array.Join(', '),  // ["red", "green"] → "red, green"
)

// Different separators
Transformer.Array.Join(' | ')   // ["a", "b", "c"] → "a | b | c"
Transformer.Array.Join('')      // ["a", "b", "c"] → "abc"`,
        }),
      ],
    }),

    // Length
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Array.Length()</h2>
        <p class="govuk-body">
          Select options to see the count. Length returns the number of items.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `// Get the number of selected items
Answer('interests').pipe(
  Transformer.Array.Length(),  // ["sports", "music"] → 2
)

// Useful for validation messages
Format('You selected %1 item(s)',
  Answer('items').pipe(Transformer.Array.Length())
)`,
        }),
      ],
    }),

    // First
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Array.First()</h2>
        <p class="govuk-body">
          Enter comma-separated values. First returns the first item in the array.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_first',
  label: 'Enter items (comma-separated)',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToArray(','),  // Convert string to array first
  ],
})

// Then use Array.First() in a pipe to display
Answer('transformers_first').pipe(
  Transformer.Array.First(),  // ["apple", "banana", "cherry"] → "apple"
)`,
        }),
      ],
    }),

    // Last
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Array.Last()</h2>
        <p class="govuk-body">
          Enter comma-separated values. Last returns the last item in the array.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_last',
  label: 'Enter items (comma-separated)',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToArray(','),  // Convert string to array first
  ],
})

// Then use Array.Last() in a pipe to display
Answer('transformers_last').pipe(
  Transformer.Array.Last(),  // ["apple", "banana", "cherry"] → "cherry"
)`,
        }),
      ],
    }),

    // Reverse
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Array.Reverse()</h2>
        <p class="govuk-body">
          Enter items to see them reversed.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_reverse',
  label: 'Enter items (comma-separated)',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToArray(','),  // Convert string to array first
  ],
})

// Then use Array.Reverse() in a pipe to display
Answer('transformers_reverse').pipe(
  Transformer.Array.Reverse(),  // ["1", "2", "3"] → ["3", "2", "1"]
)`,
        }),
      ],
    }),

    // Slice
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Array.Slice()</h2>
        <p class="govuk-body">
          Enter several items. Slice extracts the first 3.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_slice',
  label: 'Enter items (comma-separated)',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToArray(','),  // Convert string to array first
  ],
})

// Then use Array.Slice() in a pipe to display
Answer('transformers_slice').pipe(
  Transformer.Array.Slice(0, 3),  // ["a","b","c","d","e"] → ["a","b","c"]
)`,
        }),
      ],
    }),

    // Unique
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Transformer.Array.Unique()</h2>
        <p class="govuk-body">
          Enter items with duplicates. Unique removes them.
        </p>
      `,
    }),

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

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'transformers_unique',
  label: 'Enter items (comma-separated)',
  formatters: [
    Transformer.String.Trim(),
    Transformer.String.ToArray(','),  // Convert string to array first
  ],
})

// Then use Array.Unique() in a pipe to display
Answer('transformers_unique').pipe(
  Transformer.Array.Unique(),  // ["apple","banana","apple"] → ["apple","banana"]
)`,
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
              href: '/forms/form-engine-developer-guide/transformers/playground/numbers',
              labelText: 'Number Transformers',
            },
            next: {
              href: '/forms/form-engine-developer-guide/effects/intro',
              labelText: 'Effects',
            },
          }),
        ],
      },
    }),
  ],
})
