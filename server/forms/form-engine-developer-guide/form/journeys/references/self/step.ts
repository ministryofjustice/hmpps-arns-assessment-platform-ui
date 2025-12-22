import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * References - Self()
 *
 * Comprehensive documentation for the Self() reference,
 * covering field-scoped access, validation patterns, and how it resolves.
 */
export const selfStep = step({
  path: '/self',
  title: 'Self Reference',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
