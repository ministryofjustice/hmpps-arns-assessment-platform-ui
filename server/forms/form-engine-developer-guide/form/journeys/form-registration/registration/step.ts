import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Form Registration - Registration
 *
 * How to register form packages with the FormEngine.
 */
export const registrationStep = step({
  path: '/registration',
  title: 'Registration',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
