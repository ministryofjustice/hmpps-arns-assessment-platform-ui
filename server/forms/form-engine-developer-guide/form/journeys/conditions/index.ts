import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { customStep } from './custom-conditions/step'
import { conditionsPlaygroundJourney } from './playground'

/**
 * Conditions Journey
 *
 * Multi-step module covering:
 * - Introduction to conditions and their types
 * - Building custom conditions
 * - Interactive playground with live examples
 */
export const conditionsJourney = journey({
  code: 'conditions',
  title: 'Conditions',
  path: '/conditions',
  steps: [introStep, customStep],
  children: [conditionsPlaygroundJourney],
})
