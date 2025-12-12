import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Collections Playground - Intro
 *
 * Entry point to the interactive collection examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Collections Playground',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Collections Playground</h1>

        <p class="govuk-body-l">
          Try out collection patterns with interactive examples.
          See both iteration and hub-and-spoke management in action.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Choose an example</h2>

        <ul class="govuk-list">
          <li>
            <a href="/forms/form-engine-developer-guide/collections/playground/iteration" class="govuk-link govuk-link--no-visited-state">
              <strong>Collection Iteration</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Use <code>Collection()</code> and <code>Item()</code> to render lists,
              tables, and repeated content from arrays.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/collections/playground/hub" class="govuk-link govuk-link--no-visited-state">
              <strong>Hub-and-Spoke CRUD</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Fully interactive task manager. Add, edit, and remove items
              using the hub-and-spoke pattern.
            </p>
          </li>
        </ul>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">How the CRUD Demo Works</h2>

        <p class="govuk-body">
          The hub-and-spoke demo is a working task manager:
        </p>

        <ol class="govuk-list govuk-list--number">
          <li>The <strong>hub page</strong> lists your tasks</li>
          <li>Click <strong>"Add task"</strong> to create a new one</li>
          <li>Click <strong>"Edit"</strong> on any task to modify it</li>
          <li>Changes persist in your session while you explore</li>
        </ol>

        <p class="govuk-body">
          This demonstrates the full pattern including effects for loading,
          saving, and URL parameters for item identification.
        </p>
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
              href: '/forms/form-engine-developer-guide/collections/effects',
              labelText: 'Collection Effects',
            },
            next: {
              href: '/forms/form-engine-developer-guide/collections/playground/iteration',
              labelText: 'Iteration Examples',
            },
          }),
        ],
      },
    }),
  ],
})
