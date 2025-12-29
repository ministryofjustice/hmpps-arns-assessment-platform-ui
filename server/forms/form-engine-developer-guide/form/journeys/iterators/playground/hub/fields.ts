import { Format, Item, Data, Iterator, when } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper, CollectionBlock } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKButton, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Iterators Playground - Hub (CRUD Demo)
 *
 * Interactive task list demonstrating the hub-and-spoke pattern
 * using Iterator syntax.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Task Manager

  A hub-and-spoke demo using \`Iterator\` syntax for managing a list of tasks. {.lead}

  > **Try it:** Click "Add task" to create a new task, or "Edit" to modify an existing one.
  > Changes persist in your session.

  ---

  ## Your tasks

  {{slot:emptyState}}

  {{slot:taskList}}

  {{slot:buttons}}

  ---

  ## How this works

  This page uses \`Iterator.Map\` with a chainable, composable API.

  {{slot:iteratorCode}}

  ### Key Features

  | Feature | Description |
  |---------|-------------|
  | **Chainable** | Each operation is a separate \`.each()\` call |
  | **Composable** | Easy to add, remove, or reorder operations |
  | **Array transforms** | Use \`.pipe()\` for slice, flatten, etc. |

  ---

  {{slot:pagination}}
`),
  slots: {
    emptyState: [
      HtmlBlock({
        hidden: Data('playgroundItems').match(Condition.IsRequired()),
        content: `
          <div class="govuk-inset-text">
            <p class="govuk-body">No tasks yet. Click "Add task" to create one.</p>
          </div>
        `,
      }),
    ],
    taskList: [
      CollectionBlock({
        collection: Data('playgroundItems').each(
          Iterator.Map(
            HtmlBlock({
              content: Format(
                `<div class="govuk-summary-card govuk-!-margin-bottom-3">
                  <div class="govuk-summary-card__title-wrapper">
                    <h3 class="govuk-summary-card__title">%1</h3>
                    <ul class="govuk-summary-card__actions">
                      <li class="govuk-summary-card__action">
                        <a href="hub/%2/edit" class="govuk-link">Edit<span class="govuk-visually-hidden"> %1</span></a>
                      </li>
                    </ul>
                  </div>
                  <div class="govuk-summary-card__content">
                    <dl class="govuk-summary-list">
                      <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Description</dt>
                        <dd class="govuk-summary-list__value">%3</dd>
                      </div>
                      <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Category</dt>
                        <dd class="govuk-summary-list__value">%4</dd>
                      </div>
                      <div class="govuk-summary-list__row">
                        <dt class="govuk-summary-list__key">Priority</dt>
                        <dd class="govuk-summary-list__value">%5</dd>
                      </div>
                    </dl>
                  </div>
                </div>`,
                Item().path('name'),
                Item().path('id'),
                when(Item().path('description').match(Condition.IsRequired()))
                  .then(Item().path('description'))
                  .else('<em class="govuk-hint">No description</em>'),
                when(Item().path('category').match(Condition.IsRequired()))
                  .then(Item().path('category'))
                  .else('<em class="govuk-hint">Uncategorized</em>'),
                when(Item().path('priority').match(Condition.Equals('high')))
                  .then('<strong class="govuk-tag govuk-tag--red">High</strong>')
                  .else(
                    when(Item().path('priority').match(Condition.Equals('medium')))
                      .then('<strong class="govuk-tag govuk-tag--yellow">Medium</strong>')
                      .else('<strong class="govuk-tag govuk-tag--grey">Low</strong>'),
                  ),
              ),
            }),
          ),
        ),
      }),
    ],
    buttons: [
      TemplateWrapper({
        template: `
          <form method="post">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            <div class="govuk-button-group govuk-!-margin-top-4">
              <a href="hub/new/edit" class="govuk-button govuk-button--secondary" role="button">
                Add task
              </a>
              {{slot:resetButton}}
            </div>
          </form>
        `,
        values: {
          csrfToken: Data('csrfToken'),
        },
        slots: {
          resetButton: [
            GovUKButton({
              text: 'Reset to defaults',
              name: 'action',
              value: 'reset',
              classes: 'govuk-button--warning',
            }),
          ],
        },
      }),
    ],
    iteratorCode: [
      GovUKDetails({
        summaryText: 'View Iterator version code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Using Iterator.Map

              // Empty state - shown when array is empty/undefined
              HtmlBlock({
                hidden: Data('playgroundItems').match(Condition.IsRequired()),
                content: '<p>No tasks yet.</p>',
              })

              // Task list using Iterator.Map
              CollectionBlock({
                collection: Data('playgroundItems').each(
                  Iterator.Map(
                    HtmlBlock({
                      content: Format(
                        \`<div class="govuk-summary-card">
                          <h3>%1</h3>
                          <a href="hub/%2/edit">Edit</a>
                          <p>%3</p>
                        </div>\`,
                        Item().path('name'),
                        Item().path('id'),
                        Item().path('description')
                      ),
                    })
                  )
                ),
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
          href: '/forms/form-engine-developer-guide/iterators/playground/chaining-examples',
          labelText: 'Chaining Examples',
        },
      }),
    ],
  },
})
