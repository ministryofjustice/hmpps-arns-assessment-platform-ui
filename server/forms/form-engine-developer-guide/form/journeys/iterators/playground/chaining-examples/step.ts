import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators Playground - Chaining Examples
 *
 * Interactive examples of chaining iterators and using .pipe().
 */
export const chainingExamplesStep = step({
  path: '/chaining-examples',
  title: 'Chaining Examples',
  blocks: [pageContent],
})
