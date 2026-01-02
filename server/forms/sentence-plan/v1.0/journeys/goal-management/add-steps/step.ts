import {
  accessTransition,
  actionTransition,
  Data,
  loadTransition,
  next,
  Post,
  step,
  submitTransition,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageLayout } from './fields'
import { SentencePlanV1Effects } from '../../../effects'

/**
 * Add Steps page
 *
 * Allows users to add one or more steps to a goal.
 * Each step has an actor (who) and description (what).
 *
 * Features:
 * - Dynamic rows that can be added/removed
 * - Full CRUD: create new steps, edit existing steps, delete steps
 * - Deleting existing steps marks them for removal on save
 */
export const addStepsStep = step({
  path: '/add-steps',
  title: 'Add Steps',
  isEntryPoint: true,

  blocks: [pageLayout],

  onLoad: [
    loadTransition({
      effects: [
        SentencePlanV1Effects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanV1Effects.setActiveGoalContext(),
        SentencePlanV1Effects.initializeStepEditSession(),
      ],
    }),
  ],

  onAccess: [
    // If goal not found, redirect to plan overview
    accessTransition({
      guards: Data('activeGoal').not.match(Condition.IsRequired()),
      redirect: [next({ goto: '../../plan-overview' })],
    }),
  ],

  onAction: [
    // Handle "Add another step" button
    actionTransition({
      when: Post('action').match(Condition.Equals('addStep')),
      effects: [SentencePlanV1Effects.addStepToStepEditSession()],
    }),

    // Handle "Remove" button (pattern: remove_0, remove_1, etc.)
    actionTransition({
      when: Post('action').match(Condition.String.StartsWith('remove_')),
      effects: [SentencePlanV1Effects.removeStepFromStepEditSession()],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndContinue')),
      validate: true,
      onValid: {
        effects: [SentencePlanV1Effects.saveStepEditSession()],
        next: [
          next({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          next({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
  ],
})
