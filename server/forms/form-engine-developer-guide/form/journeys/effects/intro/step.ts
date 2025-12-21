import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Effects - Introduction
 *
 * What effects are, when to use them, and the EffectFunctionContext API.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Effects',
  isEntryPoint: true,
  blocks: [pageContent],
})
