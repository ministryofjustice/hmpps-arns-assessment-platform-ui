import { Format, Item, Literal, Iterator, when, and, not } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper, CollectionBlock } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

const users = [
  { id: 'user_1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', active: true },
  { id: 'user_2', name: 'Bob Smith', email: 'bob@example.com', role: 'editor', active: true },
  { id: 'user_3', name: 'Carol Williams', email: 'carol@example.com', role: 'viewer', active: false },
  { id: 'user_4', name: 'David Brown', email: 'david@example.com', role: 'editor', active: true },
]

const tasks = [
  { id: 'task_1', task: 'Review pull request', status: 'completed', priority: 'high', assignee: 'user_1' },
  { id: 'task_2', task: 'Update documentation', status: 'in_progress', priority: 'normal', assignee: 'user_2' },
  { id: 'task_3', task: 'Fix login bug', status: 'pending', priority: 'high', assignee: 'user_1' },
  { id: 'task_4', task: 'Refactor API module', status: 'in_progress', priority: 'high', assignee: 'user_4' },
  { id: 'task_5', task: 'Write unit tests', status: 'pending', priority: 'normal', assignee: 'user_3' },
]

const categories = [
  { id: 'cat_1', name: 'Development', color: 'blue', icon: '💻' },
  { id: 'cat_2', name: 'Design', color: 'purple', icon: '🎨' },
  { id: 'cat_3', name: 'Testing', color: 'green', icon: '🧪' },
  { id: 'cat_4', name: 'Documentation', color: 'yellow', icon: '📝' },
]

