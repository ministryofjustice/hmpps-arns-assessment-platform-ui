import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Custom Conditions
 *
 * How to build, register, and use your own condition functions.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Conditions',
  blocks: [pageContent],
})
