import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Custom Transformers
 *
 * How to build, register, and use your own transformer functions.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Transformers',
  blocks: [pageContent],
})
