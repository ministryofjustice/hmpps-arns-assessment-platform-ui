import {
  step,
  block,
  Format,
  Item,
  Collection,
  Data,
  Post,
  loadTransition,
  actionTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { GovUKButton, GovUKDetails, GovUKPagination } from '@form-engine-govuk-components/components'
import { DeveloperGuideEffects } from '../../../effects'

/**
 * Collections Playground - Hub (CRUD Demo)
 *
 * Interactive task list demonstrating the hub-and-spoke pattern.
 * Users can add, edit, and remove tasks.
 */
export const hubStep = step({
  path: '/hub',
  title: 'Task Manager',

  // Initialize items on page load
  onLoad: [
    loadTransition({
      effects: [DeveloperGuideEffects.initializePlaygroundItems()],
    }),
  ],

  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Task Manager</h1>

        <p class="govuk-body-l">
          This is a fully interactive demo of the hub-and-spoke pattern.
          Add, edit, and remove tasks &mdash; your changes persist in your session.
        </p>

        <div class="govuk-inset-text">
          <strong>Try it:</strong> Click "Add task" to create a new task, or "Edit" to modify an existing one.
          Changes are saved to your session and will persist as you navigate.
        </div>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Your tasks</h2>
      `,
    }),

    // Tasks collection
    block<CollectionBlock>({
      variant: 'collection-block',
      collection: Collection({
        collection: Data('playgroundItems'),
        template: [
          block<HtmlBlock>({
            variant: 'html',
            content: Format(
              `<div class="govuk-summary-card govuk-!-margin-bottom-3">
                <div class="govuk-summary-card__title-wrapper">
                  <h3 class="govuk-summary-card__title">%1</h3>
                  <ul class="govuk-summary-card__actions">
                    <li class="govuk-summary-card__action">
                      <a href="hub/%2/edit" class="govuk-link">Edit<span class="govuk-visually-hidden"> %1</span></a>
                    </li>
                  </ul>
                </div>
                <div class="govuk-summary-card__content">
                  <dl class="govuk-summary-list">
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Description</dt>
                      <dd class="govuk-summary-list__value">%3</dd>
                    </div>
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Category</dt>
                      <dd class="govuk-summary-list__value">%4</dd>
                    </div>
                    <div class="govuk-summary-list__row">
                      <dt class="govuk-summary-list__key">Priority</dt>
                      <dd class="govuk-summary-list__value">%5</dd>
                    </div>
                  </dl>
                </div>
              </div>`,
              Item().path('name'),
              Item().path('id'),
              when(Item().path('description').match(Condition.IsRequired()))
                .then(Item().path('description'))
                .else('<em class="govuk-hint">No description</em>'),
              when(Item().path('category').match(Condition.IsRequired()))
                .then(Item().path('category'))
                .else('<em class="govuk-hint">Uncategorized</em>'),
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
        fallback: [
          block<HtmlBlock>({
            variant: 'html',
            content: `
              <div class="govuk-inset-text">
                <p class="govuk-body">"Master Chief, mind telling me what you're doing with an <strong>empty task list</strong>?"</p>
                <p class="govuk-body govuk-!-margin-bottom-0"><em>"Sir, finishing this fight."</em></p>
              </div>
            `,
          }),
        ],
      }),
    }),

    // Add task and reset buttons
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <form method="post">
          <input type="hidden" name="_csrf" value="{{csrfToken}}">
          <div class="govuk-button-group govuk-!-margin-top-4">
            <a href="hub/new/edit" class="govuk-button govuk-button--secondary" role="button">
              Add task
            </a>
            {{slot:resetButton}}
          </div>
        </form>
      `,
      values: {
        csrfToken: Data('csrfToken'),
      },
      slots: {
        resetButton: [
          block<GovUKButton>({
            variant: 'govukButton',
            text: 'Reset to defaults',
            name: 'action',
            value: 'reset',
            classes: 'govuk-button--warning',
          }),
        ],
      },
    }),

    // Code examples
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">How this works</h2>
        <p class="govuk-body">
          This page is the <strong>hub</strong> in the hub-and-spoke pattern.
          It displays items using <code>Collection()</code> and links to edit pages.
        </p>
      `,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View hub page code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `step({
  path: '/hub',
  title: 'Task Manager',

  // Load items on page access
  onLoad: [
    loadTransition({
      effects: [MyEffects.initializePlaygroundItems()],
    }),
  ],

  blocks: [
    // Collection display
    block<CollectionBlock>({
      collection: Collection({
        collection: Data('playgroundItems'),
        template: [
          block<HtmlBlock>({
            content: Format(
              \`<div class="govuk-summary-card">
                <h3>%1</h3>
                <a href="hub/%2/edit">Edit</a>
                <p>%3</p>
              </div>\`,
              Item().path('name'),
              Item().path('id'),        // ID for edit link
              Item().path('description')
            ),
          }),
        ],
        fallback: [
          block<HtmlBlock>({
            content: '<p>No tasks yet.</p>',
          }),
        ],
      }),
    }),

    // Add button (links to hub/new/edit)
    block<HtmlBlock>({
      content: '<a href="hub/new/edit">Add task</a>',
    }),
  ],
})`,
        }),
      ],
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View initialize effect code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `initializePlaygroundItems: _deps => (context: EffectFunctionContext) => {
  const session = context.getSession()

  // Initialize with sample data if empty
  if (!session.playgroundItems) {
    session.playgroundItems = [
      { id: 'task_1', name: 'Review documentation', category: 'learning', priority: 'high' },
      { id: 'task_2', name: 'Build a demo form', category: 'development', priority: 'medium' },
      { id: 'task_3', name: 'Write tests', category: 'development', priority: 'low' },
    ]
  }

  // Make items available to Collection() via Data()
  context.setData('playgroundItems', session.playgroundItems)
}`,
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
              href: '/forms/form-engine-developer-guide/collections/playground/iteration',
              labelText: 'Iteration Examples',
            },
          }),
        ],
      },
    }),
  ],

  // Handle reset action (stays on page)
  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('reset')),
      effects: [DeveloperGuideEffects.resetPlaygroundItems()],
    }),
  ],
})
