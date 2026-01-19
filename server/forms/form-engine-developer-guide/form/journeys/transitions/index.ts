import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { accessStep } from './access/step'
import { actionStep } from './action/step'
import { submitStep } from './submit/step'
import { navigationStep } from './navigation/step'

/**
 * Transitions Journey
 *
 * Multi-step module covering:
 * - Introduction and lifecycle overview
 * - accessTransition() for data loading and access control
 * - actionTransition() for in-page actions
 * - submitTransition() for form submission
 * - redirect() and throwError() outcome builders
 */
export const transitionsJourney = journey({
  code: 'transitions',
  title: 'Transitions',
  path: '/transitions',
  steps: [introStep, accessStep, actionStep, submitStep, navigationStep],
})
