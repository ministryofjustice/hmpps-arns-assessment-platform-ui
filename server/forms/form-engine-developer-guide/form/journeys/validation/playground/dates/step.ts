import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Validation Playground - Dates
 *
 * Interactive examples of date validation conditions.
 */
export const datesStep = step({
  path: '/dates',
  title: 'Date Validation',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
