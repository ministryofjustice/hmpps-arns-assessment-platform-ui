import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { formatStep } from './format/step'
import { conditionalStep } from './conditional/step'
import { predicatesStep } from './predicates/step'

/**
 * Expressions Playground
 *
 * Interactive examples where users can test expressions in real time.
 */
export const expressionsPlaygroundJourney = journey({
  code: 'playground',
  title: 'Expressions Playground',
  path: '/playground',
  steps: [introStep, formatStep, conditionalStep, predicatesStep],
})
