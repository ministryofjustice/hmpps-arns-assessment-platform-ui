import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Effects - The Context Object
 *
 * Deep dive into the EffectFunctionContext API and how to use it.
 */
export const contextStep = step({
  path: '/context',
  title: 'The Context Object',
  blocks: [pageContent],
})
