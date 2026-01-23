import { accessTransition, journey } from '@form-engine/form/builders'
import { browseStep } from './steps/browse/step'
import { customiseStep } from './steps/customise/step'
import { sessionsStep } from './steps/sessions/step'
import { TrainingSessionLauncherEffects } from '../effects'

/**
 * Training Session Launcher Journey
 *
 * A form for launching training sessions into ARNS applications.
 *
 * Features:
 * - Scenario browser: visual picker with pre-configured scenarios
 * - Scenario customisation: modify scenario data before creating session
 * - Sessions manager: view and manage active training sessions
 * - Direct launch: one-click launch into SAN or Sentence Plan
 *
 * Flow:
 * - Browse (scenario picker - main entry point)
 * - Customise (optional - modify scenario before creating session)
 * - Sessions (manage active sessions, generate links into services)
 */
export const trainingSessionLauncherJourney = journey({
  code: 'training-session-launcher',
  title: 'Training Session Launcher',
  path: '/training-session-launcher',

  view: {
    template: 'training-session-launcher/views/template',
  },

  onAccess: [
    accessTransition({
      effects: [TrainingSessionLauncherEffects.storeCsrf()],
    }),
  ],

  steps: [browseStep, customiseStep, sessionsStep],
})
