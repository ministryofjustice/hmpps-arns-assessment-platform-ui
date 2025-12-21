import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Journeys & Steps - Journey Configuration
 *
 * Deep dive into the journey() builder and all its configuration options.
 */
export const journeysStep = step({
  path: '/journeys',
  title: 'Journey Configuration',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
