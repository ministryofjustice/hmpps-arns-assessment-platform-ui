import { accessTransition, Data, Format, redirect, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalCard, howHelpedField, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../effects'

// This page is for manually marking a goal as achieved
// Page is accessed through 'Mark as achieved' button on 'Update goal and steps' page

export const confirmAchievedGoalStep = step({
  path: '/confirm-achieved-goal',
  title: 'Confirm Goal Achieved',
  isEntryPoint: true,
  blocks: [pageHeading, goalCard, howHelpedField, buttonGroup],

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.deriveGoalsWithStepsFromAssessment(), SentencePlanEffects.setActiveGoalContext()],
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
