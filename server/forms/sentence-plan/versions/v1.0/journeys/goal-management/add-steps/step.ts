import {
  accessTransition,
  actionTransition,
  Data,
  Format,
  Post,
  redirect,
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
  title: 'Add or change steps',
  isEntryPoint: true,
  view: {
    locals: {
      // Backlink logic (priority order):
      // 1. If navigationReferrer='add-goal', navigate to change-goal and persist goal information
      // 2. If navigationReferrer='update-goal-steps', navigate back to update-goal-steps page
      // 3. Default: navigate back to plan overview on correct tab based on goal status (current/future)
      backlink: when(Data('navigationReferrer').match(Condition.Equals('add-goal')))
        .then(Format('../../goal/%1/change-goal', Data('activeGoal.uuid')))
        .else(
          when(Data('navigationReferrer').match(Condition.Equals('update-goal-steps')))
            .then(Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid')))
            .else(
              when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
                .then('../../plan/overview?type=current')
                .else('../../plan/overview?type=future'),
            ),
        ),
    },
  },

  blocks: [pageLayout],

  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadNavigationReferrer(),
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.initializeStepEditSession(),
      ],
      next: [
        // If goal not found, redirect to plan overview
        redirect({
          when: Data('activeGoal').not.match(Condition.IsRequired()),
          goto: '../../plan/overview',
        }),
      ],
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
          redirect({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
  ],
})
