import { Answer, next, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { FoodBusinessEffects } from '../../effects'
import { declaration, reviewHeading, submitButton } from './fields'

/**
 * STEP 8: Review and Submit
 *
 * Features demonstrated:
 * - Summary display using Format() expressions
 * - Collection iteration for review
 * - Complex submissionOnly validation
 * - Multiple effects on submission (submitRegistration, sendConfirmationEmail, notifyFSA)
 * - Declaration checkbox
 * - Final submission with guards
 */
export const reviewStep = step({
  path: '/review',
  title: 'Review and Submit',
  blocks: [reviewHeading, declaration, submitButton],

  onSubmission: [
    submitTransition({
      validate: true,
      guards: Answer('declaration').match(Condition.Array.Contains('confirmed')),
      onValid: {
        effects: [
          FoodBusinessEffects.saveStepAnswers(),
          FoodBusinessEffects.submitRegistration(),
          FoodBusinessEffects.sendConfirmationEmail(),
          FoodBusinessEffects.notifyFSA(),
        ],
        next: [next({ goto: 'confirmation' })],
      },
    }),
  ],
})
