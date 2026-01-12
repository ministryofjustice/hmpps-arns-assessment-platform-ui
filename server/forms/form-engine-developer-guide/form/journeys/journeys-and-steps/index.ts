import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { journeysStep } from './journeys/step'
import { stepsStep } from './steps/step'
import { nestedJourneysStep } from './nested-journeys/step'

/**
 * Journeys & Steps Journey
 *
 * Multi-step module covering:
 * - Introduction to journeys and steps
 * - journey() builder configuration
 * - step() builder configuration
 * - Nested journeys with children
 */
export const journeysAndStepsJourney = journey({
  code: 'journeys-and-steps',
  title: 'Journeys & Steps',
  path: '/journeys-and-steps',
  steps: [introStep, journeysStep, stepsStep, nestedJourneysStep],
})
