import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: In-Page Lookup with Action Transition
 *
 * How to do a postcode lookup or similar in-page action.
 */
export const actionLookupStep = step({
  path: '/action-lookup',
  title: 'In-Page Lookup',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
