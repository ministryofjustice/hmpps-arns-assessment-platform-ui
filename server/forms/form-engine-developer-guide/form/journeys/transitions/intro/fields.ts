import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Transitions - Introduction
 *
 * Overview of the transition system, lifecycle hooks, and execution semantics.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Transitions

  Transitions control what happens at key moments in a form's lifecycle —
  loading data, checking access, handling in-page actions, and processing submissions. {.lead}

  ---

  ## The Four Transition Types

  Each transition type serves a specific purpose in the form lifecycle:

  | Type | Where Used | Purpose |
  |------|------------|---------|
  | \`loadTransition()\` | Journey & Step | Load data before access checks |
  | \`accessTransition()\` | Journey & Step | Check permissions, redirect if denied |
  | \`actionTransition()\` | Step only | Handle in-page actions (e.g., lookups) |
  | \`submitTransition()\` | Step only | Validate, save, and navigate |

  ---

  ## Lifecycle Flow

  Transitions execute in a strict order. Understanding this order is essential
  for building forms correctly.

  ### GET Request (viewing a page)

  {{slot:getFlowCode}}

  ### POST Request (submitting a form)

  {{slot:postFlowCode}}

  ---

  ## Execution Semantics

  <div class="govuk-warning-text">
    <span class="govuk-warning-text__icon" aria-hidden="true">!</span>
    <strong class="govuk-warning-text__text">
      <span class="govuk-visually-hidden">Warning</span>
      Not all transition arrays execute the same way. This is critical to understand.
    </strong>
  </div>

  | Hook | Execution | Why |
  |------|-----------|-----|
  | \`onLoad[]\` | **ALL** execute | You may need to load multiple data sources |
  | \`onAccess[]\` | **First match** executes | First denial condition that matches triggers redirect |
  | \`onAction[]\` | **First match** executes | Only one action should handle a button click |
  | \`onSubmission[]\` | **First match** executes | Only one submission handler per button |

  ---

  ## Import

  Import transition builders from the form builders module:

  {{slot:importCode}}

  ---

  ## Basic Example

  Here's a step with all four transition types. Most steps won't need all of them —
  typically just \`onSubmission\` is required.

  {{slot:basicExampleCode}}

  ---

  {{slot:pagination}}
`),
  slots: {
    getFlowCode: [
      CodeBlock({
        language: 'bash',
        code: `
          1. Journey.onLoad     → Load shared data
          2. Journey.onAccess   → Check journey-level permissions
          3. Step.onLoad        → Load step-specific data
          4. Step.onAccess      → Check step-level permissions
          5. Blocks render      → Display the page
        `,
      }),
    ],
    postFlowCode: [
      CodeBlock({
        language: 'bash',
        code: `
          1. Step.onLoad        → Load step data
          2. Step.onAccess      → Check permissions
          3. Step.onAction      → Handle in-page actions (runs BEFORE render)
          4. Blocks render      → Display with action results
          5. Step.onSubmission  → Validate and navigate
        `,
      }),
    ],
    importCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import {
            // Transition builders
            loadTransition,
            accessTransition,
            actionTransition,
            submitTransition,
            // Navigation builder
            next,
            // HTTP references (for 'when' conditions)
            Post, Params, Query,
          } from '@form-engine/form/builders'
        `,
      }),
    ],
    basicExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          step({
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
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/effects/context',
          labelText: 'Effect Context',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transitions/load',
          labelText: 'Load Transitions',
        },
      }),
    ],
  },
})
