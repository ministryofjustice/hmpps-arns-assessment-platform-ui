import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { patternsStep } from './patterns/step'
import { validationPlaygroundJourney } from './playground'

/**
 * Validation Journey
 *
 * Multi-step module covering:
 * - Introduction and validation() builder
 * - Common validation patterns
 * - Interactive playground with live examples
 */
export const validationJourney = journey({
  code: 'validation',
  title: 'Validation',
  path: '/validation',
  steps: [introStep, patternsStep],
  children: [validationPlaygroundJourney],
})
