import { block, Item, Literal, Iterator } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

const tasks = [
  { task: 'Review pull request', status: 'completed', priority: 'high' },
  { task: 'Update documentation', status: 'in_progress', priority: 'normal' },
  { task: 'Fix login bug', status: 'pending', priority: 'high' },
  { task: 'Refactor API module', status: 'in_progress', priority: 'high' },
  { task: 'Write unit tests', status: 'pending', priority: 'normal' },
]

/**
 * Iterators - Find
 *
 * Using Iterator.Find to get the first matching item.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Iterator.Find

  \`Iterator.Find\` returns the **first item** where the predicate
  evaluates to true. Unlike \`Iterator.Filter\`, it returns a single item
  (or \`undefined\` if no match is found), not an array. {.lead}

  ---

  ## Basic Syntax

  Pass a predicate expression using \`Item()\` references:

  {{slot:syntaxCode}}

  > **Important:** Since \`Iterator.Find\` returns a single item (or undefined),
  > the result can be used directly in expressions or tested with conditions.

  ---

  ## Using Find for Conditional Display

  Use \`Iterator.Find\` with \`.match(Condition.IsRequired())\`
  to check if a matching item exists:

  {{slot:conditionalCode}}

  ---

  ## Live Example: Conditional Content

  This panel only appears because we found a high priority task in the data:

  {{slot:liveExample}}

  {{slot:liveExampleCode}}

  ---

  ## Common Patterns

  ### Lookup by ID

  A common use case is looking up an item by its ID, typically from URL parameters:

  {{slot:lookupCode}}

  ### Find First Match

  Get the first item matching a status or priority:

  {{slot:firstMatchCode}}

  ---

  ## Filter vs Find

  | Aspect | Iterator.Filter | Iterator.Find |
  |--------|-----------------|---------------|
  | **Returns** | Array of all matching items | First matching item (or undefined) |
  | **Use case** | Display lists, filter options | Lookup by ID, check existence |
  | **Chaining** | Can chain more iterators | Chain .match() to check existence |

  ---

  {{slot:pagination}}
`),
  slots: {
    syntaxCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `// Find user by ID
Data('users').each(Iterator.Find(
  Item().path('id').match(Condition.Equals(Params('userId')))
))

// Find first active item
Data('items').each(Iterator.Find(
  Item().path('status').match(Condition.Equals('active'))
))`,
      }),
    ],
    conditionalCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `// Show content only when an item is found
block<HtmlBlock>({
  variant: 'html',
  dependent: when(
    Data('users')
      .each(Iterator.Find(Item().path('id').match(Condition.Equals(Params('userId')))))
      .match(Condition.IsRequired())
  ),
  content: 'User found!',
})

// Show warning when no high priority tasks exist
block<HtmlBlock>({
  variant: 'html',
  dependent: when(
    Data('tasks')
      .each(Iterator.Find(Item().path('priority').match(Condition.Equals('high'))))
      .not.match(Condition.IsRequired())
  ),
  content: 'No urgent tasks - all clear!',
})`,
      }),
    ],
    liveExample: [
      block<HtmlBlock>({
        variant: 'html',
        hidden: Literal(tasks)
          .each(Iterator.Find(Item().path('priority').match(Condition.Equals('high'))))
          .not.match(Condition.IsRequired()),
        content: `
          <div class="govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-4">
            <h2 class="govuk-panel__title">High Priority Task Found!</h2>
            <div class="govuk-panel__body">
              There is at least one high priority task in the system.
            </div>
          </div>
        `,
      }),
    ],
    liveExampleCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `const tasks = [
  { task: 'Review pull request', status: 'completed', priority: 'high' },
  { task: 'Update documentation', status: 'in_progress', priority: 'normal' },
  { task: 'Fix login bug', status: 'pending', priority: 'high' },
  // ...
]

block<HtmlBlock>({
  variant: 'html',
  // Hidden when NO high priority task is found
  hidden: Literal(tasks)
    .each(Iterator.Find(Item().path('priority').match(Condition.Equals('high'))))
    .not.match(Condition.IsRequired()),
  content: '<div class="govuk-panel">High Priority Task Found!</div>',
})`,
          }),
        ],
      }),
    ],
    lookupCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `// Find item by ID from URL parameter
const selectedItem = Data('categories')
  .each(Iterator.Find(
    Item().path('id').match(Condition.Equals(Params('categoryId')))
  ))

// Use in conditional display
block<HtmlBlock>({
  variant: 'html',
  dependent: when(selectedItem.match(Condition.IsRequired())),
  content: 'Category found - showing details...',
})`,
      }),
    ],
    firstMatchCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `// Find first pending task
Data('tasks').each(Iterator.Find(
  Item().path('status').match(Condition.Equals('pending'))
))

// Find first item in a specific category
Data('products').each(Iterator.Find(
  Item().path('category').match(Condition.Equals('electronics'))
))`,
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/filter',
          labelText: 'Iterator.Filter',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/chaining',
          labelText: 'Chaining Iterators',
        },
      }),
    ],
  },
})
