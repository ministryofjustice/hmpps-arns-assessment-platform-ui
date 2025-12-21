import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transformers Playground - Numbers
 *
 * Interactive examples of number transformers.
 */
export const numbersStep = step({
  path: '/numbers',
  title: 'Number Transformers',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
