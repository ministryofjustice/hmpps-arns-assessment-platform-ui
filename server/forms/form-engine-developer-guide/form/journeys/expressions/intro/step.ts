import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions - Introduction
 *
 * High-level overview of what expressions are, their purpose, and
 * the different types available in the form-engine.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Expressions',
  isEntryPoint: true,
  blocks: [pageContent],
})
