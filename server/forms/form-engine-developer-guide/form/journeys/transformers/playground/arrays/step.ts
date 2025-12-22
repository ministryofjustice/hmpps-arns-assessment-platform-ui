import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transformers Playground - Arrays
 *
 * Interactive examples of array transformers.
 */
export const arraysStep = step({
  path: '/arrays',
  title: 'Array Transformers',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
