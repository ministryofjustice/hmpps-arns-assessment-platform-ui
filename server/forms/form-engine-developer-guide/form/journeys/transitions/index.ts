import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { loadStep } from './load/step'
import { accessStep } from './access/step'
import { actionStep } from './action/step'
import { submitStep } from './submit/step'
import { navigationStep } from './navigation/step'

/**
 * Transitions Journey
 *
 * Multi-step module covering:
 * - Introduction and lifecycle overview
 * - loadTransition() for data loading
 * - accessTransition() for access control
 * - actionTransition() for in-page actions
 * - submitTransition() for form submission
 * - next() and navigation patterns
 */
export const transitionsJourney = journey({
  code: 'transitions',
  title: 'Transitions',
  path: '/transitions',
  steps: [introStep, loadStep, accessStep, actionStep, submitStep, navigationStep],
})
