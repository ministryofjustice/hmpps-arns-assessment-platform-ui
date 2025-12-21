import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Validation - Introduction
 *
 * Overview of validation, the validation() builder, and best practices.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Validation',
  isEntryPoint: true,
  blocks: [pageContent],
})
