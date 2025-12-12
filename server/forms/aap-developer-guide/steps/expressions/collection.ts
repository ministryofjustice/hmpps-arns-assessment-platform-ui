import { step, block, Format, Item, Collection } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'

/**
 * Expressions - Collection
 *
 * Documentation for Collection() iteration expressions.
 */
export const collectionStep = step({
  path: '/collection',
  title: 'Collection Expressions',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Collection() - Iterating Over Data</h1>

        <p class="govuk-body-l">
          <code>Collection()</code> generates repeated content by iterating over
          an array. It's like a <code>forEach</code> that produces blocks for each item.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Basic Syntax</h2>

        <p class="govuk-body">
          Collection takes an object with <code>collection</code> (the data source),
          <code>template</code> (blocks to repeat), and optional <code>fallback</code>
          (shown when empty):
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { Collection, Data, Item, Format, block } from '@form-engine/form/builders'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'

block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    // Data source (array to iterate)
    collection: Data('items'),

    // Template blocks (rendered for each item)
    template: [
      block<HtmlBlock>({
        variant: 'html',
        content: Format('<li>%1</li>', Item().path('name')),
      }),
    ],

    // Fallback (shown when array is empty)
    fallback: [
      block<HtmlBlock>({
        variant: 'html',
        content: '<p>No items found.</p>',
      }),
    ],
  }),
})`,
    }),

    // Item() reference
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Item() - Accessing Current Item</h2>

        <p class="govuk-body">
          Inside a collection template, <code>Item()</code> references the current
          iteration item:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Access item properties
Item().path('name')         // item.name
Item().path('email')        // item.email
Item().path('address.city') // item.address.city

// Access the full item value
Item().value()              // the entire item object

// Access the iteration index (0-based)
Item().index()              // 0, 1, 2, ...

// Display 1-based numbers
Item().index().pipe(Transformer.Number.Add(1))  // 1, 2, 3, ...`,
    }),

    // Live example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Live Example</h2>
        <p class="govuk-body">
          This list is generated dynamically from data:
        </p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: [
          { name: 'Alice Johnson', role: 'Developer', team: 'Frontend' },
          { name: 'Bob Smith', role: 'Designer', team: 'UX' },
          { name: 'Carol Williams', role: 'Manager', team: 'Engineering' },
        ],
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<div class="govuk-summary-card govuk-!-margin-bottom-3">
                <div class="govuk-summary-card__title-wrapper">
                  <h3 class="govuk-summary-card__title">%1. %2</h3>
                </div>
                <div class="govuk-summary-card__content">
                  <p class="govuk-body"><strong>Role:</strong> %3</p>
                  <p class="govuk-body"><strong>Team:</strong> %4</p>
                </div>
              </div>`,
              Item().index().pipe(Transformer.Number.Add(1)),
              Item().path('name'),
              Item().path('role'),
              Item().path('team'),
            ),
          }),
        ],
      }),
    }),

    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <p class="govuk-body govuk-!-margin-top-4">The code for this example:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    collection: [
      { name: 'Alice Johnson', role: 'Developer', team: 'Frontend' },
      { name: 'Bob Smith', role: 'Designer', team: 'UX' },
      { name: 'Carol Williams', role: 'Manager', team: 'Engineering' },
    ],
    template: [
      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          \`<div class="govuk-summary-card">
            <h3>%1. %2</h3>
            <p>Role: %3</p>
            <p>Team: %4</p>
          </div>\`,
          Item().index().pipe(Transformer.Number.Add(1)),
          Item().path('name'),
          Item().path('role'),
          Item().path('team'),
        ),
      }),
    ],
  }),
})`,
          }),
        ],
      },
    }),

    // Data sources
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Data Sources</h2>

        <p class="govuk-body">
          The <code>collection</code> property accepts various data sources:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// 1. Data reference (most common)
Collection({
  collection: Data('users'),
  template: [...],
})

// 2. Answer reference (user-provided array)
Collection({
  collection: Answer('selectedItems'),
  template: [...],
})

// 3. Inline array (for static content)
Collection({
  collection: ['Option A', 'Option B', 'Option C'],
  template: [...],
})

