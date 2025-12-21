import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions - Conditional
 *
 * Documentation for when() and Conditional() if/then/else expressions.
 */
export const conditionalStep = step({
  path: '/conditional',
  title: 'Conditional Expressions',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
