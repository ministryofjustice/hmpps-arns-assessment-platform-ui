import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipe: Load Data on Entry
 *
 * How to fetch data when a step or journey loads.
 */
export const loadDataStep = step({
  path: '/load-data',
  title: 'Load Data on Entry',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
