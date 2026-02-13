import { accessTransition, Data, Format, redirect, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalCard, howHelpedField, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../effects'
import { redirectIfNotPostAgreement } from '../../../guards'

// This page is for manually marking a goal as achieved and is only accessible after a plan has been agreed.
// Page is accessed through 'Mark as achieved' button on 'Update goal and steps' page

export const confirmAchievedGoalStep = step({
  path: '/confirm-achieved-goal',
  title: 'Confirm they have achieved this goal',
  isEntryPoint: true,
  blocks: [pageHeading, goalCard, howHelpedField, buttonGroup],

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.setActiveGoalContext()],
    }),
    // Redirect if plan has not been agreed (DRAFT plans cannot access this page)
    redirectIfNotPostAgreement('../../plan/overview'),
    accessTransition({
      next: [
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
        next: [redirect({ goto: Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid')) })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('confirm')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.markGoalAsAchieved()],
        next: [redirect({ goto: '../../plan/overview?type=achieved' })],
      },
    }),
  ],
})
