import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Blocks & Fields - Introduction
 *
 * High-level overview of what blocks and fields are, their relationship,
 * and how they compose to create form pages.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Blocks & Fields',
  isEntryPoint: true,
  blocks: [pageContent],
})
