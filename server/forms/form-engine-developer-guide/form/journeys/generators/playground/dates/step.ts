import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Generators Playground - Dates
 *
 * Interactive examples of date generators.
 */
export const datesStep = step({
  path: '/dates',
  title: 'Date Generators',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
