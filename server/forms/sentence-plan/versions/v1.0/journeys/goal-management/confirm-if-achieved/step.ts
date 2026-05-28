import {
  access,
  Data,
  redirect,
  Post,
  step,
  submit,
  Format,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, goalCard, allStepsCompletedField, hasAchievedGoal, saveAndContinueButton } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { redirectIfGoalNotFound, redirectIfNotPostAgreement } from '../../../guards'
import { CaseData } from '../../../constants'

/**
 * This page is only accessible after a plan has been agreed.
 * For automatically asking the user to confirm a goal is achieved
 * if they have marked all steps as 'Complete' on a goal.
 */
export const confirmIfAchievedStep = step({
  path: '/confirm-if-achieved',
  title: 'Confirm if they have achieved this goal',
  reachability: { entryWhen: true },
  view: {
    locals: {
      backlink: 'update-goal-steps',
    },
  },
  blocks: [pageHeading, allStepsCompletedField, goalCard, hasAchievedGoal, saveAndContinueButton],

  onAccess: [
    access({
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
    // when 'yes' is selected: mark as achieved and go to achieved tab
    submit({
      when: Post('has_achieved_goal').match(Condition.Equals('yes')),
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
    // when 'no' is selected: don't mark as achieved, go back to plan overview and land on current/future tab based on goal status
    submit({
      when: Post('has_achieved_goal').match(Condition.Equals('no')),
      validate: true,
      onValid: {
        next: [
          redirect({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
    // default: when no option is selected, validate to show error
    submit({
      validate: true,
    }),
  ],
})
