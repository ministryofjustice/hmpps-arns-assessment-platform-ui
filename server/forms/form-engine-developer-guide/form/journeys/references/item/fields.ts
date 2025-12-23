import { block } from '@form-engine/form/builders'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - Item()
 *
 * Comprehensive documentation for the Item() reference,
 * covering collection iteration, scope navigation, and nested collections.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
# Item()

The \`Item()\` reference accesses values from the current collection item
during iteration. Use it to build dynamic field codes and display item-specific content. {.lead}

---

## Signature

{{slot:signatureCode}}

Returns a scoped reference with methods to access the current item's data:

- \`Item().path('key')\` — Access a property of the current item
- \`Item().value()\` — Get the entire item value
- \`Item().index()\` — Get the current iteration index (0-based)
- \`Item().parent\` — Navigate to the parent scope (for nested collections)

---

## When to Use Item()

\`Item()\` is used within **collection blocks** — blocks that
iterate over arrays. For example, displaying a list of items from Data() or
generating fields for each item in a list.

---

## Basic Usage

Access properties from the current collection item:

{{slot:basicCode}}

---

## Example: Displaying a List

Show a list of items loaded from an API:

{{slot:listCode}}

---

## Example: Dynamic Field Codes

Generate unique field codes for each item using \`Item().index()\`:

{{slot:dynamicCode}}

---

## Scope Hierarchy

When collections are nested, \`Item()\` refers to the innermost collection.
Use \`.parent\` to access outer scopes:

{{slot:scopeCode}}

{{slot:scopeDiagram}}

---

## Combining with Format()

Use \`Format()\` to build strings with item values:

{{slot:formatCode}}

---

## Restrictions

{{slot:warning}}

**Valid locations:**

- Inside a collection block's \`template\`
- Inside nested blocks within a collection
- In \`Format()\` expressions used within collections

**Invalid locations:**

- Outside any collection block
- In step-level configurations
- In journey-level configurations

---

## Best Practices

- **Use meaningful field codes:** Include context in dynamic codes, e.g., \`Format('contact_%1_email', Item().index())\`
- **Display 1-based indices to users:** Use \`Pipe(Item().index(), Transformer.Number.Add(1))\` for user-facing numbers
- **Use IDs over indices when possible:** If items have unique IDs, prefer \`Item().path('id')\` over \`Item().index()\` for field codes to handle reordering
- **Keep nesting shallow:** Deeply nested collections become hard to understand. Consider flattening data structures if possible

---

{{slot:pagination}}
`),
  slots: {
    signatureCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          Item(): ScopedReference
        `,
      }),
    ],
    basicCode: [
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
          Item().index()  // 0, 1, 2, ...
        `,
      }),
    ],
    listCode: [
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

          // Then, iterate using .each() with Iterator.Map
          block<CollectionBlock>({
            variant: 'collection-block',
            collection: Data('items').each(
              Iterator.Map(
                block<HtmlBlock>({
                  variant: 'html',
                  content: Format(
                    '<p class="govuk-body"><strong>%1</strong>: %2</p>',
                    Item().path('name'),
                    Item().path('status')
                  ),
                })
              )
            ),
          })
        `,
      }),
    ],
    dynamicCode: [
      block<CodeBlock>({
        variant: 'codeBlock',
        language: 'typescript',
        code: `
          // Create fields for each item using Iterator.Map
          block<CollectionBlock>({
            variant: 'collection-block',
            collection: Data('people').each(
              Iterator.Map(
                field<GovUKTextInput>({
                  variant: 'govukTextInput',
                  // Generate unique codes: person_0_name, person_1_name, etc.
                  code: Format('person_%1_name', Item().index()),
                  label: Format('Name for person %1',
                    Item().index().pipe(Transformer.Number.Add(1))
                  ),
                  defaultValue: Item().path('name'),
                })
              )
            ),
          })
        `,
      }),
    ],
    scopeCode: [
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
          Item().parent.parent  // Level 2 - grandparent collection item
        `,
      }),
    ],
    scopeDiagram: [
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
    ],
    formatCode: [
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
          // Results in: item_0_0, item_0_1, item_1_0, item_1_1, etc.
        `,
      }),
    ],
    warning: [
      block<GovUKWarningText>({
        variant: 'govukWarningText',
        html: '<code>Item()</code> can only be used inside a collection block. Using it outside will throw a runtime error because there is no active scope.',
      }),
    ],
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
})
