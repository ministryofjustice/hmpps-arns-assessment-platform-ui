import { journey, loadTransition, createFormPackage } from '@form-engine/form/builders'
import { hubStep } from './steps/hub/step'
import { DeveloperGuideEffects, createDeveloperGuideEffectsRegistry } from './effects'

// Journeys & Steps module
import { introStep as journeysIntroStep } from './steps/journeys-and-steps/intro'
import { journeysStep } from './steps/journeys-and-steps/journeys'
import { stepsStep } from './steps/journeys-and-steps/steps'
import { nestedJourneysStep } from './steps/journeys-and-steps/nested-journeys'

// Blocks & Fields module
import { introStep as blocksIntroStep } from './steps/blocks-and-fields/intro'
import { blocksStep } from './steps/blocks-and-fields/blocks'
import { fieldsStep } from './steps/blocks-and-fields/fields'

// References module
import { introStep as referencesIntroStep } from './steps/references/intro'
import { answerStep } from './steps/references/answer'
import { dataStep } from './steps/references/data'
import { selfStep } from './steps/references/self'
import { itemStep } from './steps/references/item'
import { httpStep } from './steps/references/http'
import { chainingStep } from './steps/references/chaining'

// Conditions module
import { introStep as conditionsIntroStep } from './steps/conditions/intro'
import { customStep as conditionsCustomStep } from './steps/conditions/custom'
import { introStep as conditionsPlaygroundIntroStep } from './steps/conditions/playground/intro'
import { stringsStep as conditionsPlaygroundStringsStep } from './steps/conditions/playground/strings'
import { numbersStep as conditionsPlaygroundNumbersStep } from './steps/conditions/playground/numbers'
import { datesStep as conditionsPlaygroundDatesStep } from './steps/conditions/playground/dates'
import { combinatorsStep as conditionsPlaygroundCombinatorsStep } from './steps/conditions/playground/combinators'

// Validation module
import { introStep as validationIntroStep } from './steps/validation/intro'
import { patternsStep } from './steps/validation/patterns'
import { introStep as playgroundIntroStep } from './steps/validation/playground/intro'
import { stringsStep as playgroundStringsStep } from './steps/validation/playground/strings'
import { numbersStep as playgroundNumbersStep } from './steps/validation/playground/numbers'
import { datesStep as playgroundDatesStep } from './steps/validation/playground/dates'
import { arraysStep as playgroundArraysStep } from './steps/validation/playground/arrays'

// Expressions module
import { introStep as expressionsIntroStep } from './steps/expressions/intro'
import { formatStep as expressionsFormatStep } from './steps/expressions/format'
import { conditionalStep as expressionsConditionalStep } from './steps/expressions/conditional'
import { predicatesStep as expressionsPredicatesStep } from './steps/expressions/predicates'
import { collectionStep as expressionsCollectionStep } from './steps/expressions/collection'
import { introStep as expressionsPlaygroundIntroStep } from './steps/expressions/playground/intro'
import { formatStep as expressionsPlaygroundFormatStep } from './steps/expressions/playground/format'
import { conditionalStep as expressionsPlaygroundConditionalStep } from './steps/expressions/playground/conditional'
import { predicatesStep as expressionsPlaygroundPredicatesStep } from './steps/expressions/playground/predicates'
import { collectionStep as expressionsPlaygroundCollectionStep } from './steps/expressions/playground/collection'

// Transformers module
import { introStep as transformersIntroStep } from './steps/transformers/intro'
import { customStep as transformersCustomStep } from './steps/transformers/custom'
import { introStep as transformersPlaygroundIntroStep } from './steps/transformers/playground/intro'
import { stringsStep as transformersPlaygroundStringsStep } from './steps/transformers/playground/strings'
import { numbersStep as transformersPlaygroundNumbersStep } from './steps/transformers/playground/numbers'
import { arraysStep as transformersPlaygroundArraysStep } from './steps/transformers/playground/arrays'

