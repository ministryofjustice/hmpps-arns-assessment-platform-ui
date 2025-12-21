import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Blocks & Fields - Block Types
 *
 * Deep dive into the block() builder and the various block types available.
 */
export const blocksStep = step({
  path: '/blocks',
  title: 'Blocks',
  blocks: [pageContent],
})
