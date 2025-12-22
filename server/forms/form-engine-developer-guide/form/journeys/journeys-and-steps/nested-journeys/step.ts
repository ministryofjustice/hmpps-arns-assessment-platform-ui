import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Journeys & Steps - Nested Journeys
 *
 * Explains how to use the children property to create hierarchical journey structures.
 */
export const nestedJourneysStep = step({
  path: '/nested-journeys',
  title: 'Nested Journeys',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
