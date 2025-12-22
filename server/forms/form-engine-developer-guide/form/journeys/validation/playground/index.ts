import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { stringsStep } from './strings/step'
import { numbersStep } from './numbers/step'
import { datesStep } from './dates/step'
import { arraysStep } from './arrays/step'

/**
 * Validation Playground
 *
 * Interactive examples where users can test validation in real time.
 */
export const validationPlaygroundJourney = journey({
  code: 'playground',
  title: 'Validation Playground',
  path: '/playground',
  steps: [introStep, stringsStep, numbersStep, datesStep, arraysStep],
})
