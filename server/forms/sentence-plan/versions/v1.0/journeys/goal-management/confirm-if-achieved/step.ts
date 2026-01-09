import { Data, Format, loadTransition, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, goalCard, howHelpedField, buttonGroup } from './fields'
import { SentencePlanEffects } from '../../../../../effects'

/**
 * For automatically asking the user to confirm a goal is achieved
 * if they have marked all steps as 'Complete' on a goal.
 */
export const confirmIfAchievedStep = step({
  path: '/confirm-if-achieved',
  title: 'Confirm If Achieved',
  isEntryPoint: true,
  blocks: [pageHeading, goalCard, howHelpedField, buttonGroup],

  onLoad: [
    loadTransition({
      effects: [SentencePlanEffects.deriveGoalsWithStepsFromAssessment(), SentencePlanEffects.setActiveGoalContext()],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('cancel')),
      onAlways: {
        next: [next({ goto: Format('../../goal/%1/update-goal-steps', Data('activeGoal.uuid')) })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('confirm')),
      validate: true,
      onValid: {
        effects: [SentencePlanEffects.markGoalAsAchieved()],
        next: [next({ goto: '../../plan/overview?type=achieved' })],
      },
    }),
  ],
})
