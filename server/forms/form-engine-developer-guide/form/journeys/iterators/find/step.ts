import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators - Find
 *
 * Using Iterator.Find to get the first matching item.
 */
export const findStep = step({
  path: '/find',
  title: 'Iterator.Find',
  blocks: [pageContent],
})
