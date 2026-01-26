import { accessTransition, Data, Format, redirect, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, introText, goalCard, removalNoteSection, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'

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
  isEntryPoint: true,
  view: {
    locals: {
      backlink: 'update-goal-steps',
    },
  },
  blocks: [pageHeading, introText, goalCard, removalNoteSection, buttonGroup],

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.setActiveGoalContext()],
      next: [
        // Only allow removing goals if plan is agreed (soft-delete for agreed plans only)
        // Draft plans should use "delete" instead
        redirect({
          when: Data('latestAgreementStatus').not.match(
            Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
          ),
          goto: '../../plan/overview',
        }),
        // Redirect if goal not found
        redirect({
          when: Data('activeGoal').not.match(Condition.IsRequired()),
          goto: '../../plan/overview',
        }),
      ],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('cancel')),
      onAlways: {
        next: [redirect({ goto: 'update-goal-steps' })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('confirm')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.markGoalAsRemoved(),
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
