import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Journeys & Steps - Introduction
 *
 * High-level overview of what journeys and steps are, their relationship,
 * and a live demonstration of URL path composition.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Journeys & Steps',
  isEntryPoint: true,
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
