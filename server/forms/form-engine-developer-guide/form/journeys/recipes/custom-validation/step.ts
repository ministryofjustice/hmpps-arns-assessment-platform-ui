import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: Custom Validation
 *
 * How to add validation with a custom error message.
 */
export const customValidationStep = step({
  path: '/custom-validation',
  title: 'Custom Validation',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
