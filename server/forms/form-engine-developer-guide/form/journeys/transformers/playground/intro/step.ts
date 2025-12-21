import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transformers Playground - Hub
 *
 * Entry point to the interactive transformer examples.
 */
export const introStep = step({
  path: '/intro',
  title: 'Transformers Playground',
  isEntryPoint: true,
  blocks: [pageContent],
})
