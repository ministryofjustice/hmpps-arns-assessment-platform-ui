import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { builtInStep } from './built-in/step'
import { customStep } from './custom-components/step'
import { extendingStep } from './extending/step'

/**
 * Components Journey
 *
 * Multi-step module covering:
 * - Understanding block() vs field()
 * - Built-in component packages (Core, GOV.UK, MOJ)
 * - Building custom components
 * - Extending and wrapping existing components
 */
export const componentsJourney = journey({
  code: 'components',
  title: 'Components',
  path: '/components',
  steps: [introStep, builtInStep, customStep, extendingStep],
})
