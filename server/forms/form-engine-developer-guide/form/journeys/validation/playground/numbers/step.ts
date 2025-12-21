import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Validation Playground - Numbers
 *
 * Interactive examples of number validation conditions.
 */
export const numbersStep = step({
  path: '/numbers',
  title: 'Number Validation',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
