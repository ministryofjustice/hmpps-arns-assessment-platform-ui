import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { formatStep } from './format/step'
import { conditionalStep } from './conditional/step'
import { predicatesStep } from './predicates/step'
import { expressionsPlaygroundJourney } from './playground'

/**
 * Expressions Journey
 *
 * Multi-step module covering:
 * - Introduction to expressions and their purpose
 * - Format() string interpolation
 * - Conditional expressions with when() and Conditional()
 * - Predicate combinators (and, or, xor, not)
 * - Interactive playground with live examples
 */
export const expressionsJourney = journey({
  code: 'expressions',
  title: 'Expressions',
  path: '/expressions',
  steps: [introStep, formatStep, conditionalStep, predicatesStep],
  children: [expressionsPlaygroundJourney],
})
