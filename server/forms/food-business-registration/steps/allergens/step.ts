import { loadTransition, next, step, submitTransition } from '@form-engine/form/builders'
import { FoodBusinessEffects } from '../../effects'
import {
  allergenHeading,
  allergenPolicyDetails,
  allergenPolicyInPlace,
  allergenStaffTraining,
  saveAndContinueButton,
} from './fields'

/**
 * STEP 6: Allergen Management
 *
 * Features demonstrated:
 * - Effect-driven validation (validateAllergenConsistency)
 * - Derived data from menu items
 * - Textarea with guidance
 * - Complex conditional logic
 */
export const allergensStep = step({
  path: '/allergens',
  title: 'Allergen Management',
  onLoad: [
    loadTransition({
      effects: [FoodBusinessEffects.validateAllergenConsistency()],
    }),
  ],
  blocks: [allergenHeading, allergenPolicyInPlace, allergenPolicyDetails, allergenStaffTraining, saveAndContinueButton],

  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [FoodBusinessEffects.saveStepAnswers()],
        next: [next({ goto: 'hygiene-rating' })],
      },
    }),
  ],
})
