import { Format, Item, Literal, Iterator } from '@form-engine/form/builders'
import { TemplateWrapper, CollectionBlock } from '@form-engine/registry/components'
import { GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

const teamMembers = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
  { name: 'Carol Williams', email: 'carol@example.com', role: 'Manager' },
]

const simpleListItems = [
  { name: 'First item' },
  { name: 'Second item' },
  { name: 'Third item' },
  { name: 'Fourth item' },
]

const dashboardStats = [
  { icon: '📋', label: 'Tasks', count: 12 },
  { icon: '✅', label: 'Completed', count: 8 },
  { icon: '⏳', label: 'Pending', count: 4 },
  { icon: '🔥', label: 'Urgent', count: 2 },
]

const articles = [
  { title: 'Getting Started', description: 'Learn the basics of form-engine', views: 1250 },
  { title: 'Advanced Patterns', description: 'Deep dive into complex forms', views: 890 },
  { title: 'Best Practices', description: 'Tips for maintainable forms', views: 2100 },
]

/**
 * Iterators Playground - Map Examples
 *
 * Interactive examples of Iterator.Map.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Iterator.Map Examples

  See \`Iterator.Map\` in action. Each example shows live output
  with the code that generates it. {.lead}

  ---

  ## 1. Property Extraction

  Extract and format specific properties from each item:

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## 2. Numbered List with Index

  Use \`Item().index()\` to include position numbers:

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## 3. Table Rows

  Generate table rows from structured data:

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## 4. Static Array with Literal()

  Use \`Literal()\` to iterate over arrays defined in your code:

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  ## 5. Summary Cards

  Generate GOV.UK summary cards from article data:

  {{slot:example5}}

  {{slot:example5Code}}

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(teamMembers).each(
          Iterator.Map(
            Format(
              '<div class="govuk-summary-card__content govuk-!-padding-3 govuk-!-margin-bottom-2"><strong>%1</strong><br><span class="govuk-body-s">%2</span></div>',
              Item().path('name'),
              Item().path('email'),
            ),
          ),
        ),
      }),
    ],
    example1Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `const teamMembers = [
  { name: 'Alice Johnson', email: 'alice@example.com', role: 'Developer' },
  { name: 'Bob Smith', email: 'bob@example.com', role: 'Designer' },
  { name: 'Carol Williams', email: 'carol@example.com', role: 'Manager' },
]

Literal(teamMembers).each(Iterator.Map(
  Format('<div><strong>%1</strong><br><span>%2</span></div>',
    Item().path('name'),
    Item().path('email')
  )
))`,
          }),
        ],
      }),
    ],
    example2: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(simpleListItems).each(
          Iterator.Map(
            Format(
              '<p class="govuk-body govuk-!-margin-bottom-2"><span class="govuk-tag govuk-tag--grey govuk-!-margin-right-2">%1</span> %2</p>',
              Item().index().pipe(Transformer.Number.Add(1)),
              Item().path('name'),
            ),
          ),
        ),
      }),
    ],
    example2Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `const simpleListItems = [
  { name: 'First item' },
  { name: 'Second item' },
  { name: 'Third item' },
  { name: 'Fourth item' },
]

Literal(simpleListItems).each(Iterator.Map(
  Format(
    '<p><span class="govuk-tag govuk-tag--grey">%1</span> %2</p>',
    Item().index().pipe(Transformer.Number.Add(1)),
    Item().path('name')
  )
))`,
          }),
        ],
      }),
    ],
    example3: [
      TemplateWrapper({
        template: `
          <table class="govuk-table">
            <thead class="govuk-table__head">
              <tr class="govuk-table__row">
                <th scope="col" class="govuk-table__header">#</th>
                <th scope="col" class="govuk-table__header">Name</th>
                <th scope="col" class="govuk-table__header">Role</th>
              </tr>
            </thead>
            <tbody class="govuk-table__body">
              {{slot:rows}}
            </tbody>
          </table>
        `,
        slots: {
          rows: [
            CollectionBlock({
              collection: Literal(teamMembers).each(
                Iterator.Map(
                  Format(
                    '<tr class="govuk-table__row"><td class="govuk-table__cell">%1</td><td class="govuk-table__cell">%2</td><td class="govuk-table__cell">%3</td></tr>',
                    Item().index().pipe(Transformer.Number.Add(1)),
                    Item().path('name'),
                    Item().path('role'),
                  ),
                ),
              ),
            }),
          ],
        },
      }),
    ],
    example3Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `Literal(teamMembers).each(Iterator.Map(
  Format(
    '<tr><td>%1</td><td>%2</td><td>%3</td></tr>',
    Item().index().pipe(Transformer.Number.Add(1)),
    Item().path('name'),
    Item().path('role')
  )
))`,
          }),
        ],
      }),
    ],
    example4: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(dashboardStats).each(
          Iterator.Map(
            Format(
              '<div class="govuk-!-display-inline-block govuk-!-margin-right-4 govuk-!-margin-bottom-2"><span class="govuk-heading-m govuk-!-margin-bottom-0">%1 %2</span><br><span class="govuk-body-s">%3 items</span></div>',
              Item().path('icon'),
              Item().path('label'),
              Item().path('count'),
            ),
          ),
        ),
      }),
    ],
    example4Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `const dashboardStats = [
  { icon: '📋', label: 'Tasks', count: 12 },
  { icon: '✅', label: 'Completed', count: 8 },
  { icon: '⏳', label: 'Pending', count: 4 },
  { icon: '🔥', label: 'Urgent', count: 2 },
]

Literal(dashboardStats).each(Iterator.Map(
  Format(
    '<div><span>%1 %2</span><br><span>%3 items</span></div>',
    Item().path('icon'),
    Item().path('label'),
    Item().path('count')
  )
))`,
          }),
        ],
      }),
    ],
    example5: [
      CollectionBlock({
        classes: 'govuk-!-margin-bottom-4',
        collection: Literal(articles).each(
          Iterator.Map(
            Format(
              `<div class="govuk-summary-card govuk-!-margin-bottom-3">
                <div class="govuk-summary-card__title-wrapper">
                  <h3 class="govuk-summary-card__title">%1</h3>
                </div>
                <div class="govuk-summary-card__content">
                  <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Description</dt>
                      <dd class="govuk-summary-list__value">%2</dd>
                    </div>
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Views</dt>
                      <dd class="govuk-summary-list__value">%3</dd>
                    </div>
                  </dl>
                </div>
              </div>`,
              Item().path('title'),
              Item().path('description'),
              Item().path('views'),
            ),
          ),
        ),
      }),
    ],
    example5Code: [
      GovUKDetails({
        summaryText: 'View code',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `const articles = [
  { title: 'Getting Started', description: 'Learn the basics', views: 1250 },
  { title: 'Advanced Patterns', description: 'Deep dive into complex forms', views: 890 },
  { title: 'Best Practices', description: 'Tips for maintainable forms', views: 2100 },
]

Literal(articles).each(Iterator.Map(
  Format(
    \`<div class="govuk-summary-card">
      <div class="govuk-summary-card__title-wrapper">
        <h3>%1</h3>
      </div>
      <div class="govuk-summary-card__content">
        <dl class="govuk-summary-list">
          <div class="govuk-summary-list__row">
            <dt>Description</dt>
            <dd>%2</dd>
          </div>
          <div class="govuk-summary-list__row">
            <dt>Views</dt>
            <dd>%3</dd>
          </div>
        </dl>
      </div>
    </div>\`,
    Item().path('title'),
    Item().path('description'),
    Item().path('views')
  )
))`,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/playground/intro',
          labelText: 'Iterators Playground',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/playground/filter-examples',
          labelText: 'Filter Examples',
        },
      }),
    ],
  },
})
