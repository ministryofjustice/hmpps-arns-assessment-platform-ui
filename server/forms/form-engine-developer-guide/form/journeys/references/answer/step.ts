import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * References - Answer()
 *
 * Comprehensive documentation for the Answer() reference,
 * including usage patterns, nested properties, and common scenarios.
 */
export const answerStep = step({
  path: '/answer',
  title: 'Answer Reference',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
