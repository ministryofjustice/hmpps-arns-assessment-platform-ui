import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Journeys & Steps - Step Configuration
 *
 * Deep dive into the step() builder and all its configuration options.
 */
export const stepsStep = step({
  path: '/steps',
  title: 'Step Configuration',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
