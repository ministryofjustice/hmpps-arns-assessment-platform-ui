import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * References - Introduction
 *
 * High-level overview of what references are, their purpose, and
 * the different types available in the form-engine.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding References',
  isEntryPoint: true,
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
