import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Collections - Hub-and-Spoke Pattern
 *
 * Architectural pattern for managing collections with CRUD operations.
 */
export const hubSpokeStep = step({
  path: '/hub-spoke',
  title: 'Hub-and-Spoke Pattern',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Hub-and-Spoke Pattern</h1>

        <p class="govuk-body-l">
          The hub-and-spoke pattern lets users manage a collection of items through
          a central list page (hub) with dedicated edit pages (spokes) for each item.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Architecture Overview</h2>
      `,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          <strong>Hub page</strong> displays the collection and provides navigation to add/edit items.
          <strong>Spoke pages</strong> handle the actual editing with forms and save operations.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Hub Page Structure</h2>

        <p class="govuk-body">The hub page has three responsibilities:</p>

        <ol class="govuk-list govuk-list--number">
          <li>Display the list of items using <code>Collection()</code></li>
          <li>Provide "Add" navigation to create new items</li>
          <li>Provide "Edit" links for each existing item</li>
        </ol>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Hub page: /items
step({
  path: '/items',
  title: 'Your Items',

  // Load items on page access
  onLoad: [
    loadTransition({
      effects: [MyEffects.initializeItems()],
    }),
  ],

  blocks: [
    // Heading
    block<HtmlBlock>({
      content: '<h1>Your items</h1>',
    }),

    // Collection display
    block<CollectionBlock>({
      collection: Collection({
        collection: Data('items'),
        template: [
          block<HtmlBlock>({
            content: Format(
              \`<div class="govuk-summary-card">
                <h2>%1</h2>
                <p>%2</p>
                <a href="items/%3/edit">Edit</a>
              </div>\`,
              Item().path('name'),
              Item().path('description'),
              Item().path('id'),  // ID for edit link
            ),
          }),
        ],
        fallback: [
          block<HtmlBlock>({
            content: '<p>No items yet.</p>',
          }),
        ],
      }),
    }),

    // Add button (links to /items/new/edit)
    block<HtmlBlock>({
      content: '<a href="items/new/edit" class="govuk-button govuk-button--secondary">Add item</a>',
    }),

    // Continue button
    block<GovUKButton>({ text: 'Continue' }),
  ],

  onSubmission: [
    submitTransition({
      validate: false,
      onAlways: {
        next: [next({ goto: 'next-step' })],
      },
    }),
  ],
})`,
    }),

    // Spoke page
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Spoke Page Structure</h2>

        <p class="govuk-body">The spoke page handles individual item editing:</p>

        <ol class="govuk-list govuk-list--number">
          <li>URL parameter (<code>:itemId</code>) identifies which item</li>
          <li>Load effect populates form with existing data</li>
          <li>Access control redirects if item not found</li>
          <li>Save effect persists changes</li>
          <li>Navigation returns to hub</li>
        </ol>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Spoke page: /items/:itemId/edit
step({
  path: '/items/:itemId/edit',  // :itemId captures the ID
  title: 'Edit Item',

  // Hide from step navigation (user navigates via hub)
  view: {
    hiddenFromNavigation: true,
  },

  // Load item data
  onLoad: [
    loadTransition({
      effects: [MyEffects.loadItem()],  // Uses context.getRequestParam('itemId')
    }),
  ],

  // Redirect if item not found
  onAccess: [
    accessTransition({
      guards: Data('itemNotFound').match(Condition.Equals(true)),
      redirect: [next({ goto: 'items' })],
    }),
  ],

  blocks: [
    // Dynamic heading
    block<HtmlBlock>({
      content: when(Data('isNewItem').match(Condition.Equals(true)))
        .then('<h1>Add item</h1>')
        .else('<h1>Edit item</h1>'),
    }),

    // Form fields
    field<GovUKTextInput>({
      code: 'itemName',
      label: 'Name',
      validate: [
        validation({
          when: Self().not.match(Condition.IsRequired()),
          message: 'Enter a name',
        }),
      ],
    }),

    field<GovukTextareaInput>({
      code: 'itemDescription',
      label: 'Description',
    }),

    // Save button
    block<GovUKButton>({
      text: 'Save',
      name: 'action',
      value: 'save',
    }),

    // Save and add another button
    block<GovUKButton>({
      text: 'Save and add another',
      name: 'action',
      value: 'saveAndAdd',
      classes: 'govuk-button--secondary',
    }),
  ],

  onSubmission: [
    // Save and return to hub
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [MyEffects.saveItem()],
        next: [next({ goto: 'items' })],
      },
    }),

    // Save and add another
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndAdd')),
      validate: true,
      onValid: {
        effects: [MyEffects.saveItem()],
        next: [next({ goto: 'items/new/edit' })],
      },
    }),
  ],
})`,
    }),

    // URL patterns
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">URL Parameter Patterns</h2>

        <p class="govuk-body">
          The spoke page path uses <code>:itemId</code> to capture the item identifier:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th class="govuk-table__header">URL</th>
              <th class="govuk-table__header">itemId Value</th>
              <th class="govuk-table__header">Meaning</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>/items/new/edit</code></td>
              <td class="govuk-table__cell"><code>"new"</code></td>
              <td class="govuk-table__cell">Create new item</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>/items/item_1/edit</code></td>
              <td class="govuk-table__cell"><code>"item_1"</code></td>
              <td class="govuk-table__cell">Edit existing item</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>/items/abc123/edit</code></td>
              <td class="govuk-table__cell"><code>"abc123"</code></td>
              <td class="govuk-table__cell">Edit item with UUID</td>
            </tr>
          </tbody>
        </table>

        <p class="govuk-body">
          Access the parameter in effects using <code>context.getRequestParam('itemId')</code>.
        </p>
      `,
    }),

    // Navigation patterns
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Navigation Patterns</h2>

        <p class="govuk-body">Navigation links in the hub-and-spoke pattern:</p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Hub: Add new item link
<a href="items/new/edit">Add item</a>

// Hub: Edit existing item (in Collection template)
Format('<a href="items/%1/edit">Edit</a>', Item().path('id'))

// Spoke: Save and return to hub
next: [next({ goto: 'items' })]

// Spoke: Save and add another
next: [next({ goto: 'items/new/edit' })]

// Dynamic navigation using Format
next: [next({ goto: Format('items/%1/edit', Answer('selectedItemId')) })]`,
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Use stable IDs:</strong> Use unique identifiers (UUIDs, database IDs)
            rather than array indices for item identification
          </li>
          <li>
            <strong>Hide spoke from navigation:</strong> Set <code>view.hiddenFromNavigation: true</code>
            so spoke pages don't appear in step progress
          </li>
          <li>
            <strong>Handle "not found":</strong> Always check if the item exists and redirect
            to the hub if not found
          </li>
          <li>
            <strong>Convention for "new":</strong> Use <code>:itemId = "new"</code> as a
            convention for creating new items
          </li>
          <li>
            <strong>Validate before save:</strong> Use <code>validate: true</code> in
            submit transitions to ensure data integrity
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
              href: '/forms/form-engine-developer-guide/collections/iteration',
              labelText: 'Collection Iteration',
            },
            next: {
              href: '/forms/form-engine-developer-guide/collections/effects',
              labelText: 'Collection Effects',
            },
          }),
        ],
      },
    }),
  ],
})
