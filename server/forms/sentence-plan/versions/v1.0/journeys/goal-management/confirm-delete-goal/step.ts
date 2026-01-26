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
import { pageHeading, introText, goalCard, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../effects'
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
  view: {
    locals: {
      backlink: when(Data('activeGoal.status').match(Condition.Equals('FUTURE')))
        .then('../../plan/overview?type=future')
        .else('../../plan/overview?type=current'),
    },
  },

  blocks: [pageHeading, introText, goalCard, buttonGroup],

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.setActiveGoalContext()],
      next: [
        // Redirect if plan is no longer in draft (delete is only for draft plans)
        redirect({
          when: Data('latestAgreementStatus').not.match(Condition.Equals('DRAFT')),
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
        next: [
          redirect({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('confirm')),
      onAlways: {
        effects: [
          SentencePlanEffects.deleteActiveGoal(),
          SentencePlanEffects.addNotification({
            type: 'success',
            title: 'Goal deleted',
            message: Format('You deleted a goal to %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
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
  ],
})
