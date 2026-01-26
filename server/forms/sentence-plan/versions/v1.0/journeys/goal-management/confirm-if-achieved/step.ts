import { accessTransition, Data, redirect, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalCard, allStepsCompletedField, hasAchievedGoal, saveAndContinueButton } from './fields'
import { POST_AGREEMENT_PROCESS_STATUSES, SentencePlanEffects } from '../../../../../effects'

/**
 * This page is only accessible after a plan has been agreed.
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

  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.setActiveGoalContext()],
      next: [
        // Redirect if plan has not been agreed (DRAFT plans cannot access this page)
        redirect({
          when: Data('latestAgreementStatus').not.match(Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES)),
          goto: '../../plan/overview',
        }),
        // Redirect if goal not found
        redirect({
          when: Data('activeGoal').not.match(Condition.IsRequired()),
          goto: '../../plan/overview',
        }),
      ],
    }),
  ],

  onSubmission: [
    // when 'yes' is selected: mark as achieved and go to achieved tab
    submitTransition({
      when: Post('has_achieved_goal').match(Condition.Equals('yes')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.markGoalAsAchieved()],
        next: [redirect({ goto: '../../plan/overview?type=achieved' })],
      },
    }),
    // when 'no' is selected: don't mark as achieved, go back to plan overview and land on current/future tab based on goal status
    submitTransition({
      when: Post('has_achieved_goal').match(Condition.Equals('no')),
      validate: true,
      onValid: {
        next: [
          redirect({
            when: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
            goto: '../../plan/overview?type=future',
          }),
          redirect({ goto: '../../plan/overview?type=current' }),
        ],
      },
    }),
    // default: when no option is selected, validate to show error
    submitTransition({
      validate: true,
    }),
  ],
})
