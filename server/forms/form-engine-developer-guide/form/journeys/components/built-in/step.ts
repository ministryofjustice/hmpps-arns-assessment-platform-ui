import { step, submitTransition } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Components - Built-in Components
 *
 * Overview of the component packages available in form-engine.
 */
export const builtInStep = step({
  path: '/built-in',
  title: 'Built-in Components',
  blocks: [pageContent],
  onSubmission: [
    submitTransition({
      validate: true,
    }),
  ],
})
