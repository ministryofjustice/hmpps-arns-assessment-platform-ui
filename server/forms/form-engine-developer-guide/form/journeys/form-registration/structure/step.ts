import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Form Registration - Directory Structure
 *
 * How to organize form files and folders.
 */
export const structureStep = step({
  path: '/structure',
  title: 'Directory Structure',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
