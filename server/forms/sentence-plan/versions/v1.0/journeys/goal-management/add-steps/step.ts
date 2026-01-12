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
      backlink: when(Query('type').match(Condition.IsRequired()))
        .then(Format('../../goal/%1/add-goal/accommodation?type=%2', Data('activeGoal.uuid'), Query('type')))
        .else(Format('../../goal/%1/add-goal/accommodation', Data('activeGoal.uuid'))),
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
            when: Query('type').match(Condition.IsRequired()),
            goto: Format('../../plan/overview?type=%1', Query('type')),
          }),
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
