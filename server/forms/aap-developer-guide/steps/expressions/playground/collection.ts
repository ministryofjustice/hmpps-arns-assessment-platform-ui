import {
  step,
  block,
  field,
  Format,
  Item,
  Collection,
  Answer,
  Data,
  when,
  submitTransition,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import {
  GovUKDetails,
  GovUKPagination,
  GovUKRadioInput,
  GovUKTextInput,
} from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { exampleBox } from '../../../helpers/exampleBox'

/**
 * Expressions Playground - Collection
 *
 * Interactive examples of Collection() and Item() expressions.
 */
export const collectionStep = step({
  path: '/collection',
  title: 'Collection Playground',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Collection Expressions Playground</h1>

        <p class="govuk-body-l">
          See <code>Collection()</code> and <code>Item()</code> in action.
          Collections iterate over data to generate repeated content.
        </p>
      `,
    }),

    // Basic list
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic List Rendering</h2>
        <p class="govuk-body">
          This list is generated from data using <code>Collection()</code>.
          Each item uses <code>Item().path()</code> to access properties.
        </p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('teamMembers'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<div class="govuk-summary-card govuk-!-margin-bottom-3">
                <div class="govuk-summary-card__title-wrapper">
                  <h3 class="govuk-summary-card__title">%1. %2</h3>
                </div>
                <div class="govuk-summary-card__content">
                  <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Email</dt>
                      <dd class="govuk-summary-list__value">%3</dd>
                    </div>
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Role</dt>
                      <dd class="govuk-summary-list__value">%4</dd>
                    </div>
                  </dl>
                </div>
              </div>`,
              Item().index().pipe(Transformer.Number.Add(1)),
              Item().path('name'),
              Item().path('email'),
              Item().path('role'),
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
      { name: 'John Smith', email: 'john.smith@example.com', role: 'Developer' },
      { name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Designer' },
      { name: 'Mike Brown', email: 'mike.b@example.com', role: 'Manager' },
    ],
    template: [
      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<div>%1. %2 (%3) - %4</div>',
          Item().index().pipe(Transformer.Number.Add(1)), // 1-based index
          Item().path('name'),
          Item().path('email'),
          Item().path('role')
        ),
      }),
    ],
  }),
})`,
        }),
      ],
    }),

    // Table generation
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Table Generation</h2>
        <p class="govuk-body">
          Use collections to generate table rows from data.
        </p>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <table class="govuk-table">
          <caption class="govuk-table__caption govuk-table__caption--m">Monthly expenses</caption>
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">#</th>
              <th scope="col" class="govuk-table__header">Category</th>
              <th scope="col" class="govuk-table__header">Description</th>
              <th scope="col" class="govuk-table__header govuk-table__header--numeric">Amount</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('expenses'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<tr class="govuk-table__row">
                <td class="govuk-table__cell">%1</td>
                <td class="govuk-table__cell">%2</td>
                <td class="govuk-table__cell">%3</td>
                <td class="govuk-table__cell govuk-table__cell--numeric">£%4</td>
              </tr>`,
              Item().index().pipe(Transformer.Number.Add(1)),
              Item().path('category'),
              Item().path('description'),
              Item().path('amount'),
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
          code: `// Table rows generated from collection
block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    collection: Data('expenses'),
    template: [
      block<HtmlBlock>({
        content: Format(
          '<tr><td>%1</td><td>%2</td><td>£%3</td></tr>',
          Item().path('category'),
          Item().path('description'),
          Item().path('amount')
        ),
      }),
    ],
  }),
})`,
        }),
      ],
    }),

    // Nested collections
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Nested Collections</h2>
        <p class="govuk-body">
          Collections can be nested. Use <code>Item().parent</code> to access
          the outer scope from within an inner collection.
        </p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('teams'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<div class="govuk-!-margin-bottom-4">
                <h3 class="govuk-heading-s govuk-!-margin-bottom-2">%1</h3>`,
              Item().path('name'),
            ),
          }),
          block<CollectionBlock>({
            variant: 'collection-block',
            collection: Collection({
              collection: Item().path('members'),
              template: [
                block<HtmlBlock>({
                  variant: 'html',
                  content: Format(
                    `<p class="govuk-body govuk-!-margin-bottom-1 govuk-!-margin-left-4">
                      • <strong>%1</strong> - %2 <em>(Team: %3)</em>
                    </p>`,
                    Item().path('name'),
                    Item().path('skill'),
                    Item().parent.path('name'),
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
          code: `// Outer collection: teams
Collection({
  collection: Data('teams'),
  template: [
    // Team name
    block<HtmlBlock>({
      content: Format('<h3>%1</h3>', Item().path('name')),
    }),

    // Inner collection: members within team
    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Item().path('members'),  // Iterate team.members
        template: [
          block<HtmlBlock>({
            content: Format(
              '<p>%1 - %2 (Team: %3)</p>',
              Item().path('name'),        // Member name
              Item().path('skill'),       // Member skill
              Item().parent.path('name')  // Team name (from outer scope)
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

    // Conditional content in collections
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Conditional Content in Collections</h2>
        <p class="govuk-body">
          Use <code>when()</code> inside collections to show different content
          based on item properties.
        </p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('tasks'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<div class="govuk-summary-list__row" style="display: flex; padding: 10px 0; border-bottom: 1px solid #b1b4b6;">
                <div style="flex: 2;">%1</div>
                <div style="flex: 1;">%2</div>
                <div style="flex: 1;">%3</div>
              </div>`,
              Item().path('task'),
              when(Item().path('status').match(Condition.Equals('completed')))
                .then('<strong class="govuk-tag govuk-tag--green">Completed</strong>')
                .else(
                  when(Item().path('status').match(Condition.Equals('in_progress')))
                    .then('<strong class="govuk-tag govuk-tag--blue">In Progress</strong>')
                    .else('<strong class="govuk-tag govuk-tag--grey">Pending</strong>'),
                ),
              when(Item().path('priority').match(Condition.Equals('high')))
                .then('<strong class="govuk-tag govuk-tag--red">High</strong>')
                .else(
                  when(Item().path('priority').match(Condition.Equals('medium')))
                    .then('<strong class="govuk-tag govuk-tag--yellow">Medium</strong>')
                    .else('<strong class="govuk-tag govuk-tag--grey">Low</strong>'),
                ),
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
          code: `Collection({
  collection: Data('tasks'),
  template: [
    block<HtmlBlock>({
      content: Format(
        '<div>%1 - %2</div>',
        Item().path('task'),
        when(Item().path('status').match(Condition.Equals('completed')))
          .then('<span class="govuk-tag govuk-tag--green">Completed</span>')
          .else(
            when(Item().path('status').match(Condition.Equals('in_progress')))
              .then('<span class="govuk-tag govuk-tag--blue">In Progress</span>')
              .else('<span class="govuk-tag govuk-tag--grey">Pending</span>')
          )
      ),
    }),
  ],
})`,
        }),
      ],
    }),

    // Fallback content
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Fallback Content</h2>
        <p class="govuk-body">
          The <code>fallback</code> property shows content when the collection is empty.
          Select "No results" to see the fallback message.
        </p>
      `,
    }),

    exampleBox([
      field<GovUKRadioInput>({
        variant: 'govukRadioInput',
        code: 'playground_coll_results',
        fieldset: {
          legend: { text: 'Simulate search results' },
        },
        items: [
          { value: 'with_results', text: 'Show results' },
          { value: 'empty', text: 'No results (show fallback)' },
        ],
      }),

      block<CollectionBlock>({
        variant: 'collection-block',
        hidden: Answer('playground_coll_results').not.match(Condition.Equals('with_results')),
        collection: Collection({
          collection: Data('searchResults'),
          template: [
            block<HtmlBlock>({
              variant: 'html',
              content: Format(
                `<div class="govuk-!-margin-bottom-2">
                  <a href="%2" class="govuk-link">%1</a>
                </div>`,
                Item().path('title'),
                Item().path('url'),
              ),
            }),
          ],
        }),
      }),

      block<HtmlBlock>({
        variant: 'html',
        hidden: Answer('playground_coll_results').not.match(Condition.Equals('empty')),
        content: `
          <div class="govuk-inset-text govuk-!-margin-top-4 govuk-!-margin-bottom-0">
            <strong>No results found</strong><br>
            Try adjusting your search terms or browse our categories.
          </div>
        `,
      }),
    ]),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `Collection({
  collection: Data('searchResults'),
  template: [
    block<HtmlBlock>({
      content: Format('<a href="%2">%1</a>', Item().path('title'), Item().path('url')),
    }),
  ],
  fallback: [
    block<HtmlBlock>({
      content: '<div class="govuk-inset-text">No results found.</div>',
    }),
  ],
})`,
        }),
      ],
    }),

    // Interactive collection with input
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Fields in Collections</h2>
        <p class="govuk-body">
          Use <code>Format()</code> with <code>Item().index()</code> to create
          unique field codes. Enter text to see how fields are generated.
        </p>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: '<h3 class="govuk-heading-s">Edit team members</h3>',
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('editableTeamMembers'),
        template: [
          block<TemplateWrapper>({
            variant: 'templateWrapper',
            template: `
              <div class="govuk-!-padding-4 govuk-!-margin-bottom-4" style="background-color: #f3f2f1; border-left: 4px solid #1d70b8;">
                <h4 class="govuk-heading-s govuk-!-margin-bottom-2">Team member {{index}}</h4>
                {{slot:fields}}
              </div>
            `,
            values: {
              index: Item().index().pipe(Transformer.Number.Add(1)),
            },
            slots: {
              fields: [
                field<GovUKTextInput>({
                  variant: 'govukTextInput',
                  code: Format('playground_coll_member_%1_name', Item().index()),
                  label: 'Name',
                  defaultValue: Item().path('name'),
                }),
                field<GovUKTextInput>({
                  variant: 'govukTextInput',
                  code: Format('playground_coll_member_%1_role', Item().index()),
                  label: 'Role',
                  defaultValue: Item().path('role'),
                }),
              ],
            },
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
          code: `Collection({
  collection: Data('teamMembers'),
  template: [
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      // Unique code: member_0_name, member_1_name, etc.
      code: Format('member_%1_name', Item().index()),
      label: Format('Name for member %1',
        Item().index().pipe(Transformer.Number.Add(1))
      ),
      // Pre-populate from data
      defaultValue: Item().path('name'),
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: Format('member_%1_role', Item().index()),
      label: 'Role',
      defaultValue: Item().path('role'),
    }),
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
              href: '/forms/form-engine-developer-guide/expressions/playground/predicates',
              labelText: 'Predicates Playground',
            },
          }),
        ],
      },
    }),
  ],
})
