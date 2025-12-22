import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: Conditional Field Visibility
 *
 * How to show or hide a field based on another field's value.
 */
export const conditionalVisibilityStep = step({
  path: '/conditional-visibility',
  title: 'Conditional Visibility',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
