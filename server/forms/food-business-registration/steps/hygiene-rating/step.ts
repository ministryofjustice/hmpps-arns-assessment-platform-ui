import { next, step, submitTransition } from '@form-engine/form/builders'
import { FoodBusinessEffects } from '../../effects'
import {
  hasHygieneRating,
  hygieneInspectionDate,
  hygieneRating,
  hygieneRatingHeading,
  improvementNotes,
  saveAndContinueButton,
} from './fields'

/**
 * STEP 7: Food Hygiene Rating
 *
 * Features demonstrated:
 * - Date input component (GovUKDateInputFull)
 * - Complex nested conditionals (rating → inspection date → improvement notes)
 * - Date validation (in past, within range)
 * - Conditional field visibility chains
 */
export const hygieneRatingStep = step({
  path: '/hygiene-rating',
  title: 'Food Hygiene Rating',
  blocks: [
    hygieneRatingHeading,
    hasHygieneRating,
    hygieneRating,
    hygieneInspectionDate,
    improvementNotes,
    saveAndContinueButton,
  ],

  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [FoodBusinessEffects.saveStepAnswers()],
        next: [next({ goto: 'review' })],
      },
    }),
  ],
})
