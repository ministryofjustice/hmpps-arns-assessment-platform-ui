import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions Playground - Format
 *
 * Interactive examples of Format() string interpolation.
 */
export const formatStep = step({
  path: '/format',
  title: 'Format Playground',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
