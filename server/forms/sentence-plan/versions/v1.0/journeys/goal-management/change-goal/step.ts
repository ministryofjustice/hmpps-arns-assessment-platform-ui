import {
  accessTransition,
  and,
  Answer,
  Data,
  Format,
  Post,
  redirect,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageLayout } from './fields'
import { POST_AGREEMENT_PROCESS_STATUSES, SentencePlanEffects } from '../../../../../effects'

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
  isEntryPoint: true,
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
    accessTransition({
      effects: [
        SentencePlanEffects.loadActiveGoalForEdit(),
        SentencePlanEffects.loadNavigationReferrer(),
        SentencePlanEffects.loadAreaAssessmentInfo(),
      ],
      next: [
        // If goal not found, redirect to plan overview
        redirect({
          when: Data('activeGoal').not.match(Condition.IsRequired()),
          goto: '../../plan/overview',
        }),
      ],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('saveGoal')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.updateActiveGoal()],
        next: [
          // if accessed through 'create a goal' page > 'add steps' and clicked 'back' then redirect to 'add-steps':
          redirect({
            when: Data('navigationReferrer').match(Condition.Equals('add-goal')),
            goto: Format('../../goal/%1/add-steps', Data('activeGoal.uuid')),
          }),
          // if accessed through 'update goal and steps'(agreed plan):
          // - current goal with no steps > go to 'add-steps'
          // - current goal with steps OR future goal > go back to 'update-goal-steps'
          redirect({
            when: Data('latestAgreementStatus').match(Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES)),
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
