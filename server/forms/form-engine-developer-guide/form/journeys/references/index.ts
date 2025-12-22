import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { answerStep } from './answer/step'
import { dataStep } from './data/step'
import { selfStep } from './self/step'
import { itemStep } from './item/step'
import { httpStep } from './http/step'
import { chainingStep } from './chaining/step'

/**
 * References Journey
 *
 * Multi-step module covering:
 * - Introduction to references and their purpose
 * - Answer() for field values
 * - Data() for external data
 * - Self() for current field scope
 * - Item() for collection iteration
 * - Params(), Query(), Post() for HTTP request data
 * - Chaining with .pipe(), .match(), Format(), Conditional()
 */
export const referencesJourney = journey({
  code: 'references',
  title: 'References',
  path: '/references',
  steps: [introStep, answerStep, dataStep, selfStep, itemStep, httpStep, chainingStep],
})
