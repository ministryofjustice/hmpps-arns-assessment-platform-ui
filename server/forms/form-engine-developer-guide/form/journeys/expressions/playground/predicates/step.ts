import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions Playground - Predicates
 *
 * Interactive examples of and(), or(), not() predicate combinators.
 */
export const predicatesStep = step({
  path: '/predicates',
  title: 'Predicates Playground',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