// Effects module
import { introStep as effectsIntroStep } from './steps/effects/intro'
import { contextStep as effectsContextStep } from './steps/effects/context'
import { customStep as effectsCustomStep } from './steps/effects/custom'

// Transitions module
import { introStep as transitionsIntroStep } from './steps/transitions/intro'
import { loadStep as transitionsLoadStep } from './steps/transitions/load'
import { accessStep as transitionsAccessStep } from './steps/transitions/access'
import { actionStep as transitionsActionStep } from './steps/transitions/action'
import { submitStep as transitionsSubmitStep } from './steps/transitions/submit'
import { navigationStep as transitionsNavigationStep } from './steps/transitions/navigation'

// Components module
import { introStep as componentsIntroStep } from './steps/components/intro'
import { builtInStep as componentsBuiltInStep } from './steps/components/built-in'
import { customStep as componentsCustomStep } from './steps/components/custom'
import { extendingStep as componentsExtendingStep } from './steps/components/extending'

// Collections module
import { introStep as collectionsIntroStep } from './steps/collections/intro'
import { iterationStep as collectionsIterationStep } from './steps/collections/iteration'
import { hubSpokeStep as collectionsHubSpokeStep } from './steps/collections/hub-spoke'
import { effectsStep as collectionsEffectsStep } from './steps/collections/effects'
import { introStep as collectionsPlaygroundIntroStep } from './steps/collections/playground/intro'
import { iterationStep as collectionsPlaygroundIterationStep } from './steps/collections/playground/iteration'
import { hubStep as collectionsPlaygroundHubStep } from './steps/collections/playground/hub'
import { editStep as collectionsPlaygroundEditStep } from './steps/collections/playground/edit'

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
 * 10. Components - building and extending UI components
 * 11. Collections - hub-and-spoke item management
 */
