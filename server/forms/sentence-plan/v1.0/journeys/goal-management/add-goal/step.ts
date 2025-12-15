import { Format, next, Params, step, submitTransition } from '@form-engine/form/builders'
import { pageHeading, continueButton } from './fields'

/**
 * For adding a new goal.
 */
export const createGoalStep = step({
  path: '/add-goal/:areaOfNeed',
  title: 'Create Goal',
  isEntryPoint: true,
  blocks: [pageHeading, continueButton],
  onSubmission: [
    submitTransition({
      validate: true,
      onValid: {
        // TODO: Create goal and get UUID, then navigate to add-steps
        next: [next({ goto: Format('/goal/%1/add-steps', Params('goalUuid')) })],
      },
    }),
  ],
})
