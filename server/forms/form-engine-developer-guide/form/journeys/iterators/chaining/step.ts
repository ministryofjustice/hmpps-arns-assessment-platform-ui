import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators - Chaining
 *
 * Combining multiple iterators and transformers.
 */
export const chainingStep = step({
  path: '/chaining',
  title: 'Chaining Iterators',
  blocks: [pageContent],
})
