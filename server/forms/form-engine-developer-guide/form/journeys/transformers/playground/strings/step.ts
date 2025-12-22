import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transformers Playground - Strings
 *
 * Interactive examples of string transformers.
 */
export const stringsStep = step({
  path: '/strings',
  title: 'String Transformers',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
