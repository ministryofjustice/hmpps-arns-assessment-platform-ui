import { accessTransition, Format, redirect, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalCard, howHelpedField, buttonGroup } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { redirectIfGoalNotFound, redirectIfNotPostAgreement } from '../../../guards'
import { CaseData } from '../../../constants'

// This page is for manually marking a goal as achieved and is only accessible after a plan has been agreed.
// Page is accessed through 'Mark as achieved' button on 'Update goal and steps' page

export const confirmAchievedGoalStep = step({
  path: '/confirm-achieved-goal',
  title: 'Confirm they have achieved this goal',
  isEntryPoint: true,
  blocks: [pageHeading, goalCard, howHelpedField, buttonGroup],

  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_CONFIRM_GOAL_ACHIEVED),
      ],
    }),
    // Redirect if plan has not been agreed (DRAFT plans cannot access this page)
    redirectIfNotPostAgreement('../../plan/overview'),
    redirectIfGoalNotFound('../../plan/overview'),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('confirm')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.markGoalAsAchieved(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_GOAL_ACHIEVED),
          SentencePlanEffects.addNotification({
            type: 'success',
            message: Format('Congratulations on achieving a goal, %1', CaseData.Forename),
            target: 'plan-overview',
          }),
        ],
        next: [redirect({ goto: '../../plan/overview?type=achieved' })],
      },
    }),
  ],
})
