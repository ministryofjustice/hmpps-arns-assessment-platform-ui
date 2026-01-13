import {
  accessTransition,
  actionTransition,
  Data,
  Format,
  loadTransition,
  next,
  Post,
  Query,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageLayout } from './fields'
import { SentencePlanEffects } from '../../../../../effects'

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
  view: {
    locals: {
      // Backlink logic:
      // 1. If came from create goal page (?from=add-goal) backLink navigates to change-goal page with goal info persisted
      // 2. Otherwise, return to plan overview on the correct tab based on goal status (ACTIVE → current, FUTURE → future)
      backlink: when(Query('from').match(Condition.Equals('add-goal')))
        .then(Format('../../goal/%1/change-goal', Data('activeGoal.uuid')))
        .else(
          when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
            .then('../../plan/overview?type=current')
            .else('../../plan/overview?type=future'),
        ),
    },
  },

  blocks: [pageLayout],

  onLoad: [
    loadTransition({
      effects: [
        SentencePlanEffects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.initializeStepEditSession(),
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
      effects: [SentencePlanEffects.addStepToStepEditSession()],
    }),

    // Handle "Remove" button (pattern: remove_0, remove_1, etc.)
    actionTransition({
      when: Post('action').match(Condition.String.StartsWith('remove_')),
      effects: [SentencePlanEffects.removeStepFromStepEditSession()],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndContinue')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.saveStepEditSession()],
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
