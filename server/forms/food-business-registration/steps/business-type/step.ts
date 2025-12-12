import { next, step, submitTransition } from '@form-engine/form/builders'
import { FoodBusinessEffects } from '../../effects'
import { assessmentIdDisplay, businessType, saveAndContinueButton } from './fields'

/**
 * STEP 1: Business Type Selection
 *
 * Features demonstrated:
 * - GovUKRadioInput component
 * - Basic required field validation
 * - Simple conditional reveal (trading hours for mobile businesses)
 */
export const businessTypeStep = step({
  path: '/business-type',
  title: 'Business Type Selection',
  isEntryPoint: true,
  blocks: [assessmentIdDisplay, businessType, saveAndContinueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        effects: [FoodBusinessEffects.saveStepAnswers()],
        next: [next({ goto: 'business-details' })],
      },
    }),
  ],
})
