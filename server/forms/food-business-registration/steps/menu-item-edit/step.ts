import { accessTransition, Data, loadTransition, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { FoodBusinessEffects } from '../../effects'
import {
  itemAllergens,
  itemCategory,
  itemDescription,
  itemDietary,
  itemName,
  itemPrice,
  menuItemHeading,
  saveAndAddAnotherButton,
  saveButton,
} from './fields'

/**
 * STEP 5: Menu Item Details (Collection Spoke)
 *
 * Features demonstrated:
 * - Params() reference for URL parameter
 * - Item editing with loadMenuItem/saveMenuItem effects
 * - All major input components (text, textarea, radio, checkbox, character count)
 * - Number validation and transformation
 * - Complex validation logic
 * - Multiple submit transitions (save vs save-and-add-another)
 */
export const menuItemEditStep = step({
  path: '/menu-items/:itemId/edit',
  title: 'Edit Menu Item',
  view: {
    hiddenFromNavigation: true,
  },
  onLoad: [
    loadTransition({
      effects: [FoodBusinessEffects.initializeMenuItems(), FoodBusinessEffects.loadMenuItem()],
    }),
  ],
  onAccess: [
    accessTransition({
      guards: Data('itemNotFound').not.match(Condition.Equals(true)),
      redirect: [next({ goto: 'menu-items' })],
    }),
  ],
  blocks: [
    menuItemHeading,
    itemName,
    itemDescription,
    itemCategory,
    itemPrice,
    itemDietary,
    itemAllergens,
    saveButton,
    saveAndAddAnotherButton,
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [FoodBusinessEffects.saveMenuItem()],
        next: [next({ goto: 'menu-items' })],
      },
    }),
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndAdd')),
      validate: true,
      onValid: {
        effects: [FoodBusinessEffects.saveMenuItem()],
        next: [next({ goto: 'menu-items/new/edit' })],
      },
    }),
  ],
})
