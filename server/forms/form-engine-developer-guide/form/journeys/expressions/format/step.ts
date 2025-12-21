import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions - Format
 *
 * Documentation for Format() string interpolation expressions.
 */
export const formatStep = step({
  path: '/format',
  title: 'Format Expressions',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
