import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { contextStep } from './context/step'
import { customStep } from './custom-effects/step'

/**
 * Effects Journey
 *
 * Multi-step module covering:
 * - Introduction to effects and their purpose
 * - The EffectFunctionContext API
 * - Building custom effects with dependency injection
 */
export const effectsJourney = journey({
  code: 'effects',
  title: 'Effects',
  path: '/effects',
  steps: [introStep, contextStep, customStep],
})
