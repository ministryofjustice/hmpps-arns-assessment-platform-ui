import { actionTransition, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { FoodBusinessEffects } from '../../effects'
import {
  addressLine1,
  addressLine2,
  businessAddressHeading,
  businessDescription,
  businessName,
  contactDetailsHeading,
  contactEmail,
  contactPhone,
  county,
  findAddressButton,
  postcode,
  saveAndContinueButton,
  town,
} from './fields'

/**
 * STEP 2: Business Details
 *
 * Features demonstrated:
 * - Multiple field types (text, textarea, character count)
 * - Postcode lookup effect (simulated API call)
 * - Conditional address fields (auto-populated from lookup)
 * - String formatters (Trim, ToTitleCase)
 * - Email and phone validation
 * - Complex field dependencies
 */
export const businessDetailsStep = step({
  path: '/business-details',
  title: 'Business Details',
  blocks: [
    businessName,
    businessDescription,
    businessAddressHeading,
    postcode,
    findAddressButton,
    addressLine1,
    addressLine2,
    town,
    county,
    contactDetailsHeading,
    contactPhone,
    contactEmail,
    saveAndContinueButton,
  ],

  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('lookup')),
      effects: [FoodBusinessEffects.lookupPostcode(Post('postcode'))],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('continue')),
      validate: true,
      onValid: {
        effects: [FoodBusinessEffects.saveStepAnswers()],
        next: [next({ goto: 'operator-details' })],
      },
    }),
  ],
})
