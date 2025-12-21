import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: Save Answers on Submit
 *
 * How to save form answers when a step is submitted.
 */
export const saveAnswersStep = step({
  path: '/save-answers',
  title: 'Save Answers on Submit',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
