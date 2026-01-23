import { createFormPackage, journey } from '@form-engine/form/builders'
import { AccessEffectsDeps } from './effects/types'
import { AccessEffectsRegistry } from './effects'
import { oasysAccessStep } from './steps/oasys-access/step'
import { crnAccessStep } from './steps/crn-access/step'

/**
 * Access Form Journey
 *
 * Provides unified entry points for OASys handover and CRN-based access
 * to any registered target service.
 *
 * Routes:
 * /forms/access/:service/oasys     - OASys handover entry point
 * /forms/access/:service/crn/:crn  - CRN-based access entry point
 *
 * After processing, redirects to the target service's entry path.
 *
 * @example
 * // OASys flow to Sentence Plan
 * /forms/access/sentence-plan/oasys
 *   → Loads handover context
 *   → Redirects to /forms/sentence-plan/v1.0/plan/overview
 *
 * @example
 * // CRN flow to Sentence Plan
 * /forms/access/sentence-plan/crn/X123456
 *   → Loads case details from Delius
 *   → Redirects to /forms/sentence-plan/v1.0/plan/overview
 */
const accessJourney = journey({
  code: 'access',
  title: 'Access',
  path: '/access',
  steps: [oasysAccessStep, crnAccessStep],
})

/**
 * Access Form Package
 *
 * Register this form in app.ts with the required dependencies:
 * - deliusApi: For CRN-based case lookups
 * - handoverApi: For OASys handover context
 */
export default createFormPackage({
  journey: accessJourney,
  createRegistries: (deps: AccessEffectsDeps) => ({
    ...AccessEffectsRegistry(deps),
  }),
})
