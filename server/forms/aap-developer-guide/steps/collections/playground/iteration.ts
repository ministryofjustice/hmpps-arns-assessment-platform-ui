import { step, block, Format, Item, Collection, Data, when } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'

/**
 * Collections Playground - Iteration
 *
 * Interactive examples of Collection() and Item() expressions.
 */
export const iterationStep = step({
  path: '/iteration',
  title: 'Iteration Examples',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Collection Iteration Examples</h1>

        <p class="govuk-body-l">
          See <code>Collection()</code> and <code>Item()</code> in action.
          Each example shows live output with the code that generates it.
        </p>
      `,
    }),

    // Example 1: Simple list
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Simple List</h2>
        <p class="govuk-body">
          A basic numbered list using <code>Item().path()</code> and <code>Item().index()</code>:
        </p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      classes: 'govuk-!-margin-bottom-4',
      collection: Collection({
        collection: Data('simpleListItems'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              '<p class="govuk-body govuk-!-margin-bottom-1"><strong>%1.</strong> %2</p>',
              Item().index().pipe(Transformer.Number.Add(1)),
              Item().path('name'),
            ),
          }),
        ],
      }),
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    collection: [
      { name: 'Complete form-engine tutorial' },
      { name: 'Build a demo registration form' },
      { name: 'Add validation rules' },
      { name: 'Implement hub-and-spoke pattern' },
    ],
    template: [
      block<HtmlBlock>({
        content: Format(
          '<p><strong>%1.</strong> %2</p>',
          Item().index().pipe(Transformer.Number.Add(1)),
          Item().path('name')
        ),
      }),
    ],
  }),
})`,
        }),
      ],
    }),

    // Example 2: Table rows
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Table Rows</h2>
        <p class="govuk-body">
          Generate table rows from data:
        </p>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <table class="govuk-table">
          <caption class="govuk-table__caption govuk-table__caption--m">Team members</caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">#</th>
              <th scope="col" class="govuk-table__header">Name</th>
              <th scope="col" class="govuk-table__header">Role</th>
              <th scope="col" class="govuk-table__header">Status</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('tableRows'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<tr class="govuk-table__row">
                <td class="govuk-table__cell">%1</td>
                <td class="govuk-table__cell">%2</td>
                <td class="govuk-table__cell">%3</td>
                <td class="govuk-table__cell">%4</td>
              </tr>`,
              Item().index().pipe(Transformer.Number.Add(1)),
              Item().path('name'),
              Item().path('role'),
              when(Item().path('status').match(Condition.Equals('active')))
                .then('<strong class="govuk-tag govuk-tag--green">Active</strong>')
                .else('<strong class="govuk-tag govuk-tag--yellow">Away</strong>'),
            ),
          }),
        ],
      }),
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
          </tbody>
        </table>
      `,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `// Table body rows
block<CollectionBlock>({
  collection: Collection({
    collection: Data('teamMembers'),
    template: [
      block<HtmlBlock>({
        content: Format(
          \`<tr>
            <td>%1</td>
            <td>%2</td>
            <td>%3</td>
            <td>%4</td>
          </tr>\`,
          Item().index().pipe(Transformer.Number.Add(1)),
          Item().path('name'),
          Item().path('role'),
          when(Item().path('status').match(Condition.Equals('active')))
            .then('<span class="govuk-tag--green">Active</span>')
            .else('<span class="govuk-tag--yellow">Away</span>')
        ),
      }),
    ],
  }),
})`,
        }),
      ],
    }),

    // Example 3: Nested collections
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Nested Collections</h2>
        <p class="govuk-body">
          Categories with items, using <code>Item().parent.path()</code> to access outer scope:
        </p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('categories'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<div class="govuk-!-margin-bottom-4">
                <h3 class="govuk-heading-s govuk-!-margin-bottom-2">
                  <strong class="govuk-tag govuk-tag--%1 govuk-!-margin-right-2">%2</strong>
                </h3>`,
              Item().path('color'),
              Item().path('name'),
            ),
          }),
          block<CollectionBlock>({
            variant: 'collection-block',
            collection: Collection({
              collection: Item().path('tasks'),
              template: [
                block<HtmlBlock>({
                  variant: 'html',
                  content: Format(
                    `<p class="govuk-body govuk-!-margin-bottom-1 govuk-!-margin-left-4">
                      • %1 <em class="govuk-!-font-size-14">(Team: %2, Priority: %3)</em>
                    </p>`,
                    Item().path('name'),
                    Item().parent.path('name'),
                    Item().path('priority'),
                  ),
                }),
              ],
            }),
          }),
          block<HtmlBlock>({
            variant: 'html',
            content: '</div>',
          }),
        ],
      }),
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `// Outer collection: categories
Collection({
  collection: Data('categories'),
  template: [
    // Category header
    block<HtmlBlock>({
      content: Format('<h3>%1</h3>', Item().path('name')),
    }),

    // Inner collection: tasks
    block<CollectionBlock>({
      collection: Collection({
        collection: Item().path('tasks'),  // Iterate category.tasks
        template: [
          block<HtmlBlock>({
            content: Format(
              '<p>• %1 (Team: %2)</p>',
              Item().path('name'),         // Task name
              Item().parent.path('name')   // Category name (parent scope)
            ),
          }),
        ],
      }),
    }),
  ],
})`,
        }),
      ],
    }),

    // Example 4: Summary cards
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Summary Cards</h2>
        <p class="govuk-body">
          GOV.UK summary cards generated from data:
        </p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('articles'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<div class="govuk-summary-card govuk-!-margin-bottom-3">
                <div class="govuk-summary-card__title-wrapper">
                  <h3 class="govuk-summary-card__title">%1</h3>
                  <ul class="govuk-summary-card__actions">
                    <li class="govuk-summary-card__action">
                      %2
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
                      <dt class="govuk-summary-list__key">Views</dt>
                      <dd class="govuk-summary-list__value">%4</dd>
                    </div>
                  </dl>
                </div>
              </div>`,
              Item().path('title'),
              when(Item().path('status').match(Condition.Equals('published')))
                .then('<strong class="govuk-tag govuk-tag--green">Published</strong>')
                .else('<strong class="govuk-tag govuk-tag--yellow">Draft</strong>'),
              Item().path('description'),
              Item().path('views'),
            ),
          }),
        ],
      }),
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `block<CollectionBlock>({
  collection: Collection({
    collection: Data('articles'),
    template: [
      block<HtmlBlock>({
        content: Format(
          \`<div class="govuk-summary-card">
            <div class="govuk-summary-card__title-wrapper">
              <h3>%1</h3>
              <ul class="govuk-summary-card__actions">
                <li>%2</li>
              </ul>
            </div>
            <div class="govuk-summary-card__content">
              <dl class="govuk-summary-list">
                <div class="govuk-summary-list__row">
                  <dt>Description</dt>
                  <dd>%3</dd>
                </div>
                <div class="govuk-summary-list__row">
                  <dt>Views</dt>
                  <dd>%4</dd>
                </div>
              </dl>
            </div>
          </div>\`,
          Item().path('title'),
          when(Item().path('status').match(Condition.Equals('published')))
            .then('<span class="govuk-tag--green">Published</span>')
            .else('<span class="govuk-tag--yellow">Draft</span>'),
          Item().path('description'),
          Item().path('views')
        ),
      }),
    ],
  }),
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
        <p class="govuk-body govuk-!-margin-top-6">
          <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
        </p>
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/collections/playground/intro',
              labelText: 'Collections Playground',
            },
            next: {
              href: '/forms/form-engine-developer-guide/collections/playground/hub',
              labelText: 'CRUD Demo',
            },
          }),
        ],
      },
    }),
  ],
})