/**
 * Iterators Playground - Find Examples
 *
 * Interactive examples of Iterator.Find for looking up single items.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Iterator.Find Examples

  See \`Iterator.Find\` in action. Unlike Filter (which returns an array),
  Find returns the **first matching item** or \`undefined\`. {.lead}

  ---

  ## 1. Existence Check

  Use \`.match(Condition.IsRequired())\` to check if a matching item exists.
  The panel below appears because we found a high-priority task:

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## 2. Conditional Content Based on Find Result

  Show different content based on whether a matching item exists:

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## 3. Using when() with Iterator.Find

  Dynamically choose content based on whether an item is found:

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## 4. Filter Then Find

  Chain \`Iterator.Filter\` with \`Iterator.Find\` for precise lookups.
  First filter to active users, then find the first editor:

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  ## 5. Multiple Condition Checks

  Use \`and()\` to combine multiple Find existence checks:

  {{slot:example5}}

  {{slot:example5Code}}

  ---

  ## 6. Real World: Category Status Indicator

  For each category, display with styling:

  {{slot:example6}}

  {{slot:example6Code}}

  ---

  ## Iterator.Find Patterns

  | Pattern | Usage |
  |---------|-------|
  | **Lookup by ID** | \`.each(Iterator.Find(Item().path('id').match(Condition.Equals(...))))\` |
  | **Existence check** | \`.each(Iterator.Find(...)).match(Condition.IsRequired())\` |
  | **Hidden when not found** | \`hidden: ...each(Iterator.Find(...)).not.match(Condition.IsRequired())\` |
  | **Filter then find** | \`.each(Iterator.Filter(...)).each(Iterator.Find(...))\` |

  > **Note:** \`Iterator.Find\` returns a single item or \`undefined\`.
  > Use \`.match(Condition.IsRequired())\` to check if an item was found.

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      HtmlBlock({
        hidden: Literal(tasks)
          .each(Iterator.Find(Item().path('priority').match(Condition.Equals('high'))))
          .not.match(Condition.IsRequired()),
        content: `
          <div class="govuk-warning-text govuk-!-margin-bottom-4">
            <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
            <strong class="govuk-warning-text__text">
              <span class="govuk-visually-hidden">Warning</span>
              High priority tasks found! Requires immediate attention.
            </strong>
          </div>
        `,
      }),
    ],
    example1Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Show warning if high priority task exists
              HtmlBlock({
                // Hidden when NO high priority task found
                hidden: Literal(tasks)
                  .each(Iterator.Find(
                    Item().path('priority').match(Condition.Equals('high'))
                  ))
                  .not.match(Condition.IsRequired()),
                content: '<div class="govuk-warning-text">High priority tasks found!</div>',
              })
            `,
          }),
        ],
      }),
    ],
    example2: [
      HtmlBlock({
        hidden: Literal(tasks)
          .each(Iterator.Find(Item().path('status').match(Condition.Equals('pending'))))
          .not.match(Condition.IsRequired()),
        content: `
          <div class="govuk-inset-text govuk-!-margin-bottom-4">
            <strong>Pending tasks exist.</strong> Some tasks are waiting to be started.
          </div>
        `,
      }),
    ],
    example2Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Show message when pending tasks exist
              HtmlBlock({
                // Hidden when NO pending task found
                hidden: Literal(tasks)
                  .each(Iterator.Find(
                    Item().path('status').match(Condition.Equals('pending'))
                  ))
                  .not.match(Condition.IsRequired()),
                content: '<div>Pending tasks exist.</div>',
              })
            `,
          }),
        ],
      }),
    ],
    example3: [
      HtmlBlock({
        content: when(
          Literal(users)
            .each(Iterator.Find(Item().path('role').match(Condition.Equals('superadmin'))))
            .match(Condition.IsRequired()),
        )
          .then(
            '<div class="govuk-inset-text"><strong>Super admin found!</strong> Special permissions available.</div>',
          )
          .else(
            '<div class="govuk-inset-text"><em>No super admin in the system.</em> (This is expected - no user has role "superadmin")</div>',
          ),
      }),
    ],
    example3Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Use when() with Iterator.Find for conditional content
              HtmlBlock({
                content: when(
                  Literal(users)
                    .each(Iterator.Find(
                      Item().path('role').match(Condition.Equals('superadmin'))
                    ))
                    .match(Condition.IsRequired())
                )
                  .then('<div>Super admin found!</div>')
                  .else('<div>No super admin in the system.</div>'),
              })
            `,
          }),
        ],
      }),
    ],
    example4: [
      HtmlBlock({
        hidden: Literal(users)
          .each(Iterator.Filter(Item().path('active').match(Condition.Equals(true))))
          .each(Iterator.Find(Item().path('role').match(Condition.Equals('editor'))))
          .not.match(Condition.IsRequired()),
        content: `
          <div class="govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-4">
            <h2 class="govuk-panel__title">Active Editor Found!</h2>
            <div class="govuk-panel__body">
              Found an active user with the "editor" role.
            </div>
          </div>
        `,
      }),
    ],
    example4Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Filter first, then find (first active editor)
              Literal(users)
                .each(Iterator.Filter(
                  Item().path('active').match(Condition.Equals(true))
                ))
                .each(Iterator.Find(
                  Item().path('role').match(Condition.Equals('editor'))
                ))
            `,
          }),
        ],
      }),
    ],
    example5: [
      HtmlBlock({
        hidden: not(
          and(
            Literal(users)
              .each(Iterator.Find(Item().path('role').match(Condition.Equals('admin'))))
              .match(Condition.IsRequired()),
            Literal(tasks)
              .each(Iterator.Find(Item().path('priority').match(Condition.Equals('high'))))
              .match(Condition.IsRequired()),
          ),
        ),
        content: `
          <div class="govuk-inset-text govuk-!-margin-bottom-4">
            <strong>Admin available for high priority tasks!</strong>
            Both an admin user and high priority tasks exist in the system.
          </div>
        `,
      }),
    ],
    example5Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Show only if BOTH conditions are true
              HtmlBlock({
                // Hidden when NOT (admin exists AND high priority tasks exist)
                hidden: not(
                  and(
                    Literal(users)
                      .each(Iterator.Find(
                        Item().path('role').match(Condition.Equals('admin'))
                      ))
                      .match(Condition.IsRequired()),
                    Literal(tasks)
                      .each(Iterator.Find(
                        Item().path('priority').match(Condition.Equals('high'))
                      ))
                      .match(Condition.IsRequired())
                  )
                ),
                content: '<div>Admin available for high priority tasks!</div>',
              })
            `,
          }),
        ],
      }),
    ],
    example6: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(categories).each(
          Iterator.Map(
            Format(
              '<span class="govuk-tag govuk-tag--%1 govuk-!-margin-right-2 govuk-!-margin-bottom-2">%2 %3</span>',
              Item().path('color'),
              Item().path('icon'),
              Item().path('name'),
            ),
          ),
        ),
      }),
    ],
    example6Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Display categories with Iterator.Map
              Literal(categories).each(Iterator.Map(
                HtmlBlock({
                  content: Format(
                    '<span class="govuk-tag govuk-tag--%1">%2 %3</span>',
                    Item().path('color'),
                    Item().path('icon'),
                    Item().path('name')
                  ),
                })
              ))
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/iterators/playground/filter-examples',
          labelText: 'Filter Examples',
        },
        next: {
          href: '/form-engine-developer-guide/iterators/playground/dynamic-fields',
          labelText: 'Dynamic Fields',
        },
      }),
    ],
  },
})
