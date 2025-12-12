import { step } from '@form-engine/form/builders'
import { confirmationPanel } from './fields'

/**
 * STEP 9: Confirmation
 *
 * Simple confirmation page showing submission success
 */
export const confirmationStep = step({
  path: '/confirmation',
  title: 'Confirmation',
  view: {
    hiddenFromNavigation: true,
  },
  blocks: [confirmationPanel],
})
