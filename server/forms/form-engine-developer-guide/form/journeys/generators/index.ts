import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { generatorsPlaygroundJourney } from './playground'

/**
 * Generators Journey
 *
 * Multi-step module covering:
 * - Introduction to generators and their purpose
 * - Interactive playground with live examples
 */
export const generatorsJourney = journey({
  code: 'generators',
  title: 'Generators',
  path: '/generators',
  steps: [introStep],
  children: [generatorsPlaygroundJourney],
})
