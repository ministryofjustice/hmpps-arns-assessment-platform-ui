import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Recipes - Introduction
 *
 * Overview of available recipes with quick links.
 */
export const introStep = step({
  path: '/intro',
  title: 'Recipes Overview',
  isEntryPoint: true,
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
