import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { customStep } from './custom-transformers/step'
import { transformersPlaygroundJourney } from './playground'

/**
 * Transformers Journey
 *
 * Multi-step module covering:
 * - Introduction to transformers and their purpose
 * - Building custom transformers with dependency injection
 * - Interactive playground with live examples
 */
export const transformersJourney = journey({
  code: 'transformers',
  title: 'Transformers',
  path: '/transformers',
  steps: [introStep, customStep],
  children: [transformersPlaygroundJourney],
})
