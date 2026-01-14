import {
  accessTransition,
  Data,
  loadTransition,
  next,
  Post,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalInfo, reviewStepsSection, viewAllNotesSection, addToPlanButton } from './fields'
import { SentencePlanEffects } from '../../../../../effects'

/**
 * Shared view for inactive goals (achieved or removed)
 *
 * This step handles both ACHIEVED and REMOVED goals, displaying:
 * - Goal details (area of need, title)
 * - Status date (achieved or removed)
 * - Steps table
 * - Notes
 * - Appropriate action buttons (re-add for removed goals)
 *
 * This is only accessible when a plan has been agreed.
 */
export const viewInactiveGoalStep = step({
  path: '/view-inactive-goal',
  title: 'View goal details',
  isEntryPoint: true,
  view: {
    locals: {
      backlink: when(Data('activeGoal.status').match(Condition.Equals('ACHIEVED')))
        .then('../../plan/overview?type=achieved')
        .else('../../plan/overview?type=removed'),
    },
  },
  blocks: [pageHeading, goalInfo, reviewStepsSection, viewAllNotesSection, addToPlanButton],

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
    // Handle re-add button (only visible for REMOVED goals)
    submitTransition({
      when: Post('action').match(Condition.Equals('re-add')),
      onAlways: {
        next: [next({ goto: '/confirm-readd-goal' })],
      },
    }),
    // Handle back to plan button (fallback for any other action)
    submitTransition({
      onAlways: {
        next: [next({ goto: '/plan-overview/plan' })],
      },
    }),
  ],
})
