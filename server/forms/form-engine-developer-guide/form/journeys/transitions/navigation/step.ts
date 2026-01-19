import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Transitions - Navigation
 *
 * The redirect() builder and navigation patterns.
 */
export const navigationStep = step({
  path: '/navigation',
  title: 'Navigation',
  blocks: [pageContent],
})
