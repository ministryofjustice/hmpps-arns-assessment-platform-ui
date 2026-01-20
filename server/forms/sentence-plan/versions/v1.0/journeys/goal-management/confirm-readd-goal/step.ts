import {
  accessTransition,
  Answer,
  Data,
  Format,
  redirect,
  Post,
  step,
  submitTransition,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalCard, readdNoteSection, canStartNowSection, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'

/**
 * Confirm re-add goal page
 *
 * This is used to add a removed goal back into a plan.
 * Only available for goals with status 'REMOVED' on agreed plans.
 *
 * The user must:
 * - Provide a reason for re-adding the goal
 * - Specify whether the person can start working on the goal now
 * - If yes, select a target date
 */
export const confirmAddGoalStep = step({
  path: '/confirm-readd-goal',
  title: 'Confirm you want to add this goal back into the plan',
  isEntryPoint: true,
  view: {
    locals: {
      backlink: 'view-inactive-goal',
    },
  },
  blocks: [pageHeading, goalCard, readdNoteSection, canStartNowSection, buttonGroup],

  onAccess: [
    // Load data first (no `when` = always runs)
    accessTransition({
      effects: [SentencePlanEffects.deriveGoalsWithStepsFromAssessment(), SentencePlanEffects.setActiveGoalContext()],
    }),
    // Only allow re-adding goals if plan is agreed
    accessTransition({
      when: Data('latestAgreementStatus').not.match(
        Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
      ),
      next: [redirect({ goto: '../../plan/overview' })],
    }),
    // Redirect if goal not found
    accessTransition({
      when: Data('activeGoal').not.match(Condition.IsRequired()),
      next: [redirect({ goto: '../../plan/overview' })],
    }),
    // Only allow re-adding REMOVED goals (not achieved)
    accessTransition({
      when: Data('activeGoal.status').not.match(Condition.Equals('REMOVED')),
      next: [redirect({ goto: '../../plan/overview' })],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('cancel')),
      onAlways: {
        next: [redirect({ goto: 'view-inactive-goal' })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('confirm')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.markGoalAsActive(),
          SentencePlanEffects.addNotification({
            type: 'success',
            message: Format('You added a goal back into %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
          }),
        ],
        next: [
          redirect({
            when: Answer('can_start_now').match(Condition.Equals('no')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
  ],
})
