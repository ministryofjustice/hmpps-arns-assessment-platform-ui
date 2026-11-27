import { step, submit, access, redirect, Query, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
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
 * - Submit: Validates the form, then creates a session (or saves a scenario) from the custom data.
 *   Invalid submissions re-render the page with an error summary and inline errors.
 */
export const customiseStep = step({
  path: '/customise',
  title: 'Customise scenario',
  reachability: { entryWhen: true },

  blocks: [pageHeading, customiseFormWrapper],

  onAccess: [
    access({
      when: Query('scenario').not.match(Condition.IsRequired()),
      next: [redirect({ goto: 'browse' })],
    }),

    access({
      effects: [TrainingSessionLauncherEffects.loadScenarioForCustomise()],
    }),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('createSession')),
      validate: true,
      onValid: {
        effects: [TrainingSessionLauncherEffects.createSessionFromCustomize()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),

    submit({
      when: Post('action').match(Condition.Equals('savePreset')),
      validate: true,
      onValid: {
        effects: [TrainingSessionLauncherEffects.saveCustomPreset()],
        next: [redirect({ goto: 'browse' })],
      },
    }),
  ],
})
