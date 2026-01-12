import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Conditions Playground - Dates
 *
 * Interactive examples of date conditions with validation.
 */
export const datesStep = step({
  path: '/dates',
  title: 'Date Conditions',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
