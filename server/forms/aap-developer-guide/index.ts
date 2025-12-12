import { journey, loadTransition, step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { hubStep } from './steps/hub/step'
import { DeveloperGuideEffects } from './effects'

// Journeys & Steps module
import { introStep as journeysIntroStep } from './steps/journeys-and-steps/intro'
import { journeysStep } from './steps/journeys-and-steps/journeys'
import { stepsStep } from './steps/journeys-and-steps/steps'
import { nestedJourneysStep } from './steps/journeys-and-steps/nested-journeys'

// Blocks & Fields module
import { introStep as blocksIntroStep } from './steps/blocks-and-fields/intro'
import { blocksStep } from './steps/blocks-and-fields/blocks'
import { fieldsStep } from './steps/blocks-and-fields/fields'

// Conditions module
import { introStep as conditionsIntroStep } from './steps/conditions/intro'

// Validation module
import { introStep as validationIntroStep } from './steps/validation/intro'
import { patternsStep } from './steps/validation/patterns'
import { introStep as playgroundIntroStep } from './steps/validation/playground/intro'
import { stringsStep as playgroundStringsStep } from './steps/validation/playground/strings'
import { numbersStep as playgroundNumbersStep } from './steps/validation/playground/numbers'
import { datesStep as playgroundDatesStep } from './steps/validation/playground/dates'
import { arraysStep as playgroundArraysStep } from './steps/validation/playground/arrays'

// Transformers module
import { introStep as transformersIntroStep } from './steps/transformers/intro'

/**
 * Form Engine Developer Guide
 *
 * An interactive tutorial that teaches form-engine concepts to developers.
 * Demonstrates each concept with live examples alongside visible code snippets.
 *
 * Structure:
 * - Main journey with hub step (concept index)
 * - Child sub-journeys for each concept module
 *
 * Concepts covered:
 * 1. Journeys & Steps - form structure and hierarchy
 * 2. Blocks & Fields - display vs input components
 * 3. References - Answer(), Data(), Self(), Item(), Params(), Post()
 * 4. Conditions - value testing and matching
 * 5. Validation - rules and error messages
 * 6. Expressions - computed values and logic
 * 7. Transformers - value pipelines
 * 8. Effects - lifecycle side effects
 * 9. Transitions - load/submit handling
 * 10. Collections - hub-and-spoke item management
 */
export default journey({
  code: 'form-engine-developer-guide',
  title: 'Form Engine Developer Guide',
  path: '/form-engine-developer-guide',
  onLoad: [
    loadTransition({
      effects: [DeveloperGuideEffects.initializeSession()],
    }),
  ],
  view: {
    template: 'partials/form-step',
  },
  steps: [hubStep],
  children: [
    /**
     * Concept 1: Journeys & Steps
     *
     * Multi-step module covering:
     * - Introduction to journeys and steps
     * - journey() builder configuration
     * - step() builder configuration
     * - Nested journeys with children
     */
    journey({
      code: 'journeys-and-steps',
      title: 'Journeys & Steps',
      path: '/journeys-and-steps',
      steps: [journeysIntroStep, journeysStep, stepsStep, nestedJourneysStep],
    }),

    /**
     * Concept 2: Blocks & Fields
     *
     * Multi-step module covering:
     * - Introduction to blocks and fields
     * - block() builder and block types
     * - field() builder and field types
     */
    journey({
      code: 'blocks-and-fields',
      title: 'Blocks & Fields',
      path: '/blocks-and-fields',
      steps: [blocksIntroStep, blocksStep, fieldsStep],
    }),

    /**
     * Concept 3: References
     */
    journey({
      code: 'references',
      title: 'References',
      path: '/references',
      steps: [
        step({
          path: '/intro',
          title: 'Understanding References',
          blocks: [
            block<HtmlBlock>({
              variant: 'html',
              content: `
                <h1 class="govuk-heading-l">References</h1>
                <p class="govuk-body-l">
                  <strong>References</strong> point to data in the form engine.
                  They get resolved at runtime to retrieve actual values.
                </p>
                <p class="govuk-body">
                  This section is under construction. Check back soon for the full content.
                </p>
                <p class="govuk-body">
                  <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
                </p>
              `,
            }),
          ],
        }),
      ],
    }),

    /**
     * Concept 4: Conditions
     *
     * Complete reference of all condition types and combining conditions.
     */
    journey({
      code: 'conditions',
      title: 'Conditions',
      path: '/conditions',
      steps: [conditionsIntroStep],
    }),

    /**
     * Concept 5: Validation
     *
     * Multi-step module covering:
     * - Introduction and validation() builder
     * - Common validation patterns
     * - Interactive playground with live examples
     */
    journey({
      code: 'validation',
      title: 'Validation',
      path: '/validation',
      steps: [validationIntroStep, patternsStep],
      children: [
        /**
         * Validation Playground
         *
         * Interactive examples where users can test validation in real time.
         */
        journey({
          code: 'playground',
          title: 'Validation Playground',
          path: '/playground',
          steps: [
            playgroundIntroStep,
            playgroundStringsStep,
            playgroundNumbersStep,
            playgroundDatesStep,
            playgroundArraysStep,
          ],
        }),
      ],
    }),

    /**
     * Concept 6: Expressions
     */
    journey({
      code: 'expressions',
      title: 'Expressions',
      path: '/expressions',
      steps: [
        step({
          path: '/intro',
          title: 'Understanding Expressions',
          blocks: [
            block<HtmlBlock>({
              variant: 'html',
              content: `
                <h1 class="govuk-heading-l">Expressions</h1>
                <p class="govuk-body-l">
                  <strong>Expressions</strong> compute values dynamically.
                  Format text, apply conditional logic, and transform data.
                </p>
                <p class="govuk-body">
                  This section is under construction. Check back soon for the full content.
                </p>
                <p class="govuk-body">
                  <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
                </p>
              `,
            }),
          ],
        }),
      ],
    }),

    /**
     * Concept 7: Transformers
     *
     * How to use formatters/transformers to clean and normalise field values.
     */
    journey({
      code: 'transformers',
      title: 'Transformers',
      path: '/transformers',
      steps: [transformersIntroStep],
    }),

    /**
     * Concept 8: Effects
     */
    journey({
      code: 'effects',
      title: 'Effects',
      path: '/effects',
      steps: [
        step({
          path: '/intro',
          title: 'Understanding Effects',
          blocks: [
            block<HtmlBlock>({
              variant: 'html',
              content: `
                <h1 class="govuk-heading-l">Effects</h1>
                <p class="govuk-body-l">
                  <strong>Effects</strong> are functions that run at specific lifecycle points.
                  Load data, save answers, call APIs, and manage side effects.
                </p>
                <p class="govuk-body">
                  This section is under construction. Check back soon for the full content.
                </p>
                <p class="govuk-body">
                  <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
                </p>
              `,
            }),
          ],
        }),
      ],
    }),

    /**
     * Concept 9: Transitions
     */
    journey({
      code: 'transitions',
      title: 'Transitions',
      path: '/transitions',
      steps: [
        step({
          path: '/intro',
          title: 'Understanding Transitions',
          blocks: [
            block<HtmlBlock>({
              variant: 'html',
              content: `
                <h1 class="govuk-heading-l">Transitions</h1>
                <p class="govuk-body-l">
                  <strong>Transitions</strong> control what happens on load and submit.
                  Run effects, validate input, and navigate between steps.
                </p>
                <p class="govuk-body">
                  This section is under construction. Check back soon for the full content.
                </p>
                <p class="govuk-body">
                  <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
                </p>
              `,
            }),
          ],
        }),
      ],
    }),

    /**
     * Concept 10: Collections
     */
    journey({
      code: 'collections',
      title: 'Collections',
      path: '/collections',
      steps: [
        step({
          path: '/intro',
          title: 'Understanding Collections',
          blocks: [
            block<HtmlBlock>({
              variant: 'html',
              content: `
                <h1 class="govuk-heading-l">Collections</h1>
                <p class="govuk-body-l">
                  <strong>Collections</strong> manage lists of items using hub-and-spoke pattern.
                  Add, edit, and remove items with dedicated edit pages.
                </p>
                <p class="govuk-body">
                  This section is under construction. Check back soon for the full content.
                </p>
                <p class="govuk-body">
                  <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
                </p>
              `,
            }),
          ],
        }),
      ],
    }),
  ],
})
