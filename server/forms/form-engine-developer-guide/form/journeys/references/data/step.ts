import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * References - Data()
 *
 * Comprehensive documentation for the Data() reference,
 * covering external data access, onAccess effects, and common patterns.
 */
export const dataStep = step({
  path: '/data',
  title: 'Data Reference',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
