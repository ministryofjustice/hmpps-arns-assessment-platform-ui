import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Collections - Effects
 *
 * How to build effects for collection CRUD operations.
 */
export const effectsStep = step({
  path: '/effects',
  title: 'Collection Effects',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Collection Effects</h1>

        <p class="govuk-body-l">
          Effects handle the data operations for collection management:
          initializing, loading, saving, and removing items.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Key Operations</h2>

        <p class="govuk-body">
          A typical collection needs four effects:
        </p>

        <ol class="govuk-list govuk-list--number">
          <li><strong>Initialize</strong> &mdash; Load or create the items array</li>
          <li><strong>Load Item</strong> &mdash; Populate form with item data</li>
          <li><strong>Save Item</strong> &mdash; Persist item changes</li>
          <li><strong>Remove Item</strong> &mdash; Delete an item</li>
        </ol>
      `,
    }),

    // Initialize effect
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Initialize Items</h2>

        <p class="govuk-body">
          Run on the hub page to ensure items are available. Typically loads from
          an API or initializes with default data:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `initializeItems: deps => async (context: EffectFunctionContext) => {
  // Option 1: Load from API
  const items = await deps.api.getItems()
  context.setData('items', items)

  // Option 2: Use session storage
  const session = context.getSession()
  if (!session.items) {
    session.items = []  // Initialize empty
  }
  context.setData('items', session.items)

  // Option 3: Seed with sample data for demos
  if (!session.items) {
    session.items = [
      { id: 'item_1', name: 'First Item' },
      { id: 'item_2', name: 'Second Item' },
    ]
  }
  context.setData('items', session.items)
}`,
    }),

    // Load item effect
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Load Item</h2>

        <p class="govuk-body">
          Run on the spoke page to populate form fields. Read the item ID from
          URL parameters and set answers:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `loadItem: _deps => (context: EffectFunctionContext) => {
  // Get item ID from URL parameter
  const itemId = context.getRequestParam('itemId')
  const session = context.getSession()
  const items = session.items || []

  if (itemId === 'new') {
    // Initialize empty form for new item
    context.setAnswer('itemName', '')
    context.setAnswer('itemDescription', '')
    context.setData('isNewItem', true)
  } else {
    // Find and load existing item
    const item = items.find((i: { id: string }) => i.id === itemId)

    if (item) {
      // Populate form fields with item data
      context.setAnswer('itemName', item.name || '')
      context.setAnswer('itemDescription', item.description || '')
      context.setData('isNewItem', false)
    } else {
      // Item not found - flag for access control
      context.setData('itemNotFound', true)
    }
  }
}`,
    }),

    // Save item effect
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Save Item</h2>

        <p class="govuk-body">
          Run on form submission to persist changes. Handle both new items
          and updates to existing items:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `saveItem: deps => async (context: EffectFunctionContext) => {
  const itemId = context.getRequestParam('itemId')
  const session = context.getSession()
  const items = session.items || []

  // Gather form data
  const itemData = {
    name: context.getAnswer('itemName') as string,
    description: context.getAnswer('itemDescription') as string,
  }

  if (itemId === 'new') {
    // Create new item with generated ID
    const newItem = {
      id: \`item_\${Date.now()}\`,  // Generate unique ID
      ...itemData,
    }
    session.items = [...items, newItem]

    // Optional: Call API to persist
    // await deps.api.createItem(newItem)
  } else {
    // Update existing item
    session.items = items.map((item: { id: string }) =>
      item.id === itemId ? { ...item, ...itemData } : item
    )

    // Optional: Call API to persist
    // await deps.api.updateItem(itemId, itemData)
  }

  // Update data for immediate display
  context.setData('items', session.items)
}`,
    }),

    // Remove item effect
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Remove Item</h2>

        <p class="govuk-body">
          Filter out the item by ID. Can be triggered from the hub page
          or as an action on the spoke page:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `removeItem: deps => async (context: EffectFunctionContext) => {
  const itemId = context.getRequestParam('itemId')
  const session = context.getSession()
  const items = session.items || []

  // Filter out the item
  session.items = items.filter((item: { id: string }) => item.id !== itemId)

  // Optional: Call API to delete
  // await deps.api.deleteItem(itemId)

  // Update data for immediate display
  context.setData('items', session.items)
}`,
    }),

    // Context methods
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Key Context Methods</h2>

        <p class="govuk-body">
          The <code>EffectFunctionContext</code> provides methods for data management:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">Method</th>
              <th class="govuk-table__header">Purpose</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>getRequestParam(name)</code></td>
              <td class="govuk-table__cell">Get URL parameter (e.g., <code>:itemId</code>)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>getSession()</code></td>
              <td class="govuk-table__cell">Access session storage (persists across requests)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>setData(key, value)</code></td>
              <td class="govuk-table__cell">Set data for <code>Data()</code> references</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>getData(key)</code></td>
              <td class="govuk-table__cell">Get previously set data</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>setAnswer(code, value)</code></td>
              <td class="govuk-table__cell">Pre-populate form field value</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>getAnswer(code)</code></td>
              <td class="govuk-table__cell">Get current answer value</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Complete example
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Complete Example</h2>

        <p class="govuk-body">
          Here's how all the effects fit together:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'

interface MyEffectsDeps {
  api: MyApiClient
}

export const { effects: MyEffects, createRegistry: createMyEffectsRegistry } =
  defineEffectsWithDeps<MyEffectsDeps>()({
    initializeItems: deps => async (context) => {
      const items = await deps.api.getItems()
      context.setData('items', items)
    },

    loadItem: _deps => (context) => {
      const itemId = context.getRequestParam('itemId')
      const items = context.getData('items') || []

      if (itemId === 'new') {
        context.setAnswer('itemName', '')
        context.setData('isNewItem', true)
      } else {
        const item = items.find((i: any) => i.id === itemId)
        if (item) {
          context.setAnswer('itemName', item.name)
          context.setData('isNewItem', false)
        } else {
          context.setData('itemNotFound', true)
        }
      }
    },

    saveItem: deps => async (context) => {
      const itemId = context.getRequestParam('itemId')
      const itemData = { name: context.getAnswer('itemName') as string }

      if (itemId === 'new') {
        await deps.api.createItem(itemData)
      } else {
        await deps.api.updateItem(itemId, itemData)
      }
    },

    removeItem: deps => async (context) => {
      const itemId = context.getRequestParam('itemId')
      await deps.api.deleteItem(itemId)
    },
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
              href: '/forms/form-engine-developer-guide/collections/hub-spoke',
              labelText: 'Hub-and-Spoke Pattern',
            },
            next: {
              href: '/forms/form-engine-developer-guide/collections/playground/intro',
              labelText: 'Collections Playground',
            },
          }),
        ],
      },
    }),
  ],
})
