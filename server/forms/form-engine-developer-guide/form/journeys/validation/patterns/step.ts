import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Validation - Common Patterns
 *
 * Real-world validation patterns: cross-field validation, conditional required,
 * date comparisons, and more.
 */
export const patternsStep = step({
  path: '/patterns',
  title: 'Common Patterns',
  blocks: [pageContent],
})
