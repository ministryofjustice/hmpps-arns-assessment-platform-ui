import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { conditionalVisibilityStep } from './conditional-visibility/step'
import { customValidationStep } from './custom-validation/step'
import { loadDataStep } from './load-data/step'
import { formatValueStep } from './format-value/step'
import { saveAnswersStep } from './save-answers/step'
import { dynamicOptionsStep } from './dynamic-options/step'
import { branchingNavigationStep } from './branching-navigation/step'
import { actionLookupStep } from './action-lookup/step'

/**
 * Recipes Journey
 *
 * Quick reference recipes for common form patterns.
 * Each recipe shows a complete, copy-paste ready example.
 */
export const recipesJourney = journey({
  code: 'recipes',
  title: 'Recipes',
  path: '/recipes',
  steps: [
    introStep,
    conditionalVisibilityStep,
    customValidationStep,
    loadDataStep,
    formatValueStep,
    saveAnswersStep,
    dynamicOptionsStep,
    branchingNavigationStep,
    actionLookupStep,
  ],
})
