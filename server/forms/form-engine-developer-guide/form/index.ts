import { journey, accessTransition } from '@form-engine/form/builders'
import { hubStep } from './steps/hub/step'
import { DeveloperGuideEffects } from '../effects'
import { formRegistrationJourney } from './journeys/form-registration'
import { journeysAndStepsJourney } from './journeys/journeys-and-steps'
import { blocksAndFieldsJourney } from './journeys/blocks-and-fields'
import { referencesJourney } from './journeys/references'
import { conditionsJourney } from './journeys/conditions'
import { validationJourney } from './journeys/validation'
import { expressionsJourney } from './journeys/expressions'
import { transformersJourney } from './journeys/transformers'
import { generatorsJourney } from './journeys/generators'
import { effectsJourney } from './journeys/effects'
import { transitionsJourney } from './journeys/transitions'
import { iteratorsJourney } from './journeys/iterators'
import { componentsJourney } from './journeys/components'
import { recipesJourney } from './journeys/recipes'

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
 * 1. Form Registration - form packages and registration
 * 2. Journeys & Steps - form structure and hierarchy
 * 3. Blocks & Fields - display vs input components
 * 4. Components - building and extending UI components
 * 5. References - Answer(), Data(), Self(), Item(), Params(), Post()
 * 6. Expressions - computed values and logic
 * 7. Transformers - value pipelines
 * 8. Generators - dynamic value creation
 * 9. Iterators - array transformation and filtering
 * 10. Conditions - value testing and matching
 * 11. Validation - rules and error messages
 * 12. Effects - lifecycle side effects
 * 13. Transitions - access/action/submit handling
 * 14. Recipes - quick reference patterns
 */
export const developerGuideJourney = journey({
  code: 'form-engine-developer-guide',
  title: 'Form Engine Developer Guide',
  path: '/form-engine-developer-guide',
  onAccess: [
    accessTransition({
      effects: [DeveloperGuideEffects.initializeSession()],
    }),
  ],
  view: {
    template: 'form-engine-developer-guide/views/template',
  },
  steps: [hubStep],
  children: [
    formRegistrationJourney,
    journeysAndStepsJourney,
    blocksAndFieldsJourney,
    componentsJourney,
    referencesJourney,
    expressionsJourney,
    transformersJourney,
    generatorsJourney,
    iteratorsJourney,
    conditionsJourney,
    validationJourney,
    effectsJourney,
    transitionsJourney,
    recipesJourney,
  ],
})
