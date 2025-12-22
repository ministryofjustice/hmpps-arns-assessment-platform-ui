import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { mapStep } from './map/step'
import { filterStep } from './filter/step'
import { findStep } from './find/step'
import { chainingStep } from './chaining/step'
import { iteratorsPlaygroundJourney } from './playground'

/**
 * Iterators Journey
 *
 * Multi-step module covering:
 * - Introduction to iterators and their purpose
 * - Iterator.Map for transforming items
 * - Iterator.Filter for filtering collections
 * - Iterator.Find for single item lookups
 * - Chaining iterators for complex operations
 * - Interactive playground with live examples
 */
export const iteratorsJourney = journey({
  code: 'iterators',
  title: 'Iterators',
  path: '/iterators',
  steps: [introStep, mapStep, filterStep, findStep, chainingStep],
  children: [iteratorsPlaygroundJourney],
})
