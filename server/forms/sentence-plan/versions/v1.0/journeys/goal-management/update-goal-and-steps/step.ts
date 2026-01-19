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
import {
  pageHeading,
  goalInfo,
  reviewStepsSection,
  progressNotesSection,
  viewAllNotesSection,
  actionButtons,
} from './fields'
import { SentencePlanEffects } from '../../../../../effects'

/**
 * Update goal and steps
 * This is used AFTER a plan is agreed to update a goal and its steps
 */
export const updateGoalAndStepsStep = step({
  path: '/update-goal-steps',
  title: 'Update goal and steps',
  isEntryPoint: true,
  view: {
    locals: {
      backlink: when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
        .then('../../plan/overview?type=current')
        .else('../../plan/overview?type=future'),
    },
  },
  blocks: [pageHeading, goalInfo, reviewStepsSection, progressNotesSection, viewAllNotesSection, actionButtons],

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.deriveGoalsWithStepsFromAssessment(), SentencePlanEffects.loadActiveGoalForEdit()],
    }),

    // If goal not found, redirect to plan overview
    accessTransition({
      when: Data('activeGoal').not.match(Condition.IsRequired()),
      next: [redirect({ goto: '../../plan/overview' })],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: false,
      onAlways: {
        effects: [SentencePlanEffects.updateGoalProgress()],
        next: [
          // If all steps completed, go to confirm-if-achieved page
          redirect({
            when: Data('allStepsCompleted').match(Condition.Equals(true)),
            goto: Format('../../goal/%1/confirm-if-achieved', Data('activeGoal.uuid')),
          }),
          // Otherwise, go back to plan overview based on goal status
          redirect({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('mark-achieved')),
      validate: false,
      onAlways: {
        effects: [SentencePlanEffects.updateGoalProgress()],
        next: [redirect({ goto: Format('../../goal/%1/confirm-achieved-goal', Data('activeGoal.uuid')) })],
      },
    }),
  ],
})
