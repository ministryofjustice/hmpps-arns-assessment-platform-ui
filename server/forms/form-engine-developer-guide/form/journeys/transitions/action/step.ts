import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transitions - Action
 *
 * onAction transitions for handling in-page actions like lookups.
 */
export const actionStep = step({
  path: '/action',
  title: 'Action Transitions',
  blocks: [pageContent],
})
