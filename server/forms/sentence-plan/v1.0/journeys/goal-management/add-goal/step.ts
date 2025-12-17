import { Format, loadTransition, next, Params, Post, step, submitTransition } from '@form-engine/form/builders'
import {
  pageHeading,
  goalNameInput,
  isGoalRelatedToOtherAreaOfNeed,
  canStartWorkingOnGoalNow,
  buttonGroup,
} from './fields'
import { SentencePlanV1Effects } from '../../../effects'
import { Condition } from '@form-engine/registry/conditions'

/**
 * For adding a new goal.
 */
export const createGoalStep = step({
  onLoad: [
    loadTransition({
      effects: [SentencePlanV1Effects.loadOrCreatePlan()],
    }),
  ],
  path: '/add-goal/:areaOfNeed',
  title: 'Create Goal',
  isEntryPoint: true,
  blocks: [pageHeading, goalNameInput, isGoalRelatedToOtherAreaOfNeed, canStartWorkingOnGoalNow, buttonGroup()],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('addSteps')),
      validate: true,
      onValid: {
        // TODO: Create goal and get UUID, then navigate to add-steps
        next: [next({ goto: Format('/goal/%1/add-steps', Params('goalUuid')) })],
      },
    }),
  ],
})
