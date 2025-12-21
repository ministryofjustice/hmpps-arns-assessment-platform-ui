import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: Branching Navigation
 *
 * How to navigate to different steps based on user answers.
 */
export const branchingNavigationStep = step({
  path: '/branching-navigation',
  title: 'Branching Navigation',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
