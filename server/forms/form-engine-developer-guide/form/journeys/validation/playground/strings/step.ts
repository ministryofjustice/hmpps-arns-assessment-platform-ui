import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Validation Playground - Strings
 *
 * Interactive examples of string validation conditions.
 */
export const stringsStep = step({
  path: '/strings',
  title: 'String Validation',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
