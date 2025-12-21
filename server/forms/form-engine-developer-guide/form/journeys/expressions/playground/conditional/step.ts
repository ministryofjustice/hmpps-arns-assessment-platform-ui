import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions Playground - Conditional
 *
 * Interactive examples of when() and Conditional() expressions.
 */
export const conditionalStep = step({
  path: '/conditional',
  title: 'Conditional Playground',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
