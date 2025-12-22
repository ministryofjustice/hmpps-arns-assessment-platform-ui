import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * References - Chaining
 *
 * Documentation for chaining references with .pipe(), .match(), .not,
 * and combining references with Format() and Conditional().
 */
export const chainingStep = step({
  path: '/chaining',
  title: 'Chaining References',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
