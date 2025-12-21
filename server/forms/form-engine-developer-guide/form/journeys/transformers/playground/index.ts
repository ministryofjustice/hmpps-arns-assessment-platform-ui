import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { stringsStep } from './strings/step'
import { numbersStep } from './numbers/step'
import { arraysStep } from './arrays/step'

/**
 * Transformers Playground
 *
 * Interactive examples where users can test transformers in real time.
 */
export const transformersPlaygroundJourney = journey({
  code: 'playground',
  title: 'Transformers Playground',
  path: '/playground',
  steps: [introStep, stringsStep, numbersStep, arraysStep],
})
