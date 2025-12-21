import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Components - Custom Components
 *
 * How to build your own components for form-engine.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Components',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
