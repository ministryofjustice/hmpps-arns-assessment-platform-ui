import { createFormPackage, journey } from '@form-engine/form/builders'
import { AccessEffectsDeps } from './effects/types'
import { AccessEffectsRegistry } from './effects'
import { oasysAccessStep } from './steps/oasys-access/step'
import { crnAccessStep } from './steps/crn-access/step'
import { privacyScreenStep } from './steps/privacy-screen/step'

/**
 * Access Form Journey
 *
 * Provides unified entry points for OASys handover and CRN-based access
 * to any registered target service.
 *
 * Routes:
 * /access/:service/oasys     - OASys handover entry point
 * /access/:service/crn/:crn  - CRN-based access entry point
 *
 * After processing, redirects either to the platform privacy screen
 * or directly to the target service entry path.
 *
 * @example
 * // OASys flow to Sentence Plan
 * /access/sentence-plan/oasys
 *   → Loads handover context
 *   → Redirects to /access/privacy-screen
 *
 * @example
 * // CRN flow to Sentence Plan
 * /access/sentence-plan/crn/X123456
 *   → Loads case details from Delius
 *   → Redirects to /access/privacy-screen
 */
const accessJourney = journey({
  code: 'access',
  title: 'Access',
  path: '/access',
  steps: [oasysAccessStep, crnAccessStep, privacyScreenStep],
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
