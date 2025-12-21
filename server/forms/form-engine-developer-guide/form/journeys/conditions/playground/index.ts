import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { stringsStep } from './strings/step'
import { numbersStep } from './numbers/step'
import { datesStep } from './dates/step'
import { combinatorsStep } from './combinators/step'

/**
 * Conditions Playground
 *
 * Interactive examples where users can see conditions in action.
 */
export const conditionsPlaygroundJourney = journey({
  code: 'playground',
  title: 'Conditions Playground',
  path: '/playground',
  steps: [introStep, stringsStep, numbersStep, datesStep, combinatorsStep],
})
