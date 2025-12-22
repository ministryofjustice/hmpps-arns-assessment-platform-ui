import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators Playground - Find Examples
 *
 * Interactive examples of Iterator.Find for looking up single items.
 */
export const findExamplesStep = step({
  path: '/find-examples',
  title: 'Find Examples',
  blocks: [pageContent],
})
