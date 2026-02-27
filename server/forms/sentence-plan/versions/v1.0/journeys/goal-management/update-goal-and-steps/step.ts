import {
  accessTransition,
  Data,
  Format,
  redirect,
  Post,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  pageHeading,
  goalInfo,
  reviewStepsSection,
  progressNotesSection,
  viewAllNotesSection,
  actionButtons,
} from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { redirectIfNotPostAgreement } from '../../../guards'

/**
 * Update goal and steps
 * This is used AFTER a plan is agreed to update a goal and its steps
 */
export const updateGoalAndStepsStep = step({
  path: '/update-goal-steps',
  title: 'Update goal and steps',
  isEntryPoint: true,
  view: {
    locals: {
      backlink: when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
        .then('../../plan/overview?type=current')
        .else('../../plan/overview?type=future'),
    },
  },
  blocks: [pageHeading, goalInfo, reviewStepsSection, progressNotesSection, viewAllNotesSection, actionButtons],

  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadActiveGoalForEdit(),
        SentencePlanEffects.setNavigationReferrer('update-goal-steps'),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_UPDATE_GOAL_AND_STEPS),
      ],
    }),
    // Redirect if plan has not been agreed (DRAFT plans cannot access this page)
    redirectIfNotPostAgreement('../../plan/overview'),
    accessTransition({
      next: [
        // Redirect if goal not found
        redirect({
          when: Data('activeGoal').not.match(Condition.IsRequired()),
          goto: '../../plan/overview',
        }),
      ],
    }),
  ],

  onSubmission: [
    // Navigate to add-steps page with referrer set (it's set in onAccess)
    submitTransition({
      when: Post('action').match(Condition.Equals('goToAddSteps')),
      validate: false,
      onAlways: {
        next: [redirect({ goto: Format('../../goal/%1/add-steps', Data('activeGoal.uuid')) })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: false,
      onAlways: {
        effects: [
          SentencePlanEffects.updateGoalProgress(),
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
    submitTransition({
      when: Post('action').match(Condition.Equals('mark-achieved')),
      validate: false,
      onAlways: {
        effects: [
          SentencePlanEffects.updateGoalProgress(),
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
