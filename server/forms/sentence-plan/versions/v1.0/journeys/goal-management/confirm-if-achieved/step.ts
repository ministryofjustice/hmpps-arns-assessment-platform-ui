import {
  access,
  Data,
  redirect,
  Post,
  step,
  submit,
  Format,
  when,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageHeading, goalCard, allStepsCompletedField, hasAchievedGoal, saveAndContinueButton } from './fields'
import { AuditEvent, SentencePlanEffects } from '../../../../../effects'
import { hasPostAgreementStatus, redirectIfGoalNotFound, redirectUnlessAllStepsCompleted } from '../../../guards'
import { CaseData } from '../../../constants'

/**
 * Automatically asks the user to confirm a goal is achieved when they have
 * marked all of its steps as 'Complete'. Reached from update-goal-steps on
 * agreed plans, and from add-steps on pre-agreed (draft) plans.
 */
export const confirmIfAchievedStep = step({
  path: '/confirm-if-achieved',
  title: 'Confirm if they have achieved this goal',
  reachability: { entryWhen: true },
  view: {
    locals: {
      // Draft plans arrive from add-steps; agreed plans from update-goal-steps (which drafts cannot reach)
      backlink: when(hasPostAgreementStatus).then('update-goal-steps').else('add-steps'),
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
    redirectIfGoalNotFound('../../plan/overview'),
    // Block direct access until every step on the goal is completed
    redirectUnlessAllStepsCompleted('../../plan/overview'),
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
            // Replace any queued banner (e.g. "You added a goal with steps") so only the achievement shows
            clearOtherNotifications: true,
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
