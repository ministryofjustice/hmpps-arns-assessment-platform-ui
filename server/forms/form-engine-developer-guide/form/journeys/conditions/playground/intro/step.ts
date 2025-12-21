import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Conditions Playground - Hub
 *
 * Entry point to the interactive conditions examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Conditions Playground',
  isEntryPoint: true,
  blocks: [pageContent],
})
