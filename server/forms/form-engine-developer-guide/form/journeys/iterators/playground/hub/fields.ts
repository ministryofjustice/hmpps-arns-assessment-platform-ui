import { block, Format, Item, Data, Iterator, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKButton, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Iterators Playground - Hub (CRUD Demo)
 *
 * Interactive task list demonstrating the hub-and-spoke pattern
 * using Iterator syntax instead of Collection().
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
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

  This page uses \`Iterator.Map\` instead of \`Collection()\`.
  The key difference is the chainable, composable API.

  {{slot:iteratorCode}}

  {{slot:collectionCode}}

  ### Key Differences

  | Aspect | Collection() | Iterator.Map |
  |--------|--------------|--------------|
  | **Syntax** | Object config with template array | Chainable \`.each()\` method |
  | **Chaining** | Filter/map in single expression | Separate \`.each()\` calls |
  | **Array transforms** | Limited options | \`.pipe()\` for slice, flatten, etc. |

  ---

  {{slot:pagination}}
`),
  slots: {
    emptyState: [
      block<HtmlBlock>({
        variant: 'html',
        hidden: Data('playgroundItems').match(Condition.IsRequired()),
        content: `
          <div class="govuk-inset-text">
            <p class="govuk-body">No tasks yet. Click "Add task" to create one.</p>
          </div>
        `,
      }),
    ],
    taskList: [
      block<CollectionBlock>({
        variant: 'collection-block',
        collection: Data('playgroundItems').each(
          Iterator.Map(
            block<HtmlBlock>({
              variant: 'html',
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
      block<TemplateWrapper>({
        variant: 'templateWrapper',
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
            block<GovUKButton>({
              variant: 'govukButton',
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
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View Iterator version code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              // Using Iterator.Map instead of Collection()

              // Empty state - shown when array is empty/undefined
              block<HtmlBlock>({
                variant: 'html',
                hidden: Data('playgroundItems').match(Condition.IsRequired()),
                content: '<p>No tasks yet.</p>',
              })

              // Task list using Iterator.Map
              block<CollectionBlock>({
                variant: 'collection-block',
                collection: Data('playgroundItems').each(
                  Iterator.Map(
                    block<HtmlBlock>({
                      variant: 'html',
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
    collectionCode: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'Compare with Collection() syntax',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              // Collection() syntax (older approach)
              block<CollectionBlock>({
                variant: 'collection-block',
                collection: Collection({
                  collection: Data('playgroundItems'),
                  template: [
                    block<HtmlBlock>({
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
                    }),
                  ],
                  fallback: [
                    block<HtmlBlock>({
                      content: '<p>No tasks yet.</p>',
                    }),
                  ],
                }),
              })
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
          href: '/forms/form-engine-developer-guide/iterators/playground/chaining-examples',
          labelText: 'Chaining Examples',
        },
      }),
    ],
  },
})
