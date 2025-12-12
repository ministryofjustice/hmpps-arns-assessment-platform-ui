import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Transitions - Introduction
 *
 * Overview of the transition system, lifecycle hooks, and execution semantics.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Transitions',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Transitions</h1>

        <p class="govuk-body-l">
          Transitions control what happens at key moments in a form's lifecycle &mdash;
          loading data, checking access, handling in-page actions, and processing submissions.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">The Four Transition Types</h2>

        <p class="govuk-body">
          Each transition type serves a specific purpose in the form lifecycle:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Type</th>
              <th scope="col" class="govuk-table__header">Where Used</th>
              <th scope="col" class="govuk-table__header">Purpose</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>loadTransition()</code></td>
              <td class="govuk-table__cell">Journey &amp; Step</td>
              <td class="govuk-table__cell">Load data before access checks</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>accessTransition()</code></td>
              <td class="govuk-table__cell">Journey &amp; Step</td>
              <td class="govuk-table__cell">Check permissions, redirect if denied</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>actionTransition()</code></td>
              <td class="govuk-table__cell">Step only</td>
              <td class="govuk-table__cell">Handle in-page actions (e.g., lookups)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>submitTransition()</code></td>
              <td class="govuk-table__cell">Step only</td>
              <td class="govuk-table__cell">Validate, save, and navigate</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Lifecycle flow diagram
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Lifecycle Flow</h2>

        <p class="govuk-body">
          Transitions execute in a strict order. Understanding this order is essential
          for building forms correctly.
        </p>

        <h3 class="govuk-heading-s">GET Request (viewing a page)</h3>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'bash',
      code: `1. Journey.onLoad     → Load shared data
2. Journey.onAccess   → Check journey-level permissions
3. Step.onLoad        → Load step-specific data
4. Step.onAccess      → Check step-level permissions
5. Blocks render      → Display the page`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h3 class="govuk-heading-s">POST Request (submitting a form)</h3>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'bash',
      code: `1. Step.onLoad        → Load step data
2. Step.onAccess      → Check permissions
3. Step.onAction      → Handle in-page actions (runs BEFORE render)
4. Blocks render      → Display with action results
5. Step.onSubmission  → Validate and navigate`,
    }),

    // Execution semantics - critical section
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Execution Semantics</h2>

        <div class="govuk-warning-text">
          <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong class="govuk-warning-text__text">
            <span class="govuk-visually-hidden">Warning</span>
            Not all transition arrays execute the same way. This is critical to understand.
          </strong>
        </div>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Hook</th>
              <th scope="col" class="govuk-table__header">Execution</th>
              <th scope="col" class="govuk-table__header">Why</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>onLoad[]</code></td>
              <td class="govuk-table__cell"><strong>ALL</strong> execute</td>
              <td class="govuk-table__cell">You may need to load multiple data sources</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>onAccess[]</code></td>
              <td class="govuk-table__cell"><strong>First match</strong> executes</td>
              <td class="govuk-table__cell">First denial condition that matches triggers redirect</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>onAction[]</code></td>
              <td class="govuk-table__cell"><strong>First match</strong> executes</td>
              <td class="govuk-table__cell">Only one action should handle a button click</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>onSubmission[]</code></td>
              <td class="govuk-table__cell"><strong>First match</strong> executes</td>
              <td class="govuk-table__cell">Only one submission handler per button</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Import statement
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Import</h2>
        <p class="govuk-body">Import transition builders from the form builders module:</p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `import {
  // Transition builders
  loadTransition,
  accessTransition,
  actionTransition,
  submitTransition,
  // Navigation builder
  next,
  // HTTP references (for 'when' conditions)
  Post, Params, Query,
} from '@form-engine/form/builders'`,
          }),
        ],
      },
    }),

    // Basic example
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Example</h2>
        <p class="govuk-body">
          Here's a step with all four transition types. Most steps won't need all of them &mdash;
          typically just <code>onSubmission</code> is required.
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `step({
  path: '/my-step',
  title: 'My Step',

  // 1. Load data needed for this step
  onLoad: [
    loadTransition({
      effects: [MyEffects.loadUserData()],
    }),
  ],

  // 2. Check if user can access this step (denial condition)
  onAccess: [
    accessTransition({
      guards: Data('user.authenticated').not.match(Condition.Equals(true)),
      redirect: [next({ goto: '/login' })],
    }),
  ],

  // 3. Handle in-page actions (e.g., lookup buttons)
  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('lookup')),
      effects: [MyEffects.performLookup()],
    }),
  ],

  // 4. Handle form submission
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [MyEffects.saveAnswers()],
        next: [next({ goto: '/next-step' })],
      },
    }),
  ],

  blocks: [/* ... */],
})`,
          }),
        ],
      },
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
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Guide Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/transitions/load',
              labelText: 'Load Transitions',
            },
          }),
        ],
      },
    }),
  ],
})
