import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transformers - Introduction
 *
 * How to use formatters/transformers to clean and normalise field values.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Transformers',
  isEntryPoint: true,
  blocks: [pageContent],
})
