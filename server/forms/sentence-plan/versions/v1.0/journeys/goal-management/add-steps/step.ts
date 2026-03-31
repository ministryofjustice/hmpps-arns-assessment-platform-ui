import {
  accessTransition,
  actionTransition,
  and,
  Data,
  Format,
  match,
  Post,
  redirect,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageLayout } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'
import { redirectIfGoalNotFound } from '../../../guards'

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
      backlink: match(Data('navigationReferrer'))
        .branch(Condition.Equals('add-goal'), Format('../../goal/%1/change-goal', Data('activeGoal.uuid')))
        .branch(
          Condition.Equals('update-goal-steps'),
          Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid')),
        )
        .otherwise(
          when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
            .then('../../plan/overview?type=current')
            .else('../../plan/overview?type=future'),
        ),
    },
  },

  blocks: [pageLayout],

  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.setAreaDataFromActiveGoal(),
        SentencePlanEffects.loadAreaAssessmentInfo(),
        SentencePlanEffects.initializeStepEditSession(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_ADD_STEPS),
      ],
    }),
    redirectIfGoalNotFound('../../plan/overview'),
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
    // Save steps after creating a new goal — show "goal added" notification
    submitTransition({
      when: and(
        Post('action').match(Condition.Equals('saveAndContinue')),
        Data('navigationReferrer').match(Condition.Equals('add-goal')),
      ),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.saveStepEditSession(),
          SentencePlanEffects.sendTelemetryEvent('CREATE_GOAL_WITH_STEPS_END', false),
          SentencePlanEffects.sendAuditEvent(AuditEvent.ADD_STEPS),
          SentencePlanEffects.addNotification({
            type: 'success',

            message: Format('You added a goal with steps to %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
            clearOtherNotifications: true,
          }),
        ],
        next: [
          redirect({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),

    // Save steps for an existing goal — no notification
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndContinue')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.saveStepEditSession(), SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_STEPS)],
        next: [
          redirect({
            when: Data('navigationReferrer').match(Condition.Equals('update-goal-steps')),
            goto: Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid')),
          }),
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
