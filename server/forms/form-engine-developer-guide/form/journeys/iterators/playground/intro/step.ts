import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Iterators Playground - Intro
 *
 * Entry point to the interactive iterator examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Iterators Playground',
  blocks: [pageContent],
})
