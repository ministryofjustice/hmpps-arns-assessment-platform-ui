import { Data, journey, loadTransition, createFormPackage } from '@form-engine/form/builders'
import { businessTypeStep } from './steps/business-type/step'
import { businessDetailsStep } from './steps/business-details/step'
import { operatorDetailsStep } from './steps/operator-details/step'
import { menuItemsStep } from './steps/menu-items/step'
import { menuItemEditStep } from './steps/menu-item-edit/step'
import { menuByCategoryStep } from './steps/menu-by-category/step'
import { allergensStep } from './steps/allergens/step'
import { hygieneRatingStep } from './steps/hygiene-rating/step'
import { reviewStep } from './steps/review/step'
import { confirmationStep } from './steps/confirmation/step'
import { FoodBusinessEffects, createFoodBusinessEffectsRegistry, FoodBusinessEffectsDeps } from './effects'

/**
 * Food Business Registration Form
 *
 * This form demonstrates the key features of the form-engine through a realistic
 * GOV.UK-style food business registration service. It showcases:
 *
 * - All major GovUK components (text, textarea, radio, checkbox, date, character count)
 * - Collection management with hub-and-spoke pattern (menu items)
 * - Complex validation (inline, dependent, submissionOnly)
 * - Conditional logic (field visibility, value computation)
 * - Custom effects (postcode lookup, data persistence)
 * - All reference types (Answer, Data, Self, Item, Params, Post)
 * - Expression builders (when/then/else, and/or/not, Format, Collection)
 * - Pipeline transformers
 * - Realistic multi-step journey following GOV.UK patterns
 *
 * Theme: Food business registration (restaurant, cafe, food stall, catering)
 * Pattern: Hub-and-spoke collection for menu items with derived allergen management
 */
const foodBusinessRegistrationJourney = journey({
  code: 'food-business-registration',
  title: 'Register a Food Business',
  path: '/food-business-registration',
  onLoad: [
    loadTransition({
      effects: [FoodBusinessEffects.createOrLoadAssessment()],
    }),
  ],
  view: {
    template: 'partials/form-step',
    locals: {
      supportData: [{ label: 'Assessment ID', value: Data('assessment.assessmentUuid') }],
    },
  },
  steps: [
    businessTypeStep,
    businessDetailsStep,
    operatorDetailsStep,
    menuItemsStep,
    menuByCategoryStep,
    menuItemEditStep,
    allergensStep,
    hygieneRatingStep,
    reviewStep,
    confirmationStep,
  ],
})

export default createFormPackage({
  journey: foodBusinessRegistrationJourney,
  createRegistries: (deps: FoodBusinessEffectsDeps) => ({
    ...createFoodBusinessEffectsRegistry(deps),
  }),
})
