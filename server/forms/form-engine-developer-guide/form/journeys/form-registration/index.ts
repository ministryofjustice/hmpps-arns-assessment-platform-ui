import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { structureStep } from './structure/step'
import { registrationStep } from './registration/step'

/**
 * Form Registration Journey
 *
 * Multi-step module covering:
 * - Introduction to form packages
 * - Directory structure and file organization
 * - Registering forms with the FormEngine
 */
export const formRegistrationJourney = journey({
  code: 'form-registration',
  title: 'Form Registration',
  path: '/form-registration',
  steps: [introStep, structureStep, registrationStep],
})
