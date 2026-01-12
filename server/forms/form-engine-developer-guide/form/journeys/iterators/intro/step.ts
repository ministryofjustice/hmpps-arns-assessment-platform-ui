import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators - Introduction
 *
 * Overview of iterators in form-engine.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Iterators',
  isEntryPoint: true,
  blocks: [pageContent],
})
