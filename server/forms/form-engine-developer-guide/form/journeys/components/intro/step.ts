import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Components - Introduction
 *
 * Understanding the component system in form-engine.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Components',
  isEntryPoint: true,
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
