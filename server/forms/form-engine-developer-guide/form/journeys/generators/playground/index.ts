import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { datesStep } from './dates/step'

/**
 * Generators Playground
 *
 * Interactive examples where users can see generators in action.
 */
export const generatorsPlaygroundJourney = journey({
  code: 'playground',
  title: 'Generators Playground',
  path: '/playground',
  steps: [introStep, datesStep],
})
