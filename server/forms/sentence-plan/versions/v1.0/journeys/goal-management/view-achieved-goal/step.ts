import {
  accessTransition,
  Data,
  Format,
  loadTransition,
  next,
  Post,
  step,
  submitTransition,
  when,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalInfo, reviewStepsSection, viewAllNotesSection } from './fields'
import { SentencePlanEffects } from '../../../../../effects'
/**
 * For viewing an achieved goal.
 * This is only accessible when a plan has been agreed.
 * // TODO: This might be mergeable with `view-removed-goal`
 */

export const viewAchievedGoalStep = step({
  path: '/view-achieved-goal',
  title: 'View goal details',
  isEntryPoint: true,
  view: {
    locals: {
      backlink: when(Data('activeGoal.status').match(Condition.Equals('ACTIVE')))
        .then('../../plan/overview?type=current')
        .else('../../plan/overview?type=future'),
    },
  },
  blocks: [pageHeading, goalInfo, reviewStepsSection, viewAllNotesSection],

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
