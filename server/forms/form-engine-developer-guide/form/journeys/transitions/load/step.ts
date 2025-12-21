import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transitions - Load
 *
 * onLoad transitions for loading data before access checks.
 */
export const loadStep = step({
  path: '/load',
  title: 'Load Transitions',
  blocks: [pageContent],
})
