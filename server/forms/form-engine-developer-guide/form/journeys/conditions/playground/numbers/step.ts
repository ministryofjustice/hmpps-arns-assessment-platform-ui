import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Conditions Playground - Numbers
 *
 * Interactive examples of number conditions with validation.
 */
export const numbersStep = step({
  path: '/numbers',
  title: 'Number Conditions',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
