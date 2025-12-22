import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * References - Item()
 *
 * Comprehensive documentation for the Item() reference,
 * covering collection iteration, scope navigation, and nested collections.
 */
export const itemStep = step({
  path: '/item',
  title: 'Item Reference',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
