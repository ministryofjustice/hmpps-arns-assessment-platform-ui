import { next, step, submitTransition } from '@form-engine/form/builders'
import { FoodBusinessEffects } from '../../effects'
import { operatorQualifications, operatorSameAsBusiness, saveAndContinueButton } from './fields'

/**
 * STEP 3: Operator Details
 *
 * Features demonstrated:
 * - Conditional field groups (operator same as business)
 * - Checkbox multi-select (qualifications)
 * - submissionOnly validation (qualification requirement)
 * - Answer() references for conditional logic
 */
export const operatorDetailsStep = step({
  path: '/operator-details',
  title: 'Operator Details',
  blocks: [operatorSameAsBusiness, operatorQualifications, saveAndContinueButton],

  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [FoodBusinessEffects.saveStepAnswers()],
        next: [next({ goto: 'menu-items' })],
      },
    }),
  ],
})
