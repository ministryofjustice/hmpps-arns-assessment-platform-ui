import {
  accessTransition,
  Data,
  Format,
  loadTransition,
  next,
  Post,
  step,
  submitTransition,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, introText, goalCard, buttonGroup } from './fields'
import { SentencePlanV1Effects } from '../../../effects'
import { CaseData } from '../../../constants'

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
    // Redirect if plan is no longer in draft (delete is only for draft plans)
    accessTransition({
      guards: Data('assessment.properties.AGREEMENT_STATUS.value').not.match(Condition.Equals('DRAFT')),
      redirect: [next({ goto: '../../plan/overview' })],
    }),
    // Redirect if goal not found
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
        effects: [
          SentencePlanV1Effects.deleteActiveGoal(),
          SentencePlanV1Effects.addNotification({
            type: 'success',
            title: 'Goal deleted',
            message: Format('You deleted a goal to %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
          }),
        ],
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
