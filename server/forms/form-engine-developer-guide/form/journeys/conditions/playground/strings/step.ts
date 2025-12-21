import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Conditions Playground - Strings
 *
 * Interactive examples of string conditions with validation.
 */
export const stringsStep = step({
  path: '/strings',
  title: 'String Conditions',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
