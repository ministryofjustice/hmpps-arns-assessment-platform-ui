import {
  access,
  Data,
  Format,
  redirect,
  Post,
  step,
  submit,
  when,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  pageHeading,
  goalSubheading,
  goalInfoFuture,
  goalInfoActive,
  reviewStepsHeading,
  reviewStepsTable,
  addOrChangeStepsLink,
  noStepsMessage,
  progressNotesSection,
  viewAllNotesSection,
  actionButtons,
} from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { redirectIfGoalNotFound, redirectIfNotPostAgreement } from '../../../guards'

/**
 * Update goal and steps
 * This is used AFTER a plan is agreed to update a goal and its steps
 */
export const updateGoalAndStepsStep = step({
  path: '/update-goal-steps',
  title: 'Update goal and steps',
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
        .then('../../plan/overview?type=current')
        .else('../../plan/overview?type=future'),
    },
  },
  blocks: [
    pageHeading,
    goalSubheading,
    goalInfoFuture,
    goalInfoActive,
    reviewStepsHeading,
    reviewStepsTable,
    addOrChangeStepsLink,
    noStepsMessage,
    progressNotesSection,
    viewAllNotesSection,
    actionButtons,
  ],

  onAccess: [
    access({
      effects: [
        SentencePlanEffects.loadActiveGoalForEdit(),
        SentencePlanEffects.sendTelemetryEvent('UPDATE_GOAL_AND_STEPS_START', true),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_UPDATE_GOAL_AND_STEPS),
      ],
    }),
    // Redirect if plan has not been agreed (DRAFT plans cannot access this page)
    redirectIfNotPostAgreement('../../plan/overview'),
    redirectIfGoalNotFound('../../plan/overview'),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: false,
      onAlways: {
        effects: [
          SentencePlanEffects.updateGoalProgress(),
          SentencePlanEffects.sendTelemetryEvent('UPDATE_GOAL_AND_STEPS_SAVE', false),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_STEP_PROGRESS, {
            goalStatus: Data('activeGoal.status'),
            action: 'save',
          }),
        ],
        next: [
          // If all steps completed, go to confirm-if-achieved page
          redirect({
            when: Data('allStepsCompleted').match(Condition.Equals(true)),
            goto: Format('../../goal/%1/confirm-if-achieved', Data('activeGoal.uuid')),
          }),
          // Otherwise, go back to plan overview based on goal status
          redirect({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
    submit({
      when: Post('action').match(Condition.Equals('mark-achieved')),
      validate: false,
      onAlways: {
        effects: [
          SentencePlanEffects.updateGoalProgress(),
          SentencePlanEffects.sendTelemetryEvent('UPDATE_GOAL_AND_STEPS_ACHIEVED', false),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_STEP_PROGRESS, {
            goalStatus: Data('activeGoal.status'),
            action: 'mark-achieved',
          }),
        ],
        next: [redirect({ goto: Format('../../goal/%1/confirm-achieved-goal', Data('activeGoal.uuid')) })],
      },
    }),
  ],
})
