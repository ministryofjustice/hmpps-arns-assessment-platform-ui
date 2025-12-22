import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transitions - Submit
 *
 * onSubmission transitions for handling form submissions, validation, and navigation.
 */
export const submitStep = step({
  path: '/submit',
  title: 'Submit Transitions',
  blocks: [pageContent],
})
