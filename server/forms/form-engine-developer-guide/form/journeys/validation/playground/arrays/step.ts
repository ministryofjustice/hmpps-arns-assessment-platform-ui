import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Validation Playground - Arrays
 *
 * Interactive examples of array validation conditions (for multi-select fields).
 */
export const arraysStep = step({
  path: '/arrays',
  title: 'Array Validation',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
