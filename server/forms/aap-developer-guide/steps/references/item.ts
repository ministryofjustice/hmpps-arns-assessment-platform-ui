import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'

/**
 * References - Item()
 *
 * Comprehensive documentation for the Item() reference,
 * covering collection iteration, scope navigation, and nested collections.
 */
export const itemStep = step({
  path: '/item',
  title: 'Item Reference',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Item()</h1>

        <p class="govuk-body-l">
          The <code>Item()</code> reference accesses values from the current collection item
          during iteration. Use it to build dynamic field codes and display item-specific content.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Signature</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `Item(): ScopedReference`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          Returns a scoped reference with methods to access the current item's data:
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li><code>Item().path('key')</code> &mdash; Access a property of the current item</li>
          <li><code>Item().value()</code> &mdash; Get the entire item value</li>
          <li><code>Item().index()</code> &mdash; Get the current iteration index (0-based)</li>
          <li><code>Item().parent</code> &mdash; Navigate to the parent scope (for nested collections)</li>
        </ul>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Use Item()</h2>

        <p class="govuk-body">
          <code>Item()</code> is used within <strong>collection blocks</strong> &mdash; blocks that
          iterate over arrays. For example, displaying a list of items from Data() or
          generating fields for each item in a list.
        </p>
      `,
    }),

    // Basic usage
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Usage</h2>
        <p class="govuk-body">
          Access properties from the current collection item:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
import { Item } from '@form-engine/form/builders'

// Access a single property
Item().path('name')      // Get item.name
Item().path('id')        // Get item.id
Item().path('status')    // Get item.status

// Access nested properties
Item().path('address.city')
Item().path('contact.email')

// Get the full item object
Item().value()

// Get the current index
Item().index()  // 0, 1, 2, ...`,
          }),
        ],
      },
    }),

    // Example: Displaying a list
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Displaying a List</h2>
        <p class="govuk-body">
          Show a list of items loaded from an API:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// First, load your data in an effect
loadItems: deps => async (context: EffectFunctionContext) => {
  const items = await deps.api.getItems()
  context.setData('items', items)
  // items = [
  //   { id: '1', name: 'First Item', status: 'active' },
  //   { id: '2', name: 'Second Item', status: 'pending' },
  // ]
}

// Then, iterate in your blocks using CollectionBlock
block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    collection: Data('items'),
    template: [
      block<HtmlBlock>({
        variant: 'html',
        content: Format(
          '<p class="govuk-body"><strong>%1</strong>: %2</p>',
          Item().path('name'),
          Item().path('status')
        ),
      }),
    ],
  }),
})`,
          }),
        ],
      },
    }),

    // Example: Dynamic field codes
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Dynamic Field Codes</h2>
        <p class="govuk-body">
          Generate unique field codes for each item using <code>Item().index()</code>:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Create fields for each item in a collection
block<CollectionBlock>({
  variant: 'collection-block',
  collection: Collection({
    collection: Data('people'),
    template: [
      field<GovUKTextInput>({
        variant: 'govukTextInput',
        // Generate unique codes: person_0_name, person_1_name, etc.
        code: Format('person_%1_name', Item().index()),
        label: Format('Name for person %1',
          Item().index().pipe(Transformer.Number.Add(1))
        ),
        defaultValue: Item().path('name'),
      }),
    ],
  }),
})`,
          }),
        ],
      },
    }),

    // Scope hierarchy
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Scope Hierarchy</h2>

        <p class="govuk-body">
          When collections are nested, <code>Item()</code> refers to the innermost collection.
          Use <code>.parent</code> to access outer scopes:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// Nested collection structure:
// categories: [
//   { name: 'Electronics', products: [{ name: 'Phone' }, { name: 'Laptop' }] },
//   { name: 'Books', products: [{ name: 'Novel' }, { name: 'Textbook' }] },
// ]

// Inside the inner collection (products):
Item().path('name')          // Product name: 'Phone', 'Laptop', etc.
Item().parent.path('name')   // Category name: 'Electronics', 'Books'

// Scope levels:
Item()         // Level 0 - current (innermost) collection item
Item().parent  // Level 1 - parent collection item
Item().parent.parent  // Level 2 - grandparent collection item`,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'Visual diagram: Nested collection scopes',
      content: [
        block<HtmlBlock>({
          variant: 'html',
          content: `
            <pre><code>categories (Level 1: Item().parent)
├── { name: 'Electronics', products: [...] }
│   └── products (Level 0: Item())
│       ├── { name: 'Phone' }     ← Item().path('name') = 'Phone'
│       │                           Item().parent.path('name') = 'Electronics'
│       └── { name: 'Laptop' }
└── { name: 'Books', products: [...] }
    └── products (Level 0: Item())
        ├── { name: 'Novel' }
        └── { name: 'Textbook' }</code></pre>
          `,
        }),
      ],
    }),

    // Combining with Format()
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Combining with Format()</h2>
        <p class="govuk-body">
          Use <code>Format()</code> to build strings with item values:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Display item information
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<p class="govuk-body">Item %1: %2 (Status: %3)</p>',
    Item().index().pipe(Transformer.Number.Add(1)),
    Item().path('name'),
    Item().path('status')
  ),
})

// Generate unique IDs
Format('item_%1_%2', Item().parent.index(), Item().index())
// Results in: item_0_0, item_0_1, item_1_0, item_1_1, etc.`,
          }),
        ],
      },
    }),

    // Restrictions and warnings
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Restrictions</h2>
      `,
    }),

    block<GovUKWarningText>({
      variant: 'govukWarningText',
      html: '<code>Item()</code> can only be used inside a collection block. Using it outside will throw a runtime error because there is no active scope.',
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          <strong>Valid locations:</strong>
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Inside a collection block's <code>template</code></li>
          <li>Inside nested blocks within a collection</li>
          <li>In <code>Format()</code> expressions used within collections</li>
        </ul>

        <p class="govuk-body">
          <strong>Invalid locations:</strong>
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li>Outside any collection block</li>
          <li>In step-level configurations</li>
          <li>In journey-level configurations</li>
        </ul>
      `,
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Use meaningful field codes:</strong> Include context in dynamic codes,
            e.g., <code>Format('contact_%1_email', Item().index())</code>
          </li>
          <li>
            <strong>Display 1-based indices to users:</strong> Use
            <code>Pipe(Item().index(), Transformer.Number.Add(1))</code> for user-facing numbers
          </li>
          <li>
            <strong>Use IDs over indices when possible:</strong> If items have unique IDs,
            prefer <code>Item().path('id')</code> over <code>Item().index()</code>
            for field codes to handle reordering
          </li>
          <li>
            <strong>Keep nesting shallow:</strong> Deeply nested collections become hard
            to understand. Consider flattening data structures if possible
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
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/references/self',
              labelText: 'Self Reference',
            },
            next: {
              href: '/forms/form-engine-developer-guide/references/http',
              labelText: 'HTTP References',
            },
          }),
        ],
      },
    }),
  ],
})
