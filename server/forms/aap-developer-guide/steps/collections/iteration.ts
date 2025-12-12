import { step, block, Format, Item, Collection } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'

/**
 * Collections - Iteration
 *
 * Using Collection() and Item() to render repeated content.
 */
export const iterationStep = step({
  path: '/iteration',
  title: 'Collection Iteration',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Collection Iteration</h1>

        <p class="govuk-body-l">
          Use <code>Collection()</code> to iterate over arrays and render repeated blocks.
          Access each item's data with the <code>Item()</code> reference.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Collection() Expression</h2>

        <p class="govuk-body">
          <code>Collection()</code> takes an object with three properties:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li><code>collection</code> &mdash; The data source (array to iterate)</li>
          <li><code>template</code> &mdash; Blocks to render for each item</li>
          <li><code>fallback</code> &mdash; Optional blocks shown when the array is empty</li>
        </ul>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { Collection, Data, Item, block } from '@form-engine/form/builders'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'

block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    collection: Data('items'),    // Array to iterate
    template: [
      // Blocks rendered for each item
      block<HtmlBlock>({
        variant: 'html',
        content: Format('<li>%1</li>', Item().path('name')),
      }),
    ],
    fallback: [
      // Shown when array is empty
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

        <h2 class="govuk-heading-m">The Item() Reference</h2>

        <p class="govuk-body">
          Inside a collection template, <code>Item()</code> refers to the current iteration item.
          It provides several methods:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Access item properties
Item().path('name')           // item.name
Item().path('address.city')   // item.address.city (nested)

// Get the full item object
Item().value()                // the entire item

// Get the iteration index (0-based)
Item().index()                // 0, 1, 2, ...

// Display 1-based numbers to users
Item().index().pipe(Transformer.Number.Add(1))  // 1, 2, 3, ...

// Access parent scope (in nested collections)
Item().parent.path('name')    // parent item's name`,
    }),

    // Live example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Live Example</h2>

        <p class="govuk-body">
          This list is generated dynamically using <code>Collection()</code>:
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
                  <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Role</dt>
                      <dd class="govuk-summary-list__value">%3</dd>
                    </div>
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Team</dt>
                      <dd class="govuk-summary-list__value">%4</dd>
                    </div>
                  </dl>
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
      code: `// 1. Data reference (loaded from API/effects)
Collection({
  collection: Data('users'),
  template: [...],
})

// 2. Answer reference (user-provided array)
Collection({
  collection: Answer('selectedItems'),
  template: [...],
})

// 3. Static array (for fixed content)
Collection({
  collection: ['Option A', 'Option B', 'Option C'],
  template: [...],
})

// 4. Nested data (for inner collections)
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
          the outer scope from within an inner collection:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Data structure:
// categories: [
//   { name: 'Electronics', products: [{ name: 'Phone' }, { name: 'Laptop' }] },
//   { name: 'Books', products: [{ name: 'Novel' }, { name: 'Textbook' }] },
// ]

// Outer collection: categories
Collection({
  collection: Data('categories'),
  template: [
    block<HtmlBlock>({
      content: Format('<h3>%1</h3>', Item().path('name')),
    }),

    // Inner collection: products within category
    block<CollectionBlock>({
      collection: Collection({
        collection: Item().path('products'),  // Iterate category.products
        template: [
          block<HtmlBlock>({
            content: Format(
              '<p>%1 (in %2)</p>',
              Item().path('name'),         // Product name (current scope)
              Item().parent.path('name'),  // Category name (parent scope)
            ),
          }),
        ],
      }),
    }),
  ],
})`,
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
      code: `Collection({
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
  ],
})`,
    }),

    // More examples link
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">More Examples</h2>

        <p class="govuk-body">
          For more detailed examples of Collection() expressions, see:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <a href="/forms/form-engine-developer-guide/expressions/collection" class="govuk-link">
              Expressions &rarr; Collection
            </a>
            &mdash; Comprehensive Collection() documentation
          </li>
          <li>
            <a href="/forms/form-engine-developer-guide/references/item" class="govuk-link">
              References &rarr; Item()
            </a>
            &mdash; Full Item() reference documentation
          </li>
          <li>
            <a href="/forms/form-engine-developer-guide/collections/playground/iteration" class="govuk-link">
              Collections Playground &rarr; Iteration
            </a>
            &mdash; Interactive examples
          </li>
        </ul>
      `,
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
              href: '/forms/form-engine-developer-guide/collections/intro',
              labelText: 'Understanding Collections',
            },
            next: {
              href: '/forms/form-engine-developer-guide/collections/hub-spoke',
              labelText: 'Hub-and-Spoke Pattern',
            },
          }),
        ],
      },
    }),
  ],
})
