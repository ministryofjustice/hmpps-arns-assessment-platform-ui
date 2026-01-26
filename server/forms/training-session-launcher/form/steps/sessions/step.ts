import { step, accessTransition, submitTransition, redirect, Post, Data } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  errorBanner,
  pageHeading,
  pageHelpText,
  noSessionsMessage,
  sessionsList,
  sectionBreak,
  newSessionButton,
  resetAllSessionsForm,
} from './fields'
import { TrainingSessionLauncherEffects } from '../../../effects'

/**
 * Sessions Step
 *
 * Displays all active training sessions.
 * Users can generate handover links for each session.
 */
export const sessionsStep = step({
  path: '/sessions',
  title: 'Active Sessions',

  onAccess: [
    accessTransition({
      effects: [TrainingSessionLauncherEffects.storeCsrf(), TrainingSessionLauncherEffects.loadPreferences()],
    }),
  ],

  blocks: [
    errorBanner,
    pageHeading,
    pageHelpText,
    noSessionsMessage,
    sessionsList,
    sectionBreak,
    newSessionButton,
    resetAllSessionsForm,
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('generateLink')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.generateHandoverLink()],
        next: [redirect({ goto: Data('handoverLink') })],
      },
    }),

    submitTransition({
      when: Post('action').match(Condition.Equals('deleteSession')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteSession()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),

    submitTransition({
      when: Post('action').match(Condition.Equals('resetAllSessions')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteAllSessions()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),
  ],
})
