import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: Dynamic Dropdown Options
 *
 * How to populate dropdown/radio options from data or filter based on another field.
 */
export const dynamicOptionsStep = step({
  path: '/dynamic-options',
  title: 'Dynamic Dropdown Options',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
