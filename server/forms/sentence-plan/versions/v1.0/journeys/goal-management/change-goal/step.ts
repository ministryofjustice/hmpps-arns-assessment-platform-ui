import {
  access,
  and,
  Answer,
  Data,
  Format,
  Post,
  redirect,
  step,
  submit,
  when,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { pageLayout } from './fields'
import { AuditEvent, POST_AGREEMENT_PROCESS_STATUSES, SentencePlanEffects } from '../../../../../effects'
import { CaseData } from '../../../constants'
import { hasPostAgreementStatus, redirectIfGoalNotFound } from '../../../guards'

/**
 * Change Goal page
 *
 * Allows users to edit an existing goal's details.
 *
 * When a goal is changed from "Goal for Now" (ACTIVE) to a future goal,
 * it redirects to the Future Goals tab.
 */
export const changeGoalStep = step({
  path: '/change-goal',
  title: 'Change goal',
  reachability: { entryWhen: true },
  view: {
    locals: {
      // Backlink logic:
      // If editing the goal through update-goal-step backLink should return to update-goal-step.
      // !! ensure nav referrer used here (rather than just latestAgreementStatus)
      // !! as you can access 'change goal' (for both agreed/pre-agree) also through create goal > add steps > click 'back',
      //
      // Otherwise, return to plan overview on the appropriate tab (current or future goals).
      backlink: when(Data("navigationReferrer").match(Condition.Equals("update-goal-steps")))
        .then(Format("../../goal/%1/update-goal-steps", Data("activeGoal.uuid")))
        .else(
          when(Data("activeGoal.status").match(Condition.Equals("ACTIVE")))
            .then("../../plan/overview?type=current")
            .else("../../plan/overview?type=future"),
        ),
    },
  },

  blocks: [pageLayout],

  onAccess: [
    access({
      effects: [
        SentencePlanEffects.loadActiveGoalForEdit(),
        SentencePlanEffects.loadAreaAssessmentInfo(),
        SentencePlanEffects.sendAuditEvent(AuditEvent.VIEW_CHANGE_GOAL),
      ],
    }),
    redirectIfGoalNotFound('../../plan/overview'),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('saveGoal')),
      validate: true,
      onValid: {
        effects: [
          SentencePlanEffects.updateActiveGoal(),
          SentencePlanEffects.sendAuditEvent(AuditEvent.EDIT_GOAL, {
            planStatus: when(Data('latestAgreementStatus').match(Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES)))
              .then('POST_AGREE')
              .else('PRE_AGREE'),
          }),
          SentencePlanEffects.addNotification({
            type: 'success',
            message: Format('You changed a goal in %1 plan', CaseData.ForenamePossessive),
            target: 'plan-overview',
          }),
        ],
        next: [
          // Create-goal flow: add-goal → add-steps → back → change-goal.
          // Clicking back from add-steps navigates to /change-goal. Because
          // 'change-goal' is not already in the stack at that point, it's treated
          // as forward navigation (pushed) rather than back-navigation (trimmed).
          // This leaves 'add-steps' as the referrer, which we match on here to
          // send the user back to finish adding steps after saving their changes.
          redirect({
            when: Data('navigationReferrer').match(Condition.Equals('add-steps')),
            goto: Format('../../goal/%1/add-steps', Data('activeGoal.uuid')),
          }),
          // if accessed through 'update goal and steps'(agreed plan):
          // - current goal with no steps > go to 'add-steps'
          // - current goal with steps OR future goal > go back to 'update-goal-steps'
          redirect({
            when: hasPostAgreementStatus,
            goto: when(
              and(
                Answer('can_start_now').match(Condition.Equals('yes')),
                Data('activeGoal.steps.length').match(Condition.Number.LessThan(1)),
              ),
            )
              .then(Format('../../goal/%1/add-steps', Data('activeGoal.uuid')))
              .else(Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid'))),
          }),
          // If changed to a future goal, redirect to future goals tab
          redirect({
            when: Answer('can_start_now').match(Condition.Equals('no')),
            goto: '../../plan/overview?type=future',
          }),
          // Otherwise redirect to current goals tab
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
  ],
})
