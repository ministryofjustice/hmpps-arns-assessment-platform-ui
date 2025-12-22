import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators - Filter
 *
 * Using Iterator.Filter to keep only items matching a predicate.
 */
export const filterStep = step({
  path: '/filter',
  title: 'Iterator.Filter',
  blocks: [pageContent],
})
