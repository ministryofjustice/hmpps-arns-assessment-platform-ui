import {
  accessTransition,
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
import { SentencePlanEffects } from '../../../../../effects'

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
  title: 'Change Goal',
  isEntryPoint: true,
  view: {
    locals: {
      // Backlink logic:
      // If editing the goal after the plan has been agreed (latestAgreementStatus exists), backLink should return
      //  to update-goal-step. Otherwise, return to plan overview on the appropriate tab (current or future goals).
      backlink: when(Data('latestAgreementStatus').match(Condition.IsRequired()))
        .then(Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid')))
        .else(
          when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
            .then('../../plan/overview?type=current')
            .else('../../plan/overview?type=future'),
        ),
    },
  },

  blocks: [pageLayout],

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadActiveGoalForEdit()],
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
