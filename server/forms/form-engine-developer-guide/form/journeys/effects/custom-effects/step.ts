import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Custom Effects
 *
 * How to build, register, and use your own effect functions with dependency injection.
 */
export const customStep = step({
  path: '/custom',
  title: 'Custom Effects',
  blocks: [pageContent],
})
