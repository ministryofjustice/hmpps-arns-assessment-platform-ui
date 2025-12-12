import { loadTransition, next, step, submitTransition } from '@form-engine/form/builders'
import { FoodBusinessEffects } from '../../effects'
import { continueButton, menuByCategoryCollection, menuByCategoryHeading } from './fields'

/**
 * Menu by Category Step - Nested Collection Demo
 *
 * Features demonstrated:
 * - Nested Collection() expressions (collection within collection)
 * - Outer collection iterates Data('menuByCategory')
 * - Inner collection iterates Item().path('items')
 * - Item() references at both nesting levels
 * - Format() expressions with nested Item() references
 */
export const menuByCategoryStep = step({
  path: '/menu-by-category',
  title: 'Menu by Category',
  onLoad: [
    loadTransition({
      effects: [FoodBusinessEffects.initializeMenuByCategory()],
    }),
  ],
  blocks: [menuByCategoryHeading, menuByCategoryCollection, continueButton],

  onSubmission: [
    submitTransition({
      validate: false,
      onAlways: {
        next: [next({ goto: 'menu-items' })],
      },
    }),
  ],
})
