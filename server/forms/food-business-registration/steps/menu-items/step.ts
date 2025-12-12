import { loadTransition, next, step, submitTransition } from '@form-engine/form/builders'
import { FoodBusinessEffects } from '../../effects'
import { addMenuItemButton, continueButton, menuItemsCollection, menuItemsHeading } from './fields'

/**
 * STEP 4: Menu Items Hub
 *
 * Features demonstrated:
 * - Collection() expression with Data() reference
 * - Item() scoped references
 * - Format() expressions for dynamic content
 * - Collection fallback content
 * - onLoad effect for data initialization
 * - Navigation to collection item (spoke)
 */
export const menuItemsStep = step({
  path: '/menu-items',
  title: 'Menu Items',
  onLoad: [
    loadTransition({
      effects: [FoodBusinessEffects.initializeMenuItems()],
    }),
  ],
  blocks: [menuItemsHeading, menuItemsCollection, addMenuItemButton, continueButton],

  onSubmission: [
    submitTransition({
      validate: false,
      onAlways: {
        next: [next({ goto: 'allergens' })],
      },
    }),
  ],
})