const developerGuideJourney = journey({
  code: 'form-engine-developer-guide',
  title: 'Form Engine Developer Guide',
  path: '/form-engine-developer-guide',
  onLoad: [
    loadTransition({
      effects: [DeveloperGuideEffects.initializeSession()],
    }),
  ],
  view: {
    template: 'aap-developer-guide/views/template',
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
     *
     * Multi-step module covering:
     * - Introduction to references and their purpose
     * - Answer() for field values
     * - Data() for external data
     * - Self() for current field scope
     * - Item() for collection iteration
     * - Params(), Query(), Post() for HTTP request data
     * - Chaining with .pipe(), .match(), Format(), Conditional()
     */
    journey({
      code: 'references',
      title: 'References',
      path: '/references',
      steps: [referencesIntroStep, answerStep, dataStep, selfStep, itemStep, httpStep, chainingStep],
    }),

    /**
     * Concept 4: Conditions
     *
     * Complete reference of all condition types, combining conditions, and building custom conditions.
     */
    journey({
      code: 'conditions',
      title: 'Conditions',
      path: '/conditions',
      steps: [conditionsIntroStep, conditionsCustomStep],
      children: [
        /**
         * Conditions Playground
         *
         * Interactive examples showing conditions with dynamic content.
         */
        journey({
          code: 'playground',
          title: 'Conditions Playground',
          path: '/playground',
          steps: [
            conditionsPlaygroundIntroStep,
            conditionsPlaygroundStringsStep,
            conditionsPlaygroundNumbersStep,
            conditionsPlaygroundDatesStep,
            conditionsPlaygroundCombinatorsStep,
          ],
        }),
      ],
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
     *
     * Multi-step module covering:
     * - Introduction to expressions
     * - Format() string interpolation
     * - when()/Conditional() if/then/else logic
     * - Predicate combinators (and, or, xor, not)
     * - Collection() iteration
     */
    journey({
      code: 'expressions',
      title: 'Expressions',
      path: '/expressions',
      steps: [
        expressionsIntroStep,
        expressionsFormatStep,
        expressionsConditionalStep,
        expressionsPredicatesStep,
        expressionsCollectionStep,
      ],
      children: [
        /**
         * Expressions Playground
         *
         * Interactive examples where users can test expressions in real time.
         */
        journey({
          code: 'playground',
          title: 'Expressions Playground',
          path: '/playground',
          steps: [
            expressionsPlaygroundIntroStep,
            expressionsPlaygroundFormatStep,
            expressionsPlaygroundConditionalStep,
            expressionsPlaygroundPredicatesStep,
            expressionsPlaygroundCollectionStep,
          ],
        }),
      ],
    }),

    /**
     * Concept 7: Transformers
     *
     * How to use formatters/transformers to clean and normalise field values.
     * Includes building custom transformers with dependency injection.
     */
    journey({
      code: 'transformers',
      title: 'Transformers',
      path: '/transformers',
      steps: [transformersIntroStep, transformersCustomStep],
      children: [
        /**
         * Transformers Playground
         *
         * Interactive examples where users can test transformers in real time.
         */
        journey({
          code: 'playground',
          title: 'Transformers Playground',
          path: '/playground',
          steps: [
            transformersPlaygroundIntroStep,
            transformersPlaygroundStringsStep,
            transformersPlaygroundNumbersStep,
            transformersPlaygroundArraysStep,
          ],
        }),
      ],
    }),

    /**
     * Concept 8: Effects
     *
     * How to create and use effect functions for side effects during form processing.
     * Covers the context API and building custom effects with dependency injection.
     */
    journey({
      code: 'effects',
      title: 'Effects',
      path: '/effects',
      steps: [effectsIntroStep, effectsContextStep, effectsCustomStep],
    }),

    /**
     * Concept 9: Transitions
     *
     * Multi-step module covering:
     * - Introduction and lifecycle overview
     * - loadTransition() for data loading
     * - accessTransition() for access control
     * - actionTransition() for in-page actions
     * - submitTransition() for form submission
     * - next() and navigation patterns
     */
    journey({
      code: 'transitions',
      title: 'Transitions',
      path: '/transitions',
      steps: [
        transitionsIntroStep,
        transitionsLoadStep,
        transitionsAccessStep,
        transitionsActionStep,
        transitionsSubmitStep,
        transitionsNavigationStep,
      ],
    }),

    /**
     * Concept 10: Components
     *
     * Multi-step module covering:
     * - Understanding block() vs field()
     * - Built-in component packages (Core, GOV.UK, MOJ)
     * - Building custom components
     * - Extending and wrapping existing components
     */
    journey({
      code: 'components',
      title: 'Components',
      path: '/components',
      steps: [componentsIntroStep, componentsBuiltInStep, componentsCustomStep, componentsExtendingStep],
    }),

    /**
     * Concept 11: Collections
     *
     * Multi-step module covering:
     * - Collection iteration with Collection() and Item()
     * - Hub-and-spoke architecture for CRUD operations
     * - Effects for collection management
     * - Interactive playground with fully working CRUD demo
     */
    journey({
      code: 'collections',
      title: 'Collections',
      path: '/collections',
      steps: [collectionsIntroStep, collectionsIterationStep, collectionsHubSpokeStep, collectionsEffectsStep],
      children: [
        /**
         * Collections Playground
         *
         * Interactive examples including a fully working task manager demo.
         */
        journey({
          code: 'playground',
          title: 'Collections Playground',
          path: '/playground',
          steps: [
            collectionsPlaygroundIntroStep,
            collectionsPlaygroundIterationStep,
            collectionsPlaygroundHubStep,
            collectionsPlaygroundEditStep,
          ],
        }),
      ],
    }),
  ],
})

export default createFormPackage({
  journey: developerGuideJourney,
  createRegistries: () => ({
    ...createDeveloperGuideEffectsRegistry({}),
  }),
})
