import {
  accessTransition,
  Data,
  Format,
  Literal,
  next,
  Params,
  Post,
  step,
  submitTransition,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { twoColumnLayout } from './fields'
import { areaOfNeedSlugs } from './constants'
import { SentencePlanV1Effects } from '../../../effects'

/**
 * For adding a new goal.
 */
export const createGoalStep = step({
  path: '/add-goal/:areaOfNeed',
  title: 'Create Goal',
  isEntryPoint: true,
  blocks: [twoColumnLayout()],
  onAccess: [
    // If area of need is not a valid slug, redirect them to `accommodation` by default.
    accessTransition({
      guards: Params('areaOfNeed').not.match(Condition.Array.IsIn(Literal(areaOfNeedSlugs))),
      redirect: [next({ goto: 'add-goal/accommodation' })],
    }),
  ],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('addSteps')),
      validate: true,
      onValid: {
        effects: [SentencePlanV1Effects.saveGoal()],
        next: [next({ goto: Format('goal/%1/add-steps', Data('goalUuid')) })],
      },
    }),

    submitTransition({
      when: Post('action').match(Condition.Equals('saveWithoutSteps')),
      validate: true,
      onValid: {
        effects: [SentencePlanV1Effects.saveGoal()],
        next: [next({ goto: '../' })],
      },
    }),
  ],
})
