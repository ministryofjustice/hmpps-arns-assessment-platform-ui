import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transitions - Access
 *
 * onAccess transitions for access control and permission checks.
 */
export const accessStep = step({
  path: '/access',
  title: 'Access Transitions',
  blocks: [pageContent],
})
