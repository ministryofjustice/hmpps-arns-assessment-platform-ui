import { step, submitTransition, accessTransition, redirect, Query, Post } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, customiseFormWrapper } from './fields'
import { TrainingSessionLauncherEffects } from '../../../effects'

/**
 * Customise Scenario Step
 *
 * Allows users to modify scenario data before creating a training session.
 * Uses TabPanel component with 4 tabs:
 * - Subject Details
 * - Criminogenic Needs
 * - Scenario Flags
 * - Practitioner Details
 *
 * Flow:
 * - Access: Loads scenario, redirects to browse if no scenario query param
 * - Action: Handles reset button to restore original values
 * - Submit: Creates session from custom data and redirects to sessions
 */
export const customiseStep = step({
  path: '/customise',
  title: 'Customise scenario',

  blocks: [pageHeading, customiseFormWrapper],

  onAccess: [
    accessTransition({
      when: Query('scenario').not.match(Condition.IsRequired()),
      next: [redirect({ goto: 'browse' })],
    }),

    accessTransition({
      effects: [TrainingSessionLauncherEffects.storeCsrf(), TrainingSessionLauncherEffects.loadScenarioForCustomise()],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('createSession')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.createSessionFromCustomize()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),

    submitTransition({
      when: Post('action').match(Condition.Equals('savePreset')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.saveCustomPreset()],
        next: [redirect({ goto: 'browse' })],
      },
    }),
  ],
})
