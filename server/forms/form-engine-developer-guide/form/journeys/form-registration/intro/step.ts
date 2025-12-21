import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Form Registration - Introduction
 *
 * Overview of what form packages are and why they matter.
 */
export const introStep = step({
  path: '/intro',
  title: 'Form Packages Overview',
  isEntryPoint: true,
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
