import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Expressions Playground - Hub
 *
 * Entry point to the interactive expression examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Expressions Playground',
  isEntryPoint: true,
  blocks: [pageContent],
})
