import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Validation Playground - Hub
 *
 * Entry point to the interactive validation examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Validation Playground',
  isEntryPoint: true,
  blocks: [pageContent],
})
