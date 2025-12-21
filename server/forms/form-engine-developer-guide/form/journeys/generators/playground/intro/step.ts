import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Generators Playground - Hub
 *
 * Entry point to the interactive generator examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Generators Playground',
  isEntryPoint: true,
  blocks: [pageContent],
})
