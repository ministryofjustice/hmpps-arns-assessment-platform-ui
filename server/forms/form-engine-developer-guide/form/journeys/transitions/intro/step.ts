import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transitions - Introduction
 *
 * Overview of the transition system, lifecycle hooks, and execution semantics.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Transitions',
  isEntryPoint: true,
  blocks: [pageContent],
})
