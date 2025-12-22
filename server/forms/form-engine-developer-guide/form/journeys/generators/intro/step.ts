import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Generators - Introduction
 *
 * How to use generators to produce dynamic values without input.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Generators',
  isEntryPoint: true,
  blocks: [pageContent],
})
