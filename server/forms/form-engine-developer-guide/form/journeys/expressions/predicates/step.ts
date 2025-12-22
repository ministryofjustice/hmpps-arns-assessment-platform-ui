import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions - Predicate Combinators
 *
 * Documentation for and(), or(), xor(), not() boolean combinators.
 */
export const predicatesStep = step({
  path: '/predicates',
  title: 'Predicate Combinators',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
