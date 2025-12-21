import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Components - Extending Components
 *
 * How to extend and wrap existing components without forking.
 */
export const extendingStep = step({
  path: '/extending',
  title: 'Extending Components',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
