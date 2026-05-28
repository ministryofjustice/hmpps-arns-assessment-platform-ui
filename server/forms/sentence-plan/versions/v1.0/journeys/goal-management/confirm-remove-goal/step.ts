import { access, Format, redirect, Post, step, submit, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, introText, goalCard, removalNoteSection, buttonGroup } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'
import { redirectIfGoalNotFound, redirectIfNotPostAgreement } from '../../../guards'

/**
 * Confirm remove goal page
 *
 * This is used AFTER a plan is agreed to remove a goal from a plan.
 * Unlike `delete` (which is for draft plans), remove is a soft-delete
 * that can be undone using `confirm-readd-goal`.
 */
export const removeGoalStep = step({
  path: '/confirm-remove-goal',
  title: 'Confirm you want to remove this goal',
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: 'update-goal-steps',
    },
  },
  blocks: [pageHeading, introText, goalCard, removalNoteSection, buttonGroup],

  onAccess: [
    access({
      effects: [
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_CONFIRM_GOAL_REMOVED),
      ],
    }),
    // Only allow removing goals if plan is agreed (soft-delete for agreed plans only)
    // Draft plans should use "delete" instead
    redirectIfNotPostAgreement('../../plan/overview'),
    redirectIfGoalNotFound('../../plan/overview'),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('confirm')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.markGoalAsRemoved(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_GOAL_REMOVED),
          SentencePlanEffects.addNotification({
            type: 'success',
            message: Format('You removed a goal from %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
          }),
        ],
        // Redirect to plan overview with "Removed goals" tab active
        next: [redirect({ goto: '../../plan/overview?type=removed' })],
      },
    }),
  ],
})
