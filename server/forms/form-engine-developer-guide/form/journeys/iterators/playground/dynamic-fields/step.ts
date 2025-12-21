import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators Playground - Dynamic Fields
 *
 * Interactive examples of generating fields dynamically within collections,
 * using Format() to create unique field codes.
 */
export const dynamicFieldsStep = step({
  path: '/dynamic-fields',
  title: 'Dynamic Fields',
  blocks: [pageContent],

  // Handle form submissions - validate and stay on page
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
