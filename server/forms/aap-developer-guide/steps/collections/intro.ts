import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Collections - Introduction
 *
 * Overview of collections in form-engine:
 * - What collections are
 * - Two patterns: iteration vs management
 * - When to use each approach
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Collections',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Collections</h1>

        <p class="govuk-body-l">
          Collections let you work with lists of items in your forms. Form-engine provides
          two complementary patterns for handling collections.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Two Patterns for Collections</h2>

        <p class="govuk-body">
          Form-engine offers two ways to work with collections, each suited for different needs:
        </p>
      `,
    }),

    // Pattern 1: Iteration
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <div class="govuk-inset-text">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-2">1. Collection Iteration</h3>
          <p class="govuk-body govuk-!-margin-bottom-2">
            <strong>Render repeated content</strong> from an array of data.
          </p>
          <p class="govuk-body govuk-!-margin-bottom-2">
            Use <code>Collection()</code> expression with <code>Item()</code> references
            to display lists, tables, or repeated field sets.
          </p>
          <p class="govuk-body govuk-!-margin-bottom-0">
            <strong>Example:</strong> Displaying a list of menu items, generating table rows,
            creating repeated field groups.
          </p>
        </div>

        <div class="govuk-inset-text">
          <h3 class="govuk-heading-s govuk-!-margin-bottom-2">2. Hub-and-Spoke Management</h3>
          <p class="govuk-body govuk-!-margin-bottom-2">
            <strong>Full CRUD operations</strong> with dedicated pages for editing.
          </p>
          <p class="govuk-body govuk-!-margin-bottom-2">
            Use a hub page (list) with navigation to spoke pages (edit forms).
            Effects handle loading, saving, and removing items.
          </p>
          <p class="govuk-body govuk-!-margin-bottom-0">
            <strong>Example:</strong> Managing a list of menu items where users can add new items,
            edit existing ones, and remove items.
          </p>
        </div>
      `,
    }),

    // When to use each
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Use Each Pattern</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Use Case</th>
              <th scope="col" class="govuk-table__header">Pattern</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Display a read-only list from API data</td>
              <td class="govuk-table__cell">Collection Iteration</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Generate table rows from loaded data</td>
              <td class="govuk-table__cell">Collection Iteration</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Create dynamic fields from existing items</td>
              <td class="govuk-table__cell">Collection Iteration</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Let users add/edit/remove items</td>
              <td class="govuk-table__cell">Hub-and-Spoke Management</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Complex edit forms for list items</td>
              <td class="govuk-table__cell">Hub-and-Spoke Management</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Persist item changes to an API</td>
              <td class="govuk-table__cell">Hub-and-Spoke Management</td>
            </tr>
          </tbody>
        </table>

        <p class="govuk-body">
          <strong>Often you'll use both together:</strong> The hub page uses Collection Iteration
          to display items, while the full hub-and-spoke pattern handles the CRUD operations.
        </p>
      `,
    }),

    // What you'll learn
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">What You'll Learn</h2>

        <p class="govuk-body">This section covers:</p>

        <ol class="govuk-list govuk-list--number">
          <li>
            <strong>Collection Iteration</strong> &mdash;
            Using <code>Collection()</code> and <code>Item()</code> to render repeated content
          </li>
          <li>
            <strong>Hub-and-Spoke Architecture</strong> &mdash;
            Building list pages with edit forms for CRUD operations
          </li>
          <li>
            <strong>Effects for Collections</strong> &mdash;
            Loading, saving, and managing collection data
          </li>
          <li>
            <strong>Interactive Playground</strong> &mdash;
            Try out both patterns with working examples
          </li>
        </ol>
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
              href: '/forms/form-engine-developer-guide/components/extending',
              labelText: 'Extending Components',
            },
            next: {
              href: '/forms/form-engine-developer-guide/collections/iteration',
              labelText: 'Collection Iteration',
            },
          }),
        ],
      },
    }),
  ],
})
