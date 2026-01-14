import { Data, loadTransition, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalCard, allStepsCompletedField, hasAchievedGoal, saveAndContinueButton } from './fields'
import { SentencePlanEffects } from '../../../../../effects'

/**
 * For automatically asking the user to confirm a goal is achieved
 * if they have marked all steps as 'Complete' on a goal.
 */
export const confirmIfAchievedStep = step({
  path: '/confirm-if-achieved',
  title: 'Confirm If Achieved',
  isEntryPoint: true,
  view: {
    locals: {
      backlink: 'update-goal-steps',
    },
  },
  blocks: [pageHeading, allStepsCompletedField, goalCard, hasAchievedGoal, saveAndContinueButton],

  onLoad: [
    loadTransition({
      effects: [SentencePlanEffects.deriveGoalsWithStepsFromAssessment(), SentencePlanEffects.setActiveGoalContext()],
    }),
  ],

  onSubmission: [
    // when 'yes' is selected: mark as achieved and go to achieved tab
    submitTransition({
      when: Post('has_achieved_goal').match(Condition.Equals('yes')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.markGoalAsAchieved()],
        next: [next({ goto: '../../plan/overview?type=achieved' })],
      },
    }),
    // when 'no' is selected: don't mark as achieved, go back to plan overview and land on current/future tab based on goal status
    submitTransition({
      when: Post('has_achieved_goal').match(Condition.Equals('no')),
      validate: true,
      onValid: {
        next: [
          next({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          next({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
    // default: when no option is selected, validate to show error
    submitTransition({
      validate: true,
    }),
  ],
})
