import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Conditions Playground - Predicate Combinators
 *
 * Interactive examples of combining conditions with and(), or().
 */
export const combinatorsStep = step({
  path: '/combinators',
  title: 'Predicate Combinators',
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
  blocks: [pageContent],
})
