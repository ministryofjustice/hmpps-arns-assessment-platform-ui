import { accessTransition, Data, loadTransition, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, introText, goalCard, buttonGroup } from './fields'
import { SentencePlanV1Effects } from '../../../effects'

/**
 * Confirm delete goal page
 *
 * This is used BEFORE a plan is agreed to remove a goal from a plan.
 * Unlike `remove` (which is for agreed plans), delete is permanent.
 */
export const confirmDeleteGoalStep = step({
  path: '/confirm-delete-goal',
  title: 'Confirm you want to delete this goal',
  isEntryPoint: true,
  blocks: [pageHeading, introText, goalCard, buttonGroup],

  onLoad: [
    loadTransition({
      effects: [
        SentencePlanV1Effects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanV1Effects.setActiveGoalContext(),
      ],
    }),
  ],

  onAccess: [
    accessTransition({
      guards: Data('activeGoal').not.match(Condition.IsRequired()),
      redirect: [next({ goto: '../../plan/overview' })],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('cancel')),
      onAlways: {
        next: [
          next({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          next({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('confirm')),
      onAlways: {
        effects: [SentencePlanV1Effects.deleteActiveGoal()],
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
