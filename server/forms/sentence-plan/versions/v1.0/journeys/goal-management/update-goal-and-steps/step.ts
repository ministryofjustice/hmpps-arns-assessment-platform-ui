import {
  accessTransition,
  Data,
  Format,
  loadTransition,
  next,
  Post,
  step,
  submitTransition,
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
  blocks: [pageHeading, goalInfo, reviewStepsSection, progressNotesSection, viewAllNotesSection, actionButtons],

  onLoad: [
    loadTransition({
      effects: [SentencePlanEffects.deriveGoalsWithStepsFromAssessment(), SentencePlanEffects.loadActiveGoalForEdit()],
    }),
  ],

  onAccess: [
    // If goal not found, redirect to plan overview
    accessTransition({
      guards: Data('activeGoal').not.match(Condition.IsRequired()),
      redirect: [next({ goto: '../../plan/overview' })],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: false,
      onAlways: {
        effects: [SentencePlanEffects.updateGoalProgress()],
        next: [next({ goto: '../../plan/overview' })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('mark-achieved')),
      validate: false,
      onAlways: {
        effects: [SentencePlanEffects.updateGoalProgress()],
        next: [next({ goto: Format('../../goal/%1/confirm-if-achieved', Data('activeGoal.uuid')) })],
      },
    }),
  ],
})
