import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * References - HTTP References (Params, Query, Post)
 *
 * Documentation for references that access HTTP request data:
 * Params(), Query(), and Post().
 */
export const httpStep = step({
  path: '/http',
  title: 'HTTP References',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
