import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators - Map
 *
 * Using Iterator.Map to transform each item to a new shape.
 */
export const mapStep = step({
  path: '/map',
  title: 'Iterator.Map',
  blocks: [pageContent],
})
