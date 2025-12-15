import { next, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

/**
 * For adding steps to a new OR existing goal
 * // TODO: In SP OG, these were separate pages - can likely do it one now
 */
export const addStepsStep = step({
  path: '/add-steps',
  title: 'Add Steps',
  isEntryPoint: true,
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        // TODO: Save steps and return to plan overview
        next: [next({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