// 4. Nested Item() (for nested collections)
Collection({
  collection: Item().path('children'),
  template: [...],
})`,
    }),

    // Nested collections
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Nested Collections</h2>

        <p class="govuk-body">
          Collections can be nested. Use <code>Item().parent</code> to access
          the outer scope:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Outer collection: categories
Collection({
  collection: Data('categories'),
  template: [
    // Category header
    block<HtmlBlock>({
      variant: 'html',
      content: Format('<h2>%1</h2>', Item().path('name')),
    }),

    // Inner collection: items within category
    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Item().path('items'),  // Iterate category.items
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              '<p>%1 (Category: %2)</p>',
              Item().path('name'),           // Inner item name
              Item().parent.path('name'),    // Outer category name
            ),
          }),
        ],
      }),
    }),
  ],
})`,
    }),

    // Live nested example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">Nested Collection Example</h3>
        <p class="govuk-body">Categories with their items:</p>
      `,
    }),

    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: [
          {
            name: 'Fruits',
            items: [
              { name: 'Apple', price: '0.50' },
              { name: 'Banana', price: '0.30' },
            ],
          },
          {
            name: 'Vegetables',
            items: [
              { name: 'Carrot', price: '0.40' },
              { name: 'Broccoli', price: '0.80' },
            ],
          },
        ],
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format('<h4 class="govuk-heading-s govuk-!-margin-bottom-1">%1</h4>', Item().path('name')),
          }),
          block<CollectionBlock>({
            variant: 'collection-block',
            collection: Collection({
              collection: Item().path('items'),
              template: [
                block<HtmlBlock>({
                  variant: 'html',
                  content: Format(
                    '<p class="govuk-body govuk-!-margin-bottom-1 govuk-!-margin-left-4">• %1 - £%2</p>',
                    Item().path('name'),
                    Item().path('price'),
                  ),
                }),
              ],
            }),
          }),
        ],
      }),
    }),

    // Dynamic field codes
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Dynamic Field Codes</h2>

        <p class="govuk-body">
          Use <code>Format()</code> with <code>Item().index()</code> to create
          unique field codes within collections:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
Collection({
  collection: Data('items'),
  template: [
    field<GovUKTextInput>({
      variant: 'govukTextInput',
      // Unique code for each item: item_0_name, item_1_name, etc.
      code: Format('item_%1_name', Item().index()),

      // Dynamic label showing position
      label: Format('Name for item %1',
        Item().index().pipe(Transformer.Number.Add(1))
      ),

      // Pre-populate from item data
      defaultValue: Item().path('name'),
    }),

    field<GovUKTextInput>({
      variant: 'govukTextInput',
      code: Format('item_%1_quantity', Item().index()),
      label: 'Quantity',
      defaultValue: Item().path('quantity'),
    }),
  ],
})`,
    }),

    // Fallback content
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Fallback Content</h2>

        <p class="govuk-body">
          The <code>fallback</code> property defines content shown when the
          collection is empty:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
Collection({
  collection: Data('searchResults'),
  template: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format('<li>%1</li>', Item().path('title')),
    }),
  ],
  fallback: [
    block<HtmlBlock>({
      variant: 'html',
      content: \`
        <div class="govuk-inset-text">
          No results found. Try a different search term.
        </div>
      \`,
    }),
  ],
})`,
    }),

    // Common patterns
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Patterns</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// 1. Summary list from data
Collection({
  collection: Data('orderItems'),
  template: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        \`<div class="govuk-summary-list__row">
          <dt class="govuk-summary-list__key">%1</dt>
          <dd class="govuk-summary-list__value">£%2</dd>
        </div>\`,
        Item().path('name'),
        Item().path('price'),
      ),
    }),
  ],
})

// 2. Numbered list
Collection({
  collection: Data('steps'),
  template: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        '<li>Step %1: %2</li>',
        Item().index().pipe(Transformer.Number.Add(1)),
        Item().path('description'),
      ),
    }),
  ],
})

// 3. Table rows
Collection({
  collection: Data('users'),
  template: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        \`<tr class="govuk-table__row">
          <td class="govuk-table__cell">%1</td>
          <td class="govuk-table__cell">%2</td>
          <td class="govuk-table__cell">%3</td>
        </tr>\`,
        Item().path('name'),
        Item().path('email'),
        Item().path('role'),
      ),
    }),
  ],
})

// 4. Card grid
Collection({
  collection: Data('services'),
  template: [
    block<HtmlBlock>({
      variant: 'html',
      content: Format(
        \`<div class="govuk-grid-column-one-third">
          <h3 class="govuk-heading-s">%1</h3>
          <p class="govuk-body">%2</p>
          <a href="%3" class="govuk-link">Learn more</a>
        </div>\`,
        Item().path('title'),
        Item().path('description'),
        Item().path('url'),
      ),
    }),
  ],
})`,
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
              href: '/forms/form-engine-developer-guide/expressions/predicates',
              labelText: 'Predicate Combinators',
            },
            next: {
              href: '/forms/form-engine-developer-guide/expressions/playground/intro',
              labelText: 'Expressions Playground',
            },
          }),
        ],
      },
    }),
  ],
})
