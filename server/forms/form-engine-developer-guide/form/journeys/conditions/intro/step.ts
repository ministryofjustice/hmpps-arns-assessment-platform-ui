import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Conditions - Introduction
 *
 * Complete reference of all condition types.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Conditions',
  isEntryPoint: true,
  blocks: [pageContent],
})
