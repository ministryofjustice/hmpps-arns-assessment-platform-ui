import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: Format a Dynamic Value
 *
 * How to display computed or formatted text.
 */
export const formatValueStep = step({
  path: '/format-value',
  title: 'Format a Dynamic Value',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
