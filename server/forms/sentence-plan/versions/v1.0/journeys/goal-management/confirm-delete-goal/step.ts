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
import { pageHeading, introText, goalCard, buttonGroup } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'
import { redirectIfGoalNotFound, redirectIfPostAgreement } from '../../../guards'

/**
 * Confirm delete goal page
 *
 * This is used BEFORE a plan is agreed to remove a goal from a plan.
 * Unlike `remove` (which is for agreed plans), delete is permanent.
 */
export const confirmDeleteGoalStep = step({
  path: '/confirm-delete-goal',
  title: 'Confirm you want to delete this goal',
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: when(Data('activeGoal.status').match(Condition.Equals('FUTURE')))
        .then('../../plan/overview?type=future')
        .else('../../plan/overview?type=current'),
    },
  },

  blocks: [pageHeading, ...introText, goalCard, buttonGroup],

  onAccess: [
    access({
      effects: [
        SentencePlanEffects.setActiveGoalContext(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_DELETE_GOAL),
      ],
    }),
    // Redirect if plan is no longer in draft (delete is only for draft plans)
    redirectIfPostAgreement('../../plan/overview'),
    redirectIfGoalNotFound('../../plan/overview'),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('confirm')),
      onAlways: {
        effects: [
          SentencePlanEffects.deleteActiveGoal(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.DELETE_GOAL),
          SentencePlanEffects.addNotification({
            type: 'success',
            message: Format('You deleted a goal from %1 plan', CaseData.ForenamePossessive),
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
